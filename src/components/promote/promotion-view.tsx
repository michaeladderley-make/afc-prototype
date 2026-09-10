"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/copy-text";
import { downloadTextFile } from "@/lib/download-file";
import { isLivePageStatus, type PartnerPage } from "@/lib/mock-pages";
import { promotionBanners, promotionCopy } from "@/lib/mock-promotion";
import { publicDonationUrl } from "@/lib/page-urls";
import { downloadQrPng, qrImageSrc } from "@/lib/qr-code";

export function PromotionView({
  page,
  schoolName,
}: {
  page: PartnerPage;
  schoolName: string;
}) {
  const live = isLivePageStatus(page.status);
  const liveUrl = publicDonationUrl(page.slug);
  const copy = promotionCopy(schoolName, liveUrl);
  const banners = promotionBanners(schoolName);
  const [copied, setCopied] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);

  function flashCopied(id: string) {
    setCopied(id);
    window.setTimeout(() => {
      setCopied((current) => (current === id ? null : current));
    }, 2000);
  }

  function flashDownloaded(id: string) {
    setDownloaded(id);
    window.setTimeout(() => {
      setDownloaded((current) => (current === id ? null : current));
    }, 2000);
  }

  function handleCopy(id: string, text: string) {
    flashCopied(id);
    void copyText(text);
  }

  function handleQrDownload() {
    flashDownloaded("qr");
    void downloadQrPng(liveUrl, `${page.slug}-qr.png`);
  }

  function handleBannerDownload(id: string, filename: string, svg: string) {
    downloadTextFile(svg, filename, "image/svg+xml");
    flashDownloaded(id);
  }

  if (!live) {
    return (
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-5 px-16 py-16">
        <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
          Promote
        </h1>
        <p className="text-base leading-6 text-muted-foreground">
          This page is {page.status === "Paused" ? "paused" : "still a draft"}.
          Promotion should wait until the page is live.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-10 px-16 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
          Promote
        </h1>
        <p className="text-base leading-6 text-muted-foreground">
          {copy.guidance}
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-[21px] leading-[28px] font-medium tracking-[0.42px] text-foreground">
          Live URL
        </h2>
        <p className="text-base leading-6 break-all text-foreground">{liveUrl}</p>
        <Button
          type="button"
          className="w-fit"
          onClick={() => handleCopy("url", liveUrl)}
        >
          {copied === "url" ? "Copied" : "Copy link"}
        </Button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[21px] leading-[28px] font-medium tracking-[0.42px] text-foreground">
          QR code
        </h2>
        <img
          src={qrImageSrc(liveUrl)}
          alt={`QR code for ${liveUrl}`}
          width={180}
          height={180}
          className="border border-border bg-background"
        />
        <Button type="button" className="w-fit" onClick={handleQrDownload}>
          {downloaded === "qr" ? "Download started" : "Download QR code"}
        </Button>
      </section>

      <CopyBlock
        title={copy.email.label}
        text={copy.email.text}
        copied={copied === "email"}
        onCopy={() => handleCopy("email", copy.email.text)}
      />
      <CopyBlock
        title={copy.social.label}
        text={copy.social.text}
        copied={copied === "social"}
        onCopy={() => handleCopy("social", copy.social.text)}
      />

      <section className="flex flex-col gap-5">
        <h2 className="text-[21px] leading-[28px] font-medium tracking-[0.42px] text-foreground">
          Approved images or banners
        </h2>
        <div className="flex flex-col gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="flex flex-col gap-3">
              <p className="text-sm tracking-[0.07px] text-foreground">
                {banner.name}
              </p>
              <div
                className="overflow-hidden border border-border bg-foreground [&_svg]:h-auto [&_svg]:w-full"
                style={{ width: banner.width, maxWidth: "100%" }}
                dangerouslySetInnerHTML={{ __html: banner.svg }}
              />
              <Button
                type="button"
                className="w-fit"
                onClick={() =>
                  handleBannerDownload(banner.id, banner.filename, banner.svg)
                }
              >
                {downloaded === banner.id ? "Download started" : "Download"}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CopyBlock({
  title,
  text,
  copied,
  onCopy,
}: {
  title: string;
  text: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[21px] leading-[28px] font-medium tracking-[0.42px] text-foreground">
        {title}
      </h2>
      <p className="whitespace-pre-wrap text-base leading-6 text-muted-foreground">
        {text}
      </p>
      <Button type="button" className="w-fit" onClick={onCopy}>
        {copied ? "Copied" : "Copy text"}
      </Button>
    </section>
  );
}
