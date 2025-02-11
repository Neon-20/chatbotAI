import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function TermsAndConditions() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="cursor-pointer px-1 underline hover:animate-pulse hover:text-black">
          T&C
        </p>
      </DialogTrigger>
      <DialogContent className="w-[70vw] overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <h2 className="mb-4 text-xl font-semibold">
            Effective Date: September 1st, 2024
          </h2>
          <div className="prose max-w-none">
            <p>
              Welcome to AID Work Copilot at Alter Domus. By using AID Work
              Copilot, you agree to comply with these Terms and Conditions.
              Please read them carefully.
            </p>

            <h2 className="mb-4 mt-6 text-2xl font-semibold">
              1. Purpose of AID Work Copilot
            </h2>
            <p>
              AID Work Copilot is a smart productivity tool designed to help
              employees at Alter Domus work more efficiently and collaborate
              better. It functions as an internal chat assistant, similar to
              ChatGPT, that integrates seamlessly into your daily tasks. AID
              Work Copilot uses advanced AI technology to process documents,
              answer questions, and provide insights, making it easier for users
              to access the information they need. Its capabilities include
              generating summaries, answering in-depth queries, and assisting
              with data extraction, ultimately enhancing communication, and
              streamlining workflows.{" "}
            </p>
            {/* <ul className="mb-4 list-disc pl-6">
              <li>
                The content of the pages of this website is for your general
                information and use only. It is subject to change without notice.
              </li>
              <li>
                This website uses cookies to monitor browsing preferences. If you do
                allow cookies to be used, personal information may be stored by us
                for use by third parties.
              </li>
              <li>
                Neither we nor any third parties provide any warranty or guarantee
                as to the accuracy, timeliness, performance, completeness or
                suitability of the information and materials found or offered on
                this website for any particular purpose. You acknowledge that such
                information and materials may contain inaccuracies or errors and we
                expressly exclude liability for any such inaccuracies or errors to
                the fullest extent permitted by law.
              </li>
            </ul> */}

            <h2 className="mb-4 mt-6 text-2xl font-semibold">2. Eligibility</h2>
            <p>
              All employees of Alter Domus are permitted to use AID Work
              Copilot. However, some capabilities may be restricted based on
              specific roles, departments, or regions.
            </p>

            <h2 className="mb-4 mt-6 text-2xl font-semibold">
              3. User Responsibilities{" "}
            </h2>
            <p>
              Users are expected to utilize AID Work Copilot in accordance with
              Alter Domus Policies on Applications. AID Work Copilot should be
              used strictly as an assistant for daily tasks. Acceptable
              behaviors include using AID Work Copilot as a smart productivity
              tool, while prohibited behaviors include, but are not limited to
              harassment or discrimination against other users, sharing
              confidential or proprietary information without authorization and
              engaging in any form of cyberbullying or malicious behavior.
              <br /> <br />
              Users must complete specific AI training before using the tool and
              ensure they understand its scope and the general background of AI.
              Users are solely responsible for their chats and conversations
              within the tool and for any data they upload.
            </p>
            <h2 className="mb-4 mt-6 text-2xl font-semibold">4. Data Usage </h2>
            <p>
              AID Work Copilot adheres to the Alter Domus Data Policy. For more
              information on data privacy and security, please refer to AID Work
              Copilot Data Policy.
            </p>
            <h2 className="mb-4 mt-6 text-2xl font-semibold">
              5. Intellectual Property{" "}
            </h2>
            <p>
              Users retain ownership of the content they create using AID Work
              Copilot. Users are granted permission to use, modify, and
              distribute this content within Alter Domus framework. However,
              using the content for illegal activities, misinformation, or in a
              manner that violates privacy rights is strictly prohibited.
            </p>
            <h2 className="mb-4 mt-6 text-2xl font-semibold">
              6. Confidentiality{" "}
            </h2>
            <p>
              AID Work Copilot is designed to respect user confidentiality. The
              chats, images, documents, or prompts used within the tool remain
              confidential and are not available to any other user, nor retain
              to train retrain or improve the models.
            </p>
            <h2 className="mb-4 mt-6 text-2xl font-semibold">
              7. Limitations of Liability{" "}
            </h2>
            <p>
              While Alter Domus strives to provide accurate information through
              AID Work Copilot, it cannot guarantee that all data generated is
              correct. Users acknowledge that they are solely responsible for
              their use of AID Work Copilot and any decisions made based on the
              information generated. Users assume all risks associated with its
              use.
            </p>
            <h2 className="mb-4 mt-6 text-2xl font-semibold">
              8. Termination of Access{" "}
            </h2>
            <p>
              Access to AID Work Copilot may be revoked if users engage in
              illegal activities, prohibited behaviors, spread misinformation,
              violate privacy rights or any other behavior Alter Domus considers
              unacceptable.
            </p>
            <h2 className="mb-4 mt-6 text-2xl font-semibold">9. Amendments </h2>
            <p>
              These Terms and Conditions may be updated or changed to adapt to
              new usage, jurisdictions, and to ensure compliance with applicable
              laws surrounding the use of Artificial Intelligence.
            </p>
            <h2 className="mb-4 mt-6 text-2xl font-semibold">
              10. Governing Law{" "}
            </h2>
            <p>
              As AID Work Copilot is a global tool, the legal jurisdiction
              governing these Terms and Conditions will be the same as the legal
              jurisdiction of the user.
            </p>
            <h2 className="mb-4 mt-6 text-2xl font-semibold">
              11. Contact Information{" "}
            </h2>
            <p>
              For questions or concerns regarding these Terms and Conditions,
              please email us at{" "}
              <a href="mailto:automation.coe@alterdomus.com">
                automation.coe@alterdomus.com
              </a>
              . The Business owner of the tool is Davendra Patel, the technical
              owner is Pranav Rajveer.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
