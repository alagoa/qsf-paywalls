import * as asyncRedis from 'async-redis';

const REDIS_HOSTNAME = 'redis-db';
const REDIS_PORT = 6379;

let redis: asyncRedis.RedisClient;

async function open() {
    redis = await asyncRedis.createClient(REDIS_PORT, REDIS_HOSTNAME);
}

async function close() {
    await redis.quit();
}

async function saveLastSubmissionId(submissionName: string) {
    await redis.set('lastSubmissionId', submissionName);
}

async function getLastSubmissionId(): Promise<string> {
    return await redis.get('lastSubmissionId');
}

export { open, close, saveLastSubmissionId, getLastSubmissionId };
