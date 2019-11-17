import * as request from 'request-promise';

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

export { outlineArticle };
