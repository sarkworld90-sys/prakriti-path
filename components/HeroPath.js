// Hero के पीछे एक घुमावदार "पथ" — प्रकृति पथ का प्रतीक
export default function HeroPath() {
  return (
    <svg className="hero-path" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path
        d="M-40 560 C 220 520, 260 380, 470 400 S 760 520, 880 360 S 1040 120, 1260 80"
        fill="none"
        stroke="#d9932b"
        strokeWidth="2.5"
        strokeDasharray="2 12"
        strokeLinecap="round"
      />
      <path
        d="M-40 590 C 240 560, 300 430, 500 440 S 790 560, 920 400 S 1080 170, 1260 130"
        fill="none"
        stroke="#6b8f5e"
        strokeWidth="1.5"
        opacity=".6"
      />
      <g fill="#6b8f5e" opacity=".5">
        <ellipse cx="160" cy="470" rx="9" ry="18" transform="rotate(-35 160 470)" />
        <ellipse cx="182" cy="462" rx="7" ry="14" transform="rotate(30 182 462)" />
        <ellipse cx="1010" cy="200" rx="9" ry="18" transform="rotate(-30 1010 200)" />
        <ellipse cx="1032" cy="194" rx="7" ry="14" transform="rotate(35 1032 194)" />
      </g>
      <circle cx="1180" cy="92" r="7" fill="#d9932b" />
    </svg>
  );
}
