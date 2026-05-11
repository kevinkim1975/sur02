// ===== lib/types.ts =====
export type QuestionType = 'radio' | 'text' | 'textarea' | 'radio+textarea' | 'display+radio+text' | 'identity' | 'priceTable' | 'checkbox';
export type SectionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface QuestionConfig {
  id: string;
  section: SectionId;
  sectionTitle: string;
  label: string;
  type: QuestionType;
  hint?: string;
  subLabel?: string;
  required: boolean;
  rows?: number;
  options?: string[];
  placeholder?: string;
  tableRows?: number;
  maxSelections?: number;
  procedures?: string[];
  priceLevels?: { id: string; label: string }[];
}

export interface SurveyConfig {
  clinicName: string;
  brandName: string;
  surveyTitle: string;
  formspreeId: string;
  thankYouMessage: string;
  headerDescription: string;
  subjectPrefix?: string;
  footerNotice?: string;
  metaDescription?: string;
  editionLabel?: string;
  mastheadSubtitle?: string;
  estimatedMinutes?: number;
  questions: QuestionConfig[];
}
