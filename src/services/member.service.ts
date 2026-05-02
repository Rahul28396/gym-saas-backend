import { ObjectId, WithId } from "mongodb";
import { Member } from "../models/member.model";
import { MemberRepository } from "../repositories/member.repository";
import { ApiError } from "../utils/ApiError";

export class MemberService {
  constructor(private repo: MemberRepository) {}

  async getAllMembers(): Promise<WithId<Member>[]> {
    return await this.repo.findAll();
  }

  async getMemberById(id: ObjectId): Promise<WithId<Member>> {
    const member = await this.repo.findById(id);
    if (!member) throw new ApiError(404, "Member not found");
    return member;
  }

  async createMember(data: Member) {
    return await this.repo.create(data);
  }

  async updateMember(id: ObjectId, data: Partial<Member>) {
    const updated = await this.repo.update(id, data);
    if (!updated) throw new ApiError(404, "Member not found");
    return updated;
  }

  async deleteMember(id: ObjectId) {
    const count = await this.repo.delete(id);
    if (count === 0) throw new ApiError(404, "Member not found");
  }
}