const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { add, subtract, multiply, divide, calculateDiscount, validateEmail } = require('../src/calculator');

describe('Calculator & Business Logic Tests', () => {

    test('add() should correctly sum two numbers', () => {
        assert.equal(add(2, 3), 5);
        assert.equal(add(-5, 5), 0);
    });

    test('subtract() should correctly subtract numbers', () => {
        assert.equal(subtract(10, 4), 6);
        assert.equal(subtract(3, 8), -5);
    });

    test('multiply() should correctly multiply numbers', () => {
        assert.equal(multiply(4, 5), 20);
        assert.equal(multiply(-2, 3), -6);
    });

    test('divide() should correctly divide numbers', () => {
        assert.equal(divide(10, 2), 5);
    });

    test('divide() by zero should throw an Error', () => {
        assert.throws(() => divide(10, 0), {
            name: 'Error',
            message: 'Division by zero is not allowed'
        });
    });

    test('calculateDiscount() should compute discounted price', () => {
        assert.equal(calculateDiscount(100, 20), 80);
        assert.equal(calculateDiscount(50, 10), 45);
    });

    test('calculateDiscount() should throw on invalid percentage', () => {
        assert.throws(() => calculateDiscount(100, -5));
        assert.throws(() => calculateDiscount(100, 150));
    });

    test('validateEmail() should validate email formats', () => {
        assert.equal(validateEmail('test@example.com'), true);
        assert.equal(validateEmail('invalid-email'), false);
    });
});
