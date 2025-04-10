document.addEventListener('DOMContentLoaded', () => {
    // Only validate if we're on part3.html
    if (window.location.pathname.includes('part3.html')) {
        const completionStatus = sessionStorage.getItem('completionStatus');
        const part1Data = sessionStorage.getItem('part1Data');
        
        if (completionStatus !== 'true' || !part1Data) {
            alert('You must complete Part 1 first');
            window.location.href = 'part1.html';
            return;
        }

        const part2Interactions = JSON.parse(sessionStorage.getItem('part2Interactions') || '[]');
        
        if (completionStatus !== 'true') {
            alert('You must complete Part 2 first');
            window.location.href = 'part2.html';
            return;
        }

        if (part2Interactions.includes(false)) {
            alert('You must complete all interactions in Part 2 before proceeding to Part 3');
            window.location.href = 'part2.html';
            return;
        }
    }

    // Initialize slider interaction tracker
    const sliderInteractionTracker = Array(14).fill(false);  // 14 scenarios

    function checkAllSlidersInteracted() {
        const notInteractedSliders = sliderInteractionTracker.filter(interacted => !interacted).length;
        return notInteractedSliders === 0;
    }

    // New function to update submit button state
    function updateSubmitButton() {
        const submitButton = document.getElementById('submitButton');
        if (submitButton) {
            // Allow clicking but give visual indication
            const allSlidersInteracted = checkAllSlidersInteracted();
            submitButton.style.opacity = allSlidersInteracted ? '1' : '0.5';
            submitButton.style.cursor = allSlidersInteracted ? 'pointer' : 'not-allowed';
        }
    }

    function getGradientColor() {
        return 'white'; // Return white for the thumb color
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
      // Updated heart rate values
      "Heart rate (beats/min)": [112, 105, 131, 135, 110],
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
      // Updated blood pressure values
      "Blood pressure (mmHg)": ["97/63", "93/66", "82/47", "78/42", "95/55"],
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
      // Updated respiratory rate values
      "Respiratory rate (breaths/min)": [24, 23, 33, 31, 24],
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
      // Updated oxygen saturation values
      "Oxygen saturation (%, breathing room air)": [92, 90, 84, 85, 92]
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

    // Create slider container and components
    const sliderContainer =
