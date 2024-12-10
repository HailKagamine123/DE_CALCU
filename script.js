// Utility Functions (keep existing ones)
function toKelvin(value, unit) {
    switch (unit) {
        case "Celsius": return value + 273.15;
        case "Fahrenheit": return (value - 32) * (5 / 9) + 273.15;
        case "Kelvin": return value;
        default: return value;
    }
}

function fromKelvin(value, unit) {
    switch (unit) {
        case "Celsius": return value - 273.15;
        case "Fahrenheit": return (value - 273.15) * (9 / 5) + 32;
        case "Kelvin": return value;
        default: return value;
    }
}

function normalizeTime(value, unit) {
    switch (unit) {
        case "seconds": return value / 3600;
        case "minutes": return value / 60;
        case "hours": return value;
        case "days": return value * 24;
        case "year": return value * 24 * 365.25
        default: return value;
    }
}

function denormalizeTime(value, unit) {
    switch (unit) {
        case "seconds": return value * 3600;
        case "minutes": return value * 60;
        case "hours": return value;
        case "days": return value / 24;
        case "year": return value / (24 * 365.25)
        default: return value;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    
    // Function to toggle theme
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        
        // Save theme preference to localStorage
        const isDarkMode = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Update button text
        themeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
    
    // Add click event listener to theme toggle button
    themeToggle.addEventListener('click', toggleTheme);
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme on page load
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        themeToggle.textContent = '🌙 Dark Mode';
    }
});

function promptContinue() {
    // Create a confirmation dialog using CSS variables for theming
    const continuePrompt = document.createElement('div');
    continuePrompt.innerHTML = `
        <div id="continueSection" style="
            background-color: var(--bg-secondary);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-top: 20px;
            box-shadow: 0 5px 15px var(--shadow);
        ">
            <h3 style="color: var(--text-primary);">Would you like to continue using the calculator?</h3>
            <button id="yesContinueBtn" style="
                background-color: var(--input-focus);
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                margin-right: 10px;
                transition: all 0.3s ease;
            ">Yes</button>
            <button id="noContinueBtn" style="
                background-color: var(--bg-accent);
                color: var(--text-primary);
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                transition: all 0.3s ease;
            ">No</button>
        </div>
    `;

    // Insert the prompt after the result section
    resultSection.after(continuePrompt);

    // Add event listeners to the new buttons
    document.getElementById('yesContinueBtn').addEventListener('click', () => {
        // Remove the continue section
        continuePrompt.remove();

        // Reset the calculator
        document.getElementById('calcType').selectedIndex = 0;
        document.getElementById('calculationType').innerHTML = '<option value="">Select Calculation Variant</option>';
        document.getElementById('inputForm').innerHTML = '';
        document.getElementById('calculatorOptions').style.display = 'none';
        resultSection.style.display = 'none';
    });

    document.getElementById('noContinueBtn').addEventListener('click', () => {
        // Create a thank you message using the same theming approach
        const thankYouMessage = document.createElement('div');
        thankYouMessage.innerHTML = `
            <div style="
                background-color: var(--bg-secondary);
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin-top: 20px;
                box-shadow: 0 5px 15px var(--shadow);
            ">
                <h3 style="color: var(--text-primary);">Thank you for using the Differential Equations Calculator!</h3>
                <p style="color: var(--text-secondary);">We hope this tool was helpful for your calculations.</p>
            </div>
        `;

        // Replace the continue prompt with thank you message
        continuePrompt.replaceWith(thankYouMessage);

        // Optional: Hide calculator section after a delay
        setTimeout(() => {
            calculatorSection.style.display = 'none';
            welcomeSection.style.display = 'block';
        }, 3000);
    });
}

