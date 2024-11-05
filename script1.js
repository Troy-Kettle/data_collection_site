// script1.js
document.addEventListener('DOMContentLoaded', () => {
// Vital Signs Data
const vitalSignsData = [
    {
        name: "Heart Rate",
        unit: "beats/min",
        min: 20,
        max: 200,
        step: 1,
        majorTick: 10,
        hasBothDirections: true
    },
    {
        name: "Systolic Blood Pressure",
        unit: "mmHg",
        min: 40,
        max: 250,
        step: 1,
        majorTick: 10,
        hasBothDirections: true
    },
    {
        name: "Respiratory Rate",
        unit: "breaths/min",
        min: 1,
        max: 60,
        step: 1,
        majorTick: 5,
        hasBothDirections: true
    },
    {
        name: "Temperature",
        unit: "℃",
        min: 32.0,
        max: 42.0,
        step: 0.1,
        majorTick: 1,
        hasBothDirections: true
    },
    {
        name: "Oxygen Saturation",
        unit: "%",
        min: 50,
        max: 100,
        step: 1,
        majorTick: 5,
        hasBothDirections: false,
        reverseScale: true
    },
    {
        name: "Inspired Oxygen -",
        unit: "L/min",
        min: 0,
        max: 15,
        step: 1,
        majorTick: 5,
        hasBothDirections: false
    },
    {
        name: "Inspired Oxygen -",
        unit: "%",
        min: 20,
        max: 100,
        step: 1,
        majorTick: 5,
        hasBothDirections: false
    }
];

// Function to create vital sign elements
function createVitalSignElement(vitalSign) {
    const container = document.createElement('div');
    container.className = 'vital-sign';

    const title = document.createElement('h3');
    title.textContent = `${vitalSign.name} (${vitalSign.unit})`;
    container.appendChild(title);

    const scaleContainer = document.createElement('div');
    scaleContainer.className = 'scale-container';
    scaleContainer.style.position = 'relative';
    container.appendChild(scaleContainer);

    const track = document.createElement('div');
    track.className = 'track';
    track.style.position = 'relative';
    scaleContainer.appendChild(track);

    const ranges = [];
    const thumbs = [];
    const thumbLabels = [];

    const levels = getConcernLevels(vitalSign);

    let thresholds = [];
    let numArrows = getNumArrows(vitalSign);
    const min = vitalSign.min;
    const max = vitalSign.max;

    // Initialize section visibility states if not already set
    if (!vitalSign.sectionStates) {
        vitalSign.sectionStates = Array(numArrows).fill(true);
    }

    // Function to check if a section is visible
    function isSectionVisible(index) {
        return vitalSign.sectionStates[index - 1]; // Adjust index since thresholds include min/max
    }

    // Function to toggle section visibility
    function toggleSection(index, visible) {
        vitalSign.sectionStates[index - 1] = visible;
        updatePositions();
    }

    function enforceBoundaries(index) {
        const threshold = thresholds[index];
        
        // Ensure thresholds stay within min and max
        threshold.value = Math.max(min, Math.min(threshold.value, max));
        
        // Handle section visibility based on overlap
        if (index > 0 && index < thresholds.length - 1) {
            // Check overlap with previous section
            if (index > 1) {
                const prevVisible = isSectionVisible(index - 1);
                if (prevVisible && thresholds[index - 1].value >= threshold.value) {
                    // Don't hide "no concern" section
                    if (!isNoConcernBoundary(index - 1)) {
                        toggleSection(index - 1, false);
                    } else {
                        // If trying to hide "no concern", prevent the movement
                        threshold.value = thresholds[index - 1].value + vitalSign.step;
                    }
                }
            }
            
            // Check overlap with next section
            if (index < thresholds.length - 2) {
                const nextVisible = isSectionVisible(index + 1);
                if (nextVisible && thresholds[index + 1].value <= threshold.value) {
                    // Don't hide "no concern" section
                    if (!isNoConcernBoundary(index + 1)) {
                        toggleSection(index + 1, false);
                    } else {
                        // If trying to hide "no concern", prevent the movement
                        threshold.value = thresholds[index + 1].value - vitalSign.step;
                    }
                }
            }
            
            // Check if moving away from hidden sections - restore them
            if (index > 1) {
                const prevHidden = !isSectionVisible(index - 1);
                if (prevHidden && thresholds[index - 1].value < threshold.value) {
                    toggleSection(index - 1, true);
                }
            }
            
            if (index < thresholds.length - 2) {
                const nextHidden = !isSectionVisible(index + 1);
                if (nextHidden && thresholds[index + 1].value > threshold.value) {
                    toggleSection(index + 1, true);
                }
            }
        }
    }

    function isNoConcernBoundary(index) {
        if (vitalSign.name === "Oxygen Saturation") {
            return index === thresholds.length - 2;
        } else if (vitalSign.name.startsWith("Inspired Oxygen")) {
            return index === 1;
        } else {
            return index === 3 || index === 4;
        }
    }

    function updatePositions() {
        // Update thumbs and labels
        thresholds.forEach((threshold, index) => {
            if (index > 0 && index < thresholds.length - 1) {
                const thumb = thumbs[index - 1];
                const thumbLabel = thumbLabels[index - 1];
                const percent = ((threshold.value - min) / (max - min)) * 100;
                
                // Only show thumb and label if section is visible
                if (isSectionVisible(index)) {
                    thumb.style.display = 'block';
                    thumb.style.left = `${percent}%`;
                    thumb.style.transform = 'translateX(-50%)';
                    
                    thumbLabel.style.display = 'block';
                    thumbLabel.style.left = `${percent}%`;
                    thumbLabel.style.transform = 'translateX(-50%)';
                    thumbLabel.textContent = formatValue(threshold.value, vitalSign);
                } else {
                    thumb.style.display = 'none';
                    thumbLabel.style.display = 'none';
                }
            }
        });
        
        // Update ranges
        const visibleRanges = [];
        let lastVisibleValue = min;
        
        for (let i = 1; i < thresholds.length; i++) {
            if (isSectionVisible(i)) {
                visibleRanges.push({
                    start: lastVisibleValue,
                    end: thresholds[i].value,
                    levelIndex: thresholds[i-1].levelIndex
                });
                lastVisibleValue = thresholds[i].value;
            }
        }
        
        // Clear existing ranges
        ranges.forEach(range => range.remove());
        ranges.length = 0;
        
        // Create new ranges
        visibleRanges.forEach(rangeData => {
            const startPercent = ((rangeData.start - min) / (max - min)) * 100;
            const endPercent = ((rangeData.end - min) / (max - min)) * 100;
            const width = endPercent - startPercent;
            
            const range = document.createElement('div');
            range.className = 'range';
            range.style.left = `${startPercent}%`;
            range.style.width = `${width}%`;
            range.style.backgroundColor = levels[rangeData.levelIndex].color;
            range.style.position = 'absolute';
            scaleContainer.appendChild(range);
            ranges.push(range);
        });
        
        updateTickMarksColor();
        updateThresholdTable(visibleRanges);
    }

    function updateThresholdTable(visibleRanges) {
        tableBody.innerHTML = '';
        
        visibleRanges.forEach(range => {
            const row = document.createElement('tr');
            const levelCell = document.createElement('td');
            levelCell.textContent = levels[range.levelIndex].label;
            
            const lowerCell = document.createElement('td');
            lowerCell.textContent = formatValue(range.start, vitalSign);
            
            const upperCell = document.createElement('td');
            upperCell.textContent = formatValue(range.end, vitalSign);
            
            row.appendChild(levelCell);
            row.appendChild(lowerCell);
            row.appendChild(upperCell);
            tableBody.appendChild(row);
        });
    }

    function formatValue(value, vitalSign) {
        const decimals = getMaxDecimalDigits(vitalSign.step);
        return value.toFixed(decimals);
    }

    function formatValueForLabel(value, vitalSign) {
        return formatValue(value, vitalSign);
    }

    function getMaxDecimalDigits(step) {
        const stepString = step.toString();
        if (stepString.includes('.')) {
            return stepString.split('.')[1].length;
        } else {
            return 0;
        }
    }

    function getConcernLevels(vitalSign) {
        if (vitalSign.name === "Oxygen Saturation") {
            return [
                { label: 'Low - severe concern', class: 'severe-concern', color: '#e74c3c' },
                { label: 'Low - moderate concern', class: 'moderate-concern', color: '#e67e22' },
                { label: 'Low - mild concern', class: 'mild-concern', color: '#f1c40f' },
                { label: 'No concern', class: 'no-concern', color: '#2ecc71' }
            ];
        }
        else if(vitalSign.name.startsWith("Inspired Oxygen")) {
            return [
                { label: 'No concern', class: 'no-concern', color: '#2ecc71' },
                { label: 'High - mild concern', class: 'mild-concern', color: '#f1c40f' },
                { label: 'High - moderate concern', class: 'moderate-concern', color: '#e67e22' },
                { label: 'High - severe concern', class: 'severe-concern', color: '#e74c3c' }
            ];
        }
        else {
            return [
                { label: 'Low - severe concern', class: 'severe-concern', color: '#e74c3c' },
                { label: 'Low - moderate concern', class: 'moderate-concern', color: '#e67e22' },
                { label: 'Low - mild concern', class: 'mild-concern', color: '#f1c40f' },
                { label: 'No concern', class: 'no-concern', color: '#2ecc71' },
                { label: 'High - mild concern', class: 'mild-concern', color: '#f1c40f' },
                { label: 'High - moderate concern', class: 'moderate-concern', color: '#e67e22' },
                { label: 'High - severe concern', class: 'severe-concern', color: '#e74c3c' }
            ];
        }
    }

    function getTickColor(value, thresholds, levels) {
        for (let i = thresholds.length - 1; i >= 0; i--) {
            if (value >= thresholds[i].value) {
                return levels[thresholds[i].levelIndex].color;
            }
        }
        return '#999';
    }

    function getArrowLevel(index, vitalSign) {
        if (vitalSign.name === "Oxygen Saturation") {
            switch (index) {
                case 1:
                    return { thumbClass: 'thumb-severe', thumbLabelClass: 'thumb-label-severe' };
                case 2:
                    return { thumbClass: 'thumb-moderate', thumbLabelClass: 'thumb-label-moderate' };
                case 3:
                    return { thumbClass: 'thumb-mild', thumbLabelClass: 'thumb-label-mild' };
                default:
                    return { thumbClass: '', thumbLabelClass: '' };
            }
        } else if (vitalSign.name.startsWith("Inspired Oxygen")) {
            switch (index) {
                case 3:
                    return { thumbClass: 'thumb-severe', thumbLabelClass: 'thumb-label-severe' };
                case 2:
                    return { thumbClass: 'thumb-moderate', thumbLabelClass: 'thumb-label-moderate' };
                case 1:
                    return { thumbClass: 'thumb-mild', thumbLabelClass: 'thumb-label-mild' };
                default:
                    return { thumbClass: '', thumbLabelClass: '' };
            }
        }
        else {
            switch (index) {
                case 1:
                    return { thumbClass: 'thumb-severe', thumbLabelClass: 'thumb-label-severe' };
                case 2:
                    return { thumbClass: 'thumb-moderate', thumbLabelClass: 'thumb-label-moderate' };
                case 3:
                    return { thumbClass: 'thumb-mild', thumbLabelClass: 'thumb-label-mild' };
                case 4:
                    return { thumbClass: 'thumb-mild', thumbLabelClass: 'thumb-label-mild' };
                case 5:
                    return { thumbClass: 'thumb-moderate', thumbLabelClass: 'thumb-label-moderate' };
                case 6:
                    return { thumbClass: 'thumb-severe', thumbLabelClass: 'thumb-label-severe' };
                default:
                    return { thumbClass: '', thumbLabelClass: '' };
            }
        }
    }

    function getNumArrows(vitalSign) {
        if (vitalSign.name === "Oxygen Saturation" || vitalSign.name.startsWith("Inspired Oxygen")) {
            return 3;
        } else {
            return 6;
        }
    }

    // Function to initialize arrows at positions evenly distributed within the range
    function getInitialPositions(numArrows, min, max, step) {
        const positions = [];
        const interval = (max - min) / (numArrows + 1);
        for (let i = 1; i <= numArrows; i++) {
            const position = min + i * interval;
            // Snap to nearest step
            const snappedPosition = Math.round(position / step) * step;
            positions.push(snappedPosition);
        }
        // Ensure positions are within bounds and sorted
        return positions.map(pos => Math.max(min, Math.min(pos, max))).sort((a, b) => a - b);
    }

    vitalSign.getValues = function() {
        return thresholds.slice(1, -1)
            .filter((_, index) => isSectionVisible(index + 1))
            .map(t => formatValue(t.value, vitalSign));
    };

    // Save thresholds to vitalSign object for later retrieval
    vitalSign.thresholds = thresholds;

    // Function to load saved data
    function loadSavedData() {
        const savedData = JSON.parse(localStorage.getItem('part1Data'));
        if (savedData && savedData.thresholds) {
            const vitalSignData = savedData.thresholds.find(v => v['Vital Sign'] === vitalSign.name);
            if (vitalSignData && vitalSignData.Values) {
                const savedValues = vitalSignData.Values.split(';').map(v => parseFloat(v));
                // Reconstruct thresholds based on saved values
                thresholds = [{ value: min, levelIndex: 0 }];

                savedValues.forEach((val, idx) => {
                    thresholds.push({ value: val, levelIndex: idx + 1 });
                });

                thresholds.push({ value: max, levelIndex: levels.length - 1 });

                createThumbs();
                updatePositions();
            } else {
                createThumbs();
            }
        } else {
            createThumbs();
        }
    }

    loadSavedData();

    return container;
}

const vitalSignsContainer = document.getElementById('vitalSignsContainer');

vitalSignsData.forEach(sign => {
    const element = createVitalSignElement(sign);
    vitalSignsContainer.appendChild(element);
});


const submitButton = document.getElementById('submitButton');

if (submitButton) {
    submitButton.addEventListener('click', () => {
        // Collect data and store it in localStorage
        collectData();
        alert('Your responses have been saved. Please proceed to Part 2.');
        // Navigate to the next page
        window.location.href = 'part2.html';
    });
} else {
    console.error('Submit button not found!');
}

function collectData() {
    const data = {};
    data.thresholds = [];

    vitalSignsData.forEach(vitalSign => {
        const values = vitalSign.getValues();
        data.thresholds.push({
            'Vital Sign': vitalSign.name,
            'Unit': vitalSign.unit,
            'Values': values.join(';')
        });
    });

    // Save data to localStorage
    localStorage.setItem('part1Data', JSON.stringify(data));

    console.log('Data collected and saved to localStorage:', data);

    return data;
}
});