// Rule-based chatbot brain. Keyword scoring keeps it fast, free and predictable.
// To upgrade later, swap `getReply` for an LLM call and keep the same response shape.

const PHONE = '+91 9610332259';
const EMAIL = 'sales@startuphealer.com';

const intents = [
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'namaste', 'hii', 'good morning', 'good evening'],
    reply:
      "Hi! 👋 I'm the StartupHealer assistant. I can help with Startup India, MSME, GST, ISO, Trademark, Company Registration, Funding, Websites and Digital Marketing. What are you looking for?",
    quickReplies: ['Startup India Certificate', 'MSME Registration', 'Pricing', 'Talk to an expert'],
  },
  {
    id: 'startup-india',
    keywords: ['startup india', 'dpiit', 'recognition', 'startup certificate', 'tax exemption', '80iac'],
    reply:
      'Startup India Certificate (DPIIT recognition) — we handle eligibility assessment, document preparation & filing, DPIIT registration, government follow-up and certificate delivery. Benefits: tax exemptions for 3 years, IPR fast-track and access to government schemes. Starting from ₹5,000.',
    quickReplies: ['Documents required', 'Talk to an expert', 'Other services'],
    link: '/services/startup-india-certificate',
  },
  {
    id: 'msme',
    keywords: ['msme', 'udyam', 'udyog', 'small business', 'hackathon'],
    reply:
      'MSME / Udyam Registration — portal setup, business classification guidance, subsidy consultation and certificate issuance. Benefits: easy bank loans, government subsidies, lower interest rates. Starting from ₹1,000.',
    quickReplies: ['Talk to an expert', 'GST Registration', 'Pricing'],
    link: '/services/msme-certificate',
  },
  {
    id: 'gst',
    keywords: ['gst', 'gstin', 'return filing', 'input tax', 'tax'],
    reply:
      'GST Registration & Compliance — GST number registration, monthly/quarterly return filing, input tax credit optimisation, audit support and notice handling. Starting from ₹2,500.',
    quickReplies: ['Talk to an expert', 'Pricing'],
    link: '/services/gst-registration',
  },
  {
    id: 'iso',
    keywords: ['iso', '9001', 'quality certification', 'ce', 'gmp'],
    reply:
      'ISO 9001:2015 Certification — gap analysis, complete documentation, internal audit prep, external audit coordination and certificate issuance. Starting from ₹3,300.',
    quickReplies: ['Talk to an expert', 'Pricing'],
    link: '/services/iso-9001-certification',
  },
  {
    id: 'trademark',
    keywords: ['trademark', 'brand', 'logo protection', 'company registration', 'pvt ltd', 'private limited', 'incorporation', 'llp', 'moa', 'aoa'],
    reply:
      'Trademark & Company Registration — trademark search & filing, RoC name approval, MOA/AOA drafting, PAN/TAN and more. Trademark from ₹9,000 (12-18 months) | Company from ₹12,999 (7-10 days).',
    quickReplies: ['Talk to an expert', 'Pricing'],
    link: '/services/trademark-company-registration',
  },
  {
    id: 'funding',
    keywords: ['funding', 'investor', 'investment', 'pitch', 'deck', 'raise', 'seed', 'grant', 'sisfs', 'loan'],
    reply:
      'Funding & Investment Support — pitch deck design, financial model, investor database access, pitch practice and term-sheet negotiation support. Custom packages from ₹25,000.',
    quickReplies: ['Talk to an expert', 'Free funding checklist'],
    link: '/services/funding-investment-support',
  },
  {
    id: 'web',
    keywords: ['website', 'web design', 'development', 'ecommerce', 'e-commerce', 'app', 'landing page'],
    reply:
      'Web Design & Development — custom UI/UX, responsive mobile layouts, SEO-friendly development, e-commerce integration, hosting & maintenance. Starting from ₹19,999.',
    quickReplies: ['Talk to an expert', 'Digital Marketing'],
    link: '/services/web-design-development',
  },
  {
    id: 'marketing',
    keywords: ['marketing', 'seo', 'social media', 'ads', 'google ads', 'facebook ads', 'instagram', 'leads', 'promotion'],
    reply:
      'Digital Marketing — SEO & keyword strategy, social media management, Google & Facebook ads, content marketing, analytics & reporting. Starting from ₹14,999/month.',
    quickReplies: ['Talk to an expert', 'Web Design'],
    link: '/services/digital-marketing',
  },
  {
    id: 'pricing',
    keywords: ['price', 'pricing', 'cost', 'fee', 'fees', 'charges', 'kitna', 'rate', 'package'],
    reply:
      'Our starting prices: MSME ₹1,000 • GST ₹2,500 • ISO ₹3,300 • Startup India ₹5,000 • Trademark ₹9,000 • Company ₹12,999 • Digital Marketing ₹14,999/mo • Website ₹19,999 • Funding support from ₹25,000. No hidden costs — free consultation included!',
    quickReplies: ['Talk to an expert', 'Other services'],
    link: '/services',
  },
  {
    id: 'documents',
    keywords: ['document', 'documents', 'papers', 'required', 'kya chahiye', 'eligibility'],
    reply:
      'Documents usually needed: PAN & Aadhaar of founders, company incorporation certificate (for DPIIT), business address proof, and a short write-up on your innovation. Share your details and our expert will send you the exact checklist for your service.',
    quickReplies: ['Talk to an expert', 'Free compliance checklist'],
  },
  {
    id: 'contact',
    keywords: ['contact', 'call', 'phone', 'number', 'email', 'address', 'office', 'location', 'whatsapp', 'expert', 'talk', 'human', 'callback'],
    reply: `You can reach us at 📞 ${PHONE} or ✉️ ${EMAIL}. Office: P NO 8, near VPM Classes, B yojna, Radha Kunj, Mansarovar, Jaipur, Rajasthan 302020. Leave your details here and an expert will call you back within 2 hours.`,
    quickReplies: ['Share my details'],
    askLead: true,
  },
  {
    id: 'about',
    keywords: ['who are you', 'about', 'startuphealer', 'startup healer', 'company'],
    reply:
      "StartupHealer is a Jaipur-based startup support partner. We don't just consult — we care. 500+ startups supported with a 95% success rate across compliance, funding and growth.",
    quickReplies: ['Services', 'Talk to an expert'],
  },
  {
    id: 'services',
    keywords: ['service', 'services', 'offer', 'help', 'other services'],
    reply:
      'We offer: Startup India Certificate, MSME Certificate, GST Registration, ISO 9001:2015, Trademark & Company Registration, Funding & Investment Support, Web Design & Development, and Digital Marketing. Which one interests you?',
    quickReplies: ['Startup India Certificate', 'MSME Registration', 'Funding', 'Pricing'],
    link: '/services',
  },
  {
    id: 'checklist',
    keywords: ['checklist', 'free', 'guide', 'ebook', 'download'],
    reply:
      'Grab our FREE "Startup Compliance & Funding Checklist 2026" — it covers every registration, licence and scheme a new Indian startup needs. Share your details and we will unlock it for you.',
    quickReplies: ['Share my details'],
    askLead: true,
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank you', 'thx', 'great', 'ok', 'okay', 'dhanyawad'],
    reply: "You're welcome! 😊 Anything else I can help you with?",
    quickReplies: ['Services', 'Talk to an expert'],
  },
];

const fallback = {
  id: 'fallback',
  reply:
    "I'm not fully sure about that one, but our experts surely are! Share your name, email and phone and we will get back to you within 2 hours — or call us at " +
    PHONE +
    '.',
  quickReplies: ['Share my details', 'Services', 'Pricing'],
  askLead: true,
};

export function getReply(input) {
  const msg = ` ${input.toLowerCase().replace(/[^a-z0-9₹\s]/g, ' ')} `;
  let best = null;
  let bestScore = 0;
  for (const intent of intents) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (msg.includes(` ${kw} `) || (kw.includes(' ') && msg.includes(kw))) score += kw.split(' ').length;
    }
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  const hit = best ?? fallback;
  return {
    intent: hit.id,
    reply: hit.reply,
    quickReplies: hit.quickReplies ?? [],
    link: hit.link,
    askLead: Boolean(hit.askLead),
  };
}
