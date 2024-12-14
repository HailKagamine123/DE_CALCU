// Utility Functions
const utils = {
    normalizeTime(time, unit) {
        const timeMap = {
            'seconds': 1/3600,
            'minutes': 1/60,
            'hours': 1,
            'days': 24,
            'year': 24 * 365.25
        };
        return time * (timeMap[unit.toLowerCase()] || 1);
    },

    toKelvin(temp, unit) {
        const conversions = {
            'celsius': temp => temp + 273.15,
            'fahrenheit': temp => (temp - 32) * 5/9 + 273.15,
            'kelvin': temp => temp
        };
        return (conversions[unit.toLowerCase()] || (t => t))(temp);
    },

    fromKelvin(tempK, unit) {
        const conversions = {
            'celsius': tempK => tempK - 273.15,
            'fahrenheit': tempK => (tempK - 273.15) * 9/5 + 32,
            'kelvin': tempK => tempK
        };
        return (conversions[unit.toLowerCase()] || (t => t))(tempK);
    },

    validateNumericInputs(inputs) {
        return inputs.every(input => 
            input.element.value !== '' && !isNaN(parseFloat(input.element.value))
        );
    },

    createElementWithStyle(type, styleOptions = {}) {
        const element = document.createElement(type);
        Object.entries(styleOptions).forEach(([key, value]) => {
            element.style[key] = value;
        });
        return element;
    }
};

// Theme Management
const ThemeManager = {
    initialize() {
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        this.applyInitialTheme(themeToggle);
    },
    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        const isDarkMode = body.classList.toggle('dark-theme');

        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        themeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    },
    applyInitialTheme(themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️ Light Mode';
        } else {
            themeToggle.textContent = '🌙 Dark Mode';
        }
    }
};

