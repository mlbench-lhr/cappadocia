import { BookingWithPopulatedData } from "../types/booking";

export function formatPricing(data: BookingWithPopulatedData) {
  const currency = data.paymentDetails.currency;
  const slot = data.activity.slots?.[0];
  const parts = [];
  if (data.childrenCount > 0) {
    const label = data.childrenCount > 1 ? "Children" : "Child";
    parts.push(
      `${currency}${slot.childPrice} × ${data.childrenCount} ${label}`
    );
  }
  if (data.adultsCount > 0) {
    const label = data.adultsCount > 1 ? "Adults" : "Adult";
    parts.push(`${currency}${slot.adultPrice} × ${data.adultsCount} ${label}`);
  }
  return `${parts.join(" + ")} = ${currency}${data.paymentDetails.amount}`;
}
