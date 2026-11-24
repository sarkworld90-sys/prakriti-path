# Facebook / Instagram Ads: पूरी तैयारी

## Pages
| Page | काम |
|---|---|
| `/guidance` | **Ads के लिए ख़ास page.** इसमें menu नहीं है, सिर्फ़ एक लक्ष्य है: निःशुल्क 15 मिनट की बातचीत बुक करना। Form 1 मिनट का है। |
| Homepage | सबसे ऊपर हरी पट्टी है ("15 मिनट की बातचीत — निःशुल्क"), menu में "मार्गदर्शन" उभरा हुआ है, और Hero में "🪷 मार्गदर्शन सत्र" link है। |

## लगाने के 4 कदम

**1. Database:** Supabase SQL Editor में `supabase/guidance_ads.sql` का पूरा code paste करके Run करें।

**2. Meta Pixel बनाएँ:**
- business.facebook.com पर जाकर **Events Manager**, फिर **Connect data sources**, फिर **Web** चुनें और Pixel बनाएँ
- Pixel ID (15–16 अंकों की संख्या) copy करें
- Vercel में Settings, फिर Environment Variables में जोड़ें: `NEXT_PUBLIC_META_PIXEL_ID` = आपकी Pixel ID
- Redeploy करें

Pixel अपने-आप ये events भेजेगा:
- `PageView`: हर page पर
- `Lead`: जब कोई /guidance या /margdarshan पर form भरे
- `Purchase`: जब कोई online भुगतान करे

**3. Domain verify करें:** Meta Business Settings में Brand Safety, फिर Domains, फिर `prakritipath.org` जोड़ें। DNS TXT record Hostinger में डालें, क्योंकि domain वहीं है।

**4. Ad बनाते समय Website URL यह डालें:**
```
https://prakritipath.org/guidance?utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
```
इससे हर lead के साथ पता चलेगा कि वह किस campaign और किस ad से आया। Supabase की `pp_enquiries` table में `utm` column देखें।

## Campaign की सलाह
- **Objective:** Leads, और Conversion location में **Website** चुनें। Conversion event: **Lead**
- **Budget:** शुरुआत ₹300–500 प्रतिदिन, 5–7 दिन। फिर जो ad सबसे सस्ता lead दे, उस पर पैसा बढ़ाएँ
- **Audience:** India, 25–55 वर्ष, हिंदी भाषी राज्य। Interests रखें: Self-help, Meditation, Personal development, Spirituality, Bhagavad Gita (या Advantage+ audience)
- **Placements:** Advantage+ (FB + Instagram feed, reels, stories)
- एक साथ 3 तस्वीरें चलाएँ, Facebook अपने-आप सबसे अच्छी चुन लेगा

## ⚠️ Facebook की नीति (बहुत ज़रूरी)
Facebook ऐसे ad **reject** कर देता है जो देखने वाले के बारे में मान लें कि वह किसी मानसिक या व्यक्तिगत स्थिति में है।
- ❌ "क्या **आप** तनाव / डिप्रेशन में हैं?", "**आप** अकेले और परेशान हैं?"
- ✅ "उलझन से स्पष्टता तक", "अपनी प्रकृति जानें", "15 मिनट की बातचीत — निःशुल्क"

नीचे का सारा text इसी नियम से लिखा है।

## Ad Text (copy करके डालें)

**Primary text 1 (ad-1 के साथ):**
> जीवन में हर किसी के सामने ऐसे मोड़ आते हैं जब रास्ता धुंधला दिखता है।
> प्रकृति पथ में हम मानते हैं: जब व्यक्ति अपनी प्रकृति समझ लेता है, तो दिशा अपने-आप साफ़ होने लगती है।
>
> 🪷 अमरेश कुमार रुद्र (लेखक, "प्रकृति पथ") के साथ 15 मिनट की शांत बातचीत: **निःशुल्क**
> ✓ फ़ोन या Video Call ✓ पूरी गोपनीयता ✓ कोई दबाव नहीं
>
> 👇 अभी अपना समय बुक करें

**Primary text 2 (ad-2 के साथ):**
> पृथ्वी, जल, अग्नि, वायु: हर व्यक्ति में एक तत्व सबसे प्रबल होता है।
> वही तय करता है कि हम कैसे सोचते हैं, किससे डरते हैं और कहाँ अटकते हैं।
>
> अपनी प्रकृति जानिए और अपने अनुसार जीवन-पथ चुनिए।
> 🪷 पहली 15 मिनट की बातचीत निःशुल्क।

**Primary text 3 (ad-3 के साथ):**
> "मैं जो चाहता हूँ, वह सच में मेरा है, या दूसरों का दिया हुआ?"
>
> कुछ प्रश्न ऐसे होते हैं जिन पर रुककर सोचना पूरी दिशा बदल देता है।
> ऐसे ही प्रश्नों पर अमरेश कुमार रुद्र के साथ 15 मिनट की बातचीत। निःशुल्क।

**Headline:** उलझन से स्पष्टता तक: पहली बातचीत निःशुल्क
**Description:** 15 मिनट · फ़ोन / Video Call · प्रकृति पथ
**Button:** Book Now (या Learn More)

## तस्वीरें
- `ad-1-ulajhan-1080x1080.png`: Feed (वर्गाकार)
- `ad-2-prakriti-1080x1080.png`: Feed (वर्गाकार)
- `ad-3-prashn-1080x1350.png`: Feed (लंबी, mobile पर सबसे ज़्यादा जगह लेती है)
- `public/og-guidance.png`: WhatsApp/Facebook पर link share करने पर दिखने वाली तस्वीर (अपने-आप)

## Leads पर तेज़ी से काम करें
Lead आने के **1 घंटे के अंदर** फ़ोन या WhatsApp करें। देर होने पर व्यक्ति का मन बदल जाता है।
Supabase में नए leads देखने की query `supabase/guidance_ads.sql` के नीचे दी है।
