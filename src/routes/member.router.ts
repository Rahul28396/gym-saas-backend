import { Router } from "express";
import { MemberController } from "../controllers/member.controller";
import { validateObjectIdMiddleware as validateObjectId } from "../middleware/validate-object-id.middleware";
import { AppContext } from "../types/app-context.type";

export const createMembersRouter = (context: AppContext): Router => {
  const router = Router();

  const {memberService} = context.services;
  const memberController = new MemberController(memberService);

  // Routes
  router.get("/", memberController.getMembers);
  router.get("/:id", validateObjectId, memberController.getMember);
  router.post("/", memberController.createMember);
  router.put("/:id", validateObjectId, memberController.updateMember);
  router.delete("/:id", validateObjectId, memberController.deleteMember);

  return router;
};