// Calculation Functions
const calculations = {
    growthDecay: {
        amount(options) {
            const { x0, t1, x1, t2, timeUnit } = options;
            const t1Norm = utils.normalizeTime(t1, timeUnit);
            const t2Norm = utils.normalizeTime(t2, timeUnit);

            // Calculate growth/decay rate (k)
            const k = Math.log(x1 / x0) / t1Norm;

            // Calculate final value and rate of change
            const x2 = x0 * Math.exp(k * t2Norm);
            const dxdt = k * x2;

            // Generate detailed explanation
            const detailedSteps = `
Detailed Calculation Steps:
--------------------
Step 1: Normalize Time
- Time t₁: ${t1} ${timeUnit} → Normalized: ${t1Norm.toFixed(4)} hours
- Time t₂: ${t2} ${timeUnit} → Normalized: ${t2Norm.toFixed(4)} hours

Step 2: Calculate Growth/Decay Rate (k)
- Formula: k = ln(x₁/x₀) / t₁
- k = ln(${x1.toFixed(4)} / ${x0.toFixed(4)}) / ${t1Norm.toFixed(4)}
- k = ${k.toFixed(4)}

Step 3: Compute Final Value (x₂)
- Formula: x₂ = x₀ * e^(k * t₂)
- x₂ = ${x0.toFixed(4)} * e^(${k.toFixed(4)} * ${t2Norm.toFixed(4)})
- x₂ = ${x2.toFixed(4)}

Step 4: Calculate Rate of Change (dx/dt)
- Formula: dx/dt = k * x₂
- dx/dt = ${k.toFixed(4)} * ${x2.toFixed(4)}
- dx/dt = ${dxdt.toFixed(4)}

Verification:
- Initial Value (x₀): ${x0.toFixed(4)}
- Value at t₁ (x₁): ${x1.toFixed(4)}
- Calculated Value at t₂ (x₂): ${x2.toFixed(4)}
- Growth/Decay Rate (k): ${k.toFixed(4)}
- Rate of Change (dx/dt): ${dxdt.toFixed(4)}
`;

            return { 
                x2, 
                dxdt, 
                k, 
                detailedCalculation: detailedSteps 
            };
        },

        time(options) {
            const { x0, x1, t1, x2, timeUnit } = options;
            const t1Norm = utils.normalizeTime(t1, timeUnit);

            // Calculate growth/decay rate (k)
            const k = Math.log(x1 / x0) / t1Norm;

            // Calculate time
            const t2 = Math.log(x2 / x0) / k;

            // Generate detailed explanation
            const detailedSteps = `
Detailed Calculation Steps:
--------------------
Step 1: Calculate Growth/Decay Rate (k)
- Formula: k = ln(x₁/x₀) / t₁
- t₁: ${t1} ${timeUnit} (Normalized: ${t1Norm.toFixed(4)} hours)
- k = ln(${x1.toFixed(4)} / ${x0.toFixed(4)}) / ${t1Norm.toFixed(4)}
- k = ${k.toFixed(4)}

Step 2: Compute Time (t₂)
- Formula: t₂ = ln(x₂/x₀) / k
- t₂ = ln(${x2.toFixed(4)} / ${x0.toFixed(4)}) / ${k.toFixed(4)}
- t₂ = ${t2.toFixed(4)} ${timeUnit}

Verification:
- Initial Value (x₀): ${x0.toFixed(4)}
- Value at t₁ (x₁): ${x1.toFixed(4)}
- Final Value (x₂): ${x2.toFixed(4)}
- Growth/Decay Rate (k): ${k.toFixed(4)}
- Calculated Time (t₂): ${t2.toFixed(4)} ${timeUnit}
`;

            return { 
                t2, 
                k, 
                detailedCalculation: detailedSteps 
            };
        }
    },

    heatTransfer: {
        temperature(options) {
            const { ambientTemp, initialTemp, targetTime, tempUnit, timeUnit } = options;
            
            // Convert temperatures to Kelvin
            const ambientTempK = utils.toKelvin(ambientTemp, tempUnit);
            const initialTempK = utils.toKelvin(initialTemp, tempUnit);
            const targetTimeNorm = utils.normalizeTime(targetTime, timeUnit);

            // Heat transfer coefficient (simplified to 1)
            const k = 1;

            // Calculate target temperature
            const targetTempK = ambientTempK + (initialTempK - ambientTempK) * Math.exp(-k * targetTimeNorm);
            const targetTemp = utils.fromKelvin(targetTempK, tempUnit);

            // Generate detailed explanation
            const detailedSteps = `
Detailed Calculation Steps:
--------------------
Step 1: Convert Temperatures to Kelvin
- Ambient Temperature: ${ambientTemp}°${tempUnit} → ${ambientTempK.toFixed(2)} K
- Initial Temperature: ${initialTemp}°${tempUnit} → ${initialTempK.toFixed(2)} K

Step 2: Normalize Time
- Target Time: ${targetTime} ${timeUnit} → Normalized: ${targetTimeNorm.toFixed(4)} hours

Step 3: Apply Heat Transfer Equation
- Heat Transfer Coefficient (k): ${k}
- Formula: T(t) = T_ambient + (T_initial - T_ambient) * e^(-k * t)
- Target Temperature: 
  ${ambientTempK.toFixed(2)} + (${initialTempK.toFixed(2)} - ${ambientTempK.toFixed(2)}) * e^(-${k} * ${targetTimeNorm.toFixed(4)})
- Calculated Target Temperature (K): ${targetTempK.toFixed(2)} K
- Converted Target Temperature: ${targetTemp.toFixed(2)}°${tempUnit}

Verification:
- Ambient Temperature: ${ambientTemp}°${tempUnit}
- Initial Temperature: ${initialTemp}°${tempUnit}
- Target Time: ${targetTime} ${timeUnit}
- Calculated Temperature: ${targetTemp.toFixed(2)}°${tempUnit}
`;

            return { 
                targetTemp, 
                detailedCalculation: detailedSteps 
            };
        },

        initialTemperature(options) {
            const { ambientTemp, knownTime1, knownTemp1, knownTime2, knownTemp2, tempUnit, timeUnit } = options;
            
            // Convert temperatures to Kelvin
            const ambientTempK = utils.toKelvin(ambientTemp, tempUnit);
            const knownTemp1K = utils.toKelvin(knownTemp1, tempUnit);
            const knownTemp2K = utils.toKelvin(knownTemp2, tempUnit);

            // Heat transfer coefficient (simplified to 1)
            const k = 1;

            // Normalize times
            const time1Norm = utils.normalizeTime(knownTime1, timeUnit);
            const time2Norm = utils.normalizeTime(knownTime2, timeUnit);

            // Calculate initial temperature
            const initialTempK = ambientTempK + 
                (knownTemp1K - ambientTempK) / 
                Math.exp(k * time1Norm);

            const initialTemp = utils.fromKelvin(initialTempK, tempUnit);

            // Generate detailed explanation
            const detailedSteps = `
Detailed Calculation Steps:
--------------------
Step 1: Convert Temperatures to Kelvin
- Ambient Temperature: ${ambientTemp}°${tempUnit} → ${ambientTempK.toFixed(2)} K
- Known Temperature 1: ${knownTemp1}°${tempUnit} → ${knownTemp1K.toFixed(2)} K
- Known Temperature 2: ${knownTemp2}°${tempUnit} → ${knownTemp2K.toFixed(2)} K

Step 2: Normalize Time
- Known Time 1: ${knownTime1} ${timeUnit} → Normalized: ${time1Norm.toFixed(4)} hours
- Known Time 2: ${knownTime2} ${timeUnit} → Normalized: ${time2Norm.toFixed(4)} hours

Step 3: Apply Initial Temperature Calculation
- Heat Transfer Coefficient (k): ${k}
- Formula: T_initial = T_ambient + (T_known - T_ambient) / e^(k * t)
- Initial Temperature Calculation:
  ${ambientTempK.toFixed(2)} + (${knownTemp1K.toFixed(2)} - ${ambientTempK.toFixed(2)}) / e^(${k} * ${time1Norm.toFixed(4)})
- Calculated Initial Temperature (K): ${initialTempK.toFixed(2)} K
- Converted Initial Temperature: ${initialTemp.toFixed(2)}°${tempUnit}

Verification:
- Ambient Temperature: ${ambientTemp}°${tempUnit}
- Known Temperature 1: ${knownTemp1}°${tempUnit} at ${knownTime1} ${timeUnit}
- Known Temperature 2: ${knownTemp2}°${tempUnit} at ${knownTime2} ${timeUnit}
- Calculated Initial Temperature: ${initialTemp.toFixed(2)}°${tempUnit}
`;

            return { 
                initialTemp, 
                detailedCalculation: detailedSteps 
            };
        },

        time(options) {
            const { ambientTemp, initialTemp, targetTemp, tempUnit, timeUnit } = options;

            // Convert temperatures to Kelvin
            const ambientTempK = utils.toKelvin(ambientTemp, tempUnit);
            const initialTempK = utils.toKelvin(initialTemp, tempUnit);
            const targetTempK = utils.toKelvin(targetTemp, tempUnit);

            // Heat transfer coefficient (simplified to 1)
            const k = 1;

            // Calculate normalized time
            const timeNormalized = -Math.log((targetTempK - ambientTempK) / 
                                              (initialTempK - ambientTempK)) / k;
            
            // Convert time to specified unit
            const timeConversionMap = {
                'seconds': 3600,
                'minutes': 60,
                'hours': 1,
                'days': 1/24
            };
            const time = timeNormalized * (timeConversionMap[timeUnit.toLowerCase()] || 1);

            // Generate detailed explanation
            const detailedSteps = `
Detailed Calculation Steps:
--------------------
Step 1: Convert Temperatures to Kelvin
- Ambient Temperature: ${ambientTemp}°${tempUnit} → ${ambientTempK.toFixed(2)} K
- Initial Temperature: ${initialTemp}°${tempUnit} → ${initialTempK.toFixed(2)} K
- Target Temperature: ${targetTemp}°${tempUnit} → ${targetTempK.toFixed(2)} K

Step 2: Calculate Time
- Heat Transfer Coefficient (k): ${k}
- Formula: t = -ln((T_target - T_ambient) / (T_initial - T_ambient)) / k
- Calculation:
  t = -ln((${targetTempK.toFixed(2)} - ${ambientTempK.toFixed(2)}) / 
          (${initialTempK.toFixed(2)} - ${ambientTempK.toFixed(2)})) / ${k}
- Normalized Time: ${timeNormalized.toFixed(4)} hours
- Converted Time: ${time.toFixed(4)} ${timeUnit}

Verification:
- Ambient Temperature: ${ambientTemp}°${tempUnit}
- Initial Temperature: ${initialTemp}°${tempUnit}
- Target Temperature: ${targetTemp}°${tempUnit}
- Calculated Time: ${time.toFixed(4)} ${timeUnit}
`;

            return { 
                time, 
                detailedCalculation: detailedSteps 
            };
        }
    }
};

