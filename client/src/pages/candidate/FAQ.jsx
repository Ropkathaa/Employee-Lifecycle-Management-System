import { useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import CandidateLayout from "../../components/CandidateLayout.jsx";

const FAQS = [
  {
    q: "How do I check my application status?",
    a: "Go to the Recruitment Status page from the sidebar to view your current stage and full application timeline.",
  },
  {
    q: "What documents do I need to upload during recruitment?",
    a: "During the recruitment stage, you'll need to upload your Resume/CV, and — if applicable — Experience Certificates and Professional Certifications.",
  },
  {
    q: "What happens after I accept my offer letter?",
    a: "Once you accept your offer, your Candidate Dashboard automatically converts into an Employee Dashboard, and you'll be asked to upload onboarding documents such as ID proof and educational certificates.",
  },
  {
    q: "Can I reschedule an interview?",
    a: "Yes. On the Interviews page, you can submit a reschedule request with your preferred date and reason. HR will review and respond to your request.",
  },
  {
    q: "I forgot my password. What should I do?",
    a: "Click 'Forgot password?' on the login page and follow the instructions to reset your password securely.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <CandidateLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">FAQ & Help Support</h1>
      <p className="text-slate-500 mb-6">Answers to common questions about the recruitment process.</p>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm divide-y divide-slate-100">
        {FAQS.map((item, idx) => (
          <div key={idx} className="p-5">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="text-sm font-medium text-slate-800">{item.q}</span>
              {openIndex === idx ? <HiChevronUp /> : <HiChevronDown />}
            </button>
            {openIndex === idx && <p className="text-sm text-slate-500 mt-3">{item.a}</p>}
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm mt-6">
        <h2 className="text-lg font-semibold mb-2">Still need help?</h2>
        <p className="text-sm text-slate-500">
          Reach out to your HR contact through the Notifications page, or email
          <span className="font-medium text-slate-800"> support@yourcompany.com</span>.
        </p>
      </div>
    </CandidateLayout>
  );
}
