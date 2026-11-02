export type Service = {
  slug: string;
  name: string; // short card name used on home page
  title: string;
  short: string;
  description: string;
  features: string[];
  benefits: string[];
  price: string;
  timeline?: string;
  icon: "rocket" | "industry" | "gst" | "iso" | "trademark" | "funding" | "web" | "marketing";
  keywords: string[];
};

export const services: Service[] = [
  {
    slug: "startup-india-certificate",
    name: "Startup India Certificate",
    title: "Startup India Certificate",
    short: "Get recognized under the Startup India scheme with complete registration support.",
    description:
      "Unlock exclusive benefits including tax exemptions, faster patent approvals, and access to government tenders. We handle the entire certification process from eligibility assessment to final approval.",
    features: [
      "Eligibility assessment & consultation",
      "Complete document preparation & filing",
      "DPIIT registration support",
      "Government liaison & follow-up",
      "Certificate delivery & activation",
    ],
    benefits: ["Tax exemptions for 3 years", "IPR fast-track", "Access to government schemes"],
    price: "Starting from ₹5,000",
    icon: "rocket",
    keywords: ["Startup India registration", "DPIIT recognition", "Startup India certificate Jaipur"],
  },
  {
    slug: "msme-certificate",
    name: "MSME Certificate",
    title: "MSME Certificate",
    short: "Register your business under MSME and avail government benefits.",
    description:
      "Get your Udyam Registration Certificate and unlock benefits like collateral-free loans, subsidy schemes, and priority sector lending.",
    features: [
      "Udyam registration portal setup",
      "Business classification guidance",
      "Subsidy scheme consultation",
      "Annual compliance support",
      "Certificate issuance",
    ],
    benefits: ["Easy bank loans", "Government subsidies", "Lower interest rates"],
    price: "Starting from ₹1,000",
    icon: "industry",
    keywords: ["MSME registration", "Udyam registration", "MSME certificate online"],
  },
  {
    slug: "gst-registration",
    name: "GST Registration",
    title: "GST Registration",
    short: "Complete GST registration and compliance assistance.",
    description:
      "Simplify your GST journey with end-to-end registration, filing support, and compliance management. Stay penalty-free with our expert guidance.",
    features: [
      "GST number registration",
      "Monthly/Quarterly return filing",
      "Input tax credit optimization",
      "GST audit support",
      "Notice handling & consultation",
    ],
    benefits: ["Legal compliance", "Input tax benefits", "Invoice credibility"],
    price: "Starting from ₹2,500",
    icon: "gst",
    keywords: ["GST registration", "GST return filing", "GST consultant Jaipur"],
  },
  {
    slug: "iso-9001-certification",
    name: "ISO 9001-2015 Certification",
    title: "ISO 9001:2015 Certification",
    short: "International quality certification for your organization.",
    description:
      "Enhance credibility, improve processes, and access global markets with ISO certification. We provide complete documentation and audit support.",
    features: [
      "Gap analysis & consultation",
      "Complete documentation support",
      "Internal audit preparation",
      "External audit coordination",
      "Certificate issuance & maintenance",
    ],
    benefits: ["Global recognition", "Process improvement", "Customer trust"],
    price: "Starting from ₹3,300",
    icon: "iso",
    keywords: ["ISO 9001 certification", "ISO 9001:2015", "ISO certification consultant"],
  },
  {
    slug: "trademark-company-registration",
    name: "Trademark & Company Registration",
    title: "Trademark & Company Registration",
    short: "Protect your brand and register your business legally.",
    description:
      "Safeguard your brand identity and establish legal business entity. From trademark search to company incorporation, we handle everything.",
    features: [
      "Comprehensive trademark search",
      "Application drafting & filing",
      "Company name approval (RoC)",
      "MOA/AOA drafting",
      "PAN, TAN & other registrations",
    ],
    benefits: ["Legal protection", "Brand ownership", "Business credibility"],
    timeline: "Trademark: 12-18 months | Company: 7-10 days",
    price: "Trademark from ₹9,000 | Company from ₹12,999",
    icon: "trademark",
    keywords: ["Trademark registration", "Private limited company registration", "Company incorporation"],
  },
  {
    slug: "funding-investment-support",
    name: "Funding & Investment",
    title: "Funding & Investment Support",
    short: "Support in finding investors and funding opportunities.",
    description:
      "From pitch deck creation to investor introductions and term sheet negotiations - we guide you through the entire fundraising journey.",
    features: [
      "Professional pitch deck design",
      "Financial model preparation",
      "Investor database access",
      "Pitch practice & refinement",
      "Term sheet negotiation support",
    ],
    benefits: ["Investor connections", "Better valuations", "Strategic guidance", "Ongoing support"],
    price: "Custom packages from ₹25,000",
    icon: "funding",
    keywords: ["Startup funding", "Pitch deck", "Investor connect India"],
  },
  {
    slug: "web-design-development",
    name: "Web Designing",
    title: "Web Design & Development",
    short: "Modern, responsive, and conversion-focused websites.",
    description:
      "Build a stunning online presence that converts visitors into customers. Custom designs, SEO optimization, and mobile-first approach included.",
    features: [
      "Custom UI/UX design",
      "Responsive mobile layouts",
      "SEO-friendly development",
      "E-commerce integration",
      "Hosting & maintenance support",
    ],
    benefits: ["Professional presence", "Lead generation", "24/7 availability"],
    price: "Starting from ₹19,999",
    icon: "web",
    keywords: ["Website development", "Web design company Jaipur", "SEO friendly website"],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    title: "Digital Marketing",
    short: "Data-driven strategies to grow your online presence.",
    description:
      "Reach your target audience effectively with SEO, social media, and performance marketing. We focus on ROI, not vanity metrics.",
    features: [
      "SEO & keyword strategy",
      "Social media management",
      "Google & Facebook ads",
      "Content marketing",
      "Analytics & reporting",
    ],
    benefits: ["Increased visibility", "Quality leads", "Brand awareness", "Ongoing campaigns"],
    price: "Starting from ₹14,999/month",
    icon: "marketing",
    keywords: ["Digital marketing agency", "SEO services", "Social media marketing"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