// Enhanced Input Handling
function generateInputForm(calcType, calculationType) {
    const inputForm = document.getElementById('inputForm');
    inputForm.innerHTML = ''; // Clear previous inputs

    // Temperature Unit Dropdown (reusable)
    const temperatureUnitDropdown = `
        <div class="input-group">
            <label for="unit-temp">Unit of Temperature:</label>
            <select id="unit-temp" required>
                <option value="Celsius">Celsius (°C)</option>
                <option value="Fahrenheit">Fahrenheit (°F)</option>
                <option value="Kelvin" selected>Kelvin (K)</option>
            </select>
        </div>
    `;

    // Time Unit Dropdown (reusable)
    const timeUnitDropdown = `
    <div class="input-group">
        <label for="unit-time">Unit of Time:</label>
        <select id="unit-time" required>
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="year">Years</option>
        </select>
    </div>
    `;

    const unitOfXInput = `
        <div class="input-group">
            <label for="unit-x">Unit of Quantity (x):</label>
            <input type="text" id="unit-x" placeholder="e.g., kg, m, $" required>
        </div>
    `;

    // Dynamic Input Generation
    if (calcType === 'growth-decay') {
        switch (calculationType) {
            case 'find-amount':
                inputForm.innerHTML = `
                    <div class="input-group">
                        <label for="initial-value">Initial Value (x₀):</label>
                        <input type="number" id="initial-value" required>
                    </div>
                    <div class="input-group">
                        <label for="time1">Time t₁:</label>
                        <input type="number" id="time1" required>
                    </div>
                    <div class="input-group">
                        <label for="amount1">Amount at Time t₁ (x₁):</label>
                        <input type="number" id="amount1" required>
                    </div>
                    <div class="input-group">
                        <label for="time2">Time t₂:</label>
                        <input type="number" id="time2" required>
                    </div>
                    ${unitOfXInput}
                    ${timeUnitDropdown}
                `;
                break;
            case 'find-initial':
                inputForm.innerHTML = `
                    <div class="input-group">
                        <label for="amount1">Amount at Time t₁ (x₁):</label>
                        <input type="number" id="amount1" required>
                    </div>
                    <div class="input-group">
                        <label for="time1">Time t₁:</label>
                        <input type="number" id="time1" required>
                    </div>
                    <div class="input-group">
                        <label for="amount2">Amount at Time t₂ (x₂):</label>
                        <input type="number" id="amount2" required>
                    </div>
                    <div class="input-group">
                        <label for="time2">Time t₂:</label>
                        <input type="number" id="time2" required>
                    </div>
                    ${unitOfXInput}
                    ${timeUnitDropdown}
                `;
                break;
                case 'find-time':
                    inputForm.innerHTML = `
                        <div class="input-group">
                            <label for="initial-value">Initial Value (x₀):</label>
                            <input type="number" id="initial-value" required>
                        </div>
                        <div class="input-group">
                            <label for="amount1">Amount at Time t1 (x1):</label>
                            <input type="number" id="amount1" required>
                        </div>
                        <div class="input-group">
                            <label for="time1">Time t1:</label>
                            <input type="number" id="time1" required>
                        </div>
                        <div class="input-group">
                            <label for="amount2">Amount at Time t2 (x2):</label>
                            <input type="number" id="amount2" required>
                        </div>
                        ${unitOfXInput}
                        ${timeUnitDropdown}
                    `;
                    break;
        }
    } else if (calcType === 'heat-cool') {
        switch (calculationType) {
            case 'find-temp':
                inputForm.innerHTML = `
                    <div class="input-group">
                        <label for="ambient-temp">Ambient Temperature (Tₐ):</label>
                        <input type="number" id="ambient-temp" required>
                    </div>
                    <div class="input-group">
                        <label for="initial-temp">Initial Temperature (T₀):</label>
                        <input type="number" id="initial-temp" required>
                    </div>
                    <div class="input-group">
                        <label for="known-time">Known Time (t₁):</label>
                        <input type="number" id="known-time" required>
                    </div>
                    <div class="input-group">
                        <label for="known-temp">Temperature at t₁ (T₁):</label>
                        <input type="number" id="known-temp" required>
                    </div>
                    <div class="input-group">
                        <label for="target-time">Target Time (t₂):</label>
                        <input type="number" id="target-time" required>
                    </div>
                    ${temperatureUnitDropdown}
                    ${timeUnitDropdown}
                `;
                break;
            case 'find-initial-temp':
                inputForm.innerHTML = `
                    <div class="input-group">
                        <label for="ambient-temp">Ambient Temperature (Tₐ):</label>
                        <input type="number" id="ambient-temp" required>
                    </div>
                    <div class="input-group">
                        <label for="known-time1">Time t₁:</label>
                        <input type="number" id="known-time1" required>
                    </div>
                    <div class="input-group">
                        <label for="known-temp1">Temperature at Time t₁ (T₁):</label>
                        <input type="number" id="known-temp1" required>
                    </div>
                    <div class="input-group">
                        <label for="known-time2">Time t₂:</label>
                        <input type="number" id="known-time2" required>
                    </div>
                    <div class="input-group">
                        <label for="known-temp2">Temperature at Time t₂ (T₂):</label>
                        <input type="number" id="known-temp2" required>
                    </div>
                    ${temperatureUnitDropdown}
                    ${timeUnitDropdown}
                `;
                break;
            case 'find-time':
                inputForm.innerHTML = `
                    <div class="input-group">
                        <label for="ambient-temp">Ambient Temperature (Tₐ):</label>
                        <input type="number" id="ambient-temp" required>
                    </div>
                    <div class="input-group">
                        <label for="initial-temp">Initial Temperature (T₀):</label>
                        <input type="number" id="initial-temp" required>
                    </div>
                    <div class="input-group">
                        <label for="target-temp">Target Temperature (T):</label>
                        <input type="number" id="target-temp" required>
                    </div>
                    ${temperatureUnitDropdown}
                    ${timeUnitDropdown}
                `;
                break;
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const calcType = document.getElementById('calcType');
    const calculationType = document.getElementById('calculationType');
    const proceedButton = document.getElementById('proceedButton');
    const calculateButton = document.getElementById('calculateButton');
    const welcomeSection = document.getElementById('welcomeSection');
    const calculatorSection = document.getElementById('calculatorSection');
    const calculatorOptions = document.getElementById('calculatorOptions');

    // Proceed Button
    proceedButton.addEventListener('click', () => {
        welcomeSection.style.display = 'none';
        calculatorSection.style.display = 'block';
    });

    // Calculator Type Selection
    calcType.addEventListener('change', (e) => {
        const selectedType = e.target.value;
        calculatorOptions.style.display = selectedType ? 'block' : 'none';
        
        // Update title
        document.getElementById('calculatorTitle').textContent = 
            selectedType === 'growth-decay' 
                ? 'Growth and Decay Calculator' 
                : 'Heat Transfer and Cooling Calculator';

        // Populate Calculation Types
        calculationType.innerHTML = '<option value="">Select Calculation Variant</option>';
        if (selectedType === 'growth-decay') {
            calculationType.innerHTML += `
                <option value="find-amount">Determine Amount at Time (t)</option>
                <option value="find-initial">Determine Initial Value</option>
                <option value="find-time">Determine Time to Reach Value</option>
            `;
        } else if (selectedType === 'heat-cool') {
            calculationType.innerHTML += `
                <option value="find-temp">Determine Temperature at Time</option>
                <option value="find-initial-temp">Determine Initial Temperature</option>
                <option value="find-time">Determine Time to Reach Temperature</option>
            `;
        }
    });

    // Calculation Type Selection
    calculationType.addEventListener('change', (e) => {
        const selectedCalcType = calcType.value;
        const selectedCalculationType = e.target.value;
        
        // Generate appropriate input form
        if (selectedCalcType && selectedCalculationType) {
            generateInputForm(selectedCalcType, selectedCalculationType);
        }
    });

    // Calculate Button
    calculateButton.addEventListener('click', () => {
        const selectedCalcType = calcType.value;
        const selectedCalculationType = calculationType.value;

        // Validate inputs
        const inputs = document.querySelectorAll('#inputForm input');
        const isValid = Array.from(inputs).every(input => input.checkValidity());

        if (!isValid) {
            alert('Please fill in all required fields with valid numbers.');
            return;
        }

        // Route to appropriate calculation function
        switch (selectedCalcType) {
            case 'growth-decay':
                switch (selectedCalculationType) {
                    case 'find-amount': calculateGrowthDecayAmount(); break;
                    case 'find-initial': calculateGrowthDecayInitial(); break;
                    case 'find-time': calculateGrowthDecayTime(); break;
                }
                break;
            case 'heat-cool':
                switch (selectedCalculationType) {
                    case 'find-temp': calculateHeatTransferTemp(); break;
                    case 'find-initial-temp': calculateHeatInitialTemp(); break;
                    case 'find-time': calculateHeatTransferTime(); break;
                }
                break;
        }
    });
});

function calculateGrowthDecayAmount() {
    const x0 = parseFloat(document.getElementById('initial-value').value);
    const t1 = parseFloat(document.getElementById('time1').value);
    const x1 = parseFloat(document.getElementById('amount1').value);
    const t2 = parseFloat(document.getElementById('time2').value);
    const unitX = document.getElementById('unit-x').value;
    const timeUnit = document.getElementById('unit-time').value;

    // Normalize time
    const t1Norm = normalizeTime(t1, timeUnit);
    const t2Norm = normalizeTime(t2, timeUnit);

    // Step 1: Solve for c (initial value)
    const c = x0;

    // Step 2: Solve for k (growth/decay rate)
    const k = Math.log(x1 / c) / t1Norm;

    // Step 3: Solve for x at t2
    const x2 = c * Math.exp(k * t2Norm);

    // Step 4: Calculate rate of change (dx/dt)
    const dxdt = k * x2;

    // Display result with detailed steps
    resultSection.style.display = 'block';
    resultText.innerHTML = `
Step 1: Solve for c
c = ${c}

Step 2: Solve for k
k = ln(${x1} / ${c}) / ${t1Norm.toFixed(4)}
  = ${k.toFixed(4)}

Step 3: Solve for x at t2
x = ${c} * e^(${k.toFixed(4)} * ${t2Norm.toFixed(4)})
  = ${x2.toFixed(4)} ${unitX}

Step 4: Calculate dx/dt
dx/dt = k * x
      = ${k.toFixed(4)} * ${x2.toFixed(4)}
      = ${dxdt.toFixed(4)} ${unitX}/hour

The growth/decay rate of x is ${dxdt.toFixed(4)} ${unitX}/hour
At time ${t2} ${timeUnit}, x is ${x2.toFixed(4)} ${unitX}
    `;
    promptContinue();
}

function calculateGrowthDecayInitial() {
  // Comprehensive element selection and validation
  const requiredElements = ['amount1', 'time1', 'amount2', 'time2', 'unit-x', 'unit-time'];
  const missingElements = requiredElements.filter(id => !document.getElementById(id));

  if (missingElements.length > 0) {
    console.error('Missing input elements:', missingElements);
    alert(`Error: The following input fields are missing: ${missingElements.join(', ')}. Please ensure the form is correctly generated.`);
    return;
  }

  // Get all required elements
  const amount1El = document.getElementById('amount1');
  const time1El = document.getElementById('time1');
  const amount2El = document.getElementById('amount2');
  const time2El = document.getElementById('time2');
  const unitXEl = document.getElementById('unit-x');
  const timeUnitEl = document.getElementById('unit-time');

  // Validate input values
  const inputValues = [
    { el: amount1El, name: 'Amount 1' },
    { el: time1El, name: 'Time 1' },
    { el: amount2El, name: 'Amount 2' },
    { el: time2El, name: 'Time 2' },
    { el: unitXEl, name: 'Unit of Quantity' }
  ];
  const invalidInputs = inputValues.filter(input => !input.el.value || (input.name !== 'Unit of Quantity' && isNaN(parseFloat(input.el.value))));
  if (invalidInputs.length > 0) {
    const invalidNames = invalidInputs.map(input => input.name);
    alert(`Please check the following inputs: ${invalidNames.join(', ')}`);
    return;
  }

  // Parse input values
  const x1 = parseFloat(amount1El.value);
  const t1 = parseFloat(time1El.value);
  const x2 = parseFloat(amount2El.value);
  const t2 = parseFloat(time2El.value);
  const unitX = unitXEl.value;
  const timeUnit = timeUnitEl.value;

  // Normalize time
  const t1Norm = normalizeTime(t1, timeUnit);
  const t2Norm = normalizeTime(t2, timeUnit);

  // Calculate initial value (x0)
  const x0 = x1 / Math.exp(Math.log(x2 / x1) * (t1Norm / (t2Norm - t1Norm)));

  // Display result with detailed steps
  const resultSection = document.getElementById('resultSection');
  const resultText = document.getElementById('resultText');
  resultSection.style.display = 'block';
  resultText.innerHTML = `
Detailed Calculation Steps:
Step 1: Calculate Initial Value (x₀)
x₀ = x₁ / (x₂ / x₁)^(t₁ / (t₂ - t₁))
   = ${x1.toFixed(4)} / (${x2.toFixed(4)} / ${x1.toFixed(4)})^(${t1Norm.toFixed(4)} / (${t2Norm.toFixed(4)} - ${t1Norm.toFixed(4)}))
   = ${x0.toFixed(4)} ${unitX}

Verification:
- Value at t₁ (x₁): ${x1.toFixed(4)} ${unitX}
- Value at t₂ (x₂): ${x2.toFixed(4)} ${unitX}
- Calculated Initial Value (x₀): ${x0.toFixed(4)} ${unitX}
- Time t₁: ${t1Norm.toFixed(4)} ${timeUnit}
- Time t₂: ${t2Norm.toFixed(4)} ${timeUnit}
  `;

  promptContinue();
}

function calculateGrowthDecayTime() {
    // Comprehensive element selection and validation
    const requiredElements = [
        'initial-value', 'amount1', 'time1', 'amount2', 'unit-x', 'unit-time'
    ];

    // Check for missing elements
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.error('Missing input elements:', missingElements);
        alert(`Error: The following input fields are missing: ${missingElements.join(', ')}. 
Please ensure the form is correctly generated.`);
        return;
    }

    // Get all required elements
    const initialValueEl = document.getElementById('initial-value');
    const amount1El = document.getElementById('amount1');
    const time1El = document.getElementById('time1');
    const amount2El = document.getElementById('amount2');
    const unitXEl = document.getElementById('unit-x');
    const timeUnitEl = document.getElementById('unit-time');

    // Validate input values
    const inputValues = [
        { el: initialValueEl, name: 'Initial Value' },
        { el: amount1El, name: 'Amount 1' },
        { el: time1El, name: 'Time 1' },
        { el: amount2El, name: 'Amount 2' },
        { el: unitXEl, name: 'Unit of Quantity' }
    ];

    const invalidInputs = inputValues.filter(input => 
        !input.el.value || 
        (input.name !== 'Unit of Quantity' && isNaN(parseFloat(input.el.value)))
    );

    if (invalidInputs.length > 0) {
        const invalidNames = invalidInputs.map(input => input.name);
        alert(`Please check the following inputs: ${invalidNames.join(', ')}`);
        return;
    }

    // Parse input values
    const x0 = parseFloat(initialValueEl.value);
    const x1 = parseFloat(amount1El.value);
    const t1 = parseFloat(time1El.value);
    const x2 = parseFloat(amount2El.value);
    const unitX = unitXEl.value;
    const timeUnit = timeUnitEl.value;

    // Normalize time
    const t1Norm = normalizeTime(t1, timeUnit);

    // Detailed calculation steps
    // Step 1: Calculate growth/decay rate (k)
    const k = Math.log(x1 / x0) / t1Norm;

    // Step 2: Calculate time to reach x2
    const t2 = Math.log(x2 / x0) / k;

    // Determine growth or decay
    const growthType = k > 0 ? 'growth' : 'decay';
    const absoluteK = Math.abs(k);

    // Create descriptive sentence
    const timeSentence = `The time required to ${growthType === 'growth' ? 'grow' : 'reduce'} from ${x0.toFixed(2)} ${unitX} to ${x2.toFixed(2)} ${unitX} with a ${growthType} rate of ${absoluteK.toFixed(4)} per ${timeUnit} is ${t2.toFixed(4)} ${timeUnit}.`;

    // Display result with detailed steps
    const resultSection = document.getElementById('resultSection');
    const resultText = document.getElementById('resultText');

    resultSection.style.display = 'block';
    resultText.innerHTML = `
${timeSentence}

Detailed Calculation Steps:

Step 1: Calculate Growth/Decay Rate (k)
k = ln(${x1} / ${x0}) / ${t1Norm.toFixed(4)}
  = ${k.toFixed(4)} per ${timeUnit}

Step 2: Calculate Time to Reach Target Value (t₂)
t₂ = ln(${x2} / ${x0}) / ${k.toFixed(4)}
   = ${t2.toFixed(4)} ${timeUnit}

Verification:
- Initial Value (x₀): ${x0.toFixed(4)} ${unitX}
- Value at t₁ (x₁): ${x1.toFixed(4)} ${unitX}
- Target Value (x₂): ${x2.toFixed(4)} ${unitX}
- Calculated Time (t₂): ${t2.toFixed(4)} ${timeUnit}

Verification Check:
x₀ * e^(k * t₂) = ${(x0 * Math.exp(k * t2)).toFixed(4)} ${unitX}
Expected x₂    = ${x2.toFixed(4)} ${unitX}
    `;
    promptContinue();

}

