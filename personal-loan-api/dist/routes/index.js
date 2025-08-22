"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const simulationController_1 = require("../controllers/simulationController");
const router = (0, express_1.Router)();
router.get('/produtos', productController_1.ProductController.getProducts);
router.post('/produtos', productController_1.ProductController.createProduct);
router.post('/simulacoes', simulationController_1.SimulationController.simulateLoan);
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Personal Loan API is running',
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map