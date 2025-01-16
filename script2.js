document.addEventListener('DOMContentLoaded', () => {
    // Initialize slider interaction tracker
    const sliderInteractionTracker = Array(15).fill(false);

    function checkAllSlidersInteracted() {
        return sliderInteractionTracker.every(interacted => interacted);
    }

    function updateSubmitButton() {
        const submitButton = document.getElementById('submitButton');
        if (submitButton) {
            submitButton.disabled = !checkAllSlidersInteracted();
        }
    }
    const combinations = [
        // Combination 1
        {
            'Heart Rate': { value: 110, abnormal: false },
            'Systolic Blood Pressure': { value: 130, abnormal: false },
            'Respiratory Rate': { value: 18, abnormal: false },
            'Temperature': { value: 36.8, abnormal: false },
            'Oxygen Saturation': { value: 98, abnormal: false }
        },
        // Combination 2
        {
            'Heart Rate': { value: 75, abnormal: false },
            'Systolic Blood Pressure': { value: 95, abnormal: false },
            'Respiratory Rate': { value: 18, abnormal: false },
            'Temperature': { value: 36.8, abnormal: false },
            'Oxygen Saturation': { value: 98, abnormal: false }
        },
        // Combination 3
        {
            'Heart Rate': { value: 75, abnormal: false },
            'Systolic Blood Pressure': { value: 130, abnormal: false },
            'Respiratory Rate': { value: 24, abnormal: false },
            'Temperature': { value: 36.8, abnormal: false },
            'Oxygen Saturation': { value: 98, abnormal: false }
        },
        // Combination 4
        {
            'Heart Rate': { value: 75, abnormal: false },
            'Systolic Blood Pressure': { value: 130, abnormal: false },
            'Respiratory Rate': { value: 18, abnormal: false },
            'Temperature': { value: 38.2, abnormal: false },
            'Oxygen Saturation': { value: 98, abnormal: false }
        },
        // Combination 5
        {
            'Heart Rate': { value: 75, abnormal: false },
            'Systolic Blood Pressure': { value: 130, abnormal: false },
            'Respiratory Rate': { value: 18, abnormal: false },
            'Temperature': { value: 36.8, abnormal: false },
            'Oxygen Saturation': { value: 92, abnormal: false }
        },
        // Combination 6
        {
            'Heart Rate': { value: 110, abnormal: false },
            'Systolic Blood Pressure': { value: 95, abnormal: false },
            'Respiratory Rate': { value: 18, abnormal: false },
            'Temperature': { value: 36.8, abnormal: false },
            'Oxygen Saturation': { value: 98, abnormal: false }
        },
        // Combination 7
        {
            'Heart Rate': { value: 110, abnormal: false },
            'Systolic Blood Pressure': { value: 130, abnormal: false },
            'Respiratory Rate': { value: 24, abnormal: false },
            'Temperature': { value: 36.8, abnormal: false },
            'Oxygen Saturation': { value: 98, abnormal: false }
        },
        // Combination 8
        {
            'Heart Rate': { value: 110, abnormal: false },
            'Systolic Blood Pressure': { value: 130, abnormal: false },
            'Respiratory Rate': { value: 18, abnormal: false },
            'Temperature': { value: 38.2, abnormal: false },
            'Oxygen Saturation': { value: 98, abnormal: false }
        },
        // Combination 9
        {
            'Heart Rate': { value: 110, abnormal: false },
            'Systolic Blood Pressure': { value: 130, abnormal: false },
            'Respiratory Rate': { value: 18, abnormal: false },
            'Temperature': { value: 36.8, abnormal: false },
            'Oxygen Saturation': { value: 92, abnormal: false }
        },
        // Combination 10
        {
            'Heart Rate': { value: 75, abnormal: false },
            'Systolic Blood Pressure': { value: 95, abnormal: false },
            'Respiratory Rate': { value: 24, abnormal: false },
            'Temperature': { value: 36.8, abnormal: false },
            'Oxygen Saturation': { value: 98, abnormal: false }
        },
        // Combination 11
        {
            'Heart Rate': { value: 75, abnormal: false },
            'Systolic Blood Pressure': { value: 95, abnormal: false },
            'Respiratory Rate': { value: 18, abnormal: false },
            'Temperature': { value: 38.2, abnormal: false },
            'Oxygen Saturation': { value: 98, abnormal: false }
        },
        // Combination 12
        {
            'Heart Rate': { value: 75, abnormal: false },
            'Systolic Blood Pressure': { value: 95, abnormal: false },
            'Respiratory Rate': { value: 18, abnormal: false },
            'Temperature': { value: 36.8, abnormal: false },
            'Oxygen Saturation': { value: 92, abnormal: false }
        },
        // Combination 13
        {
            'Heart Rate': { value: 75, abnormal: false },
            'Systolic Blood Pressure': { value: 130, abnormal: false },
            'Respiratory Rate': { value: 24, abnormal: false },
            'Temperature': { value: 38.2, abnormal: false },
            'Oxygen Saturation': { value: 98, abnormal: false }
        },
        // Combination 14
        {
            'Heart Rate': { value: 75, abnormal: false },
            'Systolic Blood Pressure': { value: 130, abnormal: false },
            'Respiratory Rate': { value: 24, abnormal: false },
            'Temperature': { value: 36.8, abnormal: false },
            'Oxygen Saturation': { value: 92, abnormal: false }
        },
        // Combination 15
        {
            'Heart Rate': { value: 75, abnormal: false },
            'Systolic Blood Pressure': { value: 130, abnormal: false },
            'Respiratory Rate': { value: 18, abnormal: false },
            'Temperature': { value: 38.2, abnormal: false },
            'Oxygen Saturation': { value: 92, abnormal: false }
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

        // Create completion indicator
        const indicator = document.createElement('span');
        indicator.className = 'completion-indicator';
        indicator.textContent = '❌';
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
            
            // Mark this slider as interacted with
            sliderInteractionTracker[index] = true;
            
            // Update the completion indicator
            const indicator = this.parentElement.querySelector('.completion-indicator');
            if (indicator) {
                indicator.textContent = '✓';
                indicator.style.color = 'green';
            }
            
            // Update submit button state
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

    // Initialize page
    const container = document.getElementById('part2Container');
    combinations.forEach((combination, index) => {
        container.appendChild(createCombinationElement(combination, index));
    });

    // Set up submit button
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        // Initially disable the submit button
        submitButton.disabled = true;

        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (checkAllSlidersInteracted()) {
                collectData();
                window.location.href = 'part3.html';
            } else {
                alert('Please interact with all sliders before proceeding.');
            }
        });
    } else {
        console.error('Submit button not found!');
    }

    // Save before unload
    window.addEventListener('beforeunload', saveData);

    // Add CSS for completion indicators
    const style = document.createElement('style');
    style.textContent = `
        .slider-wrapper {
            display: flex;
            align-items: flex-start;  /* Changed from center to flex-start */
            gap: 30px;
            margin-bottom: 10px;
            padding-top: 10px;  /* Add padding to push content down */
        }
        .completion-indicator {
            font-size: 1.2em;
            font-weight: bold;
            min-width: 24px;
            margin-top: -4px;  /* Adjust vertical position of the indicator */
        }
        .concern-slider {
            flex-grow: 1;
            margin-bottom: 25px;  /* Add space below slider for tick marks */
        }
        .tick-marks {
            margin-top: -10px;  /* Pull tick marks up under the slider */
        }
    `;
    document.head.appendChild(style);
});