// Graph Generation
const graphGenerators = {
    growthDecay(options) {
        const { x0, t1, x1, t2, timeUnit, unitX } = options;
        const t1Norm = utils.normalizeTime(t1, timeUnit);
        const t2Norm = utils.normalizeTime(t2, timeUnit);

        const c = x0;
        const k = Math.log(x1 / c) / t1Norm;

        const dataPoints = Array.from({ length: 21 }, (_, i) => {
            const t = (i / 20) * t2Norm;
            const x = c * Math.exp(k * t);
            return { x: t, y: x };
        });

        return {
            label: `Growth/Decay (${unitX})`,
            data: dataPoints,
            timeUnit,
            unitX
        };
    },

    heatTransfer(options) {
        const { ambientTemp, initialTemp, targetTime, tempUnit, timeUnit } = options;
        const ambientTempK = utils.toKelvin(ambientTemp, tempUnit);
        const initialTempK = utils.toKelvin(initialTemp, tempUnit);
        const targetTimeNorm = utils.normalizeTime(targetTime, timeUnit);

        const k = 1;

        const dataPoints = Array.from({ length: 21 }, (_, i) => {
            const t = (i / 20) * targetTimeNorm;
            const tempK = ambientTempK + (initialTempK - ambientTempK) * Math.exp(-k * t);
            const temp = utils.fromKelvin(tempK, tempUnit);
            return { x: t, y: temp };
        });

        return {
            label: `Temperature (${tempUnit})`,
            data: dataPoints,
            timeUnit,
            tempUnit
        };
    }
};

