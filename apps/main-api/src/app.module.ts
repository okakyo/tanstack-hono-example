import { createAuthModule } from "./features/auth/auth.module";
import { createCompanyModule } from "./features/company/company.module";
import { createCompanyPlanModule } from "./features/company-plan/company-plan.module";
import { createInviteStatusModule } from "./features/invite-status/invite-status.module";
import { createMemberModule } from "./features/member/member.module";
import { createMemberRoleModule } from "./features/member-role/member-role.module";
import { createUserModule } from "./features/user/user.module";
import type { Repository } from "./repositories";

export const createAppModule = (repository: Repository) => {
  return {
    authModule: createAuthModule(repository),
    userModule: createUserModule(repository),
    inviteStatusModule: createInviteStatusModule(repository),
    companyPlanModule: createCompanyPlanModule(repository),
    companyModule: createCompanyModule(repository),
    memberModule: createMemberModule(repository),
    memberRoleModule: createMemberRoleModule(repository),
  };
};
