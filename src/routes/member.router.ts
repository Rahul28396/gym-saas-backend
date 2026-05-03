import { Router } from "express";
import { getCollection } from "../config/database";
import { MemberRepository } from "../repositories/member.repository";
import { MemberService } from "../services/member.service";
import { MemberController } from "../controllers/member.controller";
import { Member } from "../models/member.model";
import { validateObjectIdMiddleware as validateObjectId } from "../middleware/validateObjectId.middleware";

export const createMembersRouter = (): Router => {
  const router = Router();

  // Dependency Injection (runs AFTER DB connection)
  const memberCollection = getCollection<Member>("members");

  const memberRepository = new MemberRepository(memberCollection);
  const memberService = new MemberService(memberRepository);
  const memberController = new MemberController(memberService);

  // Routes
  router.get("/", memberController.getMembers);
  router.get("/:id", validateObjectId, memberController.getMember);
  router.post("/", memberController.createMember);
  router.put("/:id", validateObjectId, memberController.updateMember);
  router.delete("/:id", validateObjectId, memberController.deleteMember);

  return router;
};