// Rendering and UI Management
const UIManager = {
    resetCalculator() {
        document.getElementById('calcType').selectedIndex = 0;
        document.getElementById('calculationType').innerHTML = '<option value="">Select Calculation Variant</option>';
        document.getElementById('inputForm').innerHTML = '';
        document.getElementById('calculatorOptions').style.display = 'none';
        document.getElementById('resultSection').style.display = 'none';
    },

    renderResults(resultData) {
        const resultSection = document.getElementById('resultSection');
        const resultText = document.getElementById('resultText');

        resultSection.style.display = 'block';
        resultText.innerHTML = resultData.formattedText;
    },

    renderGraph(graphData) {
        const graphContainer = document.getElementById('graphContainer');
        graphContainer.style.display = 'block';
        graphContainer.innerHTML = '<canvas id="calculationChart"></canvas>';

        const ctx = document.getElementById('calculationChart').getContext('2d');

        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: graphData.label,
                    data: graphData.data,
                    borderColor: 'var(--text-primary)',
                    backgroundColor: 'rgba(166, 77, 121, 0.2)',
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: `Time (${graphData.timeUnit})`
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: graphData.unitX || graphData.tempUnit
                        }
                    }
                }
            }
        });
    },

    promptContinue() {
        const resultSection = document.getElementById('resultSection');
        const continuePrompt = utils.createElementWithStyle('div', {
            backgroundColor: 'var(--bg-secondary)',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            marginTop: '20px',
            boxShadow: '0 5px 15px var(--shadow)'
        });

        continuePrompt.innerHTML = `
            <h3 style="color: var(--text-primary);">Would you like to continue using the calculator?</h3>
            <button id="yesContinueBtn" style="background-color: var(--input-focus); color: white; padding: 10px 20px; border: none; border-radius: 8px; margin-right: 10px;">Yes</button>
            <button id="noContinueBtn" style="background-color: var(--bg-accent); color: var(--text-primary); padding: 10px 20px; border: none; border-radius: 8px;">No</button>
        `;

        resultSection.after(continuePrompt);

        const yesContinueBtn = document.getElementById('yesContinueBtn');
        const noContinueBtn = document.getElementById('noContinueBtn');

        yesContinueBtn.addEventListener('click', () => {
            continuePrompt.remove();
            this.resetCalculator();
        });

        noContinueBtn.addEventListener('click', () => {
            const thankYouMessage = utils.createElementWithStyle('div', {
                backgroundColor: 'var(--bg-secondary)',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                marginTop: '20px',
                boxShadow: '0 5px 15px var(--shadow)'
            });

            thankYouMessage.innerHTML = `
                <h3 style="color: var(--text-primary);">Thank you for using the Differential Equations Calculator!</h3>
                <p style="color: var(--text-secondary);">We hope this tool was helpful for your calculations.</p>
            `;

            continuePrompt.replaceWith(thankYouMessage);

            setTimeout(() => {
                document.getElementById('calculatorSection').style.display = 'none';
                document.getElementById('welcomeSection').style.display = 'block';
            }, 3000);
        });
    }
};