function calculateHeatTransferTemp() {
    const ambientTemp = parseFloat(document.getElementById('ambient-temp').value);
    const initialTemp = parseFloat(document.getElementById('initial-temp').value);
    const knownTime = parseFloat(document.getElementById('known-time').value);
    const knownTemp = parseFloat(document.getElementById('known-temp').value);
    const targetTime = parseFloat(document.getElementById('target-time').value);
    const tempUnit = document.getElementById('unit-temp').value;
    const timeUnit = document.getElementById('unit-time').value;

    // Convert temperatures to Kelvin
    const ambientTempK = toKelvin(ambientTemp, tempUnit);
    const initialTempK = toKelvin(initialTemp, tempUnit);
    const knownTempK = toKelvin(knownTemp, tempUnit);

    // Normalize time
    const knownTimeNorm = normalizeTime(knownTime, timeUnit);
    const targetTimeNorm = normalizeTime(targetTime, timeUnit);

    // Step 1: Calculate heat transfer coefficient (k)
    const k = -Math.log((knownTempK - ambientTempK) / (initialTempK - ambientTempK)) / knownTimeNorm;

    // Step 2: Calculate target temperature
    const targetTempK = ambientTempK + (initialTempK - ambientTempK) * Math.exp(-k * targetTimeNorm);
    const targetTemp = fromKelvin(targetTempK, tempUnit);

    // Step 3: Verify calculations
    const verifyTempK = ambientTempK + (initialTempK - ambientTempK) * Math.exp(-k * knownTimeNorm);
    const verifyTemp = fromKelvin(verifyTempK, tempUnit);

    // Display result with detailed steps
    const resultSection = document.getElementById('resultSection');
    const resultText = document.getElementById('resultText');

    resultSection.style.display = 'block';
    resultText.innerHTML = `
Detailed Heat Transfer Temperature Calculation Steps:

Step 1: Temperature Analysis
Ambient Temperature (Tₐ): ${ambientTempK.toFixed(4)} K (${ambientTemp.toFixed(4)} ${tempUnit})
Initial Temperature (T₀): ${initialTempK.toFixed(4)} K (${initialTemp.toFixed(4)} ${tempUnit})
Known Temperature at t₁: ${knownTempK.toFixed(4)} K (${knownTemp.toFixed(4)} ${tempUnit})
Known Time (t₁): ${knownTimeNorm.toFixed(4)} normalized hours
Target Time (t₂): ${targetTimeNorm.toFixed(4)} normalized hours

Step 2: Calculate Heat Transfer Coefficient (k)
k = -ln((${knownTempK.toFixed(4)} - ${ambientTempK.toFixed(4)}) / 
        (${initialTempK.toFixed(4)} - ${ambientTempK.toFixed(4)})) / ${knownTimeNorm.toFixed(4)}
  = ${k.toFixed(4)} per normalized hour

Step 3: Calculate Target Temperature
T(t₂) = ${ambientTempK.toFixed(4)} + 
        (${initialTempK.toFixed(4)} - ${ambientTempK.toFixed(4)}) * 
        e^(-${k.toFixed(4)} * ${targetTimeNorm.toFixed(4)})
      = ${targetTempK.toFixed(4)} K
      = ${targetTemp.toFixed(4)} ${tempUnit}

Step 4: Verification
Recalculating Known Temperature (T₁):
T₁ = ${ambientTempK.toFixed(4)} + 
     (${initialTempK.toFixed(4)} - ${ambientTempK.toFixed(4)}) * 
     e^(-${k.toFixed(4)} * ${knownTimeNorm.toFixed(4)})
   = ${verifyTempK.toFixed(4)} K
   = ${verifyTemp.toFixed(4)} ${tempUnit}

Verification match: ${Math.abs(verifyTemp - knownTemp) < 0.0001 ? 'YES' : 'NO'}

Final Results:
- Temperature at Target Time (t₂): ${targetTemp.toFixed(4)} ${tempUnit}
- Heat Transfer Coefficient (k): ${k.toFixed(4)} per ${timeUnit}
    `;
    promptContinue();
}

