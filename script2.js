document.addEventListener('DOMContentLoaded', () => {
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
<p>10 = Moderate concern – requires urgent medical assessment within 1-4 hours.</p>
<p>15 = Severe concern – requires immediate medical attention.</p>

        `;
        return descriptions;
    }

    function createSlider(index) {
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
            saveData();
        });

        return slider;
    }

    function getGradientColor(percentage) {
        // No need to change colors - the gradient is fixed in CSS
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
        
        const slider = createSlider(index);
        sliderContainer.appendChild(slider);

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

    // Set up next button
    const nextButton = document.getElementById('submitButton');
    if (nextButton) {
        nextButton.addEventListener('click', (event) => {
            event.preventDefault();
            // Save data to session storage
            collectData();
            // Proceed to Part 3
            window.location.href = 'part3.html';
        });
    }

    // Save before unload
    window.addEventListener('beforeunload', saveData);
});