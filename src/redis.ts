import { createClient, RedisClientType } from 'redis';

let client: RedisClientType;

export const getClient = async () => {
  if (!client) {
    client = createClient({
      url: 'redis://localhost:7777',
      disableOfflineQueue: true,
    });
  }

  return client;
}