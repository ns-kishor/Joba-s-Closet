"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Scroll-reveal wrapper — soft, fast fade + rise. Used sparingly. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-8 md:mb-10",
        align === "center" ? "text-center mx-auto max-w-xl" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow text-rosegold mb-2", align === "center" && "text-center")}>{eyebrow}</p>
      )}
      <h2 className="font-serif text-3xl md:text-4xl text-charcoal text-balance">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground leading-relaxed">{subtitle}</p>}
    </Reveal>
  );
}
