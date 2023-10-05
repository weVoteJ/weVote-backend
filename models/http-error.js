class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Calling Error construct and Add a "message" property
    this.code = errorCode; // Adds a "code" property
  }
}

module.exports = HttpError;
