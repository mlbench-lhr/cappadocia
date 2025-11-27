export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Last Updated: 20.11.2025
          </p>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-10">
          {/* Introduction */}
          <div className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              These Terms and Conditions ("Terms") govern the use of the website{" "}
              <a
                href="https://www.cappadociaplatform.com"
                className="text-blue-600 hover:underline font-semibold"
              >
                www.cappadociaplatform.com
              </a>{" "}
              and the mobile application operated by{" "}
              <span className="font-semibold">
                KAHVECİ OTELCİLİK TURİZM TİCARET LİMİTED ŞİRKETİ
              </span>{" "}
              ("Platform"). By accessing or using the Platform, all users and
              suppliers ("User") unconditionally accept and agree to these
              Terms.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              1. Purpose and Scope
            </h2>
            <p className="text-slate-700 leading-relaxed">
              These Terms regulate the listing, sale, reservation processes,
              payment system, cancellation and refund policies regarding tour,
              activity and experience services available on the Platform, as
              well as the legal responsibilities between suppliers and
              customers.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              2. Definitions
            </h2>
            <div className="space-y-3">
              <div className="pl-4 border-l-4 border-amber-500">
                <p className="font-semibold text-slate-900">Platform:</p>
                <p className="text-slate-700">
                  A digital marketplace system where tour, activity and
                  experience services are listed, sold, and reserved.
                </p>
              </div>
              <div className="pl-4 border-l-4 border-amber-500">
                <p className="font-semibold text-slate-900">Supplier:</p>
                <p className="text-slate-700">
                  A natural or legal person who provides the service.
                </p>
              </div>
              <div className="pl-4 border-l-4 border-amber-500">
                <p className="font-semibold text-slate-900">Customer:</p>
                <p className="text-slate-700">
                  A user who purchases the service.
                </p>
              </div>
              <div className="pl-4 border-l-4 border-amber-500">
                <p className="font-semibold text-slate-900">Service:</p>
                <p className="text-slate-700">
                  Any commercial product including tours, excursions, events,
                  transfers, workshops, tickets, etc.
                </p>
              </div>
              <div className="pl-4 border-l-4 border-amber-500">
                <p className="font-semibold text-slate-900">Reservation:</p>
                <p className="text-slate-700">
                  A purchase transaction made through the Platform.
                </p>
              </div>
              <div className="pl-4 border-l-4 border-amber-500">
                <p className="font-semibold text-slate-900">Commission:</p>
                <p className="text-slate-700">
                  The commercial fee deducted by the Platform from each sale.
                </p>
              </div>
              <div className="pl-4 border-l-4 border-amber-500">
                <p className="font-semibold text-slate-900">
                  High-Risk Activity:
                </p>
                <p className="text-slate-700">
                  Activities that involve risks such as injury, accident, or
                  death.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              3. Role of the Platform and Limitation of Liability
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-semibold">Important Notice:</p>
              <p className="text-slate-700 mt-2">
                The Platform acts solely as an intermediary and provides
                technical management of the reservation process. The Platform
                does not organize tours, provide safety, equipment,
                transportation, guiding, insurance, or operational support.
              </p>
            </div>
            <p className="text-slate-700 leading-relaxed mb-3">
              The Platform shall not be held liable for any accidents, injuries,
              deaths, delays, cancellations, losses, damages, or any other
              consequences that may occur during the service.
            </p>
            <p className="text-slate-700 leading-relaxed font-semibold">
              All legal and financial responsibility rests solely with the
              Supplier.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              4. Supplier Obligations and Required Documentation
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The Supplier declares that they possess all necessary official
              permits, licenses, and authorizations required to provide the
              service.
            </p>
            <p className="text-slate-700 mb-3 font-semibold">
              The Supplier is responsible for providing the following documents:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4 mb-4">
              <li>TURSAB Agency License (A/B/C Class)</li>
              <li>Tax certificate</li>
              <li>Trade registry gazette</li>
              <li>Signature circular</li>
              <li>Professional liability insurance</li>
              <li>Package-tour insurance</li>
              <li>Personal accident insurance for high-risk activities</li>
              <li>Required municipal/port/environmental/vehicle permits</li>
              <li>Guide licenses</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              The Supplier is solely responsible for the validity, accuracy, and
              currency of these documents and agrees to present them upon
              request by the Platform.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              5. Service Standards and Penalty Provisions
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The Supplier is obligated to provide services completely, safely,
              legally, and as advertised.
            </p>
            <div className="space-y-3">
              <p className="text-slate-700 leading-relaxed">
                If the Supplier provides faulty, low-quality, risky, unsafe, or
                misleading service, the customer fee must be refunded and the
                Supplier must compensate the Platform for damages.
              </p>
              <p className="text-slate-700 leading-relaxed">
                If fake documents, false information, or any unlawful situation
                is detected, the Supplier's account will be terminated
                immediately and legal notification will be made.
              </p>
              <p className="text-slate-700 leading-relaxed">
                If customer complaint levels exceed an acceptable threshold, the
                Platform reserves the right to suspend or terminate the
                Supplier's account.
              </p>
              <p className="text-slate-700 leading-relaxed font-semibold">
                The Platform may block payments, remove content, suspend
                membership, or permanently terminate access.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              6. Pricing, Commission, and Payment Terms
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Service prices are determined by the Supplier.</li>
              <li>
                The Platform reserves the right to charge commission for each
                reservation.
              </li>
              <li>
                Payments will be transferred to the Supplier according to the
                payment schedule determined by the Platform.
              </li>
              <li>
                In the case of customer disputes or bank conflicts, the Platform
                may temporarily block payment.
              </li>
              <li>
                The Supplier accepts in advance that commission fees must be
                refunded in the case of cancellations and refunds.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              7. Cancellation and Refund Policy
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div>
                <p className="font-semibold text-slate-900">
                  Free Cancellation:
                </p>
                <p className="text-slate-700">
                  Customers may cancel reservations free of charge up to 7 days
                  before the service date.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">50% Charge:</p>
                <p className="text-slate-700">
                  Cancellations made 6–3 days prior will be charged 50% of the
                  service amount.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">100% Charge:</p>
                <p className="text-slate-700">
                  Cancellations made less than 48 hours prior will be charged
                  100%.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">No-Show:</p>
                <p className="text-slate-700">
                  No-show cases are non-refundable.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Force Majeure:</p>
                <p className="text-slate-700">
                  In cases of force majeure (weather conditions, technical
                  failure, government restrictions, health emergencies),
                  customers are entitled to a full refund or to reschedule the
                  service.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              8. High-Risk Activity Protocol
            </h2>
            <div className="bg-orange-50 border border-orange-300 rounded-lg p-4 mb-4">
              <p className="font-semibold text-orange-900 mb-2">
                High-Risk Activities Include:
              </p>
              <p className="text-slate-700">
                ATV, rafting, zipline, scuba diving, paragliding, safari, boat
                tours, climbing, and similar activities.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-slate-700 leading-relaxed">
                The Customer accepts full responsibility for assessing their own
                physical condition prior to participation.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Failure to comply with safety rules is solely the Customer's
                responsibility.
              </p>
              <p className="text-slate-700 leading-relaxed">
                The Supplier must provide the necessary insurance, equipment,
                trained staff, and safety measures.
              </p>
              <p className="text-slate-700 leading-relaxed font-semibold">
                The Supplier assumes full legal and financial liability for any
                accident, injury, death, or material damage.
              </p>
              <p className="text-slate-700 leading-relaxed font-semibold text-red-700">
                The Platform shall not be held liable under any circumstances.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              9. Customer Responsibilities
            </h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              The Customer is responsible for providing accurate and complete
              information, complying with safety rules, and ensuring that they
              meet the required health conditions.
            </p>
            <p className="text-slate-700 leading-relaxed font-semibold text-red-700">
              Participation under the influence of alcohol or drugs is strictly
              prohibited.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              10. Intellectual Property
            </h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              All content (text, images, video, trademarks, etc.) on the
              Platform is owned or licensed by the Platform.
            </p>
            <p className="text-slate-700 leading-relaxed mb-3">
              Content may not be copied, shared, or used commercially without
              permission.
            </p>
            <p className="text-slate-700 leading-relaxed">
              The Supplier grants the Platform license rights to use supplied
              content in promotional and marketing activities.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              11. Data Protection and Privacy
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Personal data is processed in accordance with applicable data
              protection legislation and KVKK. The Platform operates a separate
              Privacy and Cookie Policy.
            </p>
          </section>

          {/* Section 12 */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              12. Dispute Resolution and Jurisdiction
            </h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              Disputes shall first be attempted to be resolved through
              negotiation.
            </p>
            <p className="text-slate-700 leading-relaxed mb-2">
              If no resolution is reached, the following courts have exclusive
              jurisdiction:
            </p>
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4">
              <p className="font-semibold text-slate-900">
                Courts and Enforcement Offices of NEVŞEHİR, TURKEY
              </p>
              <p className="text-slate-700 mt-2">
                Applicable law is Turkish Law.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              13. Enforcement and Amendments
            </h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              The Platform reserves the right to modify these Terms
              unilaterally.
            </p>
            <p className="text-slate-700 leading-relaxed mb-3">
              Changes become effective upon publication.
            </p>
            <p className="text-slate-700 leading-relaxed font-semibold">
              Continued use of the Platform constitutes acceptance of updated
              Terms.
            </p>
          </section>

          {/* End Notice */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <p className="text-center text-slate-600 italic">
              This document clearly and comprehensively sets out the commercial
              and legal responsibilities between the Supplier, Customer, and the
              Platform.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
