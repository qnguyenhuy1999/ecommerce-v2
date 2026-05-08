import { Queue } from 'bullmq'
import Redis from 'ioredis'

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
})

export const queues = {
  flashSales: new Queue('flash-sales', { connection }),
  adImpressions: new Queue('ad-impressions', { connection }),
  aiTasks: new Queue('ai-tasks', { connection }),
  events: new Queue('events', { connection }),
  recommendations: new Queue('recommendations', { connection }),
  settlements: new Queue('settlements', { connection }),
  notifications: new Queue('notifications', { connection }),
  emails: new Queue('emails', { connection }),
}

export type QueueName = keyof typeof queues
