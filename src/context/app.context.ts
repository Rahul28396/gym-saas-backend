import { Db } from "mongodb";
import { MemberRepository } from "../repositories/member.repository";
import { AuthService } from "../services/auth.service";
import { MemberService } from "../services/member.service";
import { PlanService } from "../services/plan.service";
import { PlanRepository } from "../repositories/plan.repository";
import { UserRepository } from "../repositories/user.repository";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";

export const createAppContext = (db: Db) => {
    const memberRepo = new MemberRepository(db);
    const userRepo = new UserRepository(db);
    const planRepo = new PlanRepository(db);
    const refreshTokenRepo = new RefreshTokenRepository(db);

    const authService = new AuthService(userRepo, refreshTokenRepo);
    const memberService = new MemberService(memberRepo);
    const planService = new PlanService(planRepo)

    return {
        services: {
            authService,
            planService,
            memberService
        }
    };
};