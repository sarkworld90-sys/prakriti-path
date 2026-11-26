"use client";

import { useEffect, useState } from "react";

// मोबाइल पर नीचे का बटन — तभी दिखे जब फॉर्म स्क्रीन पर न हो
export default function StickyCta({ children = "15 मिनट की बातचीत — Appointment लें →" }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const form = document.getElementById("form");
    if (!form || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && window.scrollY > 200), { threshold: 0.05 });
    io.observe(form);
    const onScroll = () => {
      const r = form.getBoundingClientRect();
      setShow(window.scrollY > 200 && (r.bottom < 0 || r.top > window.innerHeight));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <a href="#form" className={`gd-sticky ${show ? "gd-sticky-on" : ""}`} aria-hidden={!show} tabIndex={show ? 0 : -1}>
      {children}
    </a>
  );
}
