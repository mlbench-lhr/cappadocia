import moment from "moment";

export function getSeason() {
  const month = moment().month(); // 0 = Jan ... 11 = Dec

  if (month >= 0 && month <= 4) return "Spring"; // Jan–May
  if (month >= 5 && month <= 7) return "Summer"; // Jun–Aug
  if (month >= 8 && month <= 11) return "Fall"; // Sep–Dec
}

export function timeSince(createdAt?: string) {
  const start = moment(createdAt);
  const now = moment();
  const years = now.diff(start, "years");

  if (!createdAt) {
    return { value: "", unit: "" };
  }

  if (years >= 1) {
    return { value: years, unit: years === 1 ? "year" : "years" };
  }

  const months = now.diff(start, "months");
  if (months >= 1) {
    return { value: months, unit: months === 1 ? "month" : "months" };
  }

  const days = now.diff(start, "days");
  return { value: days, unit: days === 1 ? "day" : "days" };
}
