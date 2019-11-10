import { ListingOptions } from 'snoowrap/dist/objects';

import { reddit } from './lib';
import * as redis from './lib/redis';

(async () => {
    try {
        // Getting the Id of the last searched post
        console.log(`\n====================================================`);
        console.log(`Connecting to DB...`);
        await redis.open();
        console.log(`Fetching ID of the last searched post...`);
        const lastSubmissionId: string = await redis.getLastSubmissionId();
        console.log(`Fetched ID: ${lastSubmissionId}`);
        const listingOptions: ListingOptions = { before: lastSubmissionId };
        console.log(`====================================================\n`);

        // Check reddit for new posts
        console.log(`Checking for new posts...`);
        const newId = await reddit.processNewPosts(listingOptions);

        // Save last submission to DB
        console.log(`\n====================================================`);
        if (lastSubmissionId !== newId) {
            await redis.saveLastSubmissionId(newId);
            console.log(`Saving ID ${newId} to DB.`);
        }
        console.log('Closing connection to DB.');
        await redis.close();
        console.log(`====================================================`);
        console.log('\nDone.');
    } catch (e) {
        console.error(e);
    }
})();
