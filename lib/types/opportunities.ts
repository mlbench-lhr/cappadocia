export interface OpportunitiesCardType {
  _id: number;
  image: string;
  location: string;
  category:
    | "Internships"
    | "Summer Program"
    | "Clubs"
    | "Community Service"
    | "Awards"
    | "Competitions";
  title: string;
  institute: string;
  description: string;
  majors: string[];
  type: "Online" | "In-Person";
  difficulty: string | "Easy" | "Medium" | "Advanced";
  dueDate: Date;
  saved: boolean;
  ignored: boolean;
  addedToBlog: boolean;
  appliedBy: string[];
  blogAddedBy: string[];
  savedBy: string[];
  ignoredBy: string[];
  price: number;
  perHour: boolean;
  link?: string;
}
