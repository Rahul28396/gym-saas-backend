import { AuthService } from "../services/auth.service"
import { MemberService } from "../services/member.service"
import { PlanService } from "../services/plan.service"
import { TrainerService } from "../services/trainer.service"

export interface AppContext {
    services: {
        authService: AuthService,
        planService: PlanService,
        memberService: MemberService,
        trainerService: TrainerService
    }
}