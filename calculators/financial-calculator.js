class FinancialCalculator extends EngineeringCalculator {
    constructor() {
        super();
        this.initializeElements();
        this.setupCalculationTypes();
    }

    initializeElements() {
        // Input elements
        this.principalInput = document.getElementById('principalInput');
        this.rateInput = document.getElementById('rateInput');
        this.timeInput = document.getElementById('timeInput');
        this.paymentInput = document.getElementById('paymentInput');
        this.futureValueInput = document.getElementById('futureValueInput');
        
        // Select elements
        this.calculationType = document.getElementById('calculationType');
        this.compoundingFrequency = document.getElementById('compoundingFrequency');
        this.paymentFrequency = document.getElementById('paymentFrequency');
        
        // Results
        this.resultsContainer = document.getElementById('resultsContainer');
        this.amortizationTable = document.getElementById('amortizationTable');
        this.chartContainer = document.getElementById('chartContainer');
        
        this.setupAdditionalListeners();
    }

    setupCalculationTypes() {
        this.calculationTypes = {
            compound: {
                name: 'Compound Interest',
                description: 'Calculate compound interest and future value',
                method: this.calculateCompoundInterest.bind(this)
            },
            loan: {
                name: 'Loan Payment',
                description: 'Calculate loan payments and amortization schedule',
                method: this.calculateLoanPayment.bind(this)
            },
            mortgage: {
                name: 'Mortgage',
                description: 'Calculate mortgage payments and total cost',
                method: this.calculateMortgage.bind(this)
            },
            investment: {
                name: 'Investment Returns',
                description: 'Calculate investment returns with regular contributions',
                method: this.calculateInvestment.bind(this)
            },
            savings: {
                name: 'Savings Goal',
                description: 'Calculate required savings for a future goal',
                method: this.calculateSavingsGoal.bind(this)
            }
        };

        this.frequencies = {
            1: 'Annually',
            2: 'Semi-annually',
            4: 'Quarterly',
            12: 'Monthly',
            24: 'Semi-monthly',
            26: 'Bi-weekly',
            52: 'Weekly',
            365: 'Daily'
        };

        this.populateSelects();
    }

    setupAdditionalListeners() {
        // Calculate on input change
        const inputs = [
            this.principalInput, this.rateInput, 
            this.timeInput, this.paymentInput,
            this.futureValueInput
        ];

        inputs.forEach(input => {
            input?.addEventListener('input', () => this.validateNumericInput(input));
        });

        // Calculate on type change
        this.calculationType?.addEventListener('change', () => {
            this.updateInputVisibility();
            this.calculate();
        });

        // Calculate on frequency change
        [this.compoundingFrequency, this.paymentFrequency].forEach(select => {
            select?.addEventListener('change', () => this.calculate());
        });
    }

    populateSelects() {
        // Populate calculation types
        if (this.calculationType) {
            Object.entries(this.calculationTypes).forEach(([value, type]) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = type.name;
                this.calculationType.appendChild(option);
            });
        }

        // Populate frequencies
        [this.compoundingFrequency, this.paymentFrequency].forEach(select => {
            if (select) {
                Object.entries(this.frequencies).forEach(([value, name]) => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = name;
                    select.appendChild(option);
                });
            }
        });
    }

    updateInputVisibility() {
        const type = this.calculationType.value;
        const inputs = {
            principal: true,
            rate: true,
            time: true,
            payment: ['loan', 'mortgage', 'investment'].includes(type),
            futureValue: ['savings'].includes(type)
        };

        Object.entries(inputs).forEach(([input, visible]) => {
            const element = document.getElementById(`${input}Input`);
            const container = element?.closest('.input-group');
            if (container) {
                container.style.display = visible ? 'flex' : 'none';
            }
        });
    }

    calculate() {
        try {
            const type = this.calculationType.value;
            const calculator = this.calculationTypes[type].method;
            const result = calculator();
            
            this.displayResults(result);
            this.updateCharts(result);
            this.addToHistory(type, result);

        } catch (error) {
            this.showError(error.message);
        }
    }

    calculateCompoundInterest() {
        const P = this.validatePositiveInput(this.principalInput.value, 'Principal');
        const r = this.validatePositiveInput(this.rateInput.value, 'Rate') / 100;
        const t = this.validatePositiveInput(this.timeInput.value, 'Time');
        const n = parseInt(this.compoundingFrequency.value);

        const A = P * Math.pow(1 + r/n, n*t);
        const I = A - P;

        return {
            futureValue: A,
            totalInterest: I,
            principal: P,
            rate: r,
            time: t,
            frequency: n
        };
    }

    calculateLoanPayment() {
        const P = this.validatePositiveInput(this.principalInput.value, 'Principal');
        const r = this.validatePositiveInput(this.rateInput.value, 'Rate') / 100 / 12;
        const t = this.validatePositiveInput(this.timeInput.value, 'Time') * 12;

        const payment = P * (r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1);
        const schedule = this.generateAmortizationSchedule(P, r, t, payment);

        return {
            payment,
            totalInterest: schedule.totalInterest,
            totalPaid: schedule.totalPaid,
            schedule: schedule.schedule,
            principal: P,
            rate: r * 12,
            time: t / 12
        };
    }

    calculateMortgage() {
        const result = this.calculateLoanPayment();
        const downPayment = this.validatePositiveInput(this.paymentInput.value, 'Down Payment');
        
        return {
            ...result,
            downPayment,
            loanToValue: ((result.principal - downPayment) / result.principal) * 100
        };
    }

    calculateInvestment() {
        const P = this.validatePositiveInput(this.principalInput.value, 'Principal');
        const r = this.validatePositiveInput(this.rateInput.value, 'Rate') / 100;
        const t = this.validatePositiveInput(this.timeInput.value, 'Time');
        const PMT = this.validatePositiveInput(this.paymentInput.value, 'Payment');
        const n = parseInt(this.paymentFrequency.value);

        const rPer = r/n;
        const nPer = n*t;

        const A = P * Math.pow(1 + rPer, nPer) + 
                 PMT * ((Math.pow(1 + rPer, nPer) - 1) / rPer);

        return {
            futureValue: A,
            totalContributions: P + (PMT * nPer),
            totalInterest: A - (P + (PMT * nPer)),
            principal: P,
            payment: PMT,
            rate: r,
            time: t
        };
    }

    calculateSavingsGoal() {
        const FV = this.validatePositiveInput(this.futureValueInput.value, 'Future Value');
        const r = this.validatePositiveInput(this.rateInput.value, 'Rate') / 100;
        const t = this.validatePositiveInput(this.timeInput.value, 'Time');
        const n = parseInt(this.paymentFrequency.value);

        const rPer = r/n;
        const nPer = n*t;

        const PMT = FV / ((Math.pow(1 + rPer, nPer) - 1) / rPer);

        return {
            requiredPayment: PMT,
            totalContributions: PMT * nPer,
            futureValue: FV,
            rate: r,
            time: t
        };
    }

    generateAmortizationSchedule(principal, rate, periods, payment) {
        let balance = principal;
        let totalInterest = 0;
        let totalPaid = 0;
        const schedule = [];

        for (let period = 1; period <= periods; period++) {
            const interest = balance * rate;
            const principal = payment - interest;
            balance -= principal;
            totalInterest += interest;
            totalPaid += payment;

            schedule.push({
                period,
                payment,
                principal,
                interest,
                totalInterest,
                balance: Math.max(0, balance)
            });
        }

        return { schedule, totalInterest, totalPaid };
    }

    displayResults(result) {
        if (!this.resultsContainer) return;

        let html = '<div class="results-summary">';
        
        switch (this.calculationType.value) {
            case 'compound':
                html += `
                    <h4>Compound Interest Results</h4>
                    <div class="result-item">
                        <span>Future Value:</span>
                        <span class="value">$${this.formatMoney(result.futureValue)}</span>
                    </div>
                    <div class="result-item">
                        <span>Total Interest:</span>
                        <span class="value">$${this.formatMoney(result.totalInterest)}</span>
                    </div>
                    <div class="result-item">
                        <span>Interest Rate:</span>
                        <span class="value">${(result.rate * 100).toFixed(2)}%</span>
                    </div>
                `;
                break;

            case 'loan':
            case 'mortgage':
                html += `
                    <h4>${this.calculationType.value === 'loan' ? 'Loan' : 'Mortgage'} Results</h4>
                    <div class="result-item">
                        <span>Monthly Payment:</span>
                        <span class="value">$${this.formatMoney(result.payment)}</span>
                    </div>
                    <div class="result-item">
                        <span>Total Interest:</span>
                        <span class="value">$${this.formatMoney(result.totalInterest)}</span>
                    </div>
                    <div class="result-item">
                        <span>Total Amount Paid:</span>
                        <span class="value">$${this.formatMoney(result.totalPaid)}</span>
                    </div>
                `;
                this.displayAmortizationSchedule(result.schedule);
                break;

            case 'investment':
                html += `
                    <h4>Investment Results</h4>
                    <div class="result-item">
                        <span>Future Value:</span>
                        <span class="value">$${this.formatMoney(result.futureValue)}</span>
                    </div>
                    <div class="result-item">
                        <span>Total Contributions:</span>
                        <span class="value">$${this.formatMoney(result.totalContributions)}</span>
                    </div>
                    <div class="result-item">
                        <span>Total Interest Earned:</span>
                        <span class="value">$${this.formatMoney(result.totalInterest)}</span>
                    </div>
                `;
                break;

            case 'savings':
                html += `
                    <h4>Savings Goal Results</h4>
                    <div class="result-item">
                        <span>Required Monthly Payment:</span>
                        <span class="value">$${this.formatMoney(result.requiredPayment)}</span>
                    </div>
                    <div class="result-item">
                        <span>Total Contributions:</span>
                        <span class="value">$${this.formatMoney(result.totalContributions)}</span>
                    </div>
                    <div class="result-item">
                        <span>Goal Amount:</span>
                        <span class="value">$${this.formatMoney(result.futureValue)}</span>
                    </div>
                `;
                break;
        }

        html += '</div>';
        this.resultsContainer.innerHTML = html;
    }

    displayAmortizationSchedule(schedule) {
        if (!this.amortizationTable) return;

        let html = `
            <h4>Amortization Schedule</h4>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Payment</th>
                            <th>Principal</th>
                            <th>Interest</th>
                            <th>Total Interest</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        schedule.forEach(row => {
            html += `
                <tr>
                    <td>${row.period}</td>
                    <td>$${this.formatMoney(row.payment)}</td>
                    <td>$${this.formatMoney(row.principal)}</td>
                    <td>$${this.formatMoney(row.interest)}</td>
                    <td>$${this.formatMoney(row.totalInterest)}</td>
                    <td>$${this.formatMoney(row.balance)}</td>
                </tr>
            `;
        });

        html += '</tbody></table></div>';
        this.amortizationTable.innerHTML = html;
    }

    updateCharts(result) {
        if (!this.chartContainer || !window.Chart) return;

        // Clear previous charts
        this.chartContainer.innerHTML = '<canvas id="financeChart"></canvas>';
        const ctx = document.getElementById('financeChart');

        let chartData;
        switch (this.calculationType.value) {
            case 'compound':
            case 'investment':
                chartData = {
                    labels: ['Principal', 'Interest'],
                    datasets: [{
                        data: [result.principal, result.totalInterest],
                        backgroundColor: ['#36a2eb', '#ff6384']
                    }]
                };
                break;

            case 'loan':
            case 'mortgage':
                chartData = {
                    labels: result.schedule.map(row => row.period),
                    datasets: [{
                        label: 'Balance',
                        data: result.schedule.map(row => row.balance),
                        borderColor: '#36a2eb',
                        fill: false
                    }, {
                        label: 'Total Interest',
                        data: result.schedule.map(row => row.totalInterest),
                        borderColor: '#ff6384',
                        fill: false
                    }]
                };
                break;

            case 'savings':
                chartData = {
                    labels: ['Required Savings', 'Goal Amount'],
                    datasets: [{
                        data: [result.totalContributions, result.futureValue],
                        backgroundColor: ['#36a2eb', '#ff6384']
                    }]
                };
                break;
        }

        new Chart(ctx, {
            type: this.calculationType.value === 'compound' || this.calculationType.value === 'savings' ? 'pie' : 'line',
            data: chartData,
            options: {
                responsive: true
            }
        });
    }

    formatMoney(amount) {
        return amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    reset() {
        const inputs = [
            this.principalInput, this.rateInput,
            this.timeInput, this.paymentInput,
            this.futureValueInput
        ];

        inputs.forEach(input => {
            if (input) input.value = '';
        });

        if (this.resultsContainer) this.resultsContainer.innerHTML = '';
        if (this.amortizationTable) this.amortizationTable.innerHTML = '';
        if (this.chartContainer) this.chartContainer.innerHTML = '';
        
        this.hideError();
    }

    addToHistory(type, result) {
        const historyEntry = {
            timestamp: new Date().toISOString(),
            type: `Financial Calculation (${this.calculationTypes[type].name})`,
            details: this.getResultSummary(type, result)
        };

        super.addToHistory(historyEntry);
    }

    getResultSummary(type, result) {
        switch (type) {
            case 'compound':
                return `Future Value: $${this.formatMoney(result.futureValue)}`;
            case 'loan':
            case 'mortgage':
                return `Monthly Payment: $${this.formatMoney(result.payment)}`;
            case 'investment':
                return `Future Value: $${this.formatMoney(result.futureValue)}`;
            case 'savings':
                return `Required Payment: $${this.formatMoney(result.requiredPayment)}`;
            default:
                return '';
        }
    }
}

// Initialize calculator when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.financialCalculator = new FinancialCalculator();
}); 