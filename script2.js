// script2.js

// Part 2: Combinations of vital signs
const combinations = [
    // 1) High heart rate and low systolic blood pressure
    {
        'Heart Rate': { value: 'High', abnormal: true },
        'Systolic Blood Pressure': { value: 'Low', abnormal: true },
        'Respiratory Rate': { value: 'Normal', abnormal: false },
        'Temperature': { value: 'Normal', abnormal: false },
        'Oxygen Saturation': { value: 'Normal', abnormal: false }
    },
    // 2) High heart rate and high respiratory rate
    {
        'Heart Rate': { value: 'High', abnormal: true },
        'Systolic Blood Pressure': { value: 'Normal', abnormal: false },
        'Respiratory Rate': { value: 'High', abnormal: true },
        'Temperature': { value: 'Normal', abnormal: false },
        'Oxygen Saturation': { value: 'Normal', abnormal: false }
    },
    // 3) High heart rate and low temperature
    {
        'Heart Rate': { value: 'High', abnormal: true },
        'Systolic Blood Pressure': { value: 'Normal', abnormal: false },
        'Respiratory Rate': { value: 'Normal', abnormal: false },
        'Temperature': { value: 'Low', abnormal: true },
        'Oxygen Saturation': { value: 'Normal', abnormal: false }
    },
    // 4) High heart rate and high temperature
    {
        'Heart Rate': { value: 'High', abnormal: true },
        'Systolic Blood Pressure': { value: 'Normal', abnormal: false },
        'Respiratory Rate': { value: 'Normal', abnormal: false },
        'Temperature': { value: 'High', abnormal: true },
        'Oxygen Saturation': { value: 'Normal', abnormal: false }
    },
    // 5) High heart rate and low oxygen saturations
    {
        'Heart Rate': { value: 'High', abnormal: true },
        'Systolic Blood Pressure': { value: 'Normal', abnormal: false },
        'Respiratory Rate': { value: 'Normal', abnormal: false },
        'Temperature': { value: 'Normal', abnormal: false },
        'Oxygen Saturation': { value: 'Low', abnormal: true }
    },
    // 6) Low systolic blood pressure and high respiratory rate
    {
        'Heart Rate': { value: 'Normal', abnormal: false },
        'Systolic Blood Pressure': { value: 'Low', abnormal: true },
        'Respiratory Rate': { value: 'High', abnormal: true },
        'Temperature': { value: 'Normal', abnormal: false },
        'Oxygen Saturation': { value: 'Normal', abnormal: false }
    },
    // 7) Low systolic blood pressure and low temperature
    {
        'Heart Rate': { value: 'Normal', abnormal: false },
        'Systolic Blood Pressure': { value: 'Low', abnormal: true },
        'Respiratory Rate': { value: 'Normal', abnormal: false },
        'Temperature': { value: 'Low', abnormal: true },
        'Oxygen Saturation': { value: 'Normal', abnormal: false }
    },
    // 8) Low systolic blood pressure and high temperature
    {
        'Heart Rate': { value: 'Normal', abnormal: false },
        'Systolic Blood Pressure': { value: 'Low', abnormal: true },
        'Respiratory Rate': { value: 'Normal', abnormal: false },
        'Temperature': { value: 'High', abnormal: true },
        'Oxygen Saturation': { value: 'Normal', abnormal: false }
    },
    // 9) Low systolic blood pressure and low oxygen saturations
    {
        'Heart Rate': { value: 'Normal', abnormal: false },
        'Systolic Blood Pressure': { value: 'Low', abnormal: true },
        'Respiratory Rate': { value: 'Normal', abnormal: false },
        'Temperature': { value: 'Normal', abnormal: false },
        'Oxygen Saturation': { value: 'Low', abnormal: true }
    },
    // 10) High respiratory rate and low temperature
    {
        'Heart Rate': { value: 'Normal', abnormal: false },
        'Systolic Blood Pressure': { value: 'Normal', abnormal: false },
        'Respiratory Rate': { value: 'High', abnormal: true },
        'Temperature': { value: 'Low', abnormal: true },
        'Oxygen Saturation': { value: 'Normal', abnormal: false }
    },
    // 11) High respiratory rate and high temperature
    {
        'Heart Rate': { value: 'Normal', abnormal: false },
        'Systolic Blood Pressure': { value: 'Normal', abnormal: false },
        'Respiratory Rate': { value: 'High', abnormal: true },
        'Temperature': { value: 'High', abnormal: true },
        'Oxygen Saturation': { value: 'Normal', abnormal: false }
    },
    // 12) High respiratory rate and low oxygen saturations
    {
        'Heart Rate': { value: 'Normal', abnormal: false },
        'Systolic Blood Pressure': { value: 'Normal', abnormal: false },
        'Respiratory Rate': { value: 'High', abnormal: true },
        'Temperature': { value: 'Normal', abnormal: false },
        'Oxygen Saturation': { value: 'Low', abnormal: true }
    },
    // 13) Low temperature and low oxygen saturations
    {
        'Heart Rate': { value: 'Normal', abnormal: false },
        'Systolic Blood Pressure': { value: 'Normal', abnormal: false },
        'Respiratory Rate': { value: 'Normal', abnormal: false },
        'Temperature': { value: 'Low', abnormal: true },
        'Oxygen Saturation': { value: 'Low', abnormal: true }
    },
    // 14) High temperature and low oxygen saturations
    {
        'Heart Rate': { value: 'Normal', abnormal: false },
        'Systolic Blood Pressure': { value: 'Normal', abnormal: false },
        'Respiratory Rate': { value: 'Normal', abnormal: false },
        'Temperature': { value: 'High', abnormal: true },
        'Oxygen Saturation': { value: 'Low', abnormal: true }
    }
];

