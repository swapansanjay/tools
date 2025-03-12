class ThermalCalculator extends EngineeringCalculator {
    constructor() {
        super();
        this.initializeElements();
    }

    initializeElements() {
        // Input elements
        this.temperatureDiffInput = document.getElementById('temperatureDiffInput');
        this.areaInput = document.getElementById('areaInput');
        this.thicknessInput = document.getElementById('thicknessInput');
        this.conductivityInput = document.getElementById('conductivityInput');
        
        // Unit selects
        this.tempUnitSelect = document.getElementById('tempUnit');
        this.areaUnitSelect = document.getElementById('areaUnit');
        this.thicknessUnitSelect = document.getElementById('thicknessUnit');
        this.conductivityUnitSelect = document.getElementById('conductivityUnit');
        this.heatFluxUnitSelect = document.getElementById('heatFluxUnit');
        
        // Results
        this.heatFluxResult = document.getElementById('heatFluxResult');
        this.totalHeatResult = document.getElementById('totalHeatResult');

        // Initialize conversion factors
        this.setupConversionFactors();
        this.setupMaterialPresets();
        this.setupAdditionalListeners();
    }

    setupConversionFactors() {
        this.temperatureConversions = {
            'K': 1,
            '°C': 1,
            '°F': 5/9
        };

        this.areaConversions = {
            'm²': 1,
            'cm²': 0.0001,
            'ft²': 0.092903,
            'in²': 0.00064516
        };

        this.thicknessConversions = {
            'm': 1,
            'cm': 0.01,
            'mm': 0.001,
            'in': 0.0254
        };

        this.conductivityConversions = {
            'W/(m·K)': 1,
            'BTU/(h·ft·°F)': 1.730735,
            'kcal/(h·m·°C)': 1.163
        };

        this.heatFluxConversions = {
            'W/m²': 1,
            'BTU/(h·ft²)': 0.176110,
            'kcal/(h·m²)': 0.859845
        };
    }

    setupMaterialPresets() {
        this.materialPresets = {
            'Copper': 385,
            'Aluminum': 205,
            'Steel (Carbon)': 43,
            'Stainless Steel': 16,
            'Concrete': 0.8,
            'Glass (Window)': 0.96,
            'Wood (Pine)': 0.12,
            'Insulation (Fiberglass)': 0.04,
            'Air': 0.024,
            'Water': 0.58
        };

        const presetSelect = document.getElementById('materialPreset');
        if (presetSelect) {
            Object.keys(this.materialPresets).forEach(material => {
                const option = document.createElement('option');
                option.value = this.materialPresets[material];
                option.textContent = material;
                presetSelect.appendChild(option);
            });

            presetSelect.addEventListener('change', () => {
                this.conductivityInput.value = presetSelect.value;
                this.calculate();
            });
        }
    }

    setupAdditionalListeners() {
        // Add change listeners for unit selects
        const unitSelects = [
            this.tempUnitSelect, this.areaUnitSelect, 
            this.thicknessUnitSelect, this.conductivityUnitSelect,
            this.heatFluxUnitSelect
        ];

        unitSelects.forEach(select => {
            select?.addEventListener('change', () => this.calculate());
        });

        // Add input validation
        const inputs = [
            this.temperatureDiffInput, this.areaInput,
            this.thicknessInput, this.conductivityInput
        ];

        inputs.forEach(input => {
            input?.addEventListener('input', () => this.validateNumericInput(input));
        });
    }

    calculate() {
        try {
            // Get and validate inputs
            const deltaT = this.validatePositiveInput(this.temperatureDiffInput.value, 'Temperature difference');
            const area = this.validatePositiveInput(this.areaInput.value, 'Area');
            const thickness = this.validatePositiveInput(this.thicknessInput.value, 'Thickness');
            const conductivity = this.validatePositiveInput(this.conductivityInput.value, 'Thermal conductivity');

            // Convert all values to SI units
            const deltaTSI = deltaT * this.temperatureConversions[this.tempUnitSelect.value];
            const areaSI = area * this.areaConversions[this.areaUnitSelect.value];
            const thicknessSI = thickness * this.thicknessConversions[this.thicknessUnitSelect.value];
            const conductivitySI = conductivity * this.conductivityConversions[this.conductivityUnitSelect.value];

            // Calculate heat flux (q = -k * dT/dx)
            const heatFlux = conductivitySI * (deltaTSI / thicknessSI);
            
            // Calculate total heat transfer (Q = q * A)
            const totalHeat = heatFlux * areaSI;

            // Display results
            this.displayResults(heatFlux, totalHeat);

            // Add to history
            this.addToHistory({
                deltaT: { value: deltaT, unit: this.tempUnitSelect.value },
                area: { value: area, unit: this.areaUnitSelect.value },
                thickness: { value: thickness, unit: this.thicknessUnitSelect.value },
                conductivity: { value: conductivity, unit: this.conductivityUnitSelect.value },
                heatFlux: { value: heatFlux, unit: 'W/m²' },
                totalHeat: { value: totalHeat, unit: 'W' }
            });

        } catch (error) {
            this.showError(error.message);
        }
    }

    displayResults(heatFlux, totalHeat) {
        // Convert heat flux to selected unit
        const convertedHeatFlux = heatFlux * this.heatFluxConversions[this.heatFluxUnitSelect.value];
        
        // Display results
        this.heatFluxResult.textContent = `${this.formatNumber(convertedHeatFlux)} ${this.heatFluxUnitSelect.value}`;
        this.totalHeatResult.textContent = `${this.formatNumber(totalHeat)} W`;

        // Display energy comparison
        this.displayEnergyComparison(totalHeat);
    }

    displayEnergyComparison(powerInWatts) {
        const comparisons = {
            'LED Bulb (10W)': 10,
            'Incandescent Bulb (60W)': 60,
            'Laptop Computer': 65,
            'Desktop Computer': 200,
            'Window AC Unit': 1500,
            'Electric Heater': 2000
        };

        const comparisonDiv = document.getElementById('energyComparison');
        if (!comparisonDiv) return;

        let html = '<h4>Power Comparison</h4><ul class="list-group">';
        
        for (const [device, power] of Object.entries(comparisons)) {
            const percentage = (powerInWatts / power) * 100;
            const colorClass = percentage > 100 ? 'danger' : 
                             percentage > 75 ? 'warning' : 'success';
            
            html += `
                <li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>${device}</span>
                        <span class="badge bg-${colorClass}">${percentage.toFixed(1)}%</span>
                    </div>
                    <div class="progress mt-1" style="height: 5px;">
                        <div class="progress-bar bg-${colorClass}" 
                             role="progressbar" 
                             style="width: ${Math.min(percentage, 100)}%">
                        </div>
                    </div>
                </li>`;
        }

        html += '</ul>';
        comparisonDiv.innerHTML = html;
    }

    reset() {
        const inputs = [
            this.temperatureDiffInput, this.areaInput,
            this.thicknessInput, this.conductivityInput
        ];

        inputs.forEach(input => input.value = '');
        
        this.heatFluxResult.textContent = '';
        this.totalHeatResult.textContent = '';
        document.getElementById('energyComparison').innerHTML = '';
        this.hideError();
    }

    addToHistory(data) {
        const historyEntry = {
            timestamp: new Date().toISOString(),
            type: 'Heat Transfer Calculation',
            input: `ΔT: ${data.deltaT.value} ${data.deltaT.unit}, A: ${data.area.value} ${data.area.unit}`,
            result: `q: ${this.formatNumber(data.heatFlux.value)} ${data.heatFlux.unit}`,
            data: data
        };

        super.addToHistory(historyEntry);
    }

    useHistoryItem(timestamp) {
        const item = this.processHistory.find(h => h.timestamp === timestamp);
        if (!item) return;

        this.temperatureDiffInput.value = item.data.deltaT.value;
        this.tempUnitSelect.value = item.data.deltaT.unit;
        this.areaInput.value = item.data.area.value;
        this.areaUnitSelect.value = item.data.area.unit;
        this.thicknessInput.value = item.data.thickness.value;
        this.thicknessUnitSelect.value = item.data.thickness.unit;
        this.conductivityInput.value = item.data.conductivity.value;
        this.conductivityUnitSelect.value = item.data.conductivity.unit;

        this.calculate();
    }
}

// Initialize calculator when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.thermalCalculator = new ThermalCalculator();
}); 