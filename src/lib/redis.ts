import { createClient, type RedisClientType } from 'redis';
import { env } from '../config/env.js';

export const redis: RedisClientType = createClient({
  url: env.REDIS_URL,
  password: env.REDIS_PASSWORD,

  socket: {
    reconnectStrategy(retries) {
      if (retries > 10) {
        return new Error('Redis reconnection limit exceeded');
      }

      return Math.min(retries * 100, 3000);
    },
  },
});

redis.on('error', (error) => {
  console.error('Redis Client Error:', error);
});
