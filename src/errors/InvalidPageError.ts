class InvalidPageError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidPageError.prototype);
    }
}

export default InvalidPageError;
