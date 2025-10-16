import mongoose, { Schema } from "mongoose";
import { ProgramKind } from "@/types/courses/courses.types";
import {
  PricingBreakdown,
  SectionsMap,
} from "@/types/courses/course.sections.types";

export interface ProgramRecord<TSections = SectionsMap> {
  programId: string;
  kind: ProgramKind;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  mode?: "online" | "offline" | "hybrid";
  location?: string;
  // Program sections shaped according to our typed SectionsMap
  sections: TSections;
  pricing: PricingBreakdown;
}

// Store program records (Fellowship and future program kinds)
const ProgramSchema = new Schema(
  {
    programId: { type: String, required: true, unique: true, index: true },
    kind: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    tags: [{ type: String }],
    mode: { type: String, enum: ["online", "offline", "hybrid"] },
    location: { type: String },
    sections: Schema.Types.Mixed,
    pricing: Schema.Types.Mixed,
  },
  { timestamps: true }
);

// Ensure programId is set; default to slug if missing
ProgramSchema.pre("validate", function (next) {
  const self = this as any;
  if (!self.programId && self.slug) {
    self.programId = String(self.slug);
  }
  next();
});

export const ProgramModel =
  (mongoose.models.Program as mongoose.Model<ProgramRecord>) ||
  mongoose.model<ProgramRecord>("Program", ProgramSchema);
