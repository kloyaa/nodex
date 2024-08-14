import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379',
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Connect to Redis server
redisClient.connect().catch((err) => {
  console.error('Redis connection error:', err);
});

export default redisClient;