function calculateHeatInitialTemp() {
    const ambientTemp = parseFloat(document.getElementById('ambient-temp').value);
    const knownTime1 = parseFloat(document.getElementById('known-time1').value);
    const knownTemp1 = parseFloat(document.getElementById('known-temp1').value);
    const knownTime2 = parseFloat(document.getElementById('known-time2').value);
    const knownTemp2 = parseFloat(document.getElementById('known-temp2').value);
    const tempUnit = document.getElementById('unit-temp').value;
    const timeUnit = document.getElementById('unit-time').value;

    // Get result section elements
    const resultSection = document.getElementById('resultSection');
    const resultText = document.getElementById('resultText');

    // Convert temperatures to Kelvin
    const ambientTempK = toKelvin(ambientTemp, tempUnit);
    const knownTemp1K = toKelvin(knownTemp1, tempUnit);
    const knownTemp2K = toKelvin(knownTemp2, tempUnit);

    // Validate temperature progression
    const isValidCooling = knownTemp1K < ambientTempK && knownTemp2K < knownTemp1K;
    const isValidHeating = knownTemp1K > ambientTempK && knownTemp2K > knownTemp1K;

    if (!isValidCooling && !isValidHeating) {
        alert('Invalid temperature progression. Temperatures must consistently move towards ambient temperature.');
        return;
    }

    // Standard heat transfer coefficient assumption
    const k = 1;

    // Solve for initial temperature
    const numerator = Math.log((knownTemp1K - ambientTempK) / (knownTemp2K - ambientTempK));
    const denominator = (knownTime2 - knownTime1) * k;
    const initialTempK = ambientTempK + (knownTemp1K - ambientTempK) * Math.exp(k * knownTime1);

    // Denormalize and convert temperatures back to original unit
    const initialTemp = fromKelvin(initialTempK, tempUnit);

    // Verify temperatures at known times
    const verifyTemp1K = ambientTempK + (initialTempK - ambientTempK) * Math.exp(-k * knownTime1);
    const verifyTemp2K = ambientTempK + (initialTempK - ambientTempK) * Math.exp(-k * knownTime2);
    const verifyTemp1 = fromKelvin(verifyTemp1K, tempUnit);
    const verifyTemp2 = fromKelvin(verifyTemp2K, tempUnit);

    // Display result with detailed steps
    resultSection.style.display = 'block';
    resultText.innerHTML = `
Detailed Heat Transfer Initial Temperature Calculation Steps:

Step 1: Temperature Analysis
Ambient Temperature (Tₐ): ${ambientTempK.toFixed(4)} K (${ambientTemp.toFixed(4)} ${tempUnit})
Known Point 1: 
  - Time (t₁): ${knownTime1.toFixed(4)} ${timeUnit}
  - Temperature: ${knownTemp1K.toFixed(4)} K (${knownTemp1.toFixed(4)} ${tempUnit})
Known Point 2: 
  - Time (t₂): ${knownTime2.toFixed(4)} ${timeUnit}
  - Temperature: ${knownTemp2K.toFixed(4)} K (${knownTemp2.toFixed(4)} ${tempUnit})

Step 2: Heat Transfer Coefficient Assumption
k = 1 (standard heat transfer rate)

Step 3: Calculate Initial Temperature
T₀ = Tₐ + (T₁ - Tₐ) * e^(k * t₁)
   = ${ambientTempK.toFixed(4)} + 
     (${knownTemp1K.toFixed(4)} - ${ambientTempK.toFixed(4)}) * 
     e^(1 * ${knownTime1.toFixed(4)})
   = ${initialTempK.toFixed(4)} K
   = ${initialTemp.toFixed(4)} ${tempUnit}

Step 4: Verification of Known Temperatures
At Time t₁: 
  Predicted: ${verifyTemp1K.toFixed(4)} K (${verifyTemp1.toFixed(4)} ${tempUnit})
  Actual: ${knownTemp1K.toFixed(4)} K (${knownTemp1.toFixed(4)} ${tempUnit})
  Difference: ${Math.abs(verifyTemp1 - knownTemp1).toFixed(4)} ${tempUnit}

At Time t₂:
  Predicted: ${verifyTemp2K.toFixed(4)} K (${verifyTemp2.toFixed(4)} ${tempUnit})
  Actual: ${knownTemp2K.toFixed(4)} K (${knownTemp2.toFixed(4)} ${tempUnit})
  Difference: ${Math.abs(verifyTemp2 - knownTemp2).toFixed(4)} ${tempUnit}

Final Result:
- Initial Temperature (T₀): ${initialTemp.toFixed(4)} ${tempUnit}
    `;

    promptContinue();
}

