import { Request, Response } from "express";
import { MemberService } from "../services/member.service";
import { success } from "../utils/response";
import { RequestWithObjectId } from "../middleware/validate-object-id.middleware";

export class MemberController {
  constructor(private service: MemberService) {}

  getMembers = async (_req: Request, res: Response) => {
    const data = await this.service.getAllMembers();
    return res.json(success(data));
  };

  getMember = async (req: RequestWithObjectId, res: Response) => {
    const data = await this.service.getMemberById(req.objectId!);
    return res.json(success(data));
  };

  createMember = async (req: Request, res: Response) => {
    const data = await this.service.createMember(req.body);
    return res.status(201).json(success(data, "Member created"));
  };

  updateMember = async (req: RequestWithObjectId, res: Response) => {
    const data = await this.service.updateMember(req.objectId!, req.body);
    return res.json(success(data, "Member updated"));
  };

  deleteMember = async (req: RequestWithObjectId, res: Response) => {
    await this.service.deleteMember(req.objectId!);
    return res.json(success(undefined, "Member deleted"));
  };
}