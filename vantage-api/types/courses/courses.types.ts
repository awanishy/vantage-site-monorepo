import {
  AdmissionInfo,
  BuiltForSectionData,
  CallToAction,
  CertificateInfo,
  CourseInfo,
  FAQSectionData,
  HeroSection,
  LearningHighlightsSectionData,
  MentorsSectionData,
  OverviewSectionData,
  ProgramDirectorInfo,
  SectionKind,
  SectionsMap,
  StepItem,
  PricingBreakdown,
} from "./course.sections.types";

export type ProgramKind =
  | "fellowship"
  | "bootcamp"
  | "certificate"
  | "workshop"
  | "custom";

export type UUID = string;

export interface ProgramBase {
  id: UUID;
  programId: string; // stable external id for client/backend usage
  kind: ProgramKind;
  slug: string; // e.g. "fellowship"
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  mode?: "online" | "offline" | "hybrid";
  location?: string;
  pricing?: PricingBreakdown;
}

export interface FellowshipProgramSections {
  navbar?: { enabled: boolean };
  hero: HeroSection;
  courseInfo?: CourseInfo; // maps to CourseInfoComponent
  overview?: OverviewSectionData;
  learningHighlights?: LearningHighlightsSectionData;
  programDirector?: ProgramDirectorInfo;
  mentors?: MentorsSectionData;
  threeStep?: { steps: StepItem[] };
  builtFor?: BuiltForSectionData;
  admissionScholarshipFees?: AdmissionInfo;
  certificate?: CertificateInfo;
  callToAction?: CallToAction;
  faq?: FAQSectionData;
  footer?: { enabled: boolean };
}

export interface Program<TSections = FellowshipProgramSections>
  extends ProgramBase {
  sections: TSections;
}

export type FellowshipProgram = Program<FellowshipProgramSections>;

// Generic section typing utilities (reusable across program kinds)
// Section types live in course.sections.types.ts

// Generic handlers that work with the canonical sections shape
export type ProgramAny = Program<SectionsMap>;

// Discriminated union placeholder for future concrete program kinds
export type KnownProgram = Program<FellowshipProgramSections>;