function calculateHeatTransferTime() {
    const ambientTemp = parseFloat(document.getElementById('ambient-temp').value);
    const initialTemp = parseFloat(document.getElementById('initial-temp').value);
    const targetTemp = parseFloat(document.getElementById('target-temp').value);
    const tempUnit = document.getElementById('unit-temp').value;
    const timeUnit = document.getElementById('unit-time').value;

    // Get result section elements
    const resultSection = document.getElementById('resultSection');
    const resultText = document.getElementById('resultText');

    // Convert temperatures to Kelvin
    const ambientTempK = toKelvin(ambientTemp, tempUnit);
    const initialTempK = toKelvin(initialTemp, tempUnit);
    const targetTempK = toKelvin(targetTemp, tempUnit);

    // Revised temperature progression check
    const isValidCooling = initialTempK > ambientTempK && 
                            targetTempK < initialTempK && 
                            targetTempK > ambientTempK;
    const isValidHeating = initialTempK < ambientTempK && 
                            targetTempK > initialTempK && 
                            targetTempK < ambientTempK;

    // Check for valid temperature progression
    if (!isValidCooling && !isValidHeating) {
        alert('Invalid temperature progression. Target temperature must be between initial and ambient temperatures.');
        return;
    }

    // Step 2: Calculate heat transfer coefficient (k)
    const k = 1; // Standard heat transfer rate assumption
    
    // Step 3: Calculate time to reach target temperature
    const time = -Math.log((targetTempK - ambientTempK) / (initialTempK - ambientTempK)) / k;
    
    // Step 4: Denormalize time
    const denormalizedTime = denormalizeTime(time, timeUnit);

    // Step 5: Verify temperature at calculated time
    const verifyTempK = ambientTempK + (initialTempK - ambientTempK) * Math.exp(-k * time);
    const verifyTemp = fromKelvin(verifyTempK, tempUnit);

    // Display result with detailed steps
    resultSection.style.display = 'block';
    resultText.innerHTML = `
Detailed Heat Transfer Time Calculation Steps:

Step 1: Temperature Analysis
Ambient Temperature (Tₐ): ${ambientTempK.toFixed(4)} K (${ambientTemp.toFixed(4)} ${tempUnit})
Initial Temperature (T₀): ${initialTempK.toFixed(4)} K (${initialTemp.toFixed(4)} ${tempUnit})
Target Temperature (T₁): ${targetTempK.toFixed(4)} K (${targetTemp.toFixed(4)} ${tempUnit})

Step 2: Heat Transfer Coefficient Assumption
k = 1 (standard heat transfer rate)

Step 3: Calculate Time to Reach Target
t = -ln((${targetTempK.toFixed(4)} - ${ambientTempK.toFixed(4)}) / 
         (${initialTempK.toFixed(4)} - ${ambientTempK.toFixed(4)})) / 1
  = ${time.toFixed(4)} normalized hours

Step 4: Convert to Specific Time Unit
Time in ${timeUnit}: ${denormalizedTime.toFixed(4)} ${timeUnit}

Step 5: Verification
Verifying temperature at calculated time:
T = ${ambientTempK.toFixed(4)} + 
    (${initialTempK.toFixed(4)} - ${ambientTempK.toFixed(4)}) * 
    e^(-1 * ${time.toFixed(4)})
  = ${verifyTempK.toFixed(4)} K
  = ${verifyTemp.toFixed(4)} ${tempUnit}

Verification match: ${Math.abs(verifyTemp - targetTemp) < 0.0001 ? 'YES' : 'NO'}

Final Results:
- Time to Reach Target: ${denormalizedTime.toFixed(4)} ${timeUnit}
- Temperature at Target Time: ${verifyTemp.toFixed(4)} ${tempUnit}
    `;

    promptContinue();
}

