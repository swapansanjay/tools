class ScientificCalculator extends EngineeringCalculator {
    constructor() {
        super();
        this.initializeElements();
        this.setupOperations();
    }

    initializeElements() {
        // Display elements
        this.display = document.getElementById('calcDisplay');
        this.historyDisplay = document.getElementById('calcHistory');
        this.expressionDisplay = document.getElementById('expressionDisplay');
        
        // Mode switches
        this.degRadSwitch = document.getElementById('degRadSwitch');
        this.inverseSwitch = document.getElementById('inverseSwitch');
        this.hypSwitch = document.getElementById('hypSwitch');
        
        this.memory = 0;
        this.lastAnswer = 0;
        this.currentExpression = '';
        this.isInverse = false;
        this.isHyperbolic = false;
        
        this.setupAdditionalListeners();
    }

    setupOperations() {
        this.operations = {
            basic: {
                add: (a, b) => a + b,
                subtract: (a, b) => a - b,
                multiply: (a, b) => a * b,
                divide: (a, b) => b !== 0 ? a / b : this.showError('Division by zero'),
                mod: (a, b) => a % b,
                power: (a, b) => Math.pow(a, b)
            },
            scientific: {
                sqrt: x => x >= 0 ? Math.sqrt(x) : this.showError('Invalid input for square root'),
                cbrt: x => Math.cbrt(x),
                exp: x => Math.exp(x),
                ln: x => x > 0 ? Math.log(x) : this.showError('Invalid input for natural logarithm'),
                log10: x => x > 0 ? Math.log10(x) : this.showError('Invalid input for logarithm'),
                log2: x => x > 0 ? Math.log2(x) : this.showError('Invalid input for logarithm'),
                factorial: x => this.calculateFactorial(x)
            },
            trigonometric: {
                sin: x => Math.sin(this.toRadians(x)),
                cos: x => Math.cos(this.toRadians(x)),
                tan: x => Math.tan(this.toRadians(x)),
                asin: x => this.fromRadians(Math.asin(x)),
                acos: x => this.fromRadians(Math.acos(x)),
                atan: x => this.fromRadians(Math.atan(x))
            },
            hyperbolic: {
                sinh: x => Math.sinh(x),
                cosh: x => Math.cosh(x),
                tanh: x => Math.tanh(x),
                asinh: x => Math.asinh(x),
                acosh: x => x >= 1 ? Math.acosh(x) : this.showError('Invalid input for acosh'),
                atanh: x => Math.abs(x) < 1 ? Math.atanh(x) : this.showError('Invalid input for atanh')
            },
            special: {
                abs: x => Math.abs(x),
                ceil: x => Math.ceil(x),
                floor: x => Math.floor(x),
                round: x => Math.round(x),
                sign: x => Math.sign(x)
            }
        };
    }

    setupAdditionalListeners() {
        // Keyboard input
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Mode switches
        this.degRadSwitch?.addEventListener('change', () => this.updateDisplay());
        this.inverseSwitch?.addEventListener('change', () => {
            this.isInverse = this.inverseSwitch.checked;
            this.updateButtonLabels();
        });
        this.hypSwitch?.addEventListener('change', () => {
            this.isHyperbolic = this.hypSwitch.checked;
            this.updateButtonLabels();
        });
    }

    handleKeyPress(e) {
        const key = e.key;
        
        if (/[0-9.]/.test(key)) {
            this.appendNumber(key);
        } else if (['+', '-', '*', '/', '^'].includes(key)) {
            this.appendOperator(key);
        } else if (key === 'Enter') {
            this.calculate();
        } else if (key === 'Backspace') {
            this.backspace();
        } else if (key === 'Escape') {
            this.clear();
        }
    }

    appendNumber(num) {
        if (num === '.' && this.display.value.includes('.')) return;
        this.display.value += num;
        this.currentExpression += num;
        this.updateExpressionDisplay();
    }

    appendOperator(op) {
        if (this.display.value === '') return;
        this.display.value += op;
        this.currentExpression += ` ${op} `;
        this.updateExpressionDisplay();
    }

    calculate() {
        try {
            const result = this.evaluateExpression(this.currentExpression);
            this.addToHistory(this.currentExpression, result);
            this.lastAnswer = result;
            this.display.value = result;
            this.currentExpression = result.toString();
            this.updateExpressionDisplay();
        } catch (error) {
            this.showError(error.message);
        }
    }

    evaluateExpression(expr) {
        // Use Function constructor to safely evaluate mathematical expressions
        const sanitizedExpr = expr
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/log/g, 'Math.log10')
            .replace(/ln/g, 'Math.log')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E');

        return Function('"use strict";return (' + sanitizedExpr + ')')();
    }

    calculateFactorial(n) {
        if (n < 0 || !Number.isInteger(n)) {
            throw new Error('Invalid input for factorial');
        }
        if (n === 0 || n === 1) return 1;
        return n * this.calculateFactorial(n - 1);
    }

    toRadians(x) {
        return this.degRadSwitch?.checked ? x * Math.PI / 180 : x;
    }

    fromRadians(x) {
        return this.degRadSwitch?.checked ? x * 180 / Math.PI : x;
    }

    memoryOperation(op) {
        switch (op) {
            case 'MC':
                this.memory = 0;
                break;
            case 'MR':
                this.display.value = this.memory;
                break;
            case 'M+':
                this.memory += parseFloat(this.display.value) || 0;
                break;
            case 'M-':
                this.memory -= parseFloat(this.display.value) || 0;
                break;
            case 'MS':
                this.memory = parseFloat(this.display.value) || 0;
                break;
        }
    }

    updateExpressionDisplay() {
        if (this.expressionDisplay) {
            this.expressionDisplay.textContent = this.currentExpression;
        }
    }

    updateButtonLabels() {
        const trigLabels = {
            normal: ['sin', 'cos', 'tan'],
            inverse: ['asin', 'acos', 'atan'],
            hyperbolic: ['sinh', 'cosh', 'tanh'],
            hyperbolicInverse: ['asinh', 'acosh', 'atanh']
        };

        const labels = this.isHyperbolic ? 
            (this.isInverse ? trigLabels.hyperbolicInverse : trigLabels.hyperbolic) :
            (this.isInverse ? trigLabels.inverse : trigLabels.normal);

        // Update button labels
        ['sin', 'cos', 'tan'].forEach((func, i) => {
            const button = document.getElementById(`btn${func}`);
            if (button) button.textContent = labels[i];
        });
    }

    addToHistory(expression, result) {
        const historyEntry = {
            timestamp: new Date().toISOString(),
            type: 'Scientific Calculation',
            expression,
            result
        };

        super.addToHistory(historyEntry);
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        if (!this.historyDisplay) return;

        const history = this.getHistory().slice(-5);
        this.historyDisplay.innerHTML = history.map(entry => `
            <div class="history-item">
                <span class="expression">${entry.expression}</span>
                <span class="result">${entry.result}</span>
            </div>
        `).join('');
    }

    clear() {
        this.display.value = '';
        this.currentExpression = '';
        this.updateExpressionDisplay();
    }

    backspace() {
        this.display.value = this.display.value.slice(0, -1);
        this.currentExpression = this.currentExpression.slice(0, -1);
        this.updateExpressionDisplay();
    }

    useConstant(constant) {
        switch (constant) {
            case 'π':
                this.appendNumber(Math.PI);
                break;
            case 'e':
                this.appendNumber(Math.E);
                break;
            case 'ans':
                this.appendNumber(this.lastAnswer);
                break;
        }
    }
}

// Initialize calculator when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scientificCalculator = new ScientificCalculator();
}); 