"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationController = void 0;
const storage_1 = require("../data/storage");
const loanCalculations_1 = require("../utils/loanCalculations");
class SimulationController {
    static simulateLoan(req, res) {
        try {
            const { productId, loanAmount, termMonths } = req.body;
            if (!productId || typeof productId !== 'string') {
                const errorResponse = {
                    success: false,
                    data: {},
                    message: 'ID do produto é obrigatório',
                };
                res.status(400).json(errorResponse);
                return;
            }
            if (!loanAmount || typeof loanAmount !== 'number' || loanAmount <= 0) {
                const errorResponse = {
                    success: false,
                    data: {},
                    message: 'Valor do empréstimo deve ser um número positivo',
                };
                res.status(400).json(errorResponse);
                return;
            }
            if (!termMonths || typeof termMonths !== 'number' || termMonths <= 0) {
                const errorResponse = {
                    success: false,
                    data: {},
                    message: 'Prazo deve ser um número positivo',
                };
                res.status(400).json(errorResponse);
                return;
            }
            const product = storage_1.Storage.getProductById(productId);
            if (!product) {
                const errorResponse = {
                    success: false,
                    data: {},
                    message: 'Produto não encontrado',
                };
                res.status(404).json(errorResponse);
                return;
            }
            if (termMonths > product.maxTermMonths) {
                const errorResponse = {
                    success: false,
                    data: {},
                    message: `Prazo máximo para este produto é ${product.maxTermMonths} meses`,
                };
                res.status(400).json(errorResponse);
                return;
            }
            const monthlyInterestRate = (0, loanCalculations_1.calculateMonthlyInterestRate)(product.annualInterestRate);
            const monthlyPayment = (0, loanCalculations_1.calculateMonthlyPayment)(loanAmount, monthlyInterestRate, termMonths);
            const totalAmount = monthlyPayment * termMonths;
            const totalInterest = totalAmount - loanAmount;
            const monthlyBreakdown = (0, loanCalculations_1.generateAmortizationSchedule)(loanAmount, monthlyPayment, monthlyInterestRate, termMonths);
            const result = {
                product,
                loanAmount,
                termMonths,
                monthlyInterestRate: Math.round(monthlyInterestRate * 10000) / 100,
                monthlyPayment: Math.round(monthlyPayment * 100) / 100,
                totalAmount: Math.round(totalAmount * 100) / 100,
                totalInterest: Math.round(totalInterest * 100) / 100,
                monthlyBreakdown,
            };
            const response = {
                success: true,
                data: result,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Error simulating loan:', error);
            const errorResponse = {
                success: false,
                data: {},
                message: 'Erro ao realizar simulação',
            };
            res.status(500).json(errorResponse);
        }
    }
}
exports.SimulationController = SimulationController;
//# sourceMappingURL=simulationController.js.map