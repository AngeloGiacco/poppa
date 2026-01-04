"use client";

import { useState } from "react";

import { Twitter, Linkedin, Facebook, Link, Check, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Analytics } from "@/lib/analytics/posthog";

interface ShareProgressProps {
  language: string;
  lessonsCompleted: number;
  minutesPracticed: number;
  streak?: number;
}

export function ShareProgress({
  language,
  lessonsCompleted,
  minutesPracticed,
  streak,
}: ShareProgressProps) {
  const t = useTranslations("Share");
  const [copied, setCopied] = useState(false);

  const shareText = t("progressText", {
    lessons: lessonsCompleted,
    language,
    minutes: minutesPracticed,
  });

  const shareUrl = "https://trypoppa.com";

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
  };

  const handleShareClick = (platform: "twitter" | "linkedin" | "facebook") => {
    Analytics.track("share_clicked", {
      platform,
      content_type: "progress",
      language,
      lessons_completed: lessonsCompleted,
    });
    window.open(shareLinks[platform], "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      Analytics.track("share_clicked", {
        platform: "copy_link",
        content_type: "progress",
        language,
        lessons_completed: lessonsCompleted,
      });
      toast({
        title: t("linkCopied"),
        description: t("linkCopiedDescription"),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: t("copyFailed"),
        description: t("copyFailedDescription"),
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: t("shareTitle"),
          text: shareText,
          url: shareUrl,
        });
        Analytics.track("share_clicked", {
          platform: "native",
          content_type: "progress",
          language,
          lessons_completed: lessonsCompleted,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-[#8B4513]">
          <Share2 className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <CardDescription className="text-[#5D4037]/70">{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-white/60 p-4">
          <p className="text-sm text-[#5D4037]">
            {t("progressPreview", {
              lessons: lessonsCompleted,
              language,
              minutes: minutesPracticed,
              streak: streak || 0,
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShareClick("twitter")}
            className="min-w-[80px] flex-1 bg-white hover:bg-blue-50"
          >
            <Twitter className="mr-2 h-4 w-4 text-[#1DA1F2]" />
            {t("twitter")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShareClick("linkedin")}
            className="min-w-[80px] flex-1 bg-white hover:bg-blue-50"
          >
            <Linkedin className="mr-2 h-4 w-4 text-[#0A66C2]" />
            {t("linkedin")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShareClick("facebook")}
            className="min-w-[80px] flex-1 bg-white hover:bg-blue-50"
          >
            <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" />
            {t("facebook")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyLink}
            className="min-w-[80px] flex-1 bg-white hover:bg-gray-50"
          >
            {copied ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Link className="mr-2 h-4 w-4" />
            )}
            {copied ? t("copied") : t("copyLink")}
          </Button>
        </div>

        {typeof navigator !== "undefined" && "share" in navigator && (
          <Button
            variant="default"
            className="w-full bg-[#8B4513] text-white hover:bg-[#6D3611]"
            onClick={handleNativeShare}
          >
            <Share2 className="mr-2 h-4 w-4" />
            {t("shareNative")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
