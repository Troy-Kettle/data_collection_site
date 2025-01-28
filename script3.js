// function validateProgression() {
//     if (!window.location.pathname.includes('part3.html')) {
//         return true;
//     }
//     try {
//         // Get stored data
//         const part1Data = sessionStorage.getItem('part1Data');
//         const part2Data = sessionStorage.getItem('part2Data');

//         // Check if both parts have data
//         if (!part1Data || !part2Data) {
//             alert('You must complete Parts 1 and 2 first');
//             window.location.href = 'index.html';
//             return false;
//         }

//         // Parse part 2 data and check completion status

//         let part2CompletionStatus;
//         try {
//             const parsedPart2Data = JSON.parse(part2Data);
//             part2CompletionStatus = parsedPart2Data && typeof parsedPart2Data === 'object' && parsedPart2Data.completed === true;  // Strict comparison to ensure it's true
//         } catch (e) {
//             console.error('Error parsing part2Data:', e);
//             alert('There was an error validating Part 2 completion. Please try completing Part 2 again.');
//             window.location.href = 'part2.html';
//             return false;
//         }

//         // Check completion status
//         if (!part2CompletionStatus) {
//             alert('You must fully complete Part 2 before proceeding to Part 3');
//             window.location.href = 'part2.html';
//             return false;
//         }

//         return true;  // All validations passed
//     } catch (e) {
//         console.error('Validation error:', e);
//         alert('An error occurred during validation. Please start from the beginning.');
//         window.location.href = 'index.html';
//         return false;
//     }
// }





document.addEventListener('DOMContentLoaded', () => {

    // if (!validateProgression()) {
    //     return;
    // }

    // Only validate if we're on part3.html
if (window.location.pathname.includes('part3.html')) {
    const completionStatus = sessionStorage.getItem('completionStatus');
    const part1Data = sessionStorage.getItem('part1Data');
    // const part2Data = sessionStorage.getItem('part2Data');
    
    if (completionStatus !== 'true' || !part1Data) {
        alert('You must complete Part 1 first');
        window.location.href = 'part1.html';
        return;
    }

    const part2Interactions = JSON.parse(sessionStorage.getItem('part2Interactions') || '[]');
    
    // Check if Part 2 is incomplete or there's no valid data
    if (completionStatus !== 'true') {
        alert('You must complete Part 2 first');
        window.location.href = 'part2.html';
        return;
    }

    // If part2Interactions includes any false (incomplete interaction), prevent loading Part 3
    if (part2Interactions.includes(false)) {
        alert('You must complete all interactions in Part 2 before proceeding to Part 3');
        window.location.href = 'part2.html';
        return;
    }

    // // Check if all sliders are interacted with
    // if (!checkAllSlidersInteracted()) {
    //     alert('You must interact with all sliders before proceeding to Part 3');
    //     window.location.href = 'part2.html';
    //     return;
    // }
}

// Function to check if all sliders have been interacted with
// function checkAllSlidersInteracted() {
//     const sliders = document.querySelectorAll('.slider'); // assuming sliders have class 'slider'
//     return Array.from(sliders).every(slider => slider.value !== '' && slider.value !== null);
// }



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

    function loadSavedData() {
        const savedData = sessionStorage.getItem('part3Data');
        if (savedData) {
            const data = JSON.parse(savedData);
    
            data.forEach((item, index) => {
                const slider = document.getElementById(`slider-${item.id}`);
                if (slider) {
                    // Set the slider value from saved data
                    slider.value = item.concernLevel || 0;
    
                    // Check if the slider was interacted with
                    const indicator = slider.parentElement.querySelector('.completion-indicator');
                    if (item.userInteracted) {
                        // Mark as completed
                        sliderInteractionTracker[index] = true;
                        indicator.textContent = '✓';
                        indicator.style.color = 'green';
                    } else {
                        // Reset the indicator if not interacted
                        sliderInteractionTracker[index] = false;
                        indicator.textContent = '';
                        indicator.style.color = 'red';
                    }
    
                    // Update slider thumb color
                    const percentage = slider.value / 15;
                    const color = getGradientColor(percentage);
                    slider.style.setProperty('--thumb-color', color);
                }
            });
    
            // Update the submit button state after loading data
            updateSubmitButton();
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
               "Blood pressure (mmHg)": ["97/63", "93/66", "99/57", "96/60", "95/55"],
               "Respiratory rate (breaths/min)": [18, 18, 19, 19, 18],
               "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
               "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
           }
       },
       {
           id: 5,
           data: {
               "Heart rate (beats/min)": [73, 68, 72, 74, 75],
               "Blood pressure (mmHg)": ["132/75", "140/78", "128/71", "103/60", "95/55"],
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
               "Respiratory rate (breaths/min)": [24, 23, 23, 25, 24],
               "Temperature (℃)": [36.8, 36.6, 36.6, 36.5, 36.8],
               "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
           }
       },
       {
           id: 8,
           data: {
               "Heart rate (beats/min)": [73, 68, 72, 74, 75],
               "Blood pressure (mmHg)": ["132/75", "140/78", "131/66", "135/73", "130/70"],
               "Respiratory rate (breaths/min)": [18, 18, 19, 22, 24],
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
               "Temperature (℃)": [36.8, 36.6, 36.6, 38.3, 38.2],
               "Oxygen saturation (%, breathing room air)": [98, 96, 97, 98, 98]
           }
       },
       {
           id: 11,
           data: {
               "Heart rate (beats/min)": [73, 68, 72, 74, 75],
               "Blood pressure (mmHg)": ["132/75", "140/78", "131/66", "135/73", "130/70"],
               "Respiratory rate (breaths/min)": [18, 18, 19, 19, 18],
               "Temperature (℃)": [36.8, 36.6, 38.3, 38.2, 36.8],
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

       slider.addEventListener('input', () => {
        // Mark the slider as interacted with
        sliderInteractionTracker[index] = true;
    
        // Update the completion indicator
        const indicator = slider.parentElement.querySelector('.completion-indicator');
        indicator.textContent = '✓';
        indicator.style.color = 'green';
    
        // Update slider thumb color
        const percentage = slider.value / 15;
        const color = getGradientColor(percentage);
        slider.style.setProperty('--thumb-color', color);
    
        // Save the updated state
        saveData();
        updateSubmitButton();
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

   function getGradientColor() {
       return 'white'; // Return white for the thumb color
   }

   function collectData() {
    const data = scenarios.map((scenario, index) => {
        const slider = document.getElementById(`slider-${scenario.id}`);
        return {
            id: scenario.id,
            concernLevel: slider ? parseInt(slider.value) : null,
            userInteracted: sliderInteractionTracker[index] || false, // Save interaction state
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
            // Clear all session storage data
            sessionStorage.clear();
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
   loadSavedData();
});