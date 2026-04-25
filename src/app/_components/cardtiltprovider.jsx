"use client";

import { useEffect } from "react";

const CANDIDATE_SELECTOR = [
  ".glass.rounded-2xl",
  ".glass.rounded-xl",
  ".glass.rounded-lg",
  ".hover-lift.rounded-2xl",
  ".hover-lift.rounded-xl",
].join(", ");

const MIN_CARD_WIDTH = 180;
const MIN_CARD_HEIGHT = 120;

function getTiltIntensity(rect) {
  const largestSide = Math.max(rect.width, rect.height);

  if (largestSide >= 1100) return 1.3;
  if (largestSide >= 900) return 1.6;
  if (largestSide >= 700) return 2.1;
  if (largestSide >= 550) return 2.6;
  if (largestSide >= 420) return 3.2;
  return 3.8;
}

function isEligibleCard(element) {
  if (!element || element.dataset.tiltCard === "off") {
    return false;
  }

  const tag = element.tagName?.toLowerCase();
  if (tag === "button" || tag === "input" || tag === "textarea" || tag === "select") {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return rect.width >= MIN_CARD_WIDTH && rect.height >= MIN_CARD_HEIGHT;
}

function setCardPointerState(element, clientX, clientY) {
  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }

  const pointerX = clientX - rect.left;
  const pointerY = clientY - rect.top;
  const ratioX = (pointerX / rect.width) * 2 - 1;
  const ratioY = (pointerY / rect.height) * 2 - 1;
  const maxTilt = getTiltIntensity(rect);

  // Invert tilt so the hovered side dips away from the viewer.
  element.style.setProperty("--card-rotate-x", `${ratioY * -maxTilt}deg`);
  element.style.setProperty("--card-rotate-y", `${ratioX * maxTilt}deg`);
  element.style.setProperty("--card-glow-x", `${(pointerX / rect.width) * 100}%`);
  element.style.setProperty("--card-glow-y", `${(pointerY / rect.height) * 100}%`);
  element.style.setProperty("--card-glow-opacity", "1");
}

function resetCardPointerState(element) {
  element.style.setProperty("--card-rotate-x", "0deg");
  element.style.setProperty("--card-rotate-y", "0deg");
  element.style.setProperty("--card-glow-opacity", "0");
}

export default function CardTiltProvider() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return undefined;
    }

    const cleanups = new Map();

    const bindCard = (element) => {
      if (!isEligibleCard(element) || cleanups.has(element)) {
        return;
      }

      element.classList.add("interactive-card-tilt");

      const onPointerEnter = (event) => setCardPointerState(element, event.clientX, event.clientY);
      const onPointerMove = (event) => setCardPointerState(element, event.clientX, event.clientY);
      const onPointerLeave = () => resetCardPointerState(element);
      const onFocus = () => {
        element.style.setProperty("--card-glow-x", "50%");
        element.style.setProperty("--card-glow-y", "50%");
        element.style.setProperty("--card-glow-opacity", "0.75");
      };
      const onBlur = () => resetCardPointerState(element);

      element.addEventListener("pointerenter", onPointerEnter);
      element.addEventListener("pointermove", onPointerMove);
      element.addEventListener("pointerleave", onPointerLeave);
      element.addEventListener("focusin", onFocus);
      element.addEventListener("focusout", onBlur);

      cleanups.set(element, () => {
        element.removeEventListener("pointerenter", onPointerEnter);
        element.removeEventListener("pointermove", onPointerMove);
        element.removeEventListener("pointerleave", onPointerLeave);
        element.removeEventListener("focusin", onFocus);
        element.removeEventListener("focusout", onBlur);
      });
    };

    const scanCards = () => {
      document.querySelectorAll(CANDIDATE_SELECTOR).forEach((element) => bindCard(element));
    };

    const observer = new MutationObserver(() => {
      scanCards();
    });

    scanCards();
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", scanCards);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", scanCards);
      cleanups.forEach((cleanup) => cleanup());
      cleanups.clear();
    };
  }, []);

  return null;
}
