# प्रकृति पथ — Version 1.0 · Step 1: Homepage

## अपने कंप्यूटर पर कैसे चलाएँ

### 1. Node.js इंस्टॉल करें (केवल एक बार)
- https://nodejs.org खोलें → **LTS** वाला बटन दबाकर डाउनलोड करें → इंस्टॉल करें।
- जाँचें: Command Prompt (Windows) या Terminal खोलकर लिखें:
  ```
  node -v
  ```
  कोई नंबर (जैसे v22.x.x) दिखे तो सही है।

### 2. यह फ़ोल्डर खोलें
ZIP को Extract करें (जैसे `D:\prakriti-path`), फिर Command Prompt में:
```
cd D:\prakriti-path
```

### 3. ज़रूरी पैकेज इंस्टॉल करें (केवल पहली बार, 1–3 मिनट)
```
npm install
```

### 4. वेबसाइट चालू करें
```
npm run dev
```
अब ब्राउज़र में खोलें: **http://localhost:3000**

बंद करने के लिए Command Prompt में `Ctrl + C` दबाएँ।

---

## कौन सी फ़ाइल क्या करती है?

| फ़ाइल | काम |
|---|---|
| `data/content.js` | होमपेज का **सारा Text** — प्रश्न, स्तंभ, मंडल, पुस्तकें। Text बदलना हो तो सिर्फ यही खोलें। |
| `app/globals.css` | रंग और Design। सबसे ऊपर रंग बदलें (`--van`, `--haldi` आदि)। |
| `app/page.js` | होमपेज के सभी Sections का ढाँचा। |
| `app/layout.js` | Font और पेज का Title। |
| `components/TodayQuestion.js` | "आज का प्रश्न" — हर दिन अपने आप नया प्रश्न। |
| `components/HeroPath.js` | सबसे ऊपर घुमावदार पथ वाला चित्र। |

**नए प्रश्न जोड़ने के लिए:** `data/content.js` में `dailyQuestions` की सूची में एक नई लाइन जोड़ें।
फाइल Save करते ही ब्राउज़र अपने आप अपडेट हो जाएगा।

> नोट: अभी "आज का उत्तर" केवल उसी ब्राउज़र में सहेजा जाता है। Login और Database (अगला Step) के बाद यह User के Account में सुरक्षित होगा।

## कोई Error आए तो
Command Prompt में जो लाल रंग का Error दिखे, उसका Screenshot या पूरा Text भेजें।

## अगला कदम
Step 2: Registration & Login (Supabase के साथ)।

---

## Level 1: Founding Member Form (Supabase)
1. `supabase/01_founding_members.sql` को Supabase के SQL Editor में चलाएँ।
2. `.env.local.example` की कॉपी बनाकर नाम `.env.local` रखें और Supabase की URL और anon key भरें।
3. `npm run dev` दोबारा चलाएँ (env बदलने पर restart ज़रूरी है)।
4. जुड़े हुए लोगों की सूची: Supabase → Table Editor → founding_members
