// ONE BOWL OF WATER — Supabase से बात करने वाले छोटे helpers (client-side)

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isConfigured = () => Boolean(SB_URL && KEY);

const headers = (extra = {}) => ({ apikey: KEY, Authorization: `Bearer ${KEY}`, ...extra });

// Database function बुलाएँ (supabase/one_bowl.sql में बने हैं)
export async function rpc(fn, args = {}) {
  const res = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(args),
  });
  const text = await res.text();
  if (!res.ok) {
    let code = "error";
    try {
      code = JSON.parse(text).message || code;
    } catch {}
    throw new Error(code);
  }
  return text ? JSON.parse(text) : null;
}

// मोबाइल की बड़ी फोटो को छोटा करें (अधिकतम 1600px, JPEG) ताकि जल्दी अपलोड हो
export async function compressImage(file, maxSide = 1600, quality = 0.8) {
  if (!file || !file.type.startsWith("image/")) throw new Error("not_image");
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", quality));
  return blob || file;
}

// Private bucket "one-bowl" में फोटो अपलोड करें, path लौटाएँ
export async function uploadPhoto(path, file) {
  const body = await compressImage(file);
  if (body.size > 5 * 1024 * 1024) throw new Error("too_big");
  const res = await fetch(`${SB_URL}/storage/v1/object/one-bowl/${path}`, {
    method: "POST",
    headers: headers({ "Content-Type": body.type || "image/jpeg", "x-upsert": "false" }),
    body,
  });
  if (!res.ok) throw new Error("upload_failed");
  return path;
}

export const cleanPhone = (v) => v.replace(/\D/g, "").slice(-10);
export const validPhone = (p) => /^[6-9]\d{9}$/.test(p);

export const randomId = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`).replace(
    /[^a-zA-Z0-9-]/g,
    ""
  );

// URL में ?ref=OBW-A-00001 हो तो पढ़ें और याद रखें (QR / Referral के लिए)
export function readReferral() {
  if (typeof window === "undefined") return "";
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("ref");
    if (fromUrl) {
      const ref = fromUrl.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 20);
      localStorage.setItem("obw_ref", ref);
      return ref;
    }
    return localStorage.getItem("obw_ref") || "";
  } catch {
    return "";
  }
}

// Database की error को हिंदी संदेश में बदलें
export function errorText(err) {
  const map = {
    invalid_name: "कृपया अपना पूरा नाम लिखें।",
    invalid_phone: "कृपया सही 10 अंकों का मोबाइल नंबर लिखें।",
    invalid_state: "कृपया राज्य चुनें।",
    invalid_place: "कृपया अपना शहर / गाँव लिखें।",
    invalid_bowls: "कटोरियों की संख्या 1 से 100 के बीच रखें।",
    invalid_level: "कृपया Ambassador का स्तर चुनें।",
    invalid_program: "कृपया कार्यक्रम चुनें।",
    invalid_mode: "कृपया Online या Offline चुनें।",
    invalid_org: "कृपया कंपनी / विभाग / संस्था का नाम लिखें।",
    not_found:"यह Campaign ID और मोबाइल नंबर मेल नहीं खाते।",
    too_many: "आज के लिए फोटो की सीमा पूरी हो गई। कल फिर भेजें।",
    not_image: "कृपया केवल फोटो (JPG/PNG) चुनें।",
    too_big: "फोटो बहुत बड़ी है। कृपया छोटी फोटो चुनें।",
    upload_failed: "फोटो अपलोड नहीं हो पाई। इंटरनेट जाँचकर फिर कोशिश करें।",
  };
  return map[err?.message] || "कुछ गड़बड़ हुई। कृपया थोड़ी देर बाद फिर कोशिश करें।";
}
