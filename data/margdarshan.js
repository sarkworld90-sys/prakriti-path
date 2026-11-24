// PRAKRITI PATH MARGDARSHAN — सारा content, शुल्क और विकल्प यहीं से बदलें।

export const contact = {
  // WhatsApp नंबर (देश कोड के साथ, बिना + के), जैसे "919876543210"। खाली रहेगा तो WhatsApp बटन नहीं दिखेगा।
  whatsapp: "918797617430",
  email: "prakritipathpp@gmail.com",
  // अपनी फोटो public/ फ़ोल्डर में रखें और नाम यहाँ लिखें, जैसे "/amresh.jpg"
  guidePhoto: "/images/founder.webp",
};

// शुल्क कैसे भरें:
//   price: रुपये में संख्या, जैसे price: 1500  → "₹1,500" दिखेगा और Online भुगतान (Razorpay) का बटन आएगा
//   price: null → "शुल्क के लिए संपर्क करें" दिखेगा, भुगतान बातचीत के बाद
//   unit: कीमत के साथ छोटा शब्द, जैसे "/ सत्र", "/ व्यक्ति", "पूरा कार्यक्रम"
//   free: true → "निःशुल्क" (भुगतान नहीं)
export const PROGRAMS = [
  {
    key: "free_call",
    icon: "☎️",
    title: "पहली बातचीत — निःशुल्क",
    en: "Free 15-min Call",
    for: "जो अभी तय नहीं कर पा रहे — पहले बस बात करके देखना चाहते हैं",
    points: ["15 मिनट, फ़ोन या video call", "कोई शुल्क, कोई दबाव नहीं", "आपके लिए सही कार्यक्रम का सुझाव"],
    modes: ["online"],
    free: true,
    price: null,
    unit: "",
    featured: true,
  },
  {
    key: "individual",
    icon: "🪷",
    title: "व्यक्तिगत मार्गदर्शन",
    en: "1:1 Session",
    for: "जो अपनी किसी उलझन, डर या निर्णय पर अकेले में बात करना चाहते हैं",
    points: ["एक-से-एक, पूरी गोपनीयता", "लगभग 60 मिनट", "अगले कदमों की स्पष्ट दिशा"],
    modes: ["online", "offline"],
    price: null,
    unit: "/ सत्र",
  },
  {
    key: "prakriti",
    icon: "🌿",
    title: "अपनी प्रकृति जानें",
    en: "Prakriti Discovery",
    for: "जो जानना चाहते हैं कि वे भीतर से कैसे हैं — और उनके लिए सही राह क्या है",
    points: ["स्वभाव, शक्तियाँ और अटकाव की पहचान", "गहरी बातचीत + लिखित सार", "आपकी प्रकृति के अनुसार जीवन-पथ"],
    modes: ["online", "offline"],
    price: null,
    unit: "/ सत्र",
  },
  {
    key: "group",
    icon: "👥",
    title: "समूह कक्षाएँ",
    en: "Group Classes",
    for: "जो दूसरों के साथ मिलकर, नियमित रूप से सीखना और बदलना चाहते हैं",
    points: ["साप्ताहिक online बैच", "शहरों में offline कार्यशालाएँ", "अभ्यास, चर्चा और journal"],
    modes: ["online", "offline"],
    price: null,
    unit: "/ सत्र",
  },
  {
    key: "yatra21",
    icon: "🌄",
    title: "21 दिन की यात्रा",
    en: "21-Day Journey",
    for: "जो एक बातचीत से आगे — रोज़ के अभ्यास से सच में बदलाव चाहते हैं",
    points: ["रोज़ एक छोटा अभ्यास + journal", "हर सप्ताह एक मार्गदर्शन सत्र", "21 दिन बाद आगे की स्पष्ट योजना"],
    modes: ["online"],
    price: null,
    unit: "पूरा कार्यक्रम",
    link: "/yatra-21",
  },
  {
    key: "corporate",
    icon: "🏢",
    title: "Corporate कार्यक्रम",
    en: "Corporate Workshops",
    for: "कंपनियों और टीमों के लिए — तनाव, संबंध और नेतृत्व पर",
    points: ["तनाव और भावनाओं की समझ", "टीम में भरोसा और संवाद", "आपकी ज़रूरत के अनुसार कार्यक्रम"],
    modes: ["online", "offline"],
    price: null,
    unit: "/ सत्र",
  },
  {
    key: "department",
    icon: "🏛️",
    title: "विभाग / संस्थान",
    en: "Departments & Institutions",
    for: "सरकारी विभाग, स्कूल-कॉलेज, अस्पताल, पुलिस और सामाजिक संस्थाओं के लिए",
    points: ["कर्मचारियों / विद्यार्थियों के लिए सत्र", "एक दिन से कई सप्ताह तक", "आपके परिसर में या online"],
    modes: ["online", "offline"],
    price: null,
    unit: "/ सत्र",
  },
];

