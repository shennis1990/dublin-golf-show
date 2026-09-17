import { siteConfig } from "@/lib/site";

export function JsonLd() {
  const organizationId = `${siteConfig.url}/#organization`;
  const organizerId = `${siteConfig.url}/#organizer`;
  const websiteId = `${siteConfig.url}/#website`;
  const eventId = `${siteConfig.url}/#event-2027`;
  const logoUrl = `${siteConfig.url}/images/logo-stacked-square.png`;

  const organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
      width: 1080,
      height: 1080,
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.social.x,
    ],
  };

  const organizer = {
    "@type": "Organization",
    "@id": organizerId,
    name: siteConfig.organiser.name,
    url: `${siteConfig.url}${siteConfig.organiser.path}`,
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": organizationId },
    inLanguage: "en-IE",
  };

  const event = {
    "@type": "Event",
    "@id": eventId,
    name: siteConfig.event.name,
    alternateName: "Ireland's Festival of Golf",
    description:
      "Ireland's Festival of Golf. A two-day indoor golf event at RDS Simmonscourt, Dublin.",
    image: [`${siteConfig.url}/og.jpg`],
    startDate: siteConfig.event.startDate,
    endDate: siteConfig.event.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: siteConfig.url,
    organizer: { "@id": organizerId },
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
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, organizer, website, event],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
