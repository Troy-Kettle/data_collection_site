document.addEventListener('DOMContentLoaded', () => {
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

    const questions = [
        "What is normal for that individual patient.",
        "Whether the general trend is worsening or improving",
        "Abnormal values that have occurred within the past 24 hours"
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

        // Add importance scale questions for this scenario
        const questionsDiv = document.createElement('div');
        questionsDiv.className = 'importance-questions';

        const questionsTitle = document.createElement('h4');
        questionsTitle.textContent = 'For this scenario, how important is it to take account of:';
        questionsDiv.appendChild(questionsTitle);

        const subheading = document.createElement('h5');
        subheading.innerHTML = 'Select your level of importance:<br>0 = Not at all important<br>8 = Moderately important<br>15 = Extremely important';
        questionsDiv.appendChild(subheading);

        questions.forEach((questionText, questionIndex) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';

            const label = document.createElement('label');
            label.textContent = questionText;
            label.setAttribute('for', `slider-${scenario.id}-${questionIndex}`);
            questionDiv.appendChild(label);

            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-container';

            // Create input slider
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '15';
            slider.value = '0';
            slider.step = '1';
            slider.id = `slider-${scenario.id}-${questionIndex}`;
            slider.className = 'slider';
            sliderContainer.appendChild(slider);

            // Create tick marks container
            const tickContainer = document.createElement('div');
            tickContainer.className = 'tick-container';

            // Add tick marks and labels
            for (let i = 0; i <= 15; i++) {
                const tick = document.createElement('div');
                tick.className = i % 5 === 0 ? 'tick major' : 'tick';
                const position = i === 0 ? 0 : `${(i / 15) * 100}%`;
                tick.style.left = position;
                tickContainer.appendChild(tick);

                if (i % 5 === 0) {
                    const label = document.createElement('div');
                    label.className = 'tick-label major';
                    label.textContent = i;
                    const labelPosition = i === 0 ? 0 : `${(i / 15) * 100}%`;
                    label.style.left = labelPosition;
                    tickContainer.appendChild(label);
                }
            }

            sliderContainer.appendChild(tickContainer);

            const sliderValueDisplay = document.createElement('div');
            sliderValueDisplay.className = 'slider-values';
            sliderValueDisplay.textContent = `Selected value: ${slider.value}`;
            sliderContainer.appendChild(sliderValueDisplay);

            // Update display and save data whenever the slider value changes
            slider.addEventListener('input', () => {
                sliderValueDisplay.textContent = `Selected value: ${slider.value}`;
                // Update thumb color based on value
                const percentage = slider.value / 15;
                const color = getGradientColor(percentage);
                slider.style.setProperty('--thumb-color', color);
                saveData();
            });

            questionDiv.appendChild(sliderContainer);
            questionsDiv.appendChild(questionDiv);
        });

        scenarioDiv.appendChild(questionsDiv);
        part3Container.appendChild(scenarioDiv);
    });

    // Replace the existing getGradientColor function
function getGradientColor(percentage) {
    // We don't need to calculate colors anymore since the gradient is in CSS
    return 'white'; // Return white for the thumb color
}

    // Data collection function
    function collectData() {
        const data = scenarios.map(scenario => {
            const scenarioData = {
                id: scenario.id,
                responses: {}
            };
            
            questions.forEach((questionText, questionIndex) => {
                const slider = document.getElementById(`slider-${scenario.id}-${questionIndex}`);
                if (slider) {
                    scenarioData.responses[questionText] = parseInt(slider.value);
                }
            });
            
            return scenarioData;
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
            saveDataToFirestore();
        });
    }
});