// Calculation Handler
let currentGraphData = null;

function handleCalculation(event) {
    event.preventDefault();
    
    // Reset previous results and graph
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('graphContainer').style.display = 'none';
    
    // Reset global graph data
    currentGraphData = null;

    const calcType = document.getElementById('calcType').value;
    const calculationType = document.getElementById('calculationType').value;

    // Collect input values dynamically
    const inputs = Array.from(document.getElementById('inputForm').querySelectorAll('input, select'))
        .map(input => ({
            id: input.id,
            element: input,
            value: input.type === 'number' ? parseFloat(input.value) : input.value
        }));

    // Validate inputs
    if (!utils.validateNumericInputs(inputs.filter(input => input.element.type === 'number'))) {
        alert('Please fill in all numeric fields with valid numbers.');
        return;
    }

    try {
        let result, graphData;

        // Growth and Decay Calculations
        if (calcType === 'growth-decay') {
            const inputMap = Object.fromEntries(inputs.map(input => [input.id, input.value]));
            
            switch (calculationType) {
                case 'find-amount':
                    result = calculations.growthDecay.amount({
                        x0: inputMap['initialValue'],
                        t1: inputMap['time1'],
                        x1: inputMap['value1'],
                        t2: inputMap['time2'],
                        timeUnit: inputMap['timeUnit'],
                        unitX: inputMap['unitX']
                    });
                    graphData = graphGenerators.growthDecay({
                        x0: inputMap['initialValue'],
                        t1: inputMap['time1'],
                        x1: inputMap['value1'],
                        t2: inputMap['time2'],
                        timeUnit: inputMap['timeUnit'],
                        unitX: inputMap['unitX']
                    });
                    break;
                
                case 'find-initial':
                    result = calculations.growthDecay.time({
                        x0: inputMap['ambientValue'],
                        x1: inputMap['value1'],
                        t1: inputMap['time1'],
                        x2: inputMap['targetValue'],
                        timeUnit: inputMap['timeUnit']
                    });
                    // No graph for this calculation type
                    break;
                
                case 'find-time':
                    result = calculations.growthDecay.time({
                        x0: inputMap['initialValue'],
                        x1: inputMap['targetValue'],
                        t1: inputMap['knownTime'],
                        timeUnit: inputMap['timeUnit']
                    });
                    // No graph for this calculation type
                    break;
            }
        }
        
        // Heat Transfer Calculations
        else if (calcType === 'heat-cool') {
            const inputMap = Object.fromEntries(inputs.map(input => [input.id, input.value]));
            
            switch (calculationType) {
                case 'find-temp':
                    result = calculations.heatTransfer.temperature({
                        ambientTemp: inputMap['ambientTemp'],
                        initialTemp: inputMap['initialTemp'],
                        targetTime: inputMap['targetTime'],
                        tempUnit: inputMap['tempUnit'],
                        timeUnit: inputMap['timeUnit']
                    });
                    graphData = graphGenerators.heatTransfer({
                        ambientTemp: inputMap['ambientTemp'],
                        initialTemp: inputMap['initialTemp'],
                        targetTime: inputMap['targetTime'],
                        tempUnit: inputMap['tempUnit'],
                        timeUnit: inputMap['timeUnit']
                    });
                    break;
                
                case 'find-initial-temp':
                    result = calculations.heatTransfer.initialTemperature({
                        ambientTemp: inputMap['ambientTemp'],
                        knownTime1: inputMap['knownTime1'],
                        knownTemp1: inputMap['knownTemp1'],
                        knownTime2: inputMap['knownTime2'],
                        knownTemp2: inputMap['knownTemp2'],
                        tempUnit: inputMap['tempUnit'],
                        timeUnit: inputMap['timeUnit']
                    });
                    // No graph for this calculation type
                    break;
                
                case 'find-time':
                    result = calculations.heatTransfer.time({
                        ambientTemp: inputMap['ambientTemp'],
                        initialTemp: inputMap['initialTemp'],
                        targetTemp: inputMap['targetTemp'],
                        tempUnit: inputMap['tempUnit'],
                        timeUnit: inputMap['timeUnit']
                    });
                    // No graph for this calculation type
                    break;
            }
        }

        // Ensure result exists before accessing detailedCalculation
        if (!result) {
            throw new Error('No calculation result was generated');
        }

        // Format result text
        const resultText = result.detailedCalculation || 'No detailed calculation available';

        // Render results
        UIManager.renderResults({ 
            formattedText: `<pre style="white-space: pre-wrap; word-wrap: break-word;">${resultText}</pre>` 
        });

        // Manage graph button visibility
        if (graphData) {
            currentGraphData = graphData;
            document.getElementById('graphButton').style.display = 'inline-block';
        } else {
            document.getElementById('graphButton').style.display = 'none';
        }

        // Prompt to continue
        UIManager.promptContinue();

    } catch (error) {
        console.error('Calculation Error:', error);
        alert(`An error occurred during calculation: ${error.message}. Please check your inputs.`);
        
        // Hide graph button in case of error
        document.getElementById('graphButton').style.display = 'none';
        currentGraphData = null;
    }
}
// Add event listener for calculate button on page load
document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculateButton');
    const inputForm = document.getElementById('inputForm');

    // Direct event listener on the calculate button
    calculateButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default form submission
        handleCalculation(event);
    });

    // Fallback form submission event listener
    inputForm.addEventListener('submit', (event) => {
        event.preventDefault();
        handleCalculation(event);
    });

    const graphButton = document.getElementById('graphButton');
    graphButton.style.display = 'none'; // Hide by default

    graphButton.addEventListener('click', () => {
        if (currentGraphData) {
            UIManager.renderGraph(currentGraphData);
        } else {
            alert('No graph data available. Please perform a calculation first.');
        }
    });
});

