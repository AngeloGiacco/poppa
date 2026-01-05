"use client";

import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Testimonial {
  id: string;
  name: string;
  language: string;
  rating: number;
  lessonsCompleted: number;
  textKey: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah M.",
    language: "spanish",
    rating: 5,
    lessonsCompleted: 24,
    textKey: "sarah",
  },
  {
    id: "2",
    name: "Michael T.",
    language: "japanese",
    rating: 5,
    lessonsCompleted: 47,
    textKey: "michael",
  },
  {
    id: "3",
    name: "Elena K.",
    language: "french",
    rating: 5,
    lessonsCompleted: 32,
    textKey: "elena",
  },
  {
    id: "4",
    name: "David R.",
    language: "german",
    rating: 5,
    lessonsCompleted: 18,
    textKey: "david",
  },
  {
    id: "5",
    name: "Aisha N.",
    language: "arabic",
    rating: 5,
    lessonsCompleted: 41,
    textKey: "aisha",
  },
];

export function Testimonials() {
  const t = useTranslations("Testimonials");
  const tCommon = useTranslations("common");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#8B4513] sm:text-3xl">{t("title")}</h2>
          <p className="text-[#5D4037]/70">{t("subtitle")}</p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden rounded-2xl border-0 bg-white/80 p-8 shadow-md backdrop-blur-sm">
                <Quote className="absolute right-6 top-6 h-12 w-12 text-[#8B4513]/10" />

                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8B4513]/10 text-xl font-bold text-[#8B4513]">
                    {currentTestimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#8B4513]">{currentTestimonial.name}</p>
                    <p className="text-sm text-[#5D4037]/70">
                      {t("learning")} {tCommon(`languages.${currentTestimonial.language}`)} •{" "}
                      {currentTestimonial.lessonsCompleted} {t("lessons")}
                    </p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from(
                      { length: currentTestimonial.rating },
                      (_, idx) => `star-${currentTestimonial.id}-${idx}`
                    ).map((key) => (
                      <Star key={key} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <blockquote className="text-lg italic leading-relaxed text-[#5D4037]">
                  &ldquo;{t(`quotes.${currentTestimonial.textKey}`)}&rdquo;
                </blockquote>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="h-10 w-10 rounded-full text-[#8B4513] hover:bg-[#8B4513]/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((testimonial) => (
                <button
                  key={`dot-${testimonial.id}`}
                  onClick={() =>
                    setActiveIndex(testimonials.findIndex((t) => t.id === testimonial.id))
                  }
                  className={`h-2 rounded-full transition-all duration-300 ${
                    testimonials[activeIndex]?.id === testimonial.id
                      ? "w-6 bg-[#8B4513]"
                      : "w-2 bg-[#8B4513]/30"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="h-10 w-10 rounded-full text-[#8B4513] hover:bg-[#8B4513]/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
