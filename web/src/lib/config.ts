// Environment configuration for the application
export const config = {
  // NextAuth configuration
  nextAuth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  },
  
  // 42 School OAuth configuration
  fortyTwo: {
    clientId: process.env.FORTY_TWO_CLIENT_ID,
    clientSecret: process.env.FORTY_TWO_CLIENT_SECRET,
  },
  
  // PocketBase configuration (for data storage)
  pocketbase: {
    url: process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://localhost:8090",
    adminUrl: process.env.NEXT_PUBLIC_POCKETBASE_ADMIN_URL || "http://localhost:8090/_/",
  },
  
  // Collection names
  collections: {
    offers: process.env.NEXT_PUBLIC_OFFERS_COLLECTION || "offers",
    requests: process.env.NEXT_PUBLIC_REQUESTS_COLLECTION || "requests",
  },
  
  // Visualizer configuration
  visualizer: {
    // Refresh interval in seconds (default: 300 = 5 minutes)
    // For testing: set NEXT_PUBLIC_VISUALIZER_REFRESH_INTERVAL=30 in .env.local for 30 seconds
    refreshIntervalSeconds: parseInt(process.env.NEXT_PUBLIC_VISUALIZER_REFRESH_INTERVAL || "300", 10),
  },
} as const;
