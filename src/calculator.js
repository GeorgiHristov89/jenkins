/**
 * Demo business logic module
 */

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new Error("Division by zero is not allowed");
    }
    return a / b;
}

function calculateDiscount(price, percentage) {
    if (price < 0 || percentage < 0 || percentage > 100) {
        throw new Error("Invalid price or discount percentage");
    }
    return price - (price * (percentage / 100));
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

module.exports = {
    add,
    subtract,
    multiply,
    divide,
    calculateDiscount,
    validateEmail
};
