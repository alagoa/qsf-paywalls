import * as request from 'request-promise';
import * as snoowrap from 'snoowrap';

import config = require('../config');
import { domainToScraper } from './scrapers';
import { InvalidPageError } from './errors';

async function outlineArticle(sourceUrl: string) {
    const apiUrl = 'https://outlineapi.com/article';
    const queryString = `?source_url=${sourceUrl}`;
    const options = {
        headers: {
            Accept: '*/*',
            Referer: 'https://outline.com/',
            Origin: 'https://outline.com',
            'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
            'Sec-Fetch-Mode': 'cors',
        },
        uri: apiUrl + queryString,
    };

    const response: string = await request.get(options);
    const responseJson = JSON.parse(response);
    return `https://outline.com/${responseJson.data.short_code}`;
}

async function processPost(post: snoowrap.Submission) {
    if (Object.keys(domainToScraper).includes(post.domain)) {
        try {
            // Check if post is behing a paywall
            const isPremium = domainToScraper[post.domain](post.url);
            if (isPremium) {
                const outlineUrl: string = await outlineArticle(post.url);
                console.log(outlineUrl);
                // Post comment on post
            } else {
                console.log(`The post is not behind a paywall. Page URL: ${post.url}`);
            }
        } catch (e) {
            if (e instanceof InvalidPageError) {
                console.error(
                    `[${post.domain}] Error: the page could not be processed. Page URL: ${post.url}\nError: ${e}`,
                );
            } else {
                console.error(
                    `[${post.domain}] An unexpected error occured. Page URL: ${post.url}\nError: ${e}`,
                );
            }
        }
    } else {
        console.log(`Unknown domain [${post.domain}], skipping. Page URL: ${post.url}`);
    }
}

// tslint:disable-next-line: no-floating-promises
(async () => {
    try {
    } catch (e) {
        console.error(e);
    }
})();
