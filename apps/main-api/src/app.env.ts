import type { JwtPayload } from "@supabase/supabase-js";
import type { Repository } from "@/repositories";
import type { AuthService } from "./features/auth/application/auth.service";
import type { CompanyService } from "./features/company/application/company.service";
import type { CompanyPlanService } from "./features/company-plan";
import type { InviteStatusService } from "./features/invite-status/application/invite-status.service";
import type { MemberService } from "./features/member/application/member.service";
import type { MemberRoleService } from "./features/member-role/application/member-role.service";
import type { UserService } from "./features/user/application/user.service";

export type AppVariables = {
  repository: Repository;
  authService: AuthService;
  userService: UserService;
  inviteStatusService: InviteStatusService;
  companyService: CompanyService;
  companyPlanService: CompanyPlanService;
  memberService: MemberService;
  memberRoleService: MemberRoleService;
  authUserId: string;
  tenantId: string;
  jwtPayload: {
    payload: JwtPayload;
  };
};

export type AppEnv = {
  Variables: AppVariables;
};
