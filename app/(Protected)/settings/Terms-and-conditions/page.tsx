"use client";

export function Terms() {
  return (
    <div className="w-full h-full flex justify-between items-end flex-col">
      <div className="w-full flex justify-start items-start gap-2 flex-col">
        <h3 className="text-lg font-semibold">
          1. Account Registration & Login
        </h3>
        <ul>
          <li>Users must register via email or social media.</li>
          <li>Account credentials must be kept secure.</li>
          <li>Password reset can be performed via the platform.</li>
        </ul>
        <h3 className="text-lg font-semibold mt-2">2. Profile Management</h3>
        <ul>
          <li>
            Users are responsible for updating personal information accurately.
          </li>
          <li>
            Users can save payment cards, set notification preferences, and
            manage favorites.
          </li>
        </ul>
        <h3 className="text-lg font-semibold mt-2">
          3. Booking & Reservations
        </h3>
        <ul>
          <li>
            Users can select dates, number of participants, and complete
            payments via the platform.
          </li>
          <li>
            Booking confirmations and cancellations will be notified to users.
          </li>
          <li>Invoice will be generated for each booking. </li>
        </ul>
        <h3 className="text-lg font-semibold mt-2">4. Reviews & Ratings </h3>
        <ul>
          <li>
            Users can submit reviews, comments, and upload photos for activities
            they participated in.
          </li>
          <li>Reviews must relate to the booked activity. </li>
        </ul>
        <h3 className="text-lg font-semibold mt-2">5. Payment & Refunds</h3>
        <ul>
          <li>Payments are processed securely through the platform.</li>
          <li>Refunds, if applicable, follow the Payment & Refund Policy.</li>
        </ul>
      </div>
    </div>
  );
}
