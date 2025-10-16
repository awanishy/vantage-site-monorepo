import { ProgramModel } from "@courses/courses.model";
import { ProgramBase } from "@/types/courses/courses.types";
import { Types } from "mongoose";

/**
 * Efficiently finds a program by any identifier (ObjectId, programId, or slug)
 * Uses a single optimized query with $or operator instead of multiple sequential queries
 */
export async function findProgramByIdentifier(
  identifier: string
): Promise<ProgramBase | null> {
  if (!identifier) {
    return null;
  }

  const idOrSlug = String(identifier).trim();
  
  // Build query conditions
  const conditions: any[] = [];
  
  // Add ObjectId condition if valid
  if (Types.ObjectId.isValid(idOrSlug)) {
    conditions.push({ _id: idOrSlug });
  }
  
  // Add programId condition
  conditions.push({ programId: idOrSlug });
  
  // Add slug condition
  conditions.push({ slug: idOrSlug });

  // Single query with $or to find by any of the conditions
  const program = await ProgramModel.findOne({
    $or: conditions
  }).lean() as ProgramBase | null;

  return program;
}

/**
 * Validates that a program exists and returns it
 * Throws an error if program is not found
 */
export async function getProgramByIdentifier(
  identifier: string
): Promise<ProgramBase> {
  const program = await findProgramByIdentifier(identifier);
  
  if (!program) {
    throw new Error(`Program not found: ${identifier}`);
  }
  
  return program;
}

