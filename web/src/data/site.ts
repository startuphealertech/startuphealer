export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://startuphealer.com").replace(/\/$/, "");

export const site = {
  name: "StartupHealer",
  legalName: "StartupHealer",
  tagline: "We Don't Just Consult — We Care",
  description:
    "StartupHealer is your growth partner for Compliance, Funding and Scale. Startup India (DPIIT), MSME, GST, ISO 9001, Trademark & Company Registration, Funding support, Web Design and Digital Marketing for Indian startups — Jaipur, Rajasthan.",
  shortAbout:
    "At StartupHealer, we empower entrepreneurs with the right tools and guidance to launch, grow, and scale their businesses. From registrations and certifications to funding, branding, and digital growth — we are your trusted startup partner.",
  phone: "+91 9610332259",
  phoneHref: "tel:9610332259",
  whatsapp: "919610332259",
  whatsappText: "Hello! I want to get started with StartupHealer.",
  email: "sales@startuphealer.com",
  address: {
    line1: "P NO 8, near VPM Classes, B yojna,",
    line2: "Radha Kunj, Mansarovar,",
    line3: "Jaipur, Rajasthan 302020",
    full: "P NO 8, near VPM Classes, B yojna, Radha Kunj, Mansarovar, Jaipur, Rajasthan 302020",
    locality: "Jaipur",
    region: "Rajasthan",
    postalCode: "302020",
    country: "IN",
  },
  geo: { lat: 26.81967916467788, lng: 75.76316007446336 },
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3569.097791317973!2d75.76316007446336!3d26.81967916467788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db63cb0e25a29%3A0x8a5a8b5e6f27e0a3!2sRadha%20Kunj%2C%20Mansarovar%2C%20Jaipur%2C%20Rajasthan%20302020!5e0!3m2!1sen!2sin!4v1693830945643!5m2!1sen!2sin",
  socials: {
    facebook: "https://www.facebook.com/share/1YihEGHF8S/",
    instagram: "https://www.instagram.com/startuphealer?utm_source=qr&igsh=MTM0bHR3bm1iZ3h3eg==",
    linkedin:
      "https://www.linkedin.com/in/startup-healer-7773b2377?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
};

export const whatsappLink = (text: string = site.whatsappText) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

// Header navigation (desktop bar + mobile menu), in this order.
// "Success Stories" → /success-stories (the old /testimonials URL 301-redirects there).
export const mainNav = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Success Stories", href: "/success-stories" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export const homeStats = [
  { number: "500+", label: "Startups Supported" },
  { number: "95%", label: "Success Rate" },
  { number: "24/7", label: "Support Available" },
  { number: "50+", label: "Expert Consultants" },
];

export const whyChoose = [
  {
    title: "We Care, Not Just Consult",
    desc: "We understand your journey and provide clarity, confidence, and practical direction.",
  },
  {
    title: "End-to-End Support",
    desc: "From legal compliance to funding and growth — everything you need under one roof.",
  },
  {
    title: "Transparent & Ethical",
    desc: "No hidden costs, no false promises. Just honest support that delivers real results.",
  },
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export const PROFILE_ROLES = [
  { value: "Founder", label: "Are you a Founder?" },
  { value: "Mentor", label: "Are you a Mentor?" },
  { value: "Investor", label: "Are you an Investor?" },
  { value: "Business Analyst", label: "Are you a Business Analyst?" },
  { value: "Job Seeker", label: "Are you a Job seeker?" },
  { value: "Job Provider", label: "Are you a Job Provider?" },
  { value: "Website Seeker", label: "Are you looking for Website?" },
  { value: "Marketing Strategy Seeker", label: "Are you looking for Marketing Strategy?" },
];
