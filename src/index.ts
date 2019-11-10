import { ListingOptions } from 'snoowrap/dist/objects';

import { reddit } from './lib';
import * as redis from './lib/redis';

// tslint:disable-next-line: no-floating-promises
(async () => {
    try {
        let lastSubmissionName = await redis.getLastSubmissionId();
        console.log('yesss::::: ', lastSubmissionName);
        const listingOptions: ListingOptions = { before: '' };
        console.log(`\n====================================================`);
        console.log(`Checking for new posts...`);
        let lastSubmissionName2 = await reddit.processNewPosts(listingOptions);
        // Save last submission to redis
        await redis.saveLastSubmissionId(lastSubmissionName2);
        console.log('\nDone.');
    } catch (e) {
        console.error(e);
    }
})();
