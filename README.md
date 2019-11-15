# qsf-paywalls

[This bot](https://www.reddit.com/user/qsf_paywalls) checks Reddit from time to time for posts behind _paywalls_. If it finds any known domain, it runs the article through [Outline](https://outline.com) and then posts a link to the article in the comments.

It is a serverless bot, using the [**Snoowrap**](https://github.com/not-an-aardvark/snoowrap) lib to query Reddit and [**Redis**](https://redis.io) for data persistence.

## If you want to use it

### Configuration

Create your .env file on the root of the project with the following environment variables.

```
# Reddit account credentials
USER_AGENT=
CLIENT_ID=
CLIENT_SECRET=
USERNAME=
PASSWORD=

# Targeted subreddits, in multireddit mode (e.g. portugal+brasil+worldnews)
TARGET_SUBS=
```

### Usage

Just run

```
docker-compose up --abort-on-container-exit
```

to run the script. The `--abort-on-container-exit` flag makes sure the Redis container stops once the script finishes executing.

## Currently supported domains

-   [observador.pt](https://observador.pt/)
-   [oglobo.globo.com](https://oglobo.globo.com)

Feel free to [contribute](contributing.md) with another domain :)

---

## TODO:

-   Write contribution guide
-   Tests

Check the [issues](https://github.com/alagoa/qsf-paywalls/issues) for more.

---

**I do not advocate piracy or content stealing! This tool was meant for a very specific purpose, where users who wanted to discuss a subject had incomplete (thus, inaccurate) information. If you have the means, please support the authors of the articles if you think their work is valuable.**
