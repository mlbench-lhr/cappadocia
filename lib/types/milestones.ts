export interface MilestonesCardType {
  _id?: string;
  image: string;
  category: string;
  title: string;
  organization: string;
  description: string;
  majors?: string[];
  type: string | "Opportunity" | "Awards";
  deadLine: Date;
  dependencies: string[];
  linkedOpportunities: string[];
  status?: "not_started" | "skipped" | "done" | "in_progress";
  saved?: boolean;
  skipped?: boolean;
  markedAsDone?: boolean;
  applied?: boolean;
  price?: number;
  perHour?: boolean;
  aiGenerated?: boolean;
  gradeLevel?: string;
  tier?: string;
  completed?: boolean;
  started?: boolean;
  season?: "Fall" | "Spring" | "Summer";
}
export interface MilestoneForm {
  image: string;
  title: string;
  organization: string;
  type: string | "Opportunity" | "Awards";
  category: string;
  gradeLevel: string;
  deadLine: Date;
  description: string;
  dependencies: string[];
  linkedOpportunities: string[];
}