// Initialization and Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const proceedButton = document.getElementById('proceedButton');
    const welcomeSection = document.getElementById('welcomeSection');
    const calculatorSection = document.getElementById('calculatorSection');

    proceedButton.addEventListener('click', () => {
        welcomeSection.style.display = 'none';
        calculatorSection.style.display = 'block';
    });


    // Theme Initialization
    ThemeManager.initialize();

    // Chart.js Loader
    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    chartScript.async = true;
    chartScript.onerror = () => {
        console.error('Chart.js loading failed');
        alert('Graphing library could not be loaded');
    };
    document.head.appendChild(chartScript);

    // Event Listeners for Calculation Types
    // Modify the existing event listener in the DOMContentLoaded block

const calcTypeSelect = document.getElementById('calcType');
const calculationTypeSelect = document.getElementById('calculationType');
const calculatorOptions = document.getElementById('calculatorOptions');
const inputForm = document.getElementById('inputForm');

calcTypeSelect.addEventListener('change', () => {
    const selectedType = calcTypeSelect.value;
    calculationTypeSelect.innerHTML = '<option value="">Select Calculation Variant</option>';
    inputForm.innerHTML = '';

    if (selectedType) {
        calculatorOptions.style.display = 'block';

        const calculationTypes = {
            'growth-decay': [
                { value: 'find-amount', text: 'Find Amount/Value' },
                { value: 'find-initial', text: 'Find Initial Value' },
                { value: 'find-time', text: 'Find Time' }
            ],
            'heat-cool': [
                { value: 'find-temp', text: 'Find Temperature' },
                { value: 'find-initial-temp', text: 'Find Initial Temperature' },
                { value: 'find-time', text: 'Find Time' }
            ]
        };

        calculationTypes[selectedType]?.forEach(type => {
            const option = document.createElement('option');
            option.value = type.value;
            option.textContent = type.text;
            calculationTypeSelect.appendChild(option);
        });
    } else {
        calculatorOptions.style.display = 'none';
    }
});

