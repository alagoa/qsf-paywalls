import * as cheerio from 'cheerio';
import * as json5 from 'json5';
import * as request from 'request-promise';

import { InvalidPageError } from '../errors';

// Gets the remainder of a string after matching a variable to it
function getAfterMatch(text: string, variable: string) {
    const result = text.substring(text.search(variable) + variable.length, text.length);
    return result;
}

const domainToScraper = {
    'observador.pt': async (url: string) => {
        let isPaywalled = false;
        const original = await request.get(url);
        const $ = cheerio.load(original, { xmlMode: false });
        // Find out which <script> block contains the isPremium flag
        const dataString = '[\\s]*(var contextualData)';
        $('script').each(async (i, x) => {
            if (x.children[0] !== undefined && !x.children[0].data!.search(dataString)) {
                // Strip out variable declaration
                const badJson = getAfterMatch(x.children[0].data!, '= ');
                // Using json5 for relaxed json parsing
                const result = json5.parse(badJson.replace(/\n/g, ''));
                isPaywalled = result.post.premium;
                return;
            } else {
                return new InvalidPageError();
            }
        });
        return isPaywalled;
    },
};

export { domainToScraper };
