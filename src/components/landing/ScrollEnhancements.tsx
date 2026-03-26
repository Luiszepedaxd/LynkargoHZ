"use client";

import { useEffect } from "react";

export default function ScrollEnhancements() {
  useEffect(() => {
    const fadeInEls = Array.from(
      document.querySelectorAll<HTMLElement>(".fade-in"),
    );

    const timers: number[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target as HTMLElement;
          const d = Number(el.dataset.d ?? 0);
          const t = window.setTimeout(() => el.classList.add("visible"), d);
          timers.push(t);
        });
      },
      { threshold: 0.1 },
    );

    fadeInEls.forEach((el, i) => {
      // Igual que tu HTML original: micro-delay escalonado por índice.
      el.dataset.d = String((i % 5) * 70);
      observer.observe(el);
    });

    const clickHandlers: Array<() => void> = [];

    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      const handler = (e: Event) => {
        const href = a.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href) as HTMLElement | null;
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      };

      a.addEventListener("click", handler);
      clickHandlers.push(() => a.removeEventListener("click", handler));
    });

    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      clickHandlers.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}