// Include Chart.js library
// Include Chart.js library
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
script.async = true;
script.onerror = () => {
    console.error('Failed to load Chart.js');
    alert('Could not load graphing library. Please check your internet connection.');
};
document.head.appendChild(script);

document.addEventListener('DOMContentLoaded', () => {
    const graphButton = document.getElementById('graphButton');
    const graphContainer = document.getElementById('graphContainer');

    // Graphing Button Logic
    graphButton.addEventListener('click', () => {
        // Check if Chart is defined before attempting to use it
        if (typeof Chart === 'undefined') {
            alert('Graphing library is still loading. Please try again in a moment.');
            return;
        }

        const selectedCalcType = calcType.value;
        const selectedCalculationType = calculationType.value;

        let graphData = null;

        // Gather data based on calculation type
        switch (selectedCalcType) {
            case 'growth-decay':
                graphData = getGrowthDecayGraphData();
                break;
            case 'heat-cool':
                graphData = getHeatTransferGraphData();
                break;
        }

        if (graphData) {
            renderGraph(graphData);
        }
    });

    function getGrowthDecayGraphData() {
        const x0 = parseFloat(document.getElementById('initial-value').value);
        const t1 = parseFloat(document.getElementById('time1').value);
        const x1 = parseFloat(document.getElementById('amount1').value);
        const t2 = parseFloat(document.getElementById('time2').value);
        const unitX = document.getElementById('unit-x').value;
        const timeUnit = document.getElementById('unit-time').value;

        const t1Norm = normalizeTime(t1, timeUnit);
        const t2Norm = normalizeTime(t2, timeUnit);

        const c = x0;
        const k = Math.log(x1 / c) / t1Norm;

        // Generate data points
        const dataPoints = [];
        const steps = 20;
        const timeStep = (t2Norm - 0) / steps;

        for (let i = 0; i <= steps; i++) {
            const t = i * timeStep;
            const x = c * Math.exp(k * t);
            dataPoints.push({ x: t, y: x });
        }

        return {
            label: `Growth/Decay (${unitX})`,
            data: dataPoints,
            timeUnit,
            unitX
        };
    }

    function getHeatTransferGraphData() {
        const ambientTemp = parseFloat(document.getElementById('ambient-temp').value);
        const initialTemp = parseFloat(document.getElementById('initial-temp').value);
        const knownTime = parseFloat(document.getElementById('known-time').value);
        const targetTime = parseFloat(document.getElementById('target-time').value);
        const tempUnit = document.getElementById('unit-temp').value;
        const timeUnit = document.getElementById('unit-time').value;

        const ambientTempK = toKelvin(ambientTemp, tempUnit);
        const initialTempK = toKelvin(initialTemp, tempUnit);

        const knownTimeNorm = normalizeTime(knownTime, timeUnit);
        const targetTimeNorm = normalizeTime(targetTime, timeUnit);

        const k = 1; // Standard heat transfer coefficient

        // Generate data points
        const dataPoints = [];
        const steps = 20;
        const timeStep = (targetTimeNorm - 0) / steps;

        for (let i = 0; i <= steps; i++) {
            const t = i * timeStep;
            const tempK = ambientTempK + (initialTempK - ambientTempK) * Math.exp(-k * t);
            const temp = fromKelvin(tempK, tempUnit);
            dataPoints.push({ x: t, y: temp });
        }

        return {
            label: `Temperature (${tempUnit})`,
            data: dataPoints,
            timeUnit,
            tempUnit
        };
    }

    function renderGraph(graphData) {
        graphContainer.style.display = 'block';
        
        // Clear previous chart
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
    }
});
