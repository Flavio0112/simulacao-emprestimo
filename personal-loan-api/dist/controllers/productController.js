"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const storage_1 = require("../data/storage");
class ProductController {
    static getProducts(req, res) {
        try {
            const products = storage_1.Storage.getAllProducts();
            const response = {
                success: true,
                data: products,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Error getting products:', error);
            const errorResponse = {
                success: false,
                data: [],
                message: 'Erro ao carregar produtos',
            };
            res.status(500).json(errorResponse);
        }
    }
    static createProduct(req, res) {
        try {
            const { name, annualInterestRate, maxTermMonths } = req.body;
            if (!name || typeof name !== 'string') {
                const errorResponse = {
                    success: false,
                    data: {},
                    message: 'Nome do produto é obrigatório',
                };
                res.status(400).json(errorResponse);
                return;
            }
            if (!annualInterestRate || typeof annualInterestRate !== 'number' || annualInterestRate <= 0) {
                const errorResponse = {
                    success: false,
                    data: {},
                    message: 'Taxa de juros anual deve ser um número positivo',
                };
                res.status(400).json(errorResponse);
                return;
            }
            if (!maxTermMonths || typeof maxTermMonths !== 'number' || maxTermMonths <= 0) {
                const errorResponse = {
                    success: false,
                    data: {},
                    message: 'Prazo máximo deve ser um número positivo',
                };
                res.status(400).json(errorResponse);
                return;
            }
            const newProduct = storage_1.Storage.addProduct({
                name: name.trim(),
                annualInterestRate,
                maxTermMonths,
            });
            const response = {
                success: true,
                data: newProduct,
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Error creating product:', error);
            const errorResponse = {
                success: false,
                data: {},
                message: 'Erro ao criar produto',
            };
            res.status(500).json(errorResponse);
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=productController.js.map