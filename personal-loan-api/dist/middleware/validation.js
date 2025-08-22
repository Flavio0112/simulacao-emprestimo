"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.jsonErrorHandler = void 0;
const jsonErrorHandler = (req, res, next) => {
    if (req.method === 'POST' && req.headers['content-type']?.includes('application/json')) {
        if (!req.body || Object.keys(req.body).length === 0) {
            res.status(400).json({
                success: false,
                message: 'Corpo da requisição não pode estar vazio',
            });
            return;
        }
    }
    next();
};
exports.jsonErrorHandler = jsonErrorHandler;
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    if (req.method === 'POST' && req.body) {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=validation.js.map