// Function to create a combination element with a single slider
function createCombinationElement(combination, index) {
    const container = document.createElement('div');
    container.className = 'combination';

    const title = document.createElement('h3');
    title.textContent = `Combination ${index + 1}`;
    container.appendChild(title);

    const table = document.createElement('table');
    table.className = 'combination-table';
    const tbody = document.createElement('tbody');

    Object.keys(combination).forEach(vitalSignName => {
        const vitalSignData = combination[vitalSignName];
        const value = vitalSignData.value;
        const isAbnormal = vitalSignData.abnormal;

        const tr = document.createElement('tr');

        const tdVitalSign = document.createElement('td');
        tdVitalSign.textContent = vitalSignName;
        tr.appendChild(tdVitalSign);

        const tdValue = document.createElement('td');
        tdValue.textContent = value;
        if (isAbnormal) {
            tdValue.style.color = '#e74c3c'; // Red color for abnormal values
            tdValue.style.fontWeight = 'bold';
        }
        tr.appendChild(tdValue);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    // Create a slider input
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';

    const sliderLabel = document.createElement('label');
    sliderLabel.innerHTML = 'Select your level of concern:<br>0 = No more concerning <br>5 = Moderately more concerning<br>10 = Much more concerning';
    sliderContainer.appendChild(sliderLabel);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '10';
    slider.value = '5'; // Default value
    slider.step = '1';
    slider.className = 'slider';
    slider.id = `slider-${index}`;
    sliderContainer.appendChild(slider);

    const sliderValueDisplay = document.createElement('div');
    sliderValueDisplay.className = 'slider-values';
    sliderValueDisplay.textContent = `Selected value: ${slider.value}`;
    sliderContainer.appendChild(sliderValueDisplay);

    // Update display and save data whenever the slider value changes
    slider.addEventListener('input', () => {
        sliderValueDisplay.textContent = `Selected value: ${slider.value}`;
        saveData();
    });

    container.appendChild(sliderContainer);

    return container;
}

// Function to collect data from sliders and store in sessionStorage
function collectData() {
    // Collect ratings from Part 2
    const part2Ratings = combinations.map((combination, index) => {
        const slider = document.getElementById(`slider-${index}`);
        if (slider) {
            const value = slider.value;
            return {
                'Combination': index + 1,
                'Rating': value
            };
        } else {
            console.error(`Slider for combination ${index + 1} not found.`);
            return {
                'Combination': index + 1,
                'Rating': null
            };
        }
    });

    // Store data in sessionStorage
    sessionStorage.setItem('part2Data', JSON.stringify(part2Ratings));

    return part2Ratings;
}

// Save data whenever input changes
function saveData() {
    collectData();
}

// Save data when the page is unloaded (optional redundancy)
window.addEventListener('beforeunload', saveData);

// Initialize the page when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page by creating all combination elements
    const part2Container = document.getElementById('part2Container');
    combinations.forEach((combination, index) => {
        const combinationElement = createCombinationElement(combination, index);
        part2Container.appendChild(combinationElement);
    });

    // Handle the submit button click event
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', () => {
        const data = collectData();
        alert('Your responses have been saved. Please proceed to Part 3.');
        // Add code here to submit data to Firestore
        if (typeof firebase !== 'undefined') {
            submitToFirestore(data);
        } else {
            console.error('Firebase is not defined. Make sure Firebase SDK is loaded.');
        }
        window.location.href = 'part3.html';
    });
});

// Function to submit data to Firestore
function submitToFirestore(data) {
    // Assuming Firestore has already been initialized
    if (typeof firebase !== 'undefined') {
        const db = firebase.firestore();
        db.collection('part2Data').add({
            combinations: data,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            console.log('Data successfully submitted to Firestore');
        }).catch((error) => {
            console.error('Error submitting data to Firestore: ', error);
        });
    } else {
        console.error('Firebase is not defined. Make sure Firebase SDK is loaded.');
    }
}