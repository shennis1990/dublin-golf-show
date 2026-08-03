export const siteConfig = {
  name: "Dublin Golf Show",
  shortName: "DGS",
  title: "Dublin Golf Show 2027 | Ireland's Festival of Golf",
  description:
    "Discover Ireland's biggest celebration of golf. Experience leading golf brands, destinations, technology, coaching, travel and live experiences at RDS Simmonscourt in June 2027.",
  ogDescription: "Ireland's biggest celebration of golf.",
  keywords: [
    "Dublin Golf Show",
    "Golf Show Ireland",
    "Golf Expo",
    "Golf Exhibition",
    "Golf Event Dublin",
    "Golf Ireland",
    "Golf Equipment",
    "Golf Travel",
    "RDS Golf Show",
  ],
  author: "Dublin Golf Show",
  locale: "en_IE",
  themeColor: "#0A111C",
  backgroundColor: "#0A111C",
  email: "hello@dublingolfshow.ie",
  /** Production origin — override with NEXT_PUBLIC_SITE_URL */
  get url() {
    return (
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.dublingolfshow.ie"
    );
  },
  event: {
    name: "Dublin Golf Show 2027",
    startDate: "2027-06-19",
    endDate: "2027-06-20",
    locationName: "RDS Simmonscourt",
    streetAddress: "Simmonscourt Road",
    addressLocality: "Dublin",
    postalCode: "D04",
    addressCountry: "IE",
  },
  social: {
    instagram: "https://www.instagram.com/",
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/",
    // TODO: replace with official Dublin Golf Show Facebook page URL
    facebook: "https://www.facebook.com/",
  },
} as const;

export type SiteConfig = typeof siteConfig;
