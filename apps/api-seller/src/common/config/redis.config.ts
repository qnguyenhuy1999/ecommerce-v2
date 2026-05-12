import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
})

export const RedisKeys = {
  // Flash Sales
  flashSaleStock: (slotId: string) => `flash:slot:${slotId}:stock`,
  flashSaleLock: (slotId: string, userId: string) => `flash:lock:${slotId}:${userId}`,
  flashSaleCountdown: (campaignId: string) => `flash:countdown:${campaignId}`,

  // Ads & Budget
  adBudget: (campaignId: string) => `ad:budget:${campaignId}`,
  adDailySpend: (campaignId: string, date: string) => `ad:spend:${campaignId}:${date}`,
  adImpressionCount: (adId: string) => `ad:impressions:${adId}`,
  adClickCount: (adId: string) => `ad:clicks:${adId}`,

  // Recommendations
  recommendationCache: (userId: string, type: string) => `rec:${type}:${userId}`,
  trendingProducts: () => `rec:trending`,
  similarProducts: (productId: string) => `rec:similar:${productId}`,

  // Loyalty
  loyaltyPoints: (userId: string) => `loyalty:points:${userId}`,
  dailyCheckIn: (userId: string, date: string) => `loyalty:checkin:${userId}:${date}`,

  // Wallet
  walletBalance: (walletId: string) => `wallet:balance:${walletId}`,
  withdrawalLock: (walletId: string) => `wallet:withdraw:lock:${walletId}`,

  // Session & Rate Limiting
  session: (sessionId: string) => `session:${sessionId}`,
  rateLimit: (key: string) => `ratelimit:${key}`,

  // Feature Flags
  featureFlag: (key: string) => `feature:${key}`,
  experimentVariant: (experimentId: string, userId: string) =>
    `experiment:${experimentId}:${userId}`,

  // Search
  searchCache: (query: string) => `search:cache:${query}`,
  searchSuggestions: (prefix: string) => `search:suggest:${prefix}`,
}

export default redis
