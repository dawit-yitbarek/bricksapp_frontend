import React from "react";

const Privacy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We collect your name and email during registration. If using Google login, your name is retrieved automatically.",
    },
    {
      title: "2. How We Use Data",
      content:
        "Your email is used for registration; your name is shown on your dashboard. We do not use your data for marketing.",
    },
    {
      title: "3. Data Sharing",
      content:
        "We do not sell, trade, or share your personal data with third parties.",
    },
    {
      title: "4. Cookies and Tracking",
      content:
        "We use JWT (JSON Web Tokens) to authenticate logged-in users. Refresh tokens are stored in HTTP-only cookies.",
    },
    {
      title: "5. Data Security",
      content:
        "Your data is securely processed in our backend. JWT tokens are protected using HTTP-only cookie flags.",
    },
    {
      title: "6. Children's Privacy",
      content:
        "This service is not directed to children under 13. We do not knowingly collect data from children.",
    },
    {
      title: "7. Changes to Policy",
      content:
        "We will notify users of updates through Twitter or Telegram. Continued use implies acceptance of the new policy.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl rounded-2xl">
        <h1 className="text-4xl font-extrabold text-white mb-6 border-b border-gray-700 pb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-6 italic">Effective Date: May 5, 2025</p>

        {sections.map((section, i) => (
          <div key={i} className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">{section.title}</h2>
            <p className="text-gray-300 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Privacy;
