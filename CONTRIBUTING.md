# Contribution guide

Thank you for considering contributing to this project :)

If you want to contribute, please follow these simple guidelines to make the process easier for those who are managing the project.

## Type of contributions

Currently, this script supports very few domains. So the main goal as at the time of writing this guide is to expand the number of domains the script can support. A domain is eligible if it conforms with the following requirements:

1. Paywalled content from that domain can be accessed with the help of [Outline](http://outline.com).

2. See 1.

That's it.

### Adding a new domain

To add a domain **A** to the script, you only have to write a function that, given a URL to an article from **A**, returns a boolean value indicating if the article is behind a paywall (true) or not (false).

For example, the following function serves that purpose for the `oglobo.globo.com` domain. ([source](src/lib/scrapers.ts))

```typescript
async (url: string) => {
    let isPaywalled = false;
    const original = await request.get(url);
    const $ = cheerio.load(original, { xmlMode: false });
    // Find out which <script> block contains the conteudoExclusivo key
    const jsonRegex = /"(conteudoExclusivo)":"((\\"|[^"])*)"/g;
    $('script').each(async (i, x) => {
        if (x.children[0] !== undefined) {
            const resultHolder = x.children[0].data!.match(jsonRegex); // Ex: [ '"conteudoExclusivo":"Não"' ]
            if (resultHolder === null) {
                return; // skip to next <script> tag
            }
            if (resultHolder[0].endsWith('"Sim"')) {
                isPaywalled = true;
            }
            return false; // break out of .each
        } else {
            return new InvalidPageError();
        }
    });
    return isPaywalled;
};
```

Then, you just need to add that function to the `domainToScraper` object on `src/lib/scrapers.ts`, with the respective domain as the key for the entry.

When doing this please try to use the libraries that are already used in this project.

#### Why do we need that? Couldn't we just run the article through Outline and be done with it?

We could, but the main idea behind this tool is to provide information to people who cannot pay for it. Running the script while ignoring whether the article is paywalled or not would hurt the ad revenue of the websites, with no parts benefiting from it.

## Other contributions

If you wish to contribute in any other way, please do :)

## Guidelines for making a pull request

### For adding a new domain

[Here is a sample PR](https://github.com/alagoa/qsf-paywalls/pull/12).

-   [Git flow approach](https://danielkummer.github.io/git-flow-cheatsheet/index.html) - The name of your branch should be `feature/domain/<domain-name>`.
-   Title should be `Add domain - <domain-name>`
-   Should be tagged with `domain` tag
-   On the description, please leave 2 examples of articles from that domain (one that is paywalled, another that is not)
-   Assign it to someone!

### For everything else

Do as you please, as long as you use a git flow approach and format your code correctly :)
