document.addEventListener('DOMContentLoaded', () => {
    // Initialize slider interaction tracker
    const sliderInteractionTracker = Array(14).fill(false);  // 14 scenarios

    function checkAllSlidersInteracted() {
        return sliderInteractionTracker.every(interacted => interacted);
    }

    function updateSubmitButton() {
        const submitButton = document.getElementById('submitButton');
        if (submitButton) {
            submitButton.disabled = !checkAllSlidersInteracted();
        }
    }


    const scenarios = [
        {
            id: 1,
            data: {
                "Heart rate (beats/min)": [112, 105, 113, 109, 110],
                "Blood pressure (mmHg)": ["132/75", "140/78", "131/66", "135/73", "130/70"],
                "Respiratory rate (breaths/min)": [18, 18, 19, 19, 18],
                "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
                "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
            }
        },
        {
            id: 2,
            data: {
                "Heart rate (beats/min)": [73, 68, 85, 92, 110],
                "Blood pressure (mmHg)": ["132/75", "140/78", "131/66", "135/73", "130/70"],
                "Respiratory rate (breaths/min)": [18, 18, 19, 19, 18],
                "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
                "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
            }
        },
        {
            id: 3,
            data: {
                "Heart rate (beats/min)": [131, 126, 123, 115, 110],
                "Blood pressure (mmHg)": ["132/75", "140/78", "131/66", "135/73", "130/70"],
                "Respiratory rate (breaths/min)": [18, 18, 19, 19, 18],
                "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
                "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
            }
        },
        {
            id: 4,
            data: {
                "Heart rate (beats/min)": [73, 68, 72, 74, 75],
                "Blood pressure (mmHg)": ["97/63", "103/66", "99/57", "102/60", "95/55"],
                "Respiratory rate (breaths/min)": [18, 18, 19, 19, 18],
                "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
                "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
            }
        },
        {
            id: 5,
            data: {
                "Heart rate (beats/min)": [73, 68, 72, 74, 75],
                "Blood pressure (mmHg)": ["132/75", "140/78", "128/71", "108/60", "95/55"],
                "Respiratory rate (breaths/min)": [18, 18, 19, 19, 18],
                "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
                "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
            }
        },
        {
            id: 6,
            data: {
                "Heart rate (beats/min)": [73, 68, 72, 74, 75],
                "Blood pressure (mmHg)": ["79/49", "83/54", "89/60", "92/57", "95/55"],
                "Respiratory rate (breaths/min)": [18, 18, 19, 19, 18],
                "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
                "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
            }
        },
        {
            id: 7,
            data: {
                "Heart rate (beats/min)": [73, 68, 72, 74, 75],
                "Blood pressure (mmHg)": ["132/75", "140/78", "131/66", "135/73", "130/70"],
                "Respiratory rate (breaths/min)": [24, 23, 22, 25, 24],
                "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
                "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
            }
        },
        {
            id: 8,
            data: {
                "Heart rate (beats/min)": [73, 68, 72, 74, 75],
                "Blood pressure (mmHg)": ["132/75", "140/78", "131/66", "135/73", "130/70"],
                "Respiratory rate (breaths/min)": [18, 18, 19, 20, 24],
                "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
                "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
            }
        },
        {
            id: 9,
            data: {
                "Heart rate (beats/min)": [73, 68, 72, 74, 75],
                "Blood pressure (mmHg)": ["132/75", "140/78", "131/66", "135/73", "130/70"],
                "Respiratory rate (breaths/min)": [33, 31, 28, 25, 24],
                "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
                "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
            }
        },
        {
            id: 10,
            data: {
                "Heart rate (beats/min)": [73, 68, 72, 74, 75],
                "Blood pressure (mmHg)": ["132/75", "140/78", "131/66", "135/73", "130/70"],
                "Respiratory rate (breaths/min)": [18, 18, 19, 19, 18],
                "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 38.2],
                "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
            }
        },
        {
            id: 11,
            data: {
                "Heart rate (beats/min)": [73, 68, 72, 74, 75],
                "Blood pressure (mmHg)": ["132/75", "140/78", "131/66", "135/73", "130/70"],
                "Respiratory rate (breaths/min)": [18, 18, 19, 19, 18],
                "Temperature (℃)": [36.8, 36.6, 36.6, 38.2, 36.8],
                "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
            }
        },
        {
            id: 12,
            data: {
                "Heart rate (beats/min)": [73, 68, 72, 74, 75],
                "Blood pressure (mmHg)": ["132/75", "140/78", "131/66", "135/73", "130/70"],
                "Respiratory rate (breaths/min)": [18, 18, 19, 19, 18],
                "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
                "Oxygen saturation (%, breathing room air)": [92, 90, 92, 91, 92]
            }
        },
        {
            id: 13,
            data: {
                "Heart rate (beats/min)": [73, 68, 72, 74, 75],
                "Blood pressure (mmHg)": ["132/75", "140/78", "131/66", "135/73", "130/70"],
                "Respiratory rate (breaths/min)": [18, 18, 19, 19, 18],
                "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
                "Oxygen saturation (%, breathing room air)": [98, 96, 97, 94, 92]
            }
        },
        {
            id: 14,
            data: {
                "Heart rate (beats/min)": [73, 68, 72, 74, 75],
                "Blood pressure (mmHg)": ["132/75", "140/78", "131/66", "135/73", "130/70"],
                "Respiratory rate (breaths/min)": [18, 18, 19, 19, 18],
                "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
                "Oxygen saturation (%, breathing room air)": [84, 85, 89, 90, 92]
            }
        }
    ];
    const timePoints = [
        "72 hours previously",
        "24 hours previously",
        "12 hours previously",
        "4 hours previously",
        "Current values"
    ];

    const part3Container = document.getElementById('part3Container');

    // Create each scenario section
    scenarios.forEach((scenario, index) => {
        const scenarioDiv = document.createElement('div');
        scenarioDiv.className = 'scenario';
        
        const title = document.createElement('h3');
        title.textContent = `Scenario ${scenario.id}`;
        scenarioDiv.appendChild(title);

        // Create the vital signs table
        const table = document.createElement('table');
        table.className = 'vital-signs-table';

        // Create header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const emptyHeader = document.createElement('th');
        headerRow.appendChild(emptyHeader);
        
        timePoints.forEach(timePoint => {
            const th = document.createElement('th');
            th.textContent = timePoint;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create data rows
        const tbody = document.createElement('tbody');
        Object.entries(scenario.data).forEach(([vitalSign, values]) => {
            const row = document.createElement('tr');
            
            const label = document.createElement('td');
            label.className = 'vital-sign-label';
            label.textContent = vitalSign;
            row.appendChild(label);

            values.forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        scenarioDiv.appendChild(table);

        // Add concern level assessment
        const concernDiv = document.createElement('div');
        concernDiv.className = 'concern-assessment';

        // Add concern level descriptions
        const descriptionsDiv = document.createElement('div');
        descriptionsDiv.className = 'concern-descriptions';
        descriptionsDiv.innerHTML = `
            <p>0 = No concern – no requirement for medical assessment.</p>
            <p>5 = Mild concern – may require medical assessment under some circumstances.</p>
            <p>10 = Moderate concern – requires medical assessment within 1-4 hours.</p>
            <p>15 = Severe concern – requires immediate medical attention.</p>
        `;
        concernDiv.appendChild(descriptionsDiv);

        // Create slider container
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';

        // Create slider wrapper
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';

        // Create input slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '15';
        slider.value = '0';
        slider.step = '1';
        slider.id = `slider-${scenario.id}`;
        slider.className = 'slider concern-slider';

        // Create completion indicator
        const indicator = document.createElement('span');
        indicator.className = 'completion-indicator';
        indicator.textContent = '';
        indicator.style.color = 'red';

        sliderWrapper.appendChild(slider);
        sliderWrapper.appendChild(indicator);
        sliderContainer.appendChild(sliderWrapper);

        function createTickMarks() {
            const tickMarksContainer = document.createElement('div');
            tickMarksContainer.className = 'tick-marks';
        
            // Container for both ticks and labels
            const ticksContainer = document.createElement('div');
            ticksContainer.className = 'ticks-container';
        
            // Create ticks and labels together
            for (let i = 0; i <= 15; i++) {
                const tick = document.createElement('div');
                tick.className = i % 5 === 0 ? 'tick major' : 'tick';
                const position = (i / 15) * 100;
                tick.style.left = `${position}%`;
                ticksContainer.appendChild(tick);
        
                // Add label only for major ticks (multiples of 5)
                if (i % 5 === 0) {
                    const label = document.createElement('div');
                    label.className = 'tick-label';
                    label.textContent = i;
                    label.style.left = `${position}%`;
                    ticksContainer.appendChild(label);
                }
            }
        
            tickMarksContainer.appendChild(ticksContainer);
            return tickMarksContainer;
        }
        

        sliderContainer.appendChild(createTickMarks());

        const sliderValueDisplay = document.createElement('div');
        sliderValueDisplay.className = 'slider-values';
        sliderContainer.appendChild(sliderValueDisplay);

        // Update display and save data whenever the slider value changes
        slider.addEventListener('input', () => {
            // Update thumb color based on value
            const percentage = slider.value / 15;
            const color = getGradientColor(percentage);
            slider.style.setProperty('--thumb-color', color);
            
            // Mark this scenario as interacted with
            sliderInteractionTracker[index] = true;
            
            // Update the completion indicator
            indicator.textContent = '✓';
            indicator.style.color = 'green';
            
            // Update submit button state
            updateSubmitButton();
            
            saveData();
        });

        concernDiv.appendChild(sliderContainer);
        scenarioDiv.appendChild(concernDiv);
        part3Container.appendChild(scenarioDiv);
    });

    const style = document.createElement('style');
style.textContent = `
    .slider-wrapper {
        display: flex;
        flex-direction: column;
        gap: 30px;
        margin-bottom: 0px;
        padding-top: 10px;
        position: relative;
    }

    .completion-indicator {
        position: absolute;
        font-size: 1.2em;
        font-weight: bold;
        left: -30px;  /* Adjust based on your gap size */
        top: 35px;    /* Move below the slider */
        min-width: 24px;
    }

    .concern-slider {
        width: 100%;
        margin-bottom: 25px;
    }
    .tick-marks {
        position: relative;
        width: 97%;
        height: 40px;
        margin-top: -10px;
    }

    .ticks-container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .tick {
        position: absolute;
        width: 1px;
        height: 5px;
        background-color: #888;
        transform: translateX(-50%);
    }

    .tick.major {
        height: 10px;
        width: 2px;
        background-color: #444;
    }

    .tick-label {
        position: absolute;
        font-size: 12px;
        color: #666;
        transform: translateX(-50%);
        top: 15px;
        text-align: center;
    }

    .concern-slider {
        width: 100%;
        margin-bottom: 10px;
    }
`;
document.head.appendChild(style);

    function getGradientColor(percentage) {
        return 'white'; // Return white for the thumb color
    }

    // Data collection function
    function collectData() {
        const data = scenarios.map(scenario => {
            const slider = document.getElementById(`slider-${scenario.id}`);
            return {
                id: scenario.id,
                concernLevel: slider ? parseInt(slider.value) : null
            };
        });

        sessionStorage.setItem('part3Data', JSON.stringify(data));
        return data;
    }

    function saveData() {
        collectData();
    }

    window.addEventListener('beforeunload', saveData);

    function saveDataToFirestore() {
        const consentData = JSON.parse(sessionStorage.getItem('consentData')) || {};
        const basicInfoData = JSON.parse(sessionStorage.getItem('basicInfoData')) || {};
        const part1Data = JSON.parse(sessionStorage.getItem('part1Data')) || {};
        const part2Data = JSON.parse(sessionStorage.getItem('part2Data')) || {};
        const part3Data = JSON.parse(sessionStorage.getItem('part3Data')) || {};

        const allData = {
            consentData,
            basicInfoData,
            part1Data,
            part2Data,
            part3Data,
            timestamp: new Date()
        };

        db.collection('vital_signs_survey').add(allData)
            .then(docRef => {
                console.log('Document written with ID: ', docRef.id);
                alert('Your responses have been saved. Thank you for completing the survey.');
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Error adding document: ', error);
                alert('There was an error saving your data. Please try again.');
            });
    }

    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            
            if (!checkAllSlidersInteracted()) {
                alert("All questions must be answered before submitting the form.");
                return;
            }
            
            saveDataToFirestore();
        });
    } 
});