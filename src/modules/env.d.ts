declare module NodeJS {
    export interface ProcessEnv {
        USER_AGENT: string;
        CLIENT_ID: string;
        CLIENT_SECRET: string;
        USERNAME: string;
        PASSWORD: string;
        TARGET_SUBS: string;
    }
}
