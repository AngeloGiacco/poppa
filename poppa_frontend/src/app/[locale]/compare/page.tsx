"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Mic, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

interface ComparisonRow {
  feature: string;
  poppa: boolean | string;
  duolingo: boolean | string;
  babbel: boolean | string;
  rosetta: boolean | string;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "voiceConversation",
    poppa: true,
    duolingo: false,
    babbel: false,
    rosetta: false,
  },
  {
    feature: "aiTutor",
    poppa: true,
    duolingo: false,
    babbel: false,
    rosetta: false,
  },
  {
    feature: "socraticMethod",
    poppa: true,
    duolingo: false,
    babbel: false,
    rosetta: false,
  },
  {
    feature: "noMemorization",
    poppa: true,
    duolingo: false,
    babbel: false,
    rosetta: false,
  },
  {
    feature: "adaptiveLessons",
    poppa: true,
    duolingo: "partial",
    babbel: "partial",
    rosetta: false,
  },
  {
    feature: "speakFromDayOne",
    poppa: true,
    duolingo: false,
    babbel: "partial",
    rosetta: true,
  },
  {
    feature: "naturalConversation",
    poppa: true,
    duolingo: false,
    babbel: false,
    rosetta: false,
  },
  {
    feature: "availableLanguages",
    poppa: "50+",
    duolingo: "40+",
    babbel: "14",
    rosetta: "25",
  },
  {
    feature: "freeMinutes",
    poppa: "15",
    duolingo: "limited",
    babbel: "trial",
    rosetta: "trial",
  },
];

const differentiators = ["voiceFirst", "thinkingMethod", "noGameification", "realConversation"];

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-green-600" />
    ) : (
      <X className="h-5 w-5 text-red-400" />
    );
  }
  if (value === "partial") {
    return <span className="text-sm text-amber-600">Partial</span>;
  }
  return <span className="text-sm font-medium text-[#5D4037]">{value}</span>;
}

export default function ComparePage() {
  const t = useTranslations("Compare");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Navigation */}
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-[#8B4513]/5 bg-[#FFF8E1]/80 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#8B4513]">Poppa</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="text-sm text-[#5D4037] hover:bg-[#8B4513]/10"
            >
              <Link href="/login">{t("nav.login")}</Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-[#8B4513] px-5 text-sm text-white shadow-md hover:bg-[#6D3611]"
            >
              <Link href="/signup">{t("nav.getStarted")}</Link>
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        className="mx-auto max-w-7xl flex-grow px-4 pb-16 pt-28 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <header className="mx-auto mb-16 max-w-4xl text-center">
          <motion.h1
            className="mb-6 text-4xl font-bold tracking-tight text-[#8B4513] sm:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#5D4037]/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t("hero.subtitle")}
          </motion.p>
        </header>

        {/* Key Differentiators */}
        <motion.div
          className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {differentiators.map((key) => (
            <Card key={key} className="overflow-hidden rounded-2xl border-0 bg-[#8B4513] shadow-lg">
              <CardContent className="p-6 text-center">
                <Mic className="mx-auto mb-3 h-8 w-8 text-white/80" />
                <h3 className="mb-2 font-semibold text-white">
                  {t(`differentiators.${key}.title`)}
                </h3>
                <p className="text-sm text-white/80">{t(`differentiators.${key}.description`)}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card className="overflow-hidden rounded-2xl border-0 bg-white/80 shadow-md backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#8B4513]/10">
                      <th className="p-4 text-left font-semibold text-[#8B4513]">
                        {t("table.feature")}
                      </th>
                      <th className="bg-[#8B4513]/5 p-4 text-center font-semibold text-[#8B4513]">
                        Poppa
                      </th>
                      <th className="p-4 text-center font-semibold text-[#5D4037]/70">Duolingo</th>
                      <th className="p-4 text-center font-semibold text-[#5D4037]/70">Babbel</th>
                      <th className="p-4 text-center font-semibold text-[#5D4037]/70">
                        Rosetta Stone
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr
                        key={row.feature}
                        className={
                          index < comparisonData.length - 1 ? "border-b border-[#8B4513]/5" : ""
                        }
                      >
                        <td className="p-4 font-medium text-[#5D4037]">
                          {t(`features.${row.feature}`)}
                        </td>
                        <td className="bg-[#8B4513]/5 p-4 text-center">
                          <div className="flex items-center justify-center">
                            <FeatureCell value={row.poppa} />
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center">
                            <FeatureCell value={row.duolingo} />
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center">
                            <FeatureCell value={row.babbel} />
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center">
                            <FeatureCell value={row.rosetta} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Why Switch Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card className="overflow-hidden rounded-2xl border-0 bg-white/60 shadow-sm backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="mb-6 text-center text-2xl font-bold text-[#8B4513] sm:text-3xl">
                {t("whySwitch.title")}
              </h2>

              <div className="mx-auto max-w-3xl space-y-4">
                {["gamification", "drilling", "patterns", "speaking"].map((key) => (
                  <div key={key} className="flex items-start gap-4">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-[#8B4513]">
                        {t(`whySwitch.reasons.${key}.title`)}
                      </h3>
                      <p className="text-sm text-[#5D4037]/70">
                        {t(`whySwitch.reasons.${key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="mt-16 py-12 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <h2 className="mb-4 text-2xl font-bold text-[#8B4513] sm:text-3xl">{t("cta.title")}</h2>
          <p className="mx-auto mb-8 max-w-xl text-[#5D4037]/70">{t("cta.subtitle")}</p>
          <Button
            asChild
            className="group rounded-full bg-[#8B4513] px-10 py-6 text-lg text-white shadow-lg hover:bg-[#6D3611] hover:shadow-xl"
          >
            <Link href="/signup">
              {t("cta.button")}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
}
