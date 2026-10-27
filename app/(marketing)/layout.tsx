import { InterestModalProvider } from "@/components/interest/InterestModalProvider";
import { PartnerModalProvider } from "@/components/partner/PartnerModalProvider";
import { JsonLd } from "@/components/seo/JsonLd";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd />
      <InterestModalProvider>
        <PartnerModalProvider>{children}</PartnerModalProvider>
      </InterestModalProvider>
    </>
  );
}
