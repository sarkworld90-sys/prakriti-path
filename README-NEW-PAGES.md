# ONE BOWL OF WATER: website par kaise lagaayein

**Naya page:** `prakritipath.org/one-bowl`

Aapki website Next.js + Supabase par bani hai aur Vercel par chalti hai. Isliye Hostinger ko message bhejne ki zaroorat nahi hai. Hostinger ke paas sirf domain hai. Code GitHub mein jaayega aur Vercel use apne aap live kar dega.

## Is zip mein kya hai

| File | Kaam |
|---|---|
| `app/one-bowl/page.js` | Muhim ka special page |
| `app/one-bowl/one-bowl.css` | Page ka design. Saari classes `ob-` se shuru hoti hain, isliye baaki site par asar nahi padega |
| `components/one-bowl/JoinCampaignForm.js` | Join form, Campaign ID aur katori ki photo upload |
| `components/one-bowl/AmbassadorForm.js` | Ambassador aavedan (photo aur poori hierarchy ke saath) |
| `components/one-bowl/ImpactDashboard.js` | National Impact Dashboard, jo live data dikhata hai |
| `components/one-bowl/SubCampaigns.js` | One School / Office / Shop One Bowl cards |
| `components/one-bowl/ShareButtons.js` | WhatsApp share aur link copy |
| `data/oneBowl.js` | Saara text, states ki list, gallery. **Content yahin se badlein** |
| `lib/oneBowl.js` | Supabase se baat karne wale helpers |
| `supabase/one_bowl.sql` | Database (tables, security, functions, photo bucket) |

Aapki koi bhi purani file nahi badli gayi hai.

## Lagaane ke 4 step

**1. Database banaayein.** Supabase Dashboard mein **SQL Editor**, phir **New query** kholein. Usme `supabase/one_bowl.sql` ki poori file paste karke **Run** dabayein. Ise dobara chalana bhi safe hai.

**2. Files copy karein.** Is zip ke folders apne `prakriti-path` project mein usi jagah daal dein: `app/`, `components/`, `data/`, `lib/`, `supabase/`. Naye `.env` ki zaroorat nahi hai. Wahi `NEXT_PUBLIC_SUPABASE_URL` aur `NEXT_PUBLIC_SUPABASE_ANON_KEY` kaam karenge jo Founding Form mein lage hain.

**3. Local mein check karein.**
```
npm run dev
```
Browser mein `http://localhost:3000/one-bowl` kholein.

**4. Live karein.**
```
git add .
git commit -m "One Bowl of Water campaign page"
git push
```
Vercel 1–2 minute mein page live kar dega.

## Homepage / menu se link jodein
Apne navbar ya homepage mein kahin bhi ye link jod dein:
```jsx
<a href="/one-bowl">💧 एक कटोरी पानी</a>
```

## Admin ka kaam (abhi Supabase se)
- **Naye Ambassador aavedan:** Table Editor mein `bowl_ambassadors` kholein (status = pending)
- **Approve karna aur Ambassador ID dena:** SQL file ke aakhir mein ready query di gayi hai
- **Katori ki photo dekhna:** Storage mein `one-bowl` bucket kholein, phir `reports/` folder dekhein
- **Photo verify karna:** `bowl_reports` mein status ko `verified` kar dein. Dashboard apne aap update ho jaayega
- **Excel export:** Kisi bhi table par jaakar Export to CSV karein

## Referral / QR kaise chalega
Approve hone par Ambassador ko ek code milega, jaise `OBW-A-00001`. Uska link hoga:
`prakritipath.org/one-bowl?ref=OBW-A-00001`
Is link (ya isi link ke QR) se jo bhi judega, wo us Ambassador ke khaate mein gina jaayega.

## Suraksha
- Koi bhi visitor database ki table seedhe padh ya badal nahi sakta. Website sirf 4 check kiye hue functions ke zariye kaam karti hai.
- Kisi ka mobile number ya naam public dashboard par nahi dikhta. Wahan sirf ginti dikhti hai.
- Photos private bucket mein rehti hain aur sirf Admin unhe dekh sakta hai.
- Reach, Pledge, Reported aur Verified, ye chaaron aankde alag-alag gine jaate hain.

## Agle phase (Phase 2 aur 3)
1. Ambassador Login aur Personal Dashboard (team performance, monthly report, Reach entry)
2. Admin Panel website par hi (approve/reject, photo verification, area allocation, Excel export)
3. Digital ID Card, QR Code, Certificate (PDF download)
4. Campaign Activity Map, aur WhatsApp/Email notifications

