import { Request, Response } from "express";
import { MemberService } from "../services/member.service";
import { success, error } from "../utils/response";
import { ObjectId } from "mongodb";
import logger from "../utils/logger";

export class MemberController {
  constructor(private service: MemberService) { }

  getMembers = async (_req: Request, res: Response) => {

    try {
      const data = await this.service.getAllMembers();
      return res.status(200).json(success(data));
    } catch (err) {
      logger.error(err);
      return res.status(400).json(error('Something went wrong!!'))
    }

  };

  getMember = async (req: Request, res: Response) => {

    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
      throw new Error("Invalid ID");
    }

    const objectId = new ObjectId(idParam);

    const data = await this.service.getMemberById(objectId);
    return res.status(200).json(success(data));
  };

  createMember = async (req: Request, res: Response) => {
    const data = await this.service.createMember(req.body);
    return res.status(201).json(success(data, "Member created"));
  };

  updateMember = async (req: Request, res: Response) => {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
      throw new Error("Invalid ID");
    }

    const objectId = new ObjectId(idParam);
    const data = await this.service.updateMember(objectId, req.body);
    return res.json(success(data, "Member updated"));
  };

  deleteMember = async (req: Request, res: Response) => {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
      throw new Error("Invalid ID");
    }

    const objectId = new ObjectId(idParam);
    await this.service.deleteMember(objectId);
    return res.json(success(undefined, "Member deleted"));
  };
}