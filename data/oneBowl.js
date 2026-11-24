// ONE BOWL OF WATER — अभियान का सारा content और विकल्प यहीं से बदलें।

export const campaign = {
  name: "ONE BOWL OF WATER",
  tagline: "एक कटोरी पानी – एक जीवन के नाम",
  by: "Prakriti Path",
  founder: "Amresh Kumar Rudra",
  website: "prakritipath.org",
  path: "/one-bowl",
  youtube: "https://www.youtube.com/@prakritipath0",
  email: "prakritipathpp@gmail.com",
};

export const STATES = [
  "उत्तर प्रदेश", "बिहार", "झारखंड", "मध्य प्रदेश", "राजस्थान", "दिल्ली", "हरियाणा", "पंजाब",
  "उत्तराखंड", "हिमाचल प्रदेश", "छत्तीसगढ़", "महाराष्ट्र", "गुजरात", "पश्चिम बंगाल", "ओडिशा",
  "असम", "आंध्र प्रदेश", "तेलंगाना", "कर्नाटक", "तमिलनाडु", "केरल", "गोवा", "अरुणाचल प्रदेश",
  "मणिपुर", "मेघालय", "मिज़ोरम", "नागालैंड", "सिक्किम", "त्रिपुरा", "जम्मू और कश्मीर", "लद्दाख",
  "चंडीगढ़", "पुडुचेरी", "अंडमान और निकोबार", "दादरा नगर हवेली और दमन दीव", "लक्षद्वीप",
];

export const PARTICIPANT_TYPES = [
  { key: "individual", label: "व्यक्तिगत / घर", icon: "🏠" },
  { key: "school", label: "स्कूल / कॉलेज", icon: "🏫" },
  { key: "office", label: "ऑफ़िस", icon: "🏢" },
  { key: "shop", label: "दुकान", icon: "🏪" },
  { key: "other", label: "अन्य संस्था", icon: "🤝" },
];

// Ambassador Hierarchy — ऊपर से नीचे
export const LEVELS = [
  { key: "national", label: "National Coordinator", hi: "राष्ट्रीय समन्वयक" },
  { key: "state", label: "State Ambassador", hi: "राज्य" },
  { key: "district", label: "District Ambassador", hi: "जिला" },
  { key: "assembly", label: "Assembly Ambassador", hi: "विधानसभा" },
  { key: "block", label: "Block Ambassador", hi: "प्रखंड" },
  { key: "panchayat", label: "Panchayat Ambassador", hi: "पंचायत" },
  { key: "ward", label: "Ward Ambassador", hi: "वार्ड" },
  { key: "institutional", label: "Institutional Ambassador", hi: "संस्थान" },
  { key: "campus", label: "Campus Ambassador", hi: "कैंपस" },
];

export const STEPS = [
  { icon: "🥣", title: "चौड़ी, उथली कटोरी लें", text: "मिट्टी का बर्तन सबसे अच्छा है — पानी ठंडा रहता है। 2–3 इंच गहराई काफ़ी है।" },
  { icon: "🌳", title: "छाया में रखें", text: "छत, बालकनी, आँगन या पेड़ के नीचे — जहाँ धूप सीधी न पड़े और बिल्ली की पहुँच न हो।" },
  { icon: "💧", title: "रोज़ साफ़ पानी भरें", text: "हर दिन पानी बदलें और कटोरी धोएँ, ताकि मच्छर या काई न पनपे।" },
  { icon: "📸", title: "फोटो भेजें", text: "अपनी कटोरी की फोटो यहीं अपलोड करें। सत्यापन के बाद वह National Dashboard में जुड़ जाएगी।" },
];

export const SUB_CAMPAIGNS = [
  { icon: "☀️", title: "One Bowl Sunday", text: "हर रविवार — कटोरी धोएँ, ताज़ा पानी भरें, और एक नए व्यक्ति को अभियान से जोड़ें।" },
  { icon: "🏫", title: "One School One Bowl", text: "हर स्कूल परिसर में कम से कम एक कटोरी — बच्चे बारी-बारी से उसकी देखभाल करें।" },
  { icon: "🏢", title: "One Office One Bowl", text: "ऑफ़िस की छत या गेट पर एक कटोरी — टीम मिलकर उसकी ज़िम्मेदारी ले।" },
  { icon: "🏪", title: "One Shop One Bowl", text: "दुकान के बाहर एक कटोरी — हर ग्राहक के लिए एक संदेश भी।" },
];

// अभियान की तस्वीरें: फोटो public/one-bowl/ फ़ोल्डर में रखें और यहाँ जोड़ें।
// जैसे: { src: "/one-bowl/patna-1.jpg", caption: "पटना — पहली कटोरी" }
export const GALLERY = [];

// YouTube वीडियो की ID जोड़ें (youtube.com/watch?v=XXXX का XXXX हिस्सा)
export const VIDEOS = [];