// Add event listener for calculation type selection
calculationTypeSelect.addEventListener('change', () => {
    const selectedType = calcTypeSelect.value;
    const selectedCalculationType = calculationTypeSelect.value;
    inputForm.innerHTML = '';

    if (selectedCalculationType) {
        const inputConfigurations = {
            'growth-decay': {
                'find-amount': [
                    { label: 'Initial Value (x₀)', id: 'initialValue', type: 'number' },
                    { label: 'Unit of x', id: 'unitX', type: 'select', options: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces','Others'] },
                    { label: 'Time 1', id: 'time1', type: 'number' },
                    { label: 'Value at Time 1 (x₁)', id: 'value1', type: 'number' },
                    { label: 'Time 2', id: 'time2', type: 'number' },
                    { label: 'Time Unit', id: 'timeUnit', type: 'select', options: ['seconds', 'minutes', 'hours', 'days', 'year'] }
                ],
                'find-initial': [
                    { label: 'Ambient Value', id: 'ambientValue', type: 'number' },
                    { label: 'Unit of x', id: 'unitX', type: 'select', options: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces','Others'] },
                    { label: 'Time 1', id: 'time1', type: 'number' },
                    { label: 'Value at Time 1', id: 'value1', type: 'number' },
                    { label: 'Target Value', id: 'targetValue', type: 'number' },
                    { label: 'Time Unit', id: 'timeUnit', type: 'select', options: ['seconds', 'minutes', 'hours', 'days', 'year'] }
                ],
                'find-time': [
                    { label: 'Initial Value (x₀)', id: 'initialValue', type: 'number' },
                    { label: 'Unit of x', id: 'unitX', type: 'select', options: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces','Others'] },
                    { label: 'Target Value (x₁)', id: 'targetValue', type: 'number' },
                    { label: 'Known Time', id: 'knownTime', type: 'number' },
                    { label: 'Time Unit', id: 'timeUnit', type: 'select', options: ['seconds', 'minutes', 'hours', 'days', 'year'] }
                ]
            },
            'heat-cool': {
                'find-temp': [
                    { label: 'Ambient Temperature', id: 'ambientTemp', type: 'number' },
                    { label: 'Initial Temperature', id: 'initialTemp', type: 'number' },
                    { label: 'Target Time', id: 'targetTime', type: 'number' },
                    { label: 'Temperature Unit', id: 'tempUnit', type: 'select', options: ['Celsius', 'Fahrenheit', 'Kelvin'] },
                    { label: 'Time Unit', id: 'timeUnit', type: 'select', options: ['seconds', 'minutes', 'hours', 'days'] }
                ],
                'find-initial-temp': [
                    { label: 'Ambient Temperature', id: 'ambientTemp', type: 'number' },
                    { label: 'Known Time 1', id: 'knownTime1', type: 'number' },
                    { label: 'Known Temperature 1', id: 'knownTemp1', type: 'number' },
                    { label: 'Known Time 2', id: 'knownTime2', type: 'number' },
                    { label: 'Known Temperature 2', id: 'knownTemp2', type: 'number' },
                    { label: 'Temperature Unit', id: 'tempUnit', type: 'select', options: ['Celsius', 'Fahrenheit', 'Kelvin'] },
                    { label: 'Time Unit', id: 'timeUnit', type: 'select', options: ['seconds', 'minutes', 'hours', 'days'] }
                ],
                'find-time': [
                    { label: 'Ambient Temperature', id: 'ambientTemp', type: 'number' },
                    { label: 'Initial Temperature', id: 'initialTemp', type: 'number' },
                    { label: 'Target Temperature', id: 'targetTemp', type: 'number' },
                    { label: 'Temperature Unit', id: 'tempUnit', type: 'select', options: ['Celsius', 'Fahrenheit', 'Kelvin'] },
                    { label: 'Time Unit', id: 'timeUnit', type: 'select', options: ['seconds', 'minutes', 'hours', 'days'] }
                ]
            }
        };

        const inputs = inputConfigurations[selectedType][selectedCalculationType];
        
        inputs.forEach(input => {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';

            const label = document.createElement('label');
            label.htmlFor = input.id;
            label.textContent = input.label;
            inputGroup.appendChild(label);

            let inputElement;
            if (input.type === 'select') {
                inputElement = document.createElement('select');
                input.options.forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText.toLowerCase();
                    option.textContent = optionText;
                    inputElement.appendChild(option);
                });
            } else {
                inputElement = document.createElement('input');
                inputElement.type = input.type;
            }

            inputElement.id = input.id;
            inputElement.name = input.id;
            inputGroup.appendChild(inputElement);

            inputForm.appendChild(inputGroup);
        });
    } else {
        inputForm.innerHTML = '';
    }
});
});
