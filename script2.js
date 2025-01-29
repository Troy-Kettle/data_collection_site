document.addEventListener('DOMContentLoaded', () => {
    // Only validate if we're on part2.html
    if (window.location.pathname.includes('part2.html')) {
        const completionStatus = sessionStorage.getItem('completionStatus');
        const part1Data = sessionStorage.getItem('part1Data');
        
        if (completionStatus !== 'true' || !part1Data) {
            alert('You must complete Part 1 first');
            window.location.href = 'part1.html';
            return;
        }
    }

    // Change from const to let
    let sliderInteractionTracker = Array(15).fill(false);

    // Load saved data function
    function loadSavedData() {
        const savedData = sessionStorage.getItem('part2Data');
        const savedInteractions = sessionStorage.getItem('part2Interactions');
        
        if (savedData) {
            const ratings = JSON.parse(savedData);
            ratings.forEach((rating) => {
                const slider = document.getElementById(`slider-${rating.Combination - 1}`);
                if (slider) {
                    slider.value = rating.Rating;
                    // Update slider appearance
                    const percentage = rating.Rating / 15;
                    const color = getGradientColor(percentage);
                    slider.style.setProperty('--thumb-color', color);
                    
                    // Update completion indicator
                    const indicator = slider.parentElement.querySelector('.completion-indicator');
                    if (indicator && rating.Rating !== 0) {
                        indicator.textContent = '✓';
                        indicator.style.color = 'green';
                    }
                }
            });
        }

        if (savedInteractions) {
            sliderInteractionTracker = JSON.parse(savedInteractions);
            updateSubmitButton();
        }
    }



    const combinations = [
        // Combination 1
        {
            'Heart Rate (beats/min)': { value: 110, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '130/70', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 18, abnormal: false },
            'Temperature (℃)': { value: 36.8, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 98, abnormal: false }
        },
        // Combination 2
        {
            'Heart Rate (beats/min)': { value: 75, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '95/55', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 18, abnormal: false },
            'Temperature (℃)': { value: 36.8, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 98, abnormal: false }
        },
        // Combination 3
        {
            'Heart Rate (beats/min)': { value: 75, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '130/70', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 24, abnormal: false },
            'Temperature (℃)': { value: 36.8, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 98, abnormal: false }
        },
        // Combination 4
        {
            'Heart Rate (beats/min)': { value: 75, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '130/70', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 18, abnormal: false },
            'Temperature (℃)': { value: 38.2, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 98, abnormal: false }
        },
        // Combination 5
        {
            'Heart Rate (beats/min)': { value: 75, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '130/70', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 18, abnormal: false },
            'Temperature (℃)': { value: 36.8, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 92, abnormal: false }
        },
        // Combination 6
        {
            'Heart Rate (beats/min)': { value: 110, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '95/55', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 18, abnormal: false },
            'Temperature (℃)': { value: 36.8, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 98, abnormal: false }
        },
        // Combination 7
        {
            'Heart Rate (beats/min)': { value: 110, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '130/70', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 24, abnormal: false },
            'Temperature (℃)': { value: 36.8, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 98, abnormal: false }
        },
        // Combination 8
        {
            'Heart Rate (beats/min)': { value: 110, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '130/70', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 18, abnormal: false },
            'Temperature (℃)': { value: 38.2, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 98, abnormal: false }
        },
        // Combination 9
        {
            'Heart Rate (beats/min)': { value: 110, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '130/70', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 18, abnormal: false },
            'Temperature (℃)': { value: 36.8, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 92, abnormal: false }
        },
        // Combination 10
        {
            'Heart Rate (beats/min)': { value: 75, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '95/55', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 24, abnormal: false },
            'Temperature (℃)': { value: 36.8, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 98, abnormal: false }
        },
        // Combination 11
        {
            'Heart Rate (beats/min)': { value: 75, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '95/55', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 18, abnormal: false },
            'Temperature (℃)': { value: 38.2, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 98, abnormal: false }
        },
        // Combination 12
        {
            'Heart Rate (beats/min)': { value: 75, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '95/55', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 18, abnormal: false },
            'Temperature (℃)': { value: 36.8, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 92, abnormal: false }
        },
        // Combination 13
        {
            'Heart Rate (beats/min)': { value: 75, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '130/70', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 24, abnormal: false },
            'Temperature (℃)': { value: 38.2, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 98, abnormal: false }
        },
        // Combination 14
        {
            'Heart Rate (beats/min)': { value: 75, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '130/70', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 24, abnormal: false },
            'Temperature (℃)': { value: 36.8, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 92, abnormal: false }
        },
        // Combination 15
        {
            'Heart Rate (beats/min)': { value: 75, abnormal: false },
            'Systolic Blood Pressure (mmHg)': { value: '130/70', abnormal: false },
            'Respiratory Rate (breaths/min)': { value: 18, abnormal: false },
            'Temperature (℃)': { value: 38.2, abnormal: false },
            'Oxygen Saturation (%, breathing room air)': { value: 92, abnormal: false }
        }
    ];

    function createVitalSignsTable(combination) {
        const table = document.createElement('table');
        table.className = 'combination-table';
        const tbody = document.createElement('tbody');

        Object.entries(combination).forEach(([name, data]) => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = name;
            row.appendChild(nameCell);
            
            const valueCell = document.createElement('td');
            valueCell.textContent = data.value;
            if (data.abnormal) {
                valueCell.style.color = '#e74c3c';
                valueCell.style.fontWeight = 'bold';
            }
            row.appendChild(valueCell);
            
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        return table;
    }

    function createConcernDescriptions() {
        const descriptions = document.createElement('div');
        descriptions.className = 'concern-descriptions';
        descriptions.innerHTML = `
            <p>0 = No concern – no requirement for medical assessment.</p>
            <p>5 = Mild concern – may require medical assessment under some circumstances.</p>
            <p>10 = Moderate concern – requires medical assessment within 1-4 hours.</p>
            <p>15 = Severe concern – requires immediate medical attention.</p>
        `;
        return descriptions;
    }

    function createSlider(index) {
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-wrapper';

        const indicator = document.createElement('span');
        indicator.className = 'completion-indicator';
        indicator.textContent = '';
        indicator.style.color = 'red';
        sliderContainer.appendChild(indicator);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '15';
        slider.value = '0';
        slider.step = '1';
        slider.className = 'concern-slider';
        slider.id = `slider-${index}`;

        slider.addEventListener('input', function() {
            const percentage = this.value / 15;
            const color = getGradientColor(percentage);
            this.style.setProperty('--thumb-color', color);
            
            // Mark as interacted regardless of value
            sliderInteractionTracker[index] = true;
            
            const indicator = this.parentElement.querySelector('.completion-indicator');
            if (indicator) {
                indicator.textContent = '✓';
                indicator.style.color = 'green';
            }
            
            sessionStorage.setItem('part2Interactions', JSON.stringify(sliderInteractionTracker));
            updateSubmitButton();
            saveData();
        });

        sliderContainer.appendChild(slider);
        return sliderContainer;
    }
    
    function getGradientColor(percentage) {
        return '#ffffff'; // White thumb color
    }

    function createTickMarks() {
        const tickMarksContainer = document.createElement('div');
        tickMarksContainer.className = 'tick-marks';

        for (let i = 0; i <= 15; i++) {
            const tick = document.createElement('div');
            tick.className = i % 5 === 0 ? 'tick major' : 'tick';
            
            const percentage = (i / 15) * 100;
            tick.style.left = `${percentage}%`;

            if (i % 5 === 0) {
                const label = document.createElement('div');
                label.className = 'tick-label';
                label.textContent = i;
                tick.appendChild(label);
            }

            tickMarksContainer.appendChild(tick);
        }

        return tickMarksContainer;
    }

    function createCombinationElement(combination, index) {
        const container = document.createElement('div');
        container.className = 'combination';

        const title = document.createElement('h3');
        title.textContent = `Combination ${index + 1}`;
        container.appendChild(title);

        container.appendChild(createVitalSignsTable(combination));

        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';

        sliderContainer.appendChild(createConcernDescriptions());
        sliderContainer.appendChild(createSlider(index));
        sliderContainer.appendChild(createTickMarks());

        container.appendChild(sliderContainer);

        return container;
    }

    function collectData() {
        const ratings = combinations.map((_, index) => {
            const slider = document.getElementById(`slider-${index}`);
            return {
                'Combination': index + 1,
                'Rating': slider ? parseInt(slider.value) : null
            };
        });

        sessionStorage.setItem('part2Data', JSON.stringify(ratings));
        return ratings;
    }

    function saveData() {
        collectData();
    }

    // New function to check if all sliders have been interacted with
    function checkAllSlidersInteracted() {
        return sliderInteractionTracker.every(interaction => interaction === true);
    }

    // New function to update submit button state
    function updateSubmitButton() {
        const submitButton = document.getElementById('submitButton');
        if (submitButton) {
            // Update visual state but keep button enabled
            const allSlidersInteracted = checkAllSlidersInteracted();
            submitButton.style.opacity = allSlidersInteracted ? '1' : '0.5';
            submitButton.style.cursor = allSlidersInteracted ? 'pointer' : 'not-allowed';
        }
    }

    // Initialize page
    const container = document.getElementById('part2Container');
    combinations.forEach((combination, index) => {
        container.appendChild(createCombinationElement(combination, index));
    });

    // Set up submit button with new functionality
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        // Initially disable the button
        submitButton.disabled = false; // Allow clicking even if not all sliders are used

        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            
            if (!checkAllSlidersInteracted()) {
                const unratedCount = sliderInteractionTracker.filter(x => !x).length;
                alert(`Please rate all combinations before proceeding. You still need to rate ${unratedCount} combination${unratedCount > 1 ? 's' : ''}.`);
                return;
            }
            
            // Collect and save the data
            const data = collectData();
            sessionStorage.setItem('part2Data', JSON.stringify(data));
            
            // Set completion status
            sessionStorage.setItem('completionStatus', 'true');
            
            // Navigate to the next page
            window.location.href = 'part3.html';
        });
    } else {
        console.error('Submit button not found!');
    }

    // Load saved data after initializing the page
    loadSavedData();

    // Save before unload
    window.addEventListener('beforeunload', saveData);

    // Add CSS for completion indicators and submit button
    const style = document.createElement('style');
    style.textContent = `
        .slider-wrapper {
            display: flex;
            align-items: flex-start;
            gap: 30px;
            margin-bottom: 10px;
            padding-top: 10px;
        }
        .completion-indicator {
            font-size: 1.2em;
            font-weight: bold;
            min-width: 24px;
            margin-top: -4px;
        }
        .concern-slider {
            flex-grow: 1;
            margin-bottom: 25px;
        }
        .tick-marks {
            margin-top: -10px;
        }
        #submitButton:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
});