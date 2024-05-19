import {StatusCodes} from "http-status-codes";

const RouteNotFoundErrorMiddleware = (req, res, next) => {
    return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Path not found', details: [{message: `Path not found: ${req.originalUrl}`}]
    });
};

export default RouteNotFoundErrorMiddleware;