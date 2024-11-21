document.addEventListener('DOMContentLoaded', () => {
    const vitalSignsData = [
        { name: "Heart Rate", unit: "beats/min" },
        { name: "Systolic Blood Pressure", unit: "mmHg" },
        { name: "Respiratory Rate", unit: "breaths/min" },
        { name: "Temperature", unit: "℃" },
        { name: "Oxygen Saturation", unit: "%" },
        { name: "Inspired Oxygen", unit: "L/min" }
    ];

    const part3Questions = [
        "What is normal for that individual patient.",
        "Whether the general trend is worsening or improving",
        "Abnormal values that have occurred within the past 24 hours"
    ];

    const part3Container = document.getElementById('part3Container');

    vitalSignsData.forEach((vitalSign, vitalIndex) => {
        const questionSet = document.createElement('div');
        questionSet.className = 'question-set';

        const title = document.createElement('h3');
        title.textContent = `When interpreting ${vitalSign.name}, how important is it to take account of:`;
        questionSet.appendChild(title);

        const subheading = document.createElement('h4');
        subheading.innerHTML = 'Select your level of importance interval:<br>0 = Not at all important<br>5 = Moderately important<br>10 = Extremely important';
        questionSet.appendChild(subheading);

        part3Questions.forEach((questionText, questionIndex) => {
            const question = document.createElement('div');
            question.className = 'question';

            const label = document.createElement('label');
            label.textContent = questionText;
            label.setAttribute('for', `slider-${vitalIndex}-${questionIndex}`);
            question.appendChild(label);

            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-container';

            // Create slider div for noUiSlider
            const sliderDiv = document.createElement('div');
            sliderDiv.id = `slider-${vitalIndex}-${questionIndex}`;
            sliderDiv.className = 'dual-slider';
            sliderContainer.appendChild(sliderDiv);

            // Create display for slider values
            const sliderValueDisplay = document.createElement('div');
            sliderValueDisplay.className = 'slider-values';
            sliderContainer.appendChild(sliderValueDisplay);

            // Initialize noUiSlider
            noUiSlider.create(sliderDiv, {
                start: [0, 10],
                connect: true,
                step: 1,
                range: {
                    'min': 0,
                    'max': 10
                },
                tooltips: [true, true],
                format: {
                    to: function(value) {
                        return Math.round(value);
                    },
                    from: function(value) {
                        return Number(value);
                    }
                }
            });

            // Load saved value if available
            const savedData = JSON.parse(sessionStorage.getItem('part3Data'));
            if (savedData && savedData[vitalIndex] && savedData[vitalIndex]['Questions'][questionText]) {
                const savedValues = savedData[vitalIndex]['Questions'][questionText];
                sliderDiv.noUiSlider.set([savedValues.lowerValue, savedValues.upperValue]);
            }

            // Update display and save data whenever the slider values change
            sliderDiv.noUiSlider.on('update', (values) => {
                sliderValueDisplay.textContent = `Selected range: ${values[0]} - ${values[1]}`;
                saveData();
            });

            question.appendChild(sliderContainer);
            questionSet.appendChild(question);
        });

        part3Container.appendChild(questionSet);
    });

    function collectData() {
        const part3Data = vitalSignsData.map((vitalSign, vitalIndex) => {
            const response = {
                'Vital Sign': vitalSign.name,
                'Questions': {}
            };
            part3Questions.forEach((questionText, questionIndex) => {
                const sliderDiv = document.getElementById(`slider-${vitalIndex}-${questionIndex}`);
                if (sliderDiv && sliderDiv.noUiSlider) {
                    const values = sliderDiv.noUiSlider.get();
                    const lowerValue = values[0];
                    const upperValue = values[1];
                    response['Questions'][questionText] = {
                        lowerValue: lowerValue,
                        upperValue: upperValue
                    };
                    console.log(`Collected data for ${vitalSign.name} - "${questionText}": ${lowerValue}, ${upperValue}`);
                } else {
                    response['Questions'][questionText] = {
                        lowerValue: null,
                        upperValue: null
                    };
                    console.warn(`No slider found for ${vitalSign.name} - "${questionText}"`);
                }
            });
            return response;
        });
    
        // Store data in sessionStorage with a unique key
        sessionStorage.setItem('part3Data', JSON.stringify(part3Data));
        console.log('part3Data saved to sessionStorage:', part3Data);
        return part3Data;
    }
    

    // Save data whenever input changes
    function saveData() {
        collectData();
    }

    // Save data when the page is unloaded
    window.addEventListener('beforeunload', saveData);

    function saveDataToFirestore() {
        // Retrieve data from sessionStorage
        const consentData = JSON.parse(sessionStorage.getItem('consentData')) || {};
        const basicInfoData = JSON.parse(sessionStorage.getItem('basicInfoData')) || {};
        const part1Data = JSON.parse(sessionStorage.getItem('part1Data')) || {};
        const part2Data = JSON.parse(sessionStorage.getItem('part2Data')) || {};
        const part3Data = JSON.parse(sessionStorage.getItem('part3Data')) || {}; // Retrieve Part 3 Data
    
        console.log('Retrieved data from sessionStorage:', {
            consentData,
            basicInfoData,
            part1Data,
            part2Data,
            part3Data
        });
    
        // Combine all data into one object
        const allData = {
            consentData,
            basicInfoData,
            part1Data,
            part2Data,
            part3Data,
            timestamp: new Date() // Add timestamp
        };
    
        console.log('All data to save:', allData);
    
        // Save to Firestore
        db.collection('vital_signs_survey').add(allData)
            .then(docRef => {
                console.log('Document written with ID: ', docRef.id);
                alert('Your responses have been saved. Thank you for completing the survey.');
                window.location.href = 'index.html'; // Redirect after submission
            })
            .catch(error => {
                console.error('Error adding document: ', error);
                alert('There was an error saving your data. Please try again.');
            });
    }
    
    

    // Event listener for the submit button
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            saveDataToFirestore(); // Save all data to Firestore on submit
        });
    }
});