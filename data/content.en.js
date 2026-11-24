// Prakriti Path — homepage content in ENGLISH.
// यह data/content.js का अंग्रेज़ी रूप है। दोनों फ़ाइलों में items की संख्या और क्रम एक जैसा रखें।

export const site = {
  name: "Prakriti Path",
  nameEn: "Prakriti Path",
  tagline: "Your Nature, Your Life Path",
  intro: "A journey to understand yourself, recognise your life, and find your own direction.",
  founder: "Amresh Kumar Rudra",
  website: "prakritipath.org",
};

export const navLinks = [
  { label: "About", href: "#parichay" },
  { label: "Journey", href: "#yatra" },
  { label: "Daily Question", href: "#aaj-ka-prashn" },
  { label: "One Bowl", href: "#katori-pani" },
  { label: "Books", href: "#pustakein" },
  { label: "Join", href: "#judein" },
  { label: "Contact", href: "#sampark" },
];

export const selfKnowledge = [
  { title: "Your Nature", text: "In what surroundings do I flourish — and where do I wither?" },
  { title: "Your Emotions", text: "Anger, fear, sorrow, joy — what are they trying to tell me?" },
  { title: "Your Desires", text: "Is what I want truly mine, or something others handed to me?" },
  { title: "Your Potential", text: "In what kind of work do I lose all track of time?" },
  { title: "Your Direction", text: "Where am I now, and where do I want to go?" },
];

// title = अंग्रेज़ी नाम, en = नीचे छोटे अक्षरों में हिंदी नाम (दोनों भाषाओं का मेल)
export const pillars = [
  {
    icon: "🌱",
    title: "Self Discovery",
    en: "स्वयं की खोज",
    text: "Who am I? What is my nature? What is my true potential?",
  },
  {
    icon: "🧠",
    title: "Life Awareness",
    en: "जीवन की समझ",
    text: "Emotions, relationships, behaviour, decisions — and the reality of life.",
  },
  {
    icon: "🧭",
    title: "Life Direction",
    en: "जीवन की दिशा",
    text: "Which direction should I move forward in?",
  },
  {
    icon: "🤝",
    title: "Social Contribution",
    en: "समाज में योगदान",
    text: "How can I use my abilities for others and for society?",
  },
];

// क्रम वही रखें जो content.js में है — ताकि दोनों भाषाओं में उस दिन एक ही प्रश्न दिखे
export const dailyQuestions = [
  "Do you truly know yourself — or only an image you have built of yourself?",
  "What in your life are you accepting today without understanding it?",
  "Do you really make your own life decisions, or are you living by others' expectations?",
  "Which of your habits controls you the most?",
  "What do you expect from others — and what do you give to your relationships?",
  "What are you running after — and why?",
  "If no one were watching you today, what would you do differently?",
];

export const journeyWeeks = [
  { week: "Week 1", title: "Who am I?", days: "Days 1–7", topics: "Identity · Habits · Thinking · Interests" },
  { week: "Week 2", title: "My Emotions", days: "Days 8–14", topics: "Anger · Fear · Sorrow · Joy" },
  { week: "Week 3", title: "My Life", days: "Days 15–21", topics: "Family · Work · Time · Priorities" },
  { week: "Week 4", title: "My Direction", days: "Days 22–30", topics: "Abilities · Purpose · Life Resolve" },
];

export const circles = [
  { icon: "🌱", name: "Self-Discovery Circle", text: "For understanding yourself" },
  { icon: "🧠", name: "Life Understanding Circle", text: "For understanding life and behaviour" },
  { icon: "🧭", name: "Life Direction Circle", text: "Career and direction in life" },
  { icon: "🤝", name: "Relationships Circle", text: "Family and relationships" },
  { icon: "🌍", name: "Nature Circle", text: "Nature and the environment" },
  { icon: "🙏", name: "Service Circle", text: "Service to society" },
];

// केवल शीर्षक/उपशीर्षक — कवर फोटो और खरीदने के लिंक data/content.js से ही आते हैं
export const books = [
  { title: "Prakriti Path", subtitle: "Your Nature, Your Life Path" },
  { title: "Prakriti Path", subtitle: "A Journey Back to the Self" },
  { title: "Prakriti Path", subtitle: "Beyond Words" },
];

export const programs = [
  { title: "Self Discovery — 30 Days", text: "Begin understanding yourself in 30 days." },
  { title: "Understanding Life", text: "Life, relationships, emotions, behaviour and decisions." },
  { title: "Find Your Direction", text: "Career, business, purpose and the direction of your life." },
  { title: "Connect with Nature", text: "Nature awareness, the environment and natural living." },
];
