import * as schema from "@db/migrations";
import { fakerJA } from "@faker-js/faker";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { Transaction } from "../index";
import { AccountListSeed } from "./accountList";

dotenv.config();

const TENANT_COUNT = 3;
const USERS_PER_TENANT = 20;

const isFirstTenant = (index: number) => index === 0;

async function checkTablesExist(db: ReturnType<typeof drizzle>) {
  const requiredTables = [
    "company_plan",
    "tenant",
    "company",
    "member_role",
    "invite_status",
    "member",
    "user",
  ];

  try {
    for (const tableName of requiredTables) {
      const result = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = ${tableName}
        );
      `);

      if (!result[0]?.exists) {
        console.error(`❌ テーブル "${tableName}" が存在しません`);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("❌ テーブル存在確認中にエラーが発生しました:", error);
    return false;
  }
}

const createTenant = async (tx: Transaction, isFirst: boolean) => {
  const [tenant] = await tx
    .insert(schema.tenant)
    .values({
      id: isFirst
        ? "aaaa0000-0000-0000-0000-000000000000"
        : fakerJA.string.uuid(),
      name: isFirst
        ? `メインテナント`
        : `テナント${fakerJA.string.alphanumeric(6)}`,
      supabaseTenantId: fakerJA.string.uuid(),
    })
    .returning();

  console.log("✓ テナントを作成しました:", tenant.id);
  return tenant;
};

const createCompany = async (
  tx: Transaction,
  tenantId: string,
  companyPlanId: string | null,
  isFirst: boolean,
  isParent: boolean = false,
) => {
  const [company] = await tx
    .insert(schema.company)
    .values({
      id: fakerJA.string.uuid(),
      name: isFirst ? `メイン会社` : fakerJA.company.name(),
      tenantId,
      companyPlanId: isParent ? companyPlanId : null,
      isParent,
    })
    .returning();

  console.log("✓ 会社を作成しました:", company.id);
  return company;
};

const createUsers = async (tx: Transaction, count: number) => {
  // 追加アカウントがあれば `accountList.ts` にアカウントを追加する
  const accountList = AccountListSeed.map((account) => ({
    id: fakerJA.string.uuid(),
    authUserId: account.authUserId,
    name: account.name,
    email: account.email,
    isAdmin: true,
  }));

  const users = [
    ...accountList,
    ...Array.from({ length: count }, (_, index) => ({
      id: fakerJA.string.uuid(),
      authUserId: fakerJA.string.uuid(),
      name: `メンバー${index + 1}`,
      email: `account-${index + 1}@example.com`,
      isAdmin: false,
    })),
  ];

  const insertedUsers = await tx.insert(schema.user).values(users).returning();
  console.log(`✓ ${insertedUsers.length}件のユーザーを作成しました`);
  return insertedUsers.map((user) => ({
    ...user,
    isAdmin: users.find((sourceUser) => sourceUser.id === user.id)?.isAdmin ?? false,
  }));
};

const createMembers = async (
  tx: Transaction,
  users: Array<{ id: string; isAdmin: boolean }>,
  tenantId: string,
  companyId: string,
  adminMemberRoleId: string,
  generalMemberRoleId: string,
  inviteStatusId: string,
) => {
  const members = users.map((user) => ({
    id: fakerJA.string.uuid(),
    tenantId,
    userId: user.id,
    companyId,
    memberRoleId: user.isAdmin ? adminMemberRoleId : generalMemberRoleId,
    inviteStatusId,
  }));

  const insertedMembers = await tx
    .insert(schema.member)
    .values(members)
    .returning();
  console.log(`✓ ${insertedMembers.length}件のメンバーを作成しました`);
  return insertedMembers;
};


const ensureReferenceSeedData = async (tx: Transaction) => {
  const existingCompanyPlans = await tx.select().from(schema.companyPlan);
  if (existingCompanyPlans.length === 0) {
    const defaultCompanyPlans = [
      {
        id: fakerJA.string.uuid(),
        name: "フリープラン",
        description: "お試し用のプランで、基本的な機能が利用可能です。",
      },
      {
        id: fakerJA.string.uuid(),
        name: "スタンダードプラン",
        description: "スタンダードプランの説明",
      },
      {
        id: fakerJA.string.uuid(),
        name: "プレミアムプラン",
        description: "プレミアムプランの説明",
      },
    ];
    await tx.insert(schema.companyPlan).values(defaultCompanyPlans);
    console.log("✓ 会社プランの初期データを作成しました");
  }

  const existingMemberRoles = await tx.select().from(schema.memberRole);
  if (existingMemberRoles.length === 0) {
    const defaultMemberRoles = [
      {
        id: fakerJA.string.uuid(),
        role: "管理者",
        description: "メンバー管理、ドキュメント管理などの操作が可能です。",
      },
      {
        id: fakerJA.string.uuid(),
        role: "一般ユーザー",
        description: "ドキュメントの閲覧や編集が可能です。",
      },
      {
        id: fakerJA.string.uuid(),
        role: "ゲスト",
        description: "共有されたドキュメントの閲覧のみが可能です。",
      },
    ];
    await tx.insert(schema.memberRole).values(defaultMemberRoles);
    console.log("✓ メンバー役割の初期データを作成しました");
  }

  const existingInviteStatuses = await tx.select().from(schema.inviteStatus);
  if (existingInviteStatuses.length === 0) {
    const defaultInviteStatuses = [
      {
        id: "00000000-0000-0000-0000-000000000101",
        code: "pending",
        name: "招待中",
        description: "招待メールを送信済みで、参加待ちの状態です。",
      },
      {
        id: "00000000-0000-0000-0000-000000000102",
        code: "joined",
        name: "参加済み",
        description: "招待を受け取り、参加が完了した状態です。",
      },
      {
        id: "00000000-0000-0000-0000-000000000103",
        code: "disabled",
        name: "無効化",
        description: "招待または所属が無効化された状態です。",
      },
    ];
    await tx.insert(schema.inviteStatus).values(defaultInviteStatuses);
    console.log("✓ 招待ステータスの初期データを作成しました");
  }
};

export async function runSeed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client, { schema });

  console.log("📋 データベーステーブルの存在確認中...");
  const tablesExist = await checkTablesExist(db);

  if (!tablesExist) {
    console.error(`
❌ マイグレーションが実行されていません。
以下のコマンドを実行してマイグレーションを適用してください:

  pnpm drizzle:migrate

その後、再度シードコマンドを実行してください:

  pnpm drizzle:seed
    `);
    await client.end();
    process.exit(1);
  }

  console.log("✅ 全てのテーブルが存在します\n");

  try {
    console.log("🌱 シード処理を開始します...\n");

    await db.transaction(async (tx) => {
      console.log("📝 トランザクション開始\n");

      await ensureReferenceSeedData(tx);

      const memberRoles = await tx.select().from(schema.memberRole);
      const companyPlans = await tx.select().from(schema.companyPlan);
      const inviteStatuses = await tx.select().from(schema.inviteStatus);
      const joinedStatus = inviteStatuses.find(
        (status) => status.name === "参加済み",
      );
      const adminMemberRole = memberRoles.find((role) => role.role === "管理者");
      const generalMemberRole = memberRoles.find(
        (role) => role.role === "一般ユーザー",
      );

      // ユーザー（アカウント情報を保持するDB データ群）を作成
      const users = await createUsers(tx, USERS_PER_TENANT);

      for (let index = 0; index < TENANT_COUNT; index += 1) {
        const isFirst = isFirstTenant(index);
        const companyPlan = companyPlans[index % companyPlans.length];
        if (!companyPlan) {
          throw new Error("会社プランが見つかりませんでした。");
        }
        if (!joinedStatus) {
          throw new Error("参加済みの招待ステータスが見つかりませんでした。");
        }
        if (!adminMemberRole) {
          throw new Error("管理者ロールが見つかりませんでした。");
        }
        if (!generalMemberRole) {
          throw new Error("一般ユーザーロールが見つかりませんでした。");
        }

        // テナント情報、親会社情報を作成
        const tenant = await createTenant(tx, isFirst);
        const parentCompany = await createCompany(
          tx,
          tenant.id,
          companyPlan.id,
          isFirst,
          true,
        );

        // 子会社情報を作成
        for (let i = 0; i < 5; i += 1) {
          await createCompany(tx, tenant.id, null, false, false);
        }

        // テナントに紐づくメンバー情報を作成
        await createMembers(
          tx,
          users,
          tenant.id,
          parentCompany.id,
          adminMemberRole.id,
          generalMemberRole.id,
          joinedStatus.id,
        );
      }

      console.log("\n✅ トランザクションをコミットします");
    });

    console.log("\n✅ シード処理が正常に完了しました!");
  } catch (error) {
    console.error("\n❌ シード処理中にエラーが発生しました");

    if (error instanceof Error) {
      console.error("エラー内容:", error.message);
      console.error("\nスタックトレース:");
      console.error(error.stack);
    } else {
      console.error("エラー:", error);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}