// पुस्तक — Amazon / Flipkart के लिंक यहाँ डालें (खाली रहेंगे तो बटन नहीं दिखेंगे)
export const book = {
  title: "प्रकृति पथ",
  subtitle: "अपनी प्रकृति, अपना जीवन पथ",
  amazon: "https://www.amazon.in/Prakriti-Path-Apni-Apna-Jeevan/dp/9347263729",
  flipkart: "https://www.flipkart.com/prakriti-path-apni-apna-jeevan/p/itmba3c807d22d37",
  // पुस्तक में छापने के लिए QR इसी लिंक का बनेगा
  qrLink: "https://prakritipath.org/margdarshan?src=book",
};

export function feeLabel(p) {
  if (p.free) return "निःशुल्क";
  if (p.price) return `₹${Number(p.price).toLocaleString("en-IN")} ${p.unit || ""}`.trim();
  return "शुल्क के लिए संपर्क करें";
}

export const MODES = [
  { key: "online", label: "Online (Video Call)", icon: "💻" },
  { key: "offline", label: "Offline (आमने-सामने)", icon: "🤝" },
  { key: "any", label: "कोई भी", icon: "✨" },
];

export const LANGUAGES = ["हिंदी", "English", "भोजपुरी", "मैथिली", "अन्य"];

export const PAINS = [
  { icon: "🌀", text: "मन हर समय उलझा रहता है, शांति नहीं मिलती" },
  { icon: "😟", text: "भविष्य, असफलता या लोगों का डर पीछा नहीं छोड़ता" },
  { icon: "🔗", text: "रिश्तों, मोह और अपेक्षाओं में खुद को खो दिया है" },
  { icon: "🧭", text: "पता नहीं कि जीवन में असल में क्या चाहिए" },
  { icon: "🔁", text: "एक ही गलती, एक ही दुख बार-बार लौटता है" },
  { icon: "🪫", text: "सब कुछ होते हुए भी भीतर खालीपन है" },
];

export const APPROACH = [
  { n: "01", title: "समझना", text: "पहले बिना किसी निर्णय के यह समझना कि आप कहाँ हैं — क्या उलझा है, क्या दुख दे रहा है।" },
  { n: "02", title: "पहचानना", text: "आपकी प्रकृति — आपका स्वभाव, आपकी शक्ति, और वह जगह जहाँ आप बार-बार अटकते हैं।" },
  { n: "03", title: "दिशा", text: "आपकी प्रकृति के अनुसार छोटे, व्यावहारिक कदम — जिन्हें आप रोज़ के जीवन में जी सकें।" },
];

export const FAQ = [
  {
    q: "सत्र कैसे होता है?",
    a: "Online सत्र video call पर होते हैं; offline सत्र तय स्थान पर। फॉर्म भरने के बाद हमारी टीम आपसे बात करके समय और तरीका तय करती है।",
  },
  {
    q: "क्या मेरी बातें गोपनीय रहेंगी?",
    a: "हाँ। व्यक्तिगत सत्र में कही गई बातें किसी से साझा नहीं की जातीं।",
  },
  {
    q: "शुल्क कैसे देना होगा?",
    a: "जिन कार्यक्रमों का शुल्क तय है, उनका भुगतान फॉर्म भरते ही UPI, कार्ड या नेट-बैंकिंग से online किया जा सकता है। बाकी का शुल्क बातचीत के बाद बताया जाता है। पहली 15 मिनट की बातचीत निःशुल्क है।",
  },
  {
    q: "Corporate / विभाग के लिए कार्यक्रम कैसे तय होता है?",
    a: "पहले आपकी टीम की ज़रूरत समझने के लिए बातचीत होती है, फिर उसी के अनुसार अवधि, विषय और स्वरूप तय किया जाता है।",
  },
  {
    q: "क्या यह इलाज या थेरेपी है?",
    a: "नहीं। प्रकृति पथ मार्गदर्शन आत्म-समझ और जीवन-दिशा का मार्ग है — यह डॉक्टर, मनोचिकित्सक या दवा का विकल्प नहीं है।",
  },
];
