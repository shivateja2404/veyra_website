import { SEO } from "@/components/SEO";

const TermsAndConditions = () => {
  return (
    <>
      <SEO 
        title="Terms and Conditions - Veyra"
        description="Terms and Conditions for using Veyra platform"
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Glass card container */}
          <div className="backdrop-blur-md bg-gray-800/70 border border-gray-700 rounded-3xl p-10 shadow-xl">
            <div className="space-y-10">
              {/* Title */}
              <h1 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 mb-8">
                Terms and Conditions
              </h1>

              {/* Dates */}
              <div className="flex flex-col md:flex-row justify-between text-sm text-gray-400 mb-8">
                <span><strong>Effective Date:</strong> 1 August 2025</span>
                <span><strong>Last Updated:</strong> 1 August 2025</span>
              </div>

              {/* Main content */}
              <div className="space-y-8 leading-relaxed text-gray-300">
                <p>
                  Welcome to Veyra! These Terms and Conditions ("Terms") govern your access and use of Veyra, 
                  including our website, mobile applications, and brand/creator dashboards (collectively, the "Platform").
                </p>

                <p>
                  By using Veyra, you agree to these Terms. If you do not accept them, please do not use our services.
                </p>

                <hr className="border-gray-700 my-8" />

                {/* Sections */}
                {[
                  {
                    title: "1. Company Details",
                    content: <p>📌 Veyra is currently owned and operated by its founding team and is not yet incorporated. We are headquartered in Pune, India.</p>,
                  },
                  {
                    title: "2. Definitions",
                    content: (
                      <ul className="list-disc pl-6 space-y-1">
                        <li><strong>"Company," "we," "us," "our"</strong> refers to the Veyra team.</li>
                        <li><strong>"User," "you," "your"</strong> refers to any individual or entity using Veyra.</li>
                        <li><strong>"Brands"</strong> refer to businesses that list and promote their products on Veyra.</li>
                        <li><strong>"Creators"</strong> refer to users who create and share product-related content.</li>
                        <li><strong>"Content"</strong> refers to images, videos, text, and other media uploaded to Veyra.</li>
                        <li><strong>"Sourcing"</strong> refers to creators receiving free products to create promotional content and return them after use.</li>
                      </ul>
                    ),
                  },
                  {
                    title: "3. Eligibility",
                    content: (
                      <>
                        <p className="mb-4">You must be at least 13 years old (or 16 in some jurisdictions) to use Veyra. By using the platform, you confirm that:</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>✔ You are legally eligible to enter into a binding agreement.</li>
                          <li>✔ You will comply with these Terms and all applicable laws.</li>
                          <li>✔ If signing up on behalf of a business, you have authority to bind the entity.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: "4. Account Registration & Security",
                    content: (
                      <>
                        <h3 className="text-lg font-medium text-indigo-400 mb-2">4.1 Creating an Account</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>Users must sign up with a valid email, phone number, or social media login.</li>
                          <li>Brands and creators may need additional verification.</li>
                          <li>You are responsible for keeping login credentials confidential.</li>
                        </ul>
                        <h3 className="text-lg font-medium text-indigo-400 mb-2">4.2 Account Restrictions</h3>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>❌ Provide false information.</li>
                          <li>❌ Use another person's account.</li>
                          <li>❌ Engage in fraudulent, illegal, or harmful activities.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: "5. Platform Usage",
                    content: (
                      <ul className="list-disc pl-6 space-y-1">
                        <li>✔ Use the platform for personal or business use only.</li>
                        <li>✔ Upload only authentic, legal, and non-infringing content.</li>
                        <li>✔ Respect other users and not harass, threaten, or abuse anyone.</li>
                        <li>✔ Follow all applicable laws, including Indian IT laws.</li>
                      </ul>
                    ),
                  },
                  {
                    title: "6. Content & Intellectual Property",
                    content: (
                      <>
                        <h3 className="text-lg font-medium text-indigo-400 mb-2">6.1 User-Generated Content</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>Creators & brands retain ownership of their content but grant Veyra a royalty-free, worldwide license to use, promote, and distribute it.</li>
                          <li>You must have rights and permissions for all content you upload.</li>
                          <li>We may moderate, remove, or restrict content that violates laws or our policies.</li>
                        </ul>
                        <h3 className="text-lg font-medium text-indigo-400 mb-2">6.2 Copyright & Trademark Infringement</h3>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>If you believe your copyrighted content is being used without permission, contact us at ankit@veyra.co.in.</li>
                          <li>We take intellectual property violations seriously.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: "7. Purchasing & Transactions",
                    content: (
                      <>
                        <h3 className="text-lg font-medium text-indigo-400 mb-2">7.1 Orders & Payments</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>Veyra does not sell products directly; we connect users with brands.</li>
                          <li>Payments are processed via Razorpay or other third-party gateways.</li>
                          <li>We are not liable for payment failures, chargebacks, or order disputes.</li>
                        </ul>
                        <h3 className="text-lg font-medium text-indigo-400 mb-2">7.2 Cancellations & Refunds</h3>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Brands define their own refund and cancellation policies, which generally follow industry standards.</li>
                          <li>Users must contact the brand directly for refunds or returns.</li>
                          <li>Veyra may intervene only in cases of fraud or abuse of platform policies.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: "8. Brand & Creator Responsibilities",
                    content: (
                      <>
                        <h3 className="text-lg font-medium text-indigo-400 mb-2">8.1 Brand Responsibilities</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>Ensure accurate and lawful product listings.</li>
                          <li>Fulfill orders promptly and as described.</li>
                          <li>Provide clear return and refund policies.</li>
                        </ul>
                        <h3 className="text-lg font-medium text-indigo-400 mb-2">8.2 Creator Responsibilities</h3>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Clearly disclose paid partnerships or sponsored content.</li>
                          <li>Upload original, high-quality content that complies with all laws.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: "9. Prohibited Activities",
                    content: (
                      <>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>🚫 No fake reviews or misleading promotions.</li>
                          <li>🚫 No hate speech, harassment, or illegal content.</li>
                          <li>🚫 No fraud, hacking, or exploiting the platform.</li>
                          <li>🚫 No data scraping, bot usage, or unauthorized automation.</li>
                        </ul>
                        <p className="mt-2">Violations may result in account termination, legal action, or financial penalties.</p>
                      </>
                    ),
                  },
                  {
                    title: "10. Privacy & Data Protection",
                    content: (
                      <>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>✔ The collection of personal data (e.g., name, email, preferences).</li>
                          <li>✔ Use of cookies and third-party analytics tools for personalized content and performance insights.</li>
                          <li>✔ Sharing limited data with brands where necessary to fulfill orders.</li>
                          <li>✔ Receiving service-related emails or notifications.</li>
                        </ul>
                        <p>You may request deletion of your account and data at any time by contacting ankit@veyra.co.in.</p>
                        <p>For more, see our <a href="/privacy-policy" className="text-purple-400 underline">Privacy Policy</a>.</p>
                      </>
                    ),
                  },
                  {
                    title: "11. Limitation of Liability",
                    content: (
                      <ul className="list-disc pl-6 space-y-1">
                        <li>⚠ Guarantee product quality, legality, or delivery timelines.</li>
                        <li>⚠ Guarantee the authenticity of user content or brand claims.</li>
                        <li>⚠ Accept liability for direct, indirect, or incidental damages resulting from platform use.</li>
                      </ul>
                    ),
                  },
                  {
                    title: "12. Termination & Suspension",
                    content: (
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Violate these Terms or platform guidelines.</li>
                        <li>Are associated with fraudulent, abusive, or illegal activity.</li>
                        <li>Are subject to valid legal or regulatory actions.</li>
                      </ul>
                    ),
                  },
                  {
                    title: "13. Governing Law & Dispute Resolution",
                    content: (
                      <ul className="list-disc pl-6 space-y-1">
                        <li>These Terms are governed by the laws of India.</li>
                        <li>Disputes shall be resolved via arbitration in Pune, Maharashtra.</li>
                        <li>You waive any right to participate in class-action suits.</li>
                      </ul>
                    ),
                  },
                  {
                    title: "14. Changes to Terms",
                    content: (
                      <>
                        <p className="mb-2">We may update these Terms from time to time. Changes will be notified through:</p>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>📌 Email or push notifications</li>
                          <li>📌 Our website (https://veyra.co.in)</li>
                        </ul>
                        <p>Continued use of the platform after updates constitutes acceptance.</p>
                      </>
                    ),
                  },
                  {
                    title: "15. Contact Us",
                    content: (
                      <ul className="list-disc pl-6 space-y-1">
                        <li>📧 ankit@veyra.co.in</li>
                        <li>📍 Godrej Infinity, Tower 6A, Pune, India</li>
                        <li>🌐 https://veyra.co.in</li>
                      </ul>
                    ),
                  },
                ].map((section, i) => (
                  <section key={i} className="space-y-4">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 mb-4">
                      {section.title}
                    </h2>
                    {section.content}
                    {i !== 14 && <hr className="border-gray-700 my-6" />}
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
