import StatusCodes from 'http-status-codes'

import {
    UserNotFoundError,
    DuplicateUserEmailError,
    DuplicateUserUsernameError,
    PasswordNotMatchingError,
    RefreshTokenNotFoundError,
    RefreshTokenExpiredError,
    RefreshTokenRevokedError, NoTokenProvidedError, TokenExpiredError, TokenInvalidError
} from '../error/user.error.js';

const config = {
    environment: process.env.NODE_ENV || 'development',
};

const UnhandledErrorMiddleware = (err, req, res, next) => {
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let error = 'Server error';
    let message = 'An error has occured, please try again later.';
    let details = [];
    let errorCode = 'no_code';

    if (err instanceof UserNotFoundError) {
        statusCode = StatusCodes.NOT_FOUND;
        error = 'Resource not found error';
        message = err.message || 'User not found.';
    } else if (err instanceof DuplicateUserEmailError) {
        statusCode = StatusCodes.CONFLICT;
        error = 'Conflicting entry found';
        message = err.message || 'User with same email already exists.';
    } else if (err instanceof DuplicateUserUsernameError) {
        statusCode = StatusCodes.CONFLICT;
        error = 'Conflicting entry found';
        message = err.message || 'User with same username already exists.';
    } else if (err instanceof PasswordNotMatchingError) {
        statusCode = StatusCodes.UNAUTHORIZED;
        error = 'Authentication error';
        message = 'Invalid username/password.';
    } else if (err instanceof RefreshTokenNotFoundError) {
        statusCode = StatusCodes.UNAUTHORIZED;
        error = 'Resource not found error';
        message = err.message || 'Refresh token not found.';
    } else if (err instanceof RefreshTokenExpiredError) {
        statusCode = StatusCodes.UNAUTHORIZED;
        error = 'Authentication error';
        message = err.message || 'Refresh token has expired.';
    } else if (err instanceof RefreshTokenRevokedError) {
        statusCode = StatusCodes.UNAUTHORIZED;
        error = 'Authentication error';
        message = err.message || 'Refresh token has already been revoked.';
    }
    else if (err instanceof NoTokenProvidedError) {
        errorCode = err.name;
        statusCode = StatusCodes.FORBIDDEN;
        error = 'Token no provided';
        message = err.message || 'Token no provided';
    }
    else if (err instanceof TokenExpiredError) {
        errorCode = err.name;
        statusCode = StatusCodes.UNAUTHORIZED;
        error = 'Token expired';
        message = err.message || 'Token expired';
    }
    else if (err instanceof TokenInvalidError) {
        errorCode = err.name;
        statusCode = StatusCodes.BAD_REQUEST;
        error = 'Token invalid';
        message = err.message || 'Token invalid';
    }

    const errorResponse = {
        errorCode,
        error,
        details: details.length > 0 ? details : [{message}],
        detailed: config.environment === 'development' ? err.message : undefined,
        stack: config.environment === 'development' ? err.stack : undefined
    };

    return res.status(statusCode).json(errorResponse);
};
export default UnhandledErrorMiddleware;
