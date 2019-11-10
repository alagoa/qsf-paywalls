import * as redislib from 'redis';

const REDIS_HOSTNAME = 'localhost';
const REDIS_PORT = 6379;
const DEFAULT_CHANNEL = 'testChannel';

const redis = redislib.createClient(REDIS_PORT, REDIS_HOSTNAME);
redis.on('connect', () => console.log('Connected to redis.'));
redis.on('error', err => console.log(`An error occured: ${err}`));

async function saveLastSubmissionId(submissionName: string) {
    redis.set('lastSubmissionId', submissionName, redislib.print);
}

async function getLastSubmissionId() {
    const result = redis.get('lastSubmissionId', (err, value) => {
        if (err) {
            console.log(`An error occurred while fetching the last submission Id: ${err}`);
        }
        console.log(`VALUE::::::${value}`);
        return value.valueOf;
    });
    return result;
}

export { saveLastSubmissionId, getLastSubmissionId };
