import * as snoowrap from 'snoowrap';
import { ListingOptions } from 'snoowrap/dist/objects';

import config = require('../../config');
import { InvalidPageError } from '../errors';
import { domainToScraper } from './scrapers';
import { outlineArticle } from './outline';

const reddit = new snoowrap.default(config);

const SUBMISSION_PREFFIX = 't3_';
const TARGET_SUBS = ['testabot'];

async function processNewPosts(options: ListingOptions) {
    const sub = reddit.getSubreddit(TARGET_SUBS.join('+'));
    const newSubmissions = await sub.getNew(options);
    options.before = `${SUBMISSION_PREFFIX}_${newSubmissions[0].id}`;
    for (const submission of newSubmissions) {
        await processPost(submission);
    }
    return `${SUBMISSION_PREFFIX}_${newSubmissions[0].id}`;
}

async function reply(post: snoowrap.Submission, outlineUrl: string) {
    await post.reply(outlineUrl).then(() => {
        return;
    });
}

async function processPost(post: snoowrap.Submission) {
    console.log(`\n[${post.id}] Processing post with id [${post.id}]...`);
    if (Object.keys(domainToScraper).includes(post.domain)) {
        try {
            // Check if post is behing a paywall
            const isPaywalled = await domainToScraper[post.domain](post.url);
            if (isPaywalled) {
                console.log(`[${post.id}] Post is behind a paywall. Trying to get Outline link.`);
                const outlineUrl: string = await outlineArticle(post.url);
                console.log(`[${post.id}] Got outline link, replying to post...`);
                await reply(post, outlineUrl);
                console.log(`[${post.id}] Replied to post successfully!`);
            } else {
                console.log(
                    `[${post.id}] The post from ${post.domain} is not behind a paywall. Post id: ${post.id}`,
                );
            }
        } catch (e) {
            if (e instanceof InvalidPageError) {
                console.error(
                    `[${post.id}] Error: the page could not be processed. Page id: ${post.id}\nError: ${e}`,
                );
            } else {
                console.error(
                    `[${post.id}] An unexpected error occured. Page id: ${post.id}\nError: ${e}`,
                );
            }
        }
    } else {
        console.log(
            `[${post.id}] Unsupported domain [${post.domain}], skipping. Page id: ${post.id}`,
        );
    }
}

export { processNewPosts, processPost, reply };
