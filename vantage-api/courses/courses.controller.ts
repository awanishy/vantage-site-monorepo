import { Request, Response } from "express";
import { ProgramModel } from "./courses.model";
import { APIError } from "@/utils/APIError";

export const listPrograms = async (_req: Request, res: Response) => {
  const programs = await ProgramModel.find().lean();
  res.json({ programs });
};

export const getProgramBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const program = await ProgramModel.findOne({ slug }).lean();
    if (!program) {
      throw APIError.NotFound(`Program not found: ${slug}`);
    }
    res.json({ program });
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    console.error("Error fetching program by slug:", error);
    throw APIError.InternalError("Failed to fetch program");
  }
};

export const getProgramByProgramId = async (req: Request, res: Response) => {
  const { programId } = req.params;
  const program = await ProgramModel.findOne({ programId }).lean();
  if (!program) throw APIError.NotFound(`Program not found: ${programId}`);
  res.json({ program });
};

export const upsertProgram = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const payload = req.body;
  if (!slug) throw APIError.BadRequest("Missing slug");

  const program = await ProgramModel.findOneAndUpdate(
    { slug },
    { $set: payload },
    { new: true, upsert: true }
  );
  res.json({ program });
};

export const deleteProgram = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const deleted = await ProgramModel.findOneAndDelete({ slug });
  if (!deleted) throw APIError.NotFound(`Program not found: ${slug}`);
  res.json({ ok: true });
};

// seeding moved to a standalone function
