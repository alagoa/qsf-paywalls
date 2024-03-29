import * as process from 'process';
import * as snoowrap from 'snoowrap';
import { ListingOptions } from 'snoowrap/dist/objects';

import { InvalidPageError } from '../errors';
import { outlineArticle } from './outline';
import { domainToScraper } from './scrapers';

const config = {
    userAgent: process.env.USER_AGENT,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
};

const reddit = new snoowrap.default(config);
const SUBMISSION_PREFIX = 't3';

const REPO_URL = 'https://github.com/alagoa/qsf-paywalls';

async function processNewPosts(options: ListingOptions) {
    const sub = reddit.getSubreddit(process.env.TARGET_SUBS);
    const newSubmissions = await sub.getNew(options);
    for (const submission of newSubmissions) {
        await processPost(submission);
    }
    // Return last submission ID
    if (newSubmissions.length <= 0) {
        console.log(`No new posts available.`);
        return options.before || '';
    }
    return `${SUBMISSION_PREFIX}_${newSubmissions[0].id}`;
}

async function reply(post: snoowrap.Submission, outlineUrl: string) {
    const response = `
[**Link sem paywall**](${outlineUrl})



*****

^(*I'm a bot, bleep bloop. Não defendo pirataria nem roubo de conteúdos. Se tiveres meios para tal, apoia os autores dos artigos se achares que estes têm valor.*)

[GitHub](${REPO_URL})

[Reportar problemas ⚠️](${REPO_URL}/issues/new)
`;
    await post.reply(response).then(() => {
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
                console.log(
                    `[${post.id}] Post from [${post.domain}] is behind a paywall. Trying to get Outline link.`,
                );
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
