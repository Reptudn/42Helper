// Environment configuration for the application
export const config = {
  // PocketBase configuration
  pocketbase: {
    url: process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://localhost:8090",
    adminUrl: process.env.NEXT_PUBLIC_POCKETBASE_ADMIN_URL || "http://localhost:8090/_/",
  },
  
  // Collection names
  collections: {
    offers: process.env.NEXT_PUBLIC_OFFERS_COLLECTION || "offers",
    requests: process.env.NEXT_PUBLIC_REQUESTS_COLLECTION || "requests",
  },
} as const;
