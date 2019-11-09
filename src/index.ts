import { ListingOptions } from 'snoowrap/dist/objects';

import { reddit } from './lib';

// tslint:disable-next-line: no-floating-promises
(async () => {
    try {
        const listingOptions: ListingOptions = {}; // TODO: get it from redis
        console.log(`\n====================================================`);
        console.log(`Checking for new posts...`);
        listingOptions.before = await reddit.processNewPosts(listingOptions);
        console.log('Done.');
    } catch (e) {
        console.error(e);
    }
})();
