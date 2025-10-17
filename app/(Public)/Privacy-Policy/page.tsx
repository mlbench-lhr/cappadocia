const PrivacyPolicy = () => {
  return (
    <>
      <section id="features" className="my-[32px] lg:my-[60px]">
        <div className="container mx-auto">
          <div className="flex flex-col justify-start items-center gap-[24px]">
            <h2 className="heading-text-style-1">Privacy Policy</h2>
            <div className="flex flex-col justify-start items-center gap-[20px]">
              <p
                className="plan-text-style-2 w-full lg:w-[1000px]"
                style={{ textAlign: "start" }}
              >
                OpportuniTree collects information such as student survey
                responses (e.g., GPA, dream colleges, hobbies, possible majors,
                awards, SAT/ACT scores, budget range, and regional preferences),
                account details (name, email, login credentials), and app usage
                data. This information is used to personalize recommendations,
                track milestones, and improve platform features.ty that fosters
                collaboration, skill development, and personal growth.
              </p>
              <p
                className="plan-text-style-2 w-full lg:w-[1000px]"
                style={{ textAlign: "start" }}
              >
                We do not sell user data. Information may only be shared with
                trusted service providers (such as hosting or analytics) or
                legal authorities if required by law. Data is stored securely
                with restricted access and encrypted systems.
              </p>
              <p
                className="plan-text-style-2 w-full lg:w-[1000px]"
                style={{ textAlign: "start" }}
              >
                Users under 13 must have parental or guardian consent in
                compliance with COPPA. Parents/guardians may request data
                deletion at any time. Users also have the right to access,
                correct, or delete their information. We retain data only while
                accounts remain active.
              </p>
              <p
                className="plan-text-style-2 w-full lg:w-[1000px]"
                style={{ textAlign: "start" }}
              >
                We may update this Privacy Policy as needed, and updates will be
                posted with a new effective date.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default PrivacyPolicy;
