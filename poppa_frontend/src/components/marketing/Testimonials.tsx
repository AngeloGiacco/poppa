"use client";

import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useTranslations } from "next-intl";

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
    <section className="mx-auto max-w-4xl px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-normal text-olive-800 sm:text-3xl">{t("title")}</h2>
        <p className="mt-3 text-olive-600/70">{t("subtitle")}</p>
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
            <div className="relative overflow-hidden rounded-2xl border border-cream-200 bg-cream-50/80 p-8 backdrop-blur-sm">
              <Quote className="absolute right-6 top-6 h-12 w-12 text-olive-200" />

              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-olive-100 text-lg font-medium text-olive-700">
                  {currentTestimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-olive-800">{currentTestimonial.name}</p>
                  <p className="text-sm text-olive-500">
                    {t("learning")} {tCommon(`languages.${currentTestimonial.language}`)} •{" "}
                    {currentTestimonial.lessonsCompleted} {t("lessons")}
                  </p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from(
                    { length: currentTestimonial.rating },
                    (_, idx) => `star-${currentTestimonial.id}-${idx}`
                  ).map((key) => (
                    <Star key={key} className="h-4 w-4 fill-warm-400 text-warm-400" />
                  ))}
                </div>
              </div>

              <blockquote className="text-lg italic leading-relaxed text-olive-700">
                &ldquo;{t(`quotes.${currentTestimonial.textKey}`)}&rdquo;
              </blockquote>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={goToPrevious}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-300 text-olive-600 transition-all duration-200 hover:border-olive-400 hover:bg-cream-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((testimonial) => (
              <button
                key={`dot-${testimonial.id}`}
                onClick={() =>
                  setActiveIndex(testimonials.findIndex((t) => t.id === testimonial.id))
                }
                className={`h-2 rounded-full transition-all duration-300 ${
                  testimonials[activeIndex]?.id === testimonial.id
                    ? "w-6 bg-olive-500"
                    : "w-2 bg-olive-200 hover:bg-olive-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-300 text-olive-600 transition-all duration-200 hover:border-olive-400 hover:bg-cream-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
