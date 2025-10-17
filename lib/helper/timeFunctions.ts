import moment from "moment";

export function getSeason() {
  const month = moment().month(); // 0 = Jan ... 11 = Dec

  if (month >= 0 && month <= 4) return "Spring"; // Jan–May
  if (month >= 5 && month <= 7) return "Summer"; // Jun–Aug
  if (month >= 8 && month <= 11) return "Fall"; // Sep–Dec
}
