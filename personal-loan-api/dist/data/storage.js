"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
class Storage {
    static getAllProducts() {
        return [...this.products];
    }
    static getProductById(id) {
        return this.products.find(product => product.id === id);
    }
    static addProduct(product) {
        const newProduct = {
            ...product,
            id: Date.now().toString(),
            createdAt: new Date(),
        };
        this.products.push(newProduct);
        return newProduct;
    }
    static getProductCount() {
        return this.products.length;
    }
    static reset() {
        this.products = [
            {
                id: '1',
                name: 'Empréstimo Pessoal',
                annualInterestRate: 18.5,
                maxTermMonths: 60,
                createdAt: new Date('2024-01-01'),
            },
            {
                id: '2',
                name: 'Crédito Consignado',
                annualInterestRate: 12.8,
                maxTermMonths: 84,
                createdAt: new Date('2024-01-01'),
            },
            {
                id: '3',
                name: 'Financiamento Imobiliário',
                annualInterestRate: 9.2,
                maxTermMonths: 360,
                createdAt: new Date('2024-01-01'),
            },
        ];
    }
}
exports.Storage = Storage;
Storage.products = [
    {
        id: '1',
        name: 'Empréstimo Pessoal',
        annualInterestRate: 18.5,
        maxTermMonths: 60,
        createdAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        name: 'Crédito Consignado',
        annualInterestRate: 12.8,
        maxTermMonths: 84,
        createdAt: new Date('2024-01-01'),
    },
    {
        id: '3',
        name: 'Financiamento Imobiliário',
        annualInterestRate: 9.2,
        maxTermMonths: 360,
        createdAt: new Date('2024-01-01'),
    },
];
//# sourceMappingURL=storage.js.map