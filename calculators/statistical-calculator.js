class StatisticalCalculator extends EngineeringCalculator {
    constructor() {
        super();
        this.initializeElements();
        this.setupCalculationTypes();
    }

    initializeElements() {
        // Input elements
        this.dataInput = document.getElementById('dataInput');
        this.dataList = document.getElementById('dataList');
        this.calculationType = document.getElementById('statCalcType');
        
        // Results elements
        this.resultsContainer = document.getElementById('statsResults');
        this.visualContainer = document.getElementById('statsVisuals');
        this.distributionContainer = document.getElementById('distributionResults');
        
        this.currentData = [];
        this.setupAdditionalListeners();
    }

    setupCalculationTypes() {
        this.calculationTypes = {
            descriptive: {
                name: 'Descriptive Statistics',
                description: 'Calculate basic statistical measures',
                method: this.calculateDescriptiveStats.bind(this)
            },
            correlation: {
                name: 'Correlation Analysis',
                description: 'Calculate correlation between two datasets',
                method: this.calculateCorrelation.bind(this)
            },
            regression: {
                name: 'Regression Analysis',
                description: 'Perform linear regression analysis',
                method: this.calculateRegression.bind(this)
            },
            probability: {
                name: 'Probability Distribution',
                description: 'Calculate probability distributions',
                method: this.calculateProbability.bind(this)
            },
            hypothesis: {
                name: 'Hypothesis Testing',
                description: 'Perform basic hypothesis tests',
                method: this.performHypothesisTest.bind(this)
            }
        };

        this.populateSelects();
    }

    setupAdditionalListeners() {
        // Process data input
        this.dataInput?.addEventListener('input', () => {
            this.processDataInput();
        });

        // Calculate on type change
        this.calculationType?.addEventListener('change', () => {
            this.calculate();
        });

        // Add export functionality
        document.getElementById('exportStats')?.addEventListener('click', () => {
            this.exportResults();
        });
    }

    populateSelects() {
        if (!this.calculationType) return;

        Object.entries(this.calculationTypes).forEach(([value, type]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = type.name;
            this.calculationType.appendChild(option);
        });
    }

    processDataInput() {
        try {
            const input = this.dataInput.value;
            this.currentData = input.split(/[,\n\t]/)
                .map(x => x.trim())
                .filter(x => x !== '')
                .map(x => {
                    const num = parseFloat(x);
                    if (isNaN(num)) throw new Error('Invalid numeric input');
                    return num;
                });

            this.updateDataList();
            this.calculate();
        } catch (error) {
            this.showError('Please enter valid numeric data separated by commas, newlines, or tabs');
        }
    }

    updateDataList() {
        if (!this.dataList) return;

        const html = this.currentData.map((value, index) => `
            <div class="data-item">
                <span class="data-index">${index + 1}</span>
                <span class="data-value">${value}</span>
                <button class="btn btn-sm btn-danger" onclick="statisticalCalculator.removeDataPoint(${index})">×</button>
            </div>
        `).join('');

        this.dataList.innerHTML = html;
    }

    removeDataPoint(index) {
        this.currentData.splice(index, 1);
        this.updateDataList();
        this.calculate();
    }

    calculate() {
        try {
            if (this.currentData.length === 0) {
                this.showError('Please enter some data to analyze');
                return;
            }

            const type = this.calculationType.value;
            const calculator = this.calculationTypes[type].method;
            const result = calculator();
            
            this.displayResults(result);
            this.updateVisualizations(result);
            this.addToHistory(type, result);

        } catch (error) {
            this.showError(error.message);
        }
    }

    calculateDescriptiveStats() {
        const n = this.currentData.length;
        const sorted = [...this.currentData].sort((a, b) => a - b);
        const sum = sorted.reduce((a, b) => a + b, 0);
        const mean = sum / n;
        
        // Calculate variance and standard deviation
        const squaredDiffs = sorted.map(x => Math.pow(x - mean, 2));
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (n - 1);
        const stdDev = Math.sqrt(variance);

        // Calculate median
        const median = n % 2 === 0 
            ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
            : sorted[Math.floor(n/2)];

        // Calculate mode
        const frequencies = {};
        sorted.forEach(x => frequencies[x] = (frequencies[x] || 0) + 1);
        const maxFreq = Math.max(...Object.values(frequencies));
        const mode = Object.entries(frequencies)
            .filter(([, freq]) => freq === maxFreq)
            .map(([value]) => parseFloat(value));

        // Calculate quartiles
        const q1 = this.calculatePercentile(sorted, 25);
        const q3 = this.calculatePercentile(sorted, 75);
        const iqr = q3 - q1;

        return {
            n,
            min: sorted[0],
            max: sorted[n - 1],
            range: sorted[n - 1] - sorted[0],
            sum,
            mean,
            median,
            mode,
            variance,
            stdDev,
            q1,
            q2: median,
            q3,
            iqr,
            skewness: this.calculateSkewness(sorted, mean, stdDev),
            kurtosis: this.calculateKurtosis(sorted, mean, stdDev)
        };
    }

    calculateCorrelation() {
        if (this.currentData.length % 2 !== 0) {
            throw new Error('Need an even number of data points for correlation analysis');
        }

        const n = this.currentData.length / 2;
        const x = this.currentData.slice(0, n);
        const y = this.currentData.slice(n);

        const meanX = x.reduce((a, b) => a + b, 0) / n;
        const meanY = y.reduce((a, b) => a + b, 0) / n;

        let sumXY = 0, sumX2 = 0, sumY2 = 0;
        for (let i = 0; i < n; i++) {
            const diffX = x[i] - meanX;
            const diffY = y[i] - meanY;
            sumXY += diffX * diffY;
            sumX2 += diffX * diffX;
            sumY2 += diffY * diffY;
        }

        const r = sumXY / Math.sqrt(sumX2 * sumY2);
        const rSquared = r * r;

        return {
            correlation: r,
            rSquared,
            n,
            x,
            y,
            meanX,
            meanY
        };
    }

    calculateRegression() {
        const result = this.calculateCorrelation();
        const { x, y, meanX, meanY, n } = result;

        let sumXY = 0, sumX2 = 0;
        for (let i = 0; i < n; i++) {
            sumXY += (x[i] - meanX) * (y[i] - meanY);
            sumX2 += Math.pow(x[i] - meanX, 2);
        }

        const slope = sumXY / sumX2;
        const intercept = meanY - slope * meanX;

        // Calculate predicted values and residuals
        const predicted = x.map(xi => slope * xi + intercept);
        const residuals = y.map((yi, i) => yi - predicted[i]);

        return {
            ...result,
            slope,
            intercept,
            equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
            predicted,
            residuals,
            residualStdError: Math.sqrt(residuals.reduce((a, b) => a + b * b, 0) / (n - 2))
        };
    }

    calculateProbability() {
        const stats = this.calculateDescriptiveStats();
        const { mean, stdDev } = stats;

        // Calculate normal distribution probabilities
        const zScores = this.currentData.map(x => (x - mean) / stdDev);
        const probabilities = zScores.map(z => this.normalCDF(z));

        return {
            ...stats,
            zScores,
            probabilities,
            normalDistribution: {
                mean,
                stdDev,
                variance: stdDev * stdDev
            }
        };
    }

    performHypothesisTest() {
        const stats = this.calculateDescriptiveStats();
        const { mean, stdDev, n } = stats;

        // Perform one-sample t-test (comparing to hypothetical mean of 0)
        const tStat = mean / (stdDev / Math.sqrt(n));
        const degreesOfFreedom = n - 1;
        const pValue = 2 * (1 - this.studentTCDF(Math.abs(tStat), degreesOfFreedom));

        return {
            ...stats,
            hypothesisTest: {
                testType: 'One-sample t-test',
                nullHypothesis: 'μ = 0',
                alternativeHypothesis: 'μ ≠ 0',
                tStatistic: tStat,
                degreesOfFreedom,
                pValue,
                significant: pValue < 0.05
            }
        };
    }

    calculatePercentile(sorted, p) {
        const index = (p / 100) * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }

    calculateSkewness(data, mean, stdDev) {
        const n = data.length;
        const m3 = data.reduce((acc, x) => acc + Math.pow(x - mean, 3), 0) / n;
        return m3 / Math.pow(stdDev, 3);
    }

    calculateKurtosis(data, mean, stdDev) {
        const n = data.length;
        const m4 = data.reduce((acc, x) => acc + Math.pow(x - mean, 4), 0) / n;
        return m4 / Math.pow(stdDev, 4) - 3;
    }

    normalCDF(z) {
        const t = 1 / (1 + 0.2316419 * Math.abs(z));
        const d = 0.3989423 * Math.exp(-z * z / 2);
        const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return z > 0 ? 1 - p : p;
    }

    studentTCDF(t, df) {
        const x = df / (df + t * t);
        let p = 0.5;
        
        if (t > 0) {
            p = 1 - 0.5 * this.incompleteBeta(x, df/2, 0.5);
        } else {
            p = 0.5 * this.incompleteBeta(x, df/2, 0.5);
        }
        
        return p;
    }

    incompleteBeta(x, a, b) {
        const maxIterations = 100;
        const epsilon = 1e-8;
        
        if (x === 0) return 0;
        if (x === 1) return 1;
        
        const lnBeta = this.logGamma(a + b) - this.logGamma(a) - this.logGamma(b);
        
        let sum = 1;
        let term = 1;
        let n = 1;
        
        while (Math.abs(term) > epsilon && n < maxIterations) {
            term *= (n - 1 + a) * x / n;
            sum += term;
            n++;
        }
        
        return Math.exp(Math.log(sum) + a * Math.log(x) + b * Math.log(1 - x) - lnBeta) / a;
    }

    logGamma(x) {
        const p = [676.5203681218851, -1259.1392167224028, 771.32342877765313,
                   -176.61502916214059, 12.507343278686905, -0.13857109526572012,
                   9.9843695780195716e-6, 1.5056327351493116e-7];
        
        let g = 7;
        if (x < 0.5) {
            return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * x)) - this.logGamma(1 - x);
        }
        
        x -= 1;
        let a = 0.99999999999980993;
        for (let i = 0; i < p.length; i++) {
            a += p[i] / (x + i + 1);
        }
        
        let t = x + g + 0.5;
        return Math.log(2 * Math.PI) / 2 + Math.log(a) - t + (x + 0.5) * Math.log(t);
    }

    displayResults(result) {
        if (!this.resultsContainer) return;

        let html = '<div class="results-summary">';
        
        switch (this.calculationType.value) {
            case 'descriptive':
                html += `
                    <h4>Descriptive Statistics</h4>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <tr><td>Count (n)</td><td>${result.n}</td></tr>
                            <tr><td>Mean</td><td>${result.mean.toFixed(4)}</td></tr>
                            <tr><td>Median</td><td>${result.median.toFixed(4)}</td></tr>
                            <tr><td>Mode</td><td>${result.mode.join(', ')}</td></tr>
                            <tr><td>Standard Deviation</td><td>${result.stdDev.toFixed(4)}</td></tr>
                            <tr><td>Variance</td><td>${result.variance.toFixed(4)}</td></tr>
                            <tr><td>Range</td><td>${result.range.toFixed(4)}</td></tr>
                            <tr><td>Minimum</td><td>${result.min.toFixed(4)}</td></tr>
                            <tr><td>Maximum</td><td>${result.max.toFixed(4)}</td></tr>
                            <tr><td>Q1 (25th Percentile)</td><td>${result.q1.toFixed(4)}</td></tr>
                            <tr><td>Q3 (75th Percentile)</td><td>${result.q3.toFixed(4)}</td></tr>
                            <tr><td>IQR</td><td>${result.iqr.toFixed(4)}</td></tr>
                            <tr><td>Skewness</td><td>${result.skewness.toFixed(4)}</td></tr>
                            <tr><td>Kurtosis</td><td>${result.kurtosis.toFixed(4)}</td></tr>
                        </table>
                    </div>
                `;
                break;

            case 'correlation':
                html += `
                    <h4>Correlation Analysis</h4>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <tr><td>Correlation Coefficient (r)</td><td>${result.correlation.toFixed(4)}</td></tr>
                            <tr><td>Coefficient of Determination (r²)</td><td>${result.rSquared.toFixed(4)}</td></tr>
                            <tr><td>Sample Size (n)</td><td>${result.n}</td></tr>
                            <tr><td>Mean X</td><td>${result.meanX.toFixed(4)}</td></tr>
                            <tr><td>Mean Y</td><td>${result.meanY.toFixed(4)}</td></tr>
                        </table>
                    </div>
                `;
                break;

            case 'regression':
                html += `
                    <h4>Regression Analysis</h4>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <tr><td>Regression Equation</td><td>${result.equation}</td></tr>
                            <tr><td>Slope</td><td>${result.slope.toFixed(4)}</td></tr>
                            <tr><td>Intercept</td><td>${result.intercept.toFixed(4)}</td></tr>
                            <tr><td>R-squared</td><td>${result.rSquared.toFixed(4)}</td></tr>
                            <tr><td>Residual Standard Error</td><td>${result.residualStdError.toFixed(4)}</td></tr>
                        </table>
                    </div>
                `;
                break;

            case 'probability':
                html += `
                    <h4>Probability Distribution</h4>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Value</th>
                                    <th>Z-Score</th>
                                    <th>Probability</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${result.currentData.map((value, i) => `
                                    <tr>
                                        <td>${value.toFixed(4)}</td>
                                        <td>${result.zScores[i].toFixed(4)}</td>
                                        <td>${result.probabilities[i].toFixed(4)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
                break;

            case 'hypothesis':
                html += `
                    <h4>Hypothesis Test Results</h4>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <tr><td>Test Type</td><td>${result.hypothesisTest.testType}</td></tr>
                            <tr><td>Null Hypothesis</td><td>${result.hypothesisTest.nullHypothesis}</td></tr>
                            <tr><td>Alternative Hypothesis</td><td>${result.hypothesisTest.alternativeHypothesis}</td></tr>
                            <tr><td>T-Statistic</td><td>${result.hypothesisTest.tStatistic.toFixed(4)}</td></tr>
                            <tr><td>Degrees of Freedom</td><td>${result.hypothesisTest.degreesOfFreedom}</td></tr>
                            <tr><td>P-Value</td><td>${result.hypothesisTest.pValue.toFixed(4)}</td></tr>
                            <tr><td>Significant at α = 0.05</td><td>${result.hypothesisTest.significant ? 'Yes' : 'No'}</td></tr>
                        </table>
                    </div>
                `;
                break;
        }

        html += '</div>';
        this.resultsContainer.innerHTML = html;
    }

    updateVisualizations(result) {
        if (!this.visualContainer || !window.Chart) return;

        // Clear previous charts
        this.visualContainer.innerHTML = '<canvas id="statsChart"></canvas>';
        const ctx = document.getElementById('statsChart');

        let chartConfig;
        switch (this.calculationType.value) {
            case 'descriptive':
                chartConfig = {
                    type: 'box',
                    data: {
                        datasets: [{
                            data: this.currentData,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true
                    }
                };
                break;

            case 'correlation':
            case 'regression':
                chartConfig = {
                    type: 'scatter',
                    data: {
                        datasets: [{
                            label: 'Data Points',
                            data: result.x.map((x, i) => ({ x, y: result.y[i] })),
                            backgroundColor: 'rgba(54, 162, 235, 0.5)'
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: { type: 'linear', position: 'bottom' }
                        }
                    }
                };

                if (this.calculationType.value === 'regression') {
                    chartConfig.data.datasets.push({
                        label: 'Regression Line',
                        data: result.x.map(x => ({
                            x,
                            y: result.slope * x + result.intercept
                        })),
                        type: 'line',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: false
                    });
                }
                break;

            case 'probability':
                chartConfig = {
                    type: 'line',
                    data: {
                        labels: result.currentData.map(x => x.toFixed(2)),
                        datasets: [{
                            label: 'Normal Distribution',
                            data: result.probabilities,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            fill: false
                        }]
                    },
                    options: {
                        responsive: true
                    }
                };
                break;
        }

        if (chartConfig) {
            new Chart(ctx, chartConfig);
        }
    }

    exportResults() {
        const type = this.calculationType.value;
        const result = this.calculationTypes[type].method();
        
        const data = {
            type,
            timestamp: new Date().toISOString(),
            data: this.currentData,
            results: result
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `statistical-analysis-${type}-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    reset() {
        if (this.dataInput) this.dataInput.value = '';
        if (this.dataList) this.dataList.innerHTML = '';
        if (this.resultsContainer) this.resultsContainer.innerHTML = '';
        if (this.visualContainer) this.visualContainer.innerHTML = '';
        
        this.currentData = [];
        this.hideError();
    }

    addToHistory(type, result) {
        const historyEntry = {
            timestamp: new Date().toISOString(),
            type: `Statistical Analysis (${this.calculationTypes[type].name})`,
            data: this.currentData.slice(0, 5),
            summary: this.getResultSummary(type, result)
        };

        super.addToHistory(historyEntry);
    }

    getResultSummary(type, result) {
        switch (type) {
            case 'descriptive':
                return `n=${result.n}, mean=${result.mean.toFixed(2)}, sd=${result.stdDev.toFixed(2)}`;
            case 'correlation':
                return `r=${result.correlation.toFixed(4)}, r²=${result.rSquared.toFixed(4)}`;
            case 'regression':
                return result.equation;
            case 'probability':
                return `mean=${result.mean.toFixed(2)}, sd=${result.stdDev.toFixed(2)}`;
            case 'hypothesis':
                return `p-value=${result.hypothesisTest.pValue.toFixed(4)}`;
            default:
                return '';
        }
    }
}

// Initialize calculator when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.statisticalCalculator = new StatisticalCalculator();
}); 