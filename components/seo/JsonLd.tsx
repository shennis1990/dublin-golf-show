import { siteConfig } from "@/lib/site";

export function JsonLd() {
  const organization = {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/images/logo-stacked-square.png`,
      width: 1200,
      height: 1200,
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.x,
      siteConfig.social.linkedin,
    ],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "en-IE",
  };

  const event = {
    "@type": "Event",
    "@id": `${siteConfig.url}/#event-2027`,
    name: siteConfig.event.name,
    description: siteConfig.description,
    image: [`${siteConfig.url}/og.jpg`],
    startDate: siteConfig.event.startDate,
    endDate: siteConfig.event.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: siteConfig.url,
    organizer: { "@id": `${siteConfig.url}/#organization` },
    location: {
      "@type": "Place",
      name: siteConfig.event.locationName,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.event.streetAddress,
        addressLocality: siteConfig.event.addressLocality,
        postalCode: siteConfig.event.postalCode,
        addressCountry: siteConfig.event.addressCountry,
      },
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/#register`,
      availability: "https://schema.org/PreOrder",
      price: "0",
      priceCurrency: "EUR",
      validFrom: "2026-01-01",
    },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website, event],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
