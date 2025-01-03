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
            const { x0, t1, x1, t2, timeUnit, unitX } = options;
            
            // Calculate k using Python's method
            const k = Math.log(x1 / x0) / t1;
            
            // Calculate final value using x = ce^kt where c = x0
            const x2 = x0 * Math.exp(k * t2);
            
            // Calculate rate of change
            const dxdt = k * x2;

            // Keep original output format exactly as it was
            const detailedSteps = `
Detailed Calculation Steps:
--------------------
Step 1: Time Values
- Time t₁: ${t1} ${timeUnit}
- Time t₂: ${t2} ${timeUnit}

Step 2: Calculate Growth/Decay Rate (k)
- Formula: k = ln(x₁/x₀) / t₁
- k = ln(${x1.toFixed(4)} / ${x0.toFixed(4)}) / ${t1.toFixed(4)}
- k = ${k.toFixed(4)}

Step 3: Compute Final Value (x₂)
- Formula: x₂ = x₀ * e^(k * t₂)
- x₂ = ${x0.toFixed(4)} * e^(${k.toFixed(4)} * ${t2.toFixed(4)})
- x₂ = ${x2.toFixed(4)}

Step 4: Calculate Rate of Change (dx/dt)
- Formula: dx/dt = k * x₂
- dx/dt = ${k.toFixed(4)} * ${x2.toFixed(4)}
- dx/dt = ${dxdt.toFixed(2)} ${unitX}/${timeUnit}

Verification:
- Initial Value (x₀): ${x0.toFixed(4)}
- Value at t₁ (x₁): ${x1.toFixed(4)}
- Calculated Value at t₂ (x₂): ${x2.toFixed(4)}
- Growth/Decay Rate (k): ${k.toFixed(4)}
- Rate of Change at t₂: ${dxdt.toFixed(2)} ${unitX}/${timeUnit}
`;

            return { 
                x2, 
                dxdt, 
                k, 
                detailedCalculation: detailedSteps 
            };
        },

        initialValue(options) {
            const { x1, t1, x2, t2, timeUnit, unitX } = options;
            
            // Calculate k using ratio method from Python
            const k = Math.log(x1 / x2) / (t1 - t2);
            
            // Calculate initial value using point 1
            const x0 = x1 / Math.exp(k * t1);

            // Keep original output format
            const detailedSteps = `
Detailed Calculation Steps:
--------------------
Step 1: Time Values
- Time t₁: ${t1} ${timeUnit}
- Time t₂: ${t2} ${timeUnit}

Step 2: Calculate Growth/Decay Rate (k)
- Formula: k = ln(x₁/x₂) / (t₁ - t₂)
- k = ln(${x1.toFixed(4)} / ${x2.toFixed(4)}) / (${t1.toFixed(4)} - ${t2.toFixed(4)})
- k = ${k.toFixed(4)}

Step 3: Compute Initial Value (x₀)
- Formula: x₀ = x₁ / e^(k * t₁)
- x₀ = ${x1.toFixed(4)} / e^(${k.toFixed(4)} * ${t1.toFixed(4)})
- x₀ = ${x0.toFixed(4)}

Verification:
- Value at t₁ (x₁): ${x1.toFixed(4)}
- Value at t₂ (x₂): ${x2.toFixed(4)}
- Calculated Initial Value (x₀): ${x0.toFixed(4)} ${unitX}
- Growth/Decay Rate (k): ${k.toFixed(4)}
`;

            return { 
                x0, 
                k, 
                detailedCalculation: detailedSteps 
            };
        },

        time(options) {
            const { x0, x1, t1, x2, timeUnit } = options;
            
            // Calculate k using Python's method
            const k = Math.log(x1 / x0) / t1;
            
            // Calculate time using Python's method
            const t2 = Math.log(x2 / x0) / k;

            // Keep original output format
            const detailedSteps = `
Detailed Calculation Steps:
--------------------
Step 1: Calculate Growth/Decay Rate (k)
- Formula: k = ln(x₁/x₀) / t₁
- k = ln(${x1.toFixed(4)} / ${x0.toFixed(4)}) / ${t1.toFixed(4)}
- k = ${k.toFixed(4)}

Step 2: Compute Required Time (t₂)
- Formula: t₂ = ln(x₂/x₀) / k
- t₂ = ln(${x2.toFixed(4)} / ${x0.toFixed(4)}) / ${k.toFixed(4)}
- t₂ = ${t2.toFixed(4)} ${timeUnit}

Verification:
- Initial Value (x₀): ${x0.toFixed(4)}
- Value at t₁ (x₁): ${x1.toFixed(4)}
- Target Value (x₂): ${x2.toFixed(4)}
- Growth/Decay Rate (k): ${k.toFixed(4)}
- Required Time (t₂): ${t2.toFixed(4)} ${timeUnit}
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

            // Calculate temperature difference C
            const C = initialTemp - ambientTemp;

            // Heat transfer coefficient
            const k = Math.log((31 - ambientTemp) / C) / -1; // Using t=1 min data point

            // Calculate target temperature
            const targetTemp = ambientTemp + C * Math.exp(-k * targetTime);

            // Generate detailed explanation
            const detailedSteps = `
Detailed Heat Transfer Calculation:
--------------------
Step 1: Initial Conditions
@t=0 ${timeUnit}, T=${initialTemp.toFixed(2)}°${tempUnit}, T∞=${ambientTemp.toFixed(2)}°${tempUnit}
T-T∞=Ce^(-kt)

Step 2: Calculate C (Initial Temperature Difference)
${initialTemp.toFixed(2)}=${ambientTemp.toFixed(2)}+C
C=${C.toFixed(2)}

Step 3: Calculate k using t=1 ${timeUnit} data point
${31}=${ambientTemp.toFixed(2)}+${C.toFixed(2)}e^(-k*1)
${(31 - ambientTemp).toFixed(2)}=${C.toFixed(2)}e^(-k*1)
k=${k.toFixed(6)}

Step 4: Temperature as a function of time:
T=${ambientTemp.toFixed(2)}+${C.toFixed(2)}e^(-${k.toFixed(6)}t)
T=${targetTemp.toFixed(2)}°${tempUnit}

Verification:
- Ambient Temperature (T∞): ${ambientTemp.toFixed(2)}°${tempUnit}
- Initial Temperature (T₀): ${initialTemp.toFixed(2)}°${tempUnit}
- Temperature Difference (C): ${C.toFixed(2)}
- Heat Transfer Coefficient (k): ${k.toFixed(6)}
- Final Temperature: ${targetTemp.toFixed(2)}°${tempUnit}
`;

            return {
                targetTemp,
                detailedCalculation: detailedSteps
            };
        },

        initialTemperature(options) {
            const { ambientTemp, knownTime1, knownTemp1, knownTime2, knownTemp2, tempUnit, timeUnit } = options;

            // Calculate temperature differences for both known points
            const C1 = knownTemp1 - ambientTemp;
            const C2 = knownTemp2 - ambientTemp;

            // Calculate k using the ratio of the two points
            const k = -Math.log(C2 / C1) / (knownTime2 - knownTime1);

            // Calculate initial temperature using point 1
            const initialTemp = ambientTemp + C1 * Math.exp(k * knownTime1);

            // Generate detailed explanation
            const detailedSteps = `
Detailed Heat Transfer Calculation:
--------------------
Step 1: Calculate Temperature Differences
C₁ = T₁ - T∞ = ${knownTemp1.toFixed(2)} - ${ambientTemp.toFixed(2)} = ${C1.toFixed(2)}
C₂ = T₂ - T∞ = ${knownTemp2.toFixed(2)} - ${ambientTemp.toFixed(2)} = ${C2.toFixed(2)}

Step 2: Calculate Heat Transfer Coefficient (k)
- Using the ratio of two known points:
- T₁ - T∞ = C₁e^(-k*t₁)
- T₂ - T∞ = C₁e^(-k*t₂)
- (T₂ - T∞)/(T₁ - T∞) = e^(-k(t₂-t₁))
- k = -ln((T₂ - T∞)/(T₁ - T∞))/(t₂-t₁)
k = -ln(${C2.toFixed(4)}/${C1.toFixed(4)})/(${knownTime2} - ${knownTime1})
k = ${k.toFixed(6)}

Step 3: Calculate Initial Temperature
- Using point 1:
T₀ = T∞ + (T₁ - T∞)e^(kt₁)
T₀ = ${ambientTemp.toFixed(2)} + ${C1.toFixed(2)} * e^(${k.toFixed(6)} * ${knownTime1})
T₀ = ${initialTemp.toFixed(2)}°${tempUnit}

Verification:
- Ambient Temperature (T∞): ${ambientTemp.toFixed(2)}°${tempUnit}
- Known Point 1: ${knownTemp1.toFixed(2)}°${tempUnit} at t=${knownTime1} ${timeUnit}
- Known Point 2: ${knownTemp2.toFixed(2)}°${tempUnit} at t=${knownTime2} ${timeUnit}
- Heat Transfer Coefficient (k): ${k.toFixed(6)}
- Calculated Initial Temperature: ${initialTemp.toFixed(2)}°${tempUnit}
`;

            return {
                initialTemp,
                detailedCalculation: detailedSteps
            };
        },

        time(options) {
            const { ambientTemp, initialTemp, knownTemp1, knownTime1, targetTemp, tempUnit, timeUnit } = options;

            // Calculate temperature difference C
            const C = initialTemp - ambientTemp;
            
            // Calculate k using the known point
            const k = Math.log((knownTemp1 - ambientTemp) / C) / -knownTime1;
            
            // Calculate time to reach target temperature
            const calculatedTime = -Math.log((targetTemp - ambientTemp) / C) / k;

            const detailedSteps = `
Detailed Heat Transfer Calculation:
--------------------
Step 1: Initial Conditions
@t=0 ${timeUnit}, T=${initialTemp.toFixed(2)}°${tempUnit}, T∞=${ambientTemp.toFixed(2)}°${tempUnit}
Known point: @t=${knownTime1} ${timeUnit}, T=${knownTemp1}°${tempUnit}
T-T∞=Ce^(-kt)

Step 2: Calculate Initial Temperature Difference (C)
C = T₀ - T∞
C = ${initialTemp.toFixed(2)} - ${ambientTemp.toFixed(2)}
C = ${C.toFixed(2)}°${tempUnit}

Step 3: Calculate k using known point
${knownTemp1} = ${ambientTemp.toFixed(2)} + ${C.toFixed(2)}e^(-k*${knownTime1})
${(knownTemp1 - ambientTemp).toFixed(2)} = ${C.toFixed(2)}e^(-k*${knownTime1})
k = ${k.toFixed(6)} per ${timeUnit}

Step 4: Calculate Time to Reach Target Temperature
T = T∞ + Ce^(-kt)
${targetTemp.toFixed(2)} = ${ambientTemp.toFixed(2)} + ${C.toFixed(2)}e^(-${k.toFixed(6)}t)
${(targetTemp - ambientTemp).toFixed(2)} = ${C.toFixed(2)}e^(-${k.toFixed(6)}t)
t = -ln((${targetTemp.toFixed(2)} - ${ambientTemp.toFixed(2)})/${C.toFixed(2)})/${k.toFixed(6)}
t = ${calculatedTime.toFixed(2)} ${timeUnit}

Time in minutes and seconds: ${Math.floor(calculatedTime)} min and ${Math.round((calculatedTime % 1) * 60)} seconds

Verification:
- Ambient Temperature (T∞): ${ambientTemp.toFixed(2)}°${tempUnit}
- Initial Temperature (T₀): ${initialTemp.toFixed(2)}°${tempUnit}
- Known Point: ${knownTemp1.toFixed(2)}°${tempUnit} at t=${knownTime1} ${timeUnit}
- Target Temperature: ${targetTemp.toFixed(2)}°${tempUnit}
- Cooling Coefficient (k): ${k.toFixed(6)} per ${timeUnit}
- Required Time: ${calculatedTime.toFixed(2)} ${timeUnit}`;

            return {
                time: calculatedTime,
                detailedCalculation: detailedSteps

            };
        }
    }
};

//Input Functions
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
                    // Match Python inputs
                    result = calculations.growthDecay.amount({
                        x0: inputMap['initialValue'],  // x0 - initial value
                        t1: inputMap['time1'],         // t1 - time for x1
                        x1: inputMap['value1'],        // x1 - amount at time t1
                        t2: inputMap['time2'],         // t2 - target time
                        timeUnit: inputMap['timeUnit'],
                        unitX: inputMap['unitX']
                    });
                    break;
                
                case 'find-initial':
                    // Match Python inputs for initial value calculation
                    result = calculations.growthDecay.initialValue({
                        x1: inputMap['value1'],        // x1 - amount at time t1
                        t1: inputMap['time1'],         // t1 - first time
                        x2: inputMap['value2'],        // x2 - amount at time t2
                        t2: inputMap['time2'],         // t2 - second time
                        timeUnit: inputMap['timeUnit'],
                        unitX: inputMap['unitX']
                    });
                    break;
                
                case 'find-time':
                    // Match Python inputs for time calculation
                    result = calculations.growthDecay.time({
                        x0: inputMap['initialValue'],  // x0 - initial value
                        x1: inputMap['value1'],        // x1 - amount at time t1
                        t1: inputMap['time1'],         // t1 - known time
                        x2: inputMap['targetValue'],   // x2 - target value
                        timeUnit: inputMap['timeUnit']
                    });
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
                            knownTemp1: inputMap['knownTemp1'],
                            knownTime1: inputMap['knownTime1'],
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
                'find-time': [
                    { label: 'Initial Value (x₀)', id: 'initialValue', type: 'number' },
                    { label: 'Unit of x', id: 'unitX', type: 'select', options: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces', 'Others'] },
                    { label: 'Value at Time 1 (x₁)', id: 'value1', type: 'number' },
                    { label: 'Time 1', id: 'time1', type: 'number' },
                    { label: 'Target Value (x₂)', id: 'targetValue', type: 'number' },
                    { label: 'Time Unit', id: 'timeUnit', type: 'select', options: ['seconds', 'minutes', 'hours', 'days', 'year'] }
                ],
                'find-initial': [
                    { label: 'Time 1', id: 'time1', type: 'number' },
                    { label: 'Value at Time 1 (x₁)', id: 'value1', type: 'number' },
                    { label: 'Time 2', id: 'time2', type: 'number' },
                    { label: 'Value at Time 2 (x₂)', id: 'value2', type: 'number' },
                    { label: 'Unit of x', id: 'unitX', type: 'select', options: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces', 'Others'] },
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
                    { label: 'Known Temperature Point', id: 'knownTemp1', type: 'number' },
                    { label: 'Time at Known Point', id: 'knownTime1', type: 'number' },
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

// Graph Generation
const graphGenerators = {
    growthDecay(options) {
        const { x0, t1, x1, t2, timeUnit, unitX } = options;

        // Calculate k using the known points
        const k = Math.log(x1 / x0) / t1;

        // Generate curve points with better distribution
        const numPoints = 200;  // Increased for smoother curve
        const curvePoints = [];
        
        for (let i = 0; i <= numPoints; i++) {
            const t = (i / numPoints) * Math.max(t1, t2);
            const x = x0 * Math.exp(k * t);
            curvePoints.push({ x: t, y: x });
        }

        // Add specific time points for highlighting
        const specificPoints = [
            { x: 0, y: x0 },     // Initial point
            { x: t1, y: x1 },    // Time 1 point
            { x: t2, y: x0 * Math.exp(k * t2) }  // Time 2 point
        ];

        return {
            label: `Growth/Decay (${unitX})`,
            datasets: [
                {
                    label: 'Continuous Curve',
                    data: curvePoints,
                    borderColor: 'var(--text-primary)',
                    backgroundColor: 'rgba(166, 77, 121, 0.2)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Time Points',
                    data: specificPoints,
                    borderColor: 'var(--text-primary)',
                    backgroundColor: 'var(--text-primary)',
                    pointRadius: 6,
                    pointStyle: 'circle',
                    showLine: false
                }
            ],
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: `Time (${timeUnit})`
                        },
                        grid: {
                            display: true
                        },
                        ticks: {
                            callback: value => value.toFixed(1)
                        }
                    },
                    y: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: unitX
                        },
                        grid: {
                            display: true
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: (${context.parsed.x.toFixed(1)} ${timeUnit}, ${context.parsed.y.toFixed(2)} ${unitX})`;
                            }
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        };
    },

    heatTransfer(options) {
        const { ambientTemp, initialTemp, targetTime, tempUnit, timeUnit } = options;

        // Calculate k using the known data point (T=31°C at t=1)
        const C = initialTemp - ambientTemp;
        const k = Math.log((31 - ambientTemp) / C) / -1;

        // Generate curve points
        const numPoints = 200;
        const curvePoints = [];
        const maxTime = Math.max(targetTime, 5); // Ensure we show at least 5 time units

        for (let i = 0; i <= numPoints; i++) {
            const t = (i / numPoints) * maxTime;
            const temp = ambientTemp + C * Math.exp(-k * t);
            curvePoints.push({ x: t, y: temp });
        }

        // Add specific time points for highlighting
        const specificPoints = [
            { x: 0, y: initialTemp },  // Initial temperature
            { x: targetTime, y: ambientTemp + C * Math.exp(-k * targetTime) }  // Temperature at target time
        ];

        return {
            label: `Temperature vs Time`,
            datasets: [
                {
                    label: 'Temperature Curve',
                    data: curvePoints,
                    borderColor: 'var(--text-primary)',
                    backgroundColor: 'rgba(166, 77, 121, 0.2)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Time Points',
                    data: specificPoints,
                    borderColor: 'var(--text-primary)',
                    backgroundColor: 'var(--text-primary)',
                    pointRadius: 6,
                    pointStyle: 'circle',
                    showLine: false
                }
            ],
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: `Time (${timeUnit})`
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        min: 0,
                        max: maxTime
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: `Temperature (°${tempUnit})`
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: (${context.parsed.x.toFixed(1)} ${timeUnit}, ${context.parsed.y.toFixed(1)}°${tempUnit})`;
                            }
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true
                        }
                    }
                }
            }
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
                datasets: graphData.datasets
            },
            options: {
                responsive: true,
                ...graphData.options,
                interaction: {
                    intersect: false,
                    mode: 'nearest'
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
