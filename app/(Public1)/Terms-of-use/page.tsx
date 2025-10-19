const PrivacyPolicy = () => {
  return (
    <>
      <section id="features" className="my-[32px] lg:my-[60px]">
        <div className="container mx-auto">
          <div className="flex flex-col justify-start items-center gap-[24px]">
            <h2 className="heading-text-style-1">Terms & Conditions</h2>
            <div className="flex flex-col justify-start items-center gap-[20px]">
              <p
                className="plan-text-style-2 w-full lg:w-[1000px]"
                style={{ textAlign: "start" }}
              >
                By using OpportuniTree, you agree to these terms. OpportuniTree
                is an AI-powered platform that helps students discover
                extracurricular activities, programs, and opportunities. Users
                under 13 must have parental or guardian consent. You are
                responsible for keeping your account details secure and ensuring
                that all information you provide is accurate.{" "}
              </p>
              <p
                className="plan-text-style-2 w-full lg:w-[1000px]"
                style={{ textAlign: "start" }}
              >
                You may not use the platform for illegal, harmful, or misleading
                purposes. The OpportuniTree name, logo, surveys, content, and
                brand materials are the property of OpportuniTree and may not be
                copied or distributed without permission. While we recommend
                opportunities from third parties, we are not responsible for
                their accuracy, costs, or outcomes; users should confirm details
                independently.{" "}
              </p>
              <p
                className="plan-text-style-2 w-full lg:w-[1000px]"
                style={{ textAlign: "start" }}
              >
                OpportuniTree is not liable for damages, losses, or missed
                opportunities resulting from use of the service. We may suspend
                or terminate accounts that violate these terms. These Terms are
                governed by the laws of the United States, specifically [insert
                state].{" "}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default PrivacyPolicy;
