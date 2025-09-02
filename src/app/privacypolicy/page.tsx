import { SEO } from "@/components/SEO";

const PrivacyPolicy = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy - Veyra"
        description="Privacy Policy for Veyra platform - how we collect, use, and protect your data"
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Glass card container */}
          <div className="backdrop-blur-md bg-gray-800/70 border border-gray-700 rounded-3xl p-10 shadow-xl">
            <div className="space-y-10">
              {/* Title */}
              <h1 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 mb-8">
                Privacy Policy
              </h1>

              {/* Dates */}
              <div className="flex flex-col md:flex-row justify-between text-sm text-gray-400 mb-8">
                <span><strong>Effective Date:</strong> 28 February 2025</span>
                <span><strong>Last Updated:</strong> 28 February 2025</span>
              </div>

              {/* Main content */}
              <div className="space-y-8 leading-relaxed text-gray-300">
                <p>
                  Veyra ("we," "us," or "our") operates the Veyra platform, including our website, mobile applications, 
                  and brand/creator dashboards (collectively, the "Platform"). This Privacy Policy describes how we collect, 
                  use, store, and share your personal data when you use our services.
                </p>

                <p>
                  By accessing or using Veyra, you consent to our collection, storage, and processing of your data as outlined 
                  in this policy. If you do not agree, please do not use the platform.
                </p>

                <hr className="border-gray-700 my-8" />

                {/* Sections */}
                {[
                  {
                    title: "1. Information We Collect",
                    content: (
                      <>
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">1.1 Personal Information (PI)</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>Full Name</li>
                          <li>Email Address</li>
                          <li>Phone Number</li>
                          <li>Profile Photo</li>
                          <li>Username & Password</li>
                          <li>Shipping & Billing Address (for purchases)</li>
                          <li>Government ID (if needed for creator/brand verification)</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">1.2 Non-Personal Information</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>Device Info (IP address, OS, browser, app version)</li>
                          <li>Usage Data (clicks, views, time spent)</li>
                          <li>Referral Data (how you found us)</li>
                          <li>Analytics Data (via Google Analytics, Firebase, etc.)</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">1.3 Payment & Transaction Data</h3>
                        <p className="mb-4">
                          Payments are processed by third-party gateways (e.g., Razorpay). We do not store card details or financial data on our servers.
                        </p>
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">1.4 Content Data (for Brands & Creators)</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>Uploaded content (images, videos, captions)</li>
                          <li>Creator/brand bios and social links</li>
                          <li>Engagement metrics (likes, views, clicks)</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">1.5 Contacts & Social Media (Optional)</h3>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Your contact list (for suggesting friends or followers)</li>
                          <li>Your connected social handles (for profile enhancement)</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: "2. How We Use Your Data",
                    content: (
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Operate and improve Veyra's core features</li>
                        <li>Enable social interaction (likes, follows, comments, DMs)</li>
                        <li>Recommend personalized content</li>
                        <li>Process orders and payments</li>
                        <li>Verify brand and creator identities</li>
                        <li>Prevent fraud and ensure platform safety</li>
                        <li>Conduct analytics and measure engagement</li>
                        <li>Deliver marketing messages (with opt-out options)</li>
                      </ul>
                    ),
                  },
                  {
                    title: "3. How We Share Your Data",
                    content: (
                      <>
                        <p>We do not sell your data. However, we may share it with:</p>
                        <h3 className="text-lg font-medium text-indigo-400 mt-3">Service Providers</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>Payment gateways (e.g., Razorpay)</li>
                          <li>Cloud infrastructure providers</li>
                          <li>Analytics and ad partners</li>
                          <li>Customer support tools</li>
                        </ul>
                        <h3 className="text-lg font-medium text-indigo-400 mt-3">Brands & Creators</h3>
                        <p className="mb-4">Limited profile data and public content may be shared for coordination and reporting.</p>
                        <h3 className="text-lg font-medium text-indigo-400 mt-3">Legal & Compliance</h3>
                        <p className="mb-4">We may disclose your data to law enforcement or regulators if required by law.</p>
                        <h3 className="text-lg font-medium text-indigo-400 mt-3">Business Transfers</h3>
                        <p>User data may be transferred in a merger, acquisition, or asset sale.</p>
                      </>
                    ),
                  },
                  {
                    title: "4. Data Retention & Security",
                    content: (
                      <>
                        <p>We retain your data:</p>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>As long as your account is active, and</li>
                          <li>For as long as necessary to comply with legal obligations</li>
                        </ul>
                        <p>Your data is stored on secure servers with encryption and periodic security reviews.</p>
                        <p>You may request full data deletion by emailing ankit@veyra.co.in.</p>
                      </>
                    ),
                  },
                  {
                    title: "5. Your Rights & Choices",
                    content: (
                      <>
                        <h3 className="text-lg font-medium text-indigo-400 mt-3">5.1 Access & Correction</h3>
                        <p className="mb-4">You can access or update your profile via the Settings section.</p>
                        <h3 className="text-lg font-medium text-indigo-400 mt-3">5.2 Data Deletion</h3>
                        <p className="mb-4">You may request account and data deletion via email to ankit@veyra.co.in.</p>
                        <h3 className="text-lg font-medium text-indigo-400 mt-3">5.3 Marketing Opt-Out</h3>
                        <p>You can unsubscribe from promotional emails and push notifications through your settings.</p>
                      </>
                    ),
                  },
                  {
                    title: "6. Cookies & Tracking Technologies",
                    content: (
                      <>
                        <p>Veyra uses cookies and similar tools for:</p>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>Managing sessions and logins</li>
                          <li>Analyzing behavior and performance</li>
                          <li>Recommending relevant products and content</li>
                        </ul>
                        <p>You may disable cookies in your browser settings, though some features may be limited.</p>
                      </>
                    ),
                  },
                  {
                    title: "7. Third-Party Links & Services",
                    content: (
                      <>
                        <p>Veyra may include external links (e.g., brand stores or payment pages). We are not responsible for their privacy practices.</p>
                        <h3 className="text-lg font-medium text-indigo-400 mt-3">7.1 Instagram Integration for Creators</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>Enhanced engagement</li>
                          <li>Comment-based auto-replies with product links</li>
                          <li>Profile verification</li>
                        </ul>
                        <p>Upon granting access via Instagram OAuth, Veyra may:</p>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>View your public Instagram profile and posts</li>
                          <li>Read public comments for product-related engagement</li>
                          <li>Send product links to commenters via auto-replies</li>
                        </ul>
                        <p>We do not access private messages or post content on your behalf without context.</p>
                        <p>You may disconnect Instagram at any time through either Veyra or Instagram settings.</p>
                        <p>This feature complies with Meta's Platform Terms.</p>
                      </>
                    ),
                  },
                  {
                    title: "8. Children's Privacy",
                    content: (
                      <>
                        <p>Veyra is not intended for users under 13 years old (or 16 where applicable).</p>
                        <p>If we learn that a minor has registered, we will delete the account and associated data.</p>
                      </>
                    ),
                  },
                  {
                    title: "9. Changes to This Policy",
                    content: (
                      <>
                        <p>We may update this Privacy Policy from time to time. Significant updates will be notified through:</p>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                          <li>Email</li>
                          <li>In-app alerts</li>
                          <li>Our website</li>
                        </ul>
                        <p>Your continued use of Veyra after changes indicates acceptance.</p>
                      </>
                    ),
                  },
                  {
                    title: "10. Contact Us",
                    content: (
                      <>
                        <p>For privacy questions, data requests, or complaints:</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>📧 Email: ankit@veyra.co.in</li>
                          <li>📍 Address: Godrej Infinity, Tower 6A, Pune, Maharashtra, India</li>
                          <li>🌐 Website: www.veyra.co.in</li>
                        </ul>
                      </>
                    ),
                  },
                ].map((section, i) => (
                  <section key={i} className="space-y-4">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 mb-4">
                      {section.title}
                    </h2>
                    {section.content}
                    {i !== 9 && <hr className="border-gray-700 my-6" />}
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

export default PrivacyPolicy;
