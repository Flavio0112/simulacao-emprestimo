"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = require("./middleware/cors");
const validation_1 = require("./middleware/validation");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(cors_1.corsMiddleware);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(validation_1.requestLogger);
app.use(validation_1.jsonErrorHandler);
app.use('/api', routes_1.default);
app.get('/', (req, res) => {
    res.json({
        message: 'Personal Loan API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            products: {
                list: 'GET /api/produtos',
                create: 'POST /api/produtos',
            },
            simulations: {
                create: 'POST /api/simulacoes',
            },
        },
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint não encontrado',
    });
});
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Personal Loan API running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
exports.default = app;
//# sourceMappingURL=app.js.map