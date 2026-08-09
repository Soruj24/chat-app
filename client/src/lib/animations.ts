import type { Transition, Variants } from "framer-motion";

export const spring = {
  gentle: { type: "spring", stiffness: 300, damping: 30 } as const,
  snappy: { type: "spring", stiffness: 500, damping: 35 } as const,
  bouncy: { type: "spring", stiffness: 400, damping: 25 } as const,
  smooth: { type: "spring", stiffness: 200, damping: 25 } as const,
} as const;

export const ease = {
  out: [0, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
  inOut: [0.4, 0, 0.2, 1],
} as const;

export const transition = {
  default: { duration: 0.2, ease: ease.out },
  fast: { duration: 0.12, ease: ease.out },
  slow: { duration: 0.3, ease: ease.inOut },
} as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};
