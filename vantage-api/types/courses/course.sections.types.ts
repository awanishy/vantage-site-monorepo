export type UUID = string;

export interface MediaAsset {
  url: string;
  alt?: string;
}

export interface Mentor {
  id: UUID;
  name: string;
  title?: string;
  company?: string;
  photo?: MediaAsset;
  bio?: string;
  socials?: Partial<Record<"linkedin" | "twitter" | "website", string>>;
}

export interface ProgramDirectorInfo {
  name: string;
  title?: string;
  photo?: MediaAsset;
  bio?: string;
}

export interface FAQItem {
  id: UUID;
  question: string;
  answer: string;
  category?: string;
}

export interface StepItem {
  id: UUID;
  title: string;
  description?: string;
  icon?: MediaAsset;
}

export interface HighlightItem {
  id: UUID;
  label: string;
  value?: string;
  icon?: MediaAsset;
}

export interface TargetAudienceItem {
  id: UUID;
  title: string;
  description?: string;
  icon?: MediaAsset;
}

export interface PricingBreakdown {
  currency: string;
  tuition: number;
  applicationFee?: number;
  taxesIncluded?: boolean;
}

export interface ScholarshipInfo {
  available: boolean;
  description?: string;
  minAmount?: number;
  maxAmount?: number;
  criteria?: string[];
}

export interface AdmissionInfo {
  applicationDeadline?: string;
  startDate?: string;
  durationWeeks?: number;
  scheduleNote?: string;
  pricing?: PricingBreakdown;
  scholarship?: ScholarshipInfo;
  contactEmail?: string;
}

export interface CertificateInfo {
  title?: string;
  description?: string;
  previewImage?: MediaAsset;
}

export interface CallToAction {
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
}

export interface CourseModule {
  id: UUID;
  title: string;
  description?: string;
  weeks?: number;
  topics?: string[];
}

export interface CourseInfo {
  summary?: string;
  outcomes?: string[];
  modules?: CourseModule[];
}

export interface HeroSection {
  heading: string;
  subheading?: string;
  background?: MediaAsset;
  video?: MediaAsset;
  cta?: CallToAction;
}

export interface OverviewSectionData {
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LearningHighlightsSectionData {
  title?: string;
  highlights: HighlightItem[];
}

export interface MentorsSectionData {
  title?: string;
  mentors: Mentor[];
}

export interface BuiltForSectionData {
  title?: string;
  audience: TargetAudienceItem[];
}

export interface FAQSectionData {
  title?: string;
  items: FAQItem[];
}

export type SectionKind =
  | "navbar"
  | "hero"
  | "courseInfo"
  | "overview"
  | "learningHighlights"
  | "programDirector"
  | "mentors"
  | "threeStep"
  | "builtFor"
  | "admissionScholarshipFees"
  | "certificate"
  | "callToAction"
  | "faq"
  | "footer";

export interface SectionsMap {
  navbar?: { enabled: boolean };
  hero: HeroSection;
  courseInfo?: CourseInfo;
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

export type SectionData<K extends SectionKind> = SectionsMap[K];

export type SectionRecord<K extends SectionKind = SectionKind> = {
  key: K;
  data: SectionData<K>;
};