---

# Doosra page: PRAKRITI PATH MARGDARSHAN (`/margdarshan`)

Ye online aur offline paid sessions ka page hai: vyaktigat margdarshan, "Apni Prakriti Janein", samooh kakshayein, Corporate aur Vibhag/Sansthan.

**Is page ki nayi files:**
- `app/margdarshan/page.js`, `app/margdarshan/margdarshan.css`
- `components/margdarshan/BookingForm.js`, `components/margdarshan/ProgramCards.js`
- `data/margdarshan.js`: **sab yahin se badlein**, jaise shulk (`fee`), WhatsApp number (`whatsapp`), apni photo (`guidePhoto`), programs aur FAQ
- `supabase/margdarshan.sql`: ise bhi SQL Editor mein Run karein

**Aavedan kahan dikhenge:** Supabase ke Table Editor mein `pp_enquiries` table mein. Har aavedan ka number aisa hoga: PPM-1001. Status ko `new`, `contacted`, `scheduled`, `paid`, `completed` mein badal kar track karein.

**Menu link:** `<a href="/margdarshan">🪷 मार्गदर्शन / Sessions</a>`

---

# Naye features (Update 2)

## Naye pages
| Page | Kaam |
|---|---|
| `/prakriti-quiz` | "Apni Prakriti Janein": 16 prashn, 4 prakritiyan (Prithvi, Jal, Agni, Vayu). Result ke baad seedha session booking par le jaata hai |
| `/yatra-21` | 21 din ki yatra: har din ka abhyas, 3 hafte |
| `/margdarshan` | Isme ab ye bhi hai: nishulk 15 minute ki pehli baatcheet, quiz ka rasta, pustak ka hissa aur QR, aur online bhugtan |

**Quiz aur yatra ka content badalna ho to:** `data/prakritiQuiz.js` aur `data/yatra21.js` mein badlein. Inhe apni pustak ke shabdon ke hisaab se zaroor theek kar lein.

## Shulk (fees) kaise daalein
`data/margdarshan.js` mein har program ke aage `price: 1500` jaisa likhein. Isse:
- Page par "₹1,500 / सत्र" dikhega
- Form bharne ke baad **"अभी online भुगतान करें"** button aayega (UPI, card, net-banking)

Agar `price: null` rakhenge to "शुल्क के लिए संपर्क करें" dikhega aur online bhugtan nahi hoga.

## Razorpay (online bhugtan) chalu karna
1. razorpay.com par account banayein aur KYC poori karein
2. Dashboard mein Settings, phir API Keys mein jaakar **Key ID** aur **Key Secret** banayein
3. Vercel mein Project Settings, phir Environment Variables mein ye 4 daalein:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `SUPABASE_SERVICE_ROLE_KEY` (Supabase mein Project Settings, phir API mein "service_role" key. **Ise kabhi kisi ko na dikhayein**)
   - `RAZORPAY_WEBHOOK_SECRET` (koi bhi lamba secret shabd)
4. Razorpay mein Settings, phir Webhooks mein jaakar Add karein:
   - URL: `https://prakritipath.org/api/pay/webhook`
   - Event: `payment.captured`
   - Secret: wahi jo upar `RAZORPAY_WEBHOOK_SECRET` mein rakha
5. Redeploy karein
6. Pehle **Test Mode** ki keys se jaanch lein, phir Live keys lagayein

Bhugtan ka record Supabase ki `pp_payments` table mein milega. Bhugtan hote hi us aavedan ka status apne aap `paid` ho jaata hai.

## Pustak ka QR
`/margdarshan` page par pustak wale hisse mein QR hai. "छापने के लिए QR डाउनलोड करें" se 600×600 ki photo mil jaayegi, jise pustak mein chhaap sakte hain. Scan karne par seedha booking form khulega, aur aavedan mein `source = book` darj hoga. Isse aapko pata chalega ki kitne log pustak se aaye.

Amazon aur Flipkart ke link `data/margdarshan.js` ke `book` hisse mein daalein.

## Database
`supabase/margdarshan.sql` ko **dobara Run karein**. Isme naye programs, quiz/source columns aur `pp_payments` table jude hain. Ise dobara chalana bhi safe hai.

## Menu ke links
```jsx
<a href="/prakriti-quiz">🧭 अपनी प्रकृति जानें</a>
<a href="/margdarshan">🪷 मार्गदर्शन</a>
<a href="/yatra-21">🌄 21 दिन की यात्रा</a>
<a href="/one-bowl">💧 एक कटोरी पानी</a>
```
