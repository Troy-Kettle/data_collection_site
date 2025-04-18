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
            name: "Supplementary oxygen",
            unit: "L/min",
            min: 0,
            max: 15,
            step: 1,
            majorTick: 5,
            hasBothDirections: false
        },
        {
            name: "Inspired oxygen concentration",
            unit: "%",
            min: 21,
            max: 100,
            step: 1,
            majorTick: 5,
            hasBothDirections: false
        }
    ];

    // Enhanced storage functions for persistence
    function saveMovedArrows(vitalSignName, movedArrows) {
        const savedData = JSON.parse(sessionStorage.getItem('vitalSignsMovedArrows') || '{}');
        savedData[vitalSignName] = Array.from(movedArrows);
        sessionStorage.setItem('vitalSignsMovedArrows', JSON.stringify(savedData));
    }

    function loadMovedArrows(vitalSignName) {
        const savedData = JSON.parse(sessionStorage.getItem('vitalSignsMovedArrows') || '{}');
        return savedData[vitalSignName] || [];
    }

    // New functions to save and load threshold positions
    function saveThresholdPositions(vitalSignName, thresholdValues) {
        const savedPositions = JSON.parse(sessionStorage.getItem('vitalSignsThresholds') || '{}');
        savedPositions[vitalSignName] = thresholdValues;
        sessionStorage.setItem('vitalSignsThresholds', JSON.stringify(savedPositions));
    }

    function loadThresholdPositions(vitalSignName) {
        const savedPositions = JSON.parse(sessionStorage.getItem('vitalSignsThresholds') || '{}');
        return savedPositions[vitalSignName];
    }

    // Initialize arrow movement tracking system
    const arrowMovementTracker = new Map();
    vitalSignsData.forEach(sign => {
        const numArrows = getNumArrows(sign);
        const savedArrows = loadMovedArrows(sign.name);
        arrowMovementTracker.set(sign.name, {
            arrowsMoved: new Set(savedArrows),
            initialPositions: new Array(numArrows).fill(null)
        });
    });

    function restoreCompletionStatus() {
        vitalSignsData.forEach(sign => {
            const savedArrows = loadMovedArrows(sign.name);
            if (savedArrows.length === getNumArrows(sign)) {
                const tracker = arrowMovementTracker.get(sign.name);
                tracker.arrowsMoved = new Set(savedArrows);
            }
        });
        updateCompletionStatus();
    }

    function getNumArrows(vitalSign) {
        if (vitalSign.name === "Oxygen Saturation" || 
            vitalSign.name === "Supplementary oxygen" || 
            vitalSign.name === "Inspired oxygen concentration") {
            return 3;
        }
        return 6;
    }

    function checkVitalSignComplete(vitalSignName) {
        const tracker = arrowMovementTracker.get(vitalSignName);
        const vitalSign = vitalSignsData.find(v => v.name === vitalSignName);
        const requiredArrows = getNumArrows(vitalSign);
        return tracker.arrowsMoved.size === requiredArrows;
    }

    function checkAllComplete() {
        for (const [name] of arrowMovementTracker) {
            if (!checkVitalSignComplete(name)) return false;
        }
        return true;
    }

    function updateCompletionStatus() {
        vitalSignsData.forEach(sign => {
            const container = document.querySelector(`[data-vital-sign="${sign.name}"]`);
            if (container) {
                const indicator = container.querySelector('.completion-indicator');
                if (indicator) {
                    const tracker = arrowMovementTracker.get(sign.name);
                    const totalArrows = getNumArrows(sign);
                    const numMoved = tracker.arrowsMoved.size;
                    const isComplete = numMoved === totalArrows;
                    
                    // Only show checkmark when complete, otherwise show nothing
                    indicator.textContent = isComplete ? '✓' : '';
                    indicator.style.color = isComplete ? 'green' : '';
                }
            }
        });

        const submitButton = document.getElementById('submitButton');
if (submitButton) {
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!checkAllComplete()) {
            return;
        }
        const data = collectData();
        if (data) {
            sessionStorage.setItem('completionStatus', 'true');
            window.location.href = 'part2.html';
        }
    });
} else {
    console.error('Submit button not found');
}
    }

    function createVitalSignElement(vitalSign) {
        const container = document.createElement('div');
        container.className = 'vital-sign';
        container.setAttribute('data-vital-sign', vitalSign.name);

        const titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.justifyContent = 'space-between';
        titleContainer.style.alignItems = 'center';

        const title = document.createElement('h3');
        title.textContent = `${vitalSign.name} (${vitalSign.unit})`;
        
        const indicator = document.createElement('span');
        indicator.className = 'completion-indicator';
        indicator.textContent = '';
        indicator.style.color = 'red';
        indicator.style.marginLeft = '10px';

        titleContainer.appendChild(title);
        titleContainer.appendChild(indicator);
        container.appendChild(titleContainer);

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
        const ticks = [];
        const min = vitalSign.min;
        const max = vitalSign.max;

        let thresholds = [];

        function getArrowLevel(index, vitalSign) {
            if (vitalSign.name === "Oxygen Saturation") {
                switch (index) {
                    case 1: return { thumbClass: 'thumb-severe' };
                    case 2: return { thumbClass: 'thumb-moderate' };
                    case 3: return { thumbClass: 'thumb-mild' };
                    default: return { thumbClass: '' };
                }
            } 
            else if (vitalSign.name === "Supplementary oxygen" || vitalSign.name === "Inspired oxygen concentration") {
                switch (index) {
                    case 1: return { thumbClass: 'thumb-mild' };
                    case 2: return { thumbClass: 'thumb-moderate' };
                    case 3: return { thumbClass: 'thumb-severe' };
                    default: return { thumbClass: '' };
                }
            }
            else {
                switch (index) {
                    case 1: return { thumbClass: 'thumb-severe' };
                    case 2: return { thumbClass: 'thumb-moderate' };
                    case 3: return { thumbClass: 'thumb-mild' };
                    case 4: return { thumbClass: 'thumb-mild' };
                    case 5: return { thumbClass: 'thumb-moderate' };
                    case 6: return { thumbClass: 'thumb-severe' };
                    default: return { thumbClass: '' };
                }
            }
        }

        function getConcernLevels(vitalSign) {
            if (vitalSign.name === "Supplementary oxygen" || vitalSign.name === "Inspired oxygen concentration") {
                return [
                    { label: 'No concern', class: 'no-concern', color: '#2ecc71' },
                    { label: 'Above normal - mild concern', class: 'mild-concern', color: '#f1c40f' },
                    { label: 'Above normal - moderate concern', class: 'moderate-concern', color: '#e67e22' },
                    { label: 'Above normal - severe concern', class: 'severe-concern', color: '#e74c3c' }
                ];
            }
            else if (vitalSign.name === "Oxygen Saturation") {
                return [
                    { label: 'Below normal - severe concern', class: 'severe-concern', color: '#e74c3c' },
                    { label: 'Below normal - moderate concern', class: 'moderate-concern', color: '#e67e22' },
                    { label: 'Below normal - mild concern', class: 'mild-concern', color: '#f1c40f' },
                    { label: 'No concern', class: 'no-concern', color: '#2ecc71' }
                ];
            } 
            else {
                return [
                    { label: 'Below normal - severe concern', class: 'severe-concern', color: '#e74c3c' },
                    { label: 'Below normal - moderate concern', class: 'moderate-concern', color: '#e67e22' },
                    { label: 'Below normal - mild concern', class: 'mild-concern', color: '#f1c40f' },
                    { label: 'No concern', class: 'no-concern', color: '#2ecc71' },
                    { label: 'Above normal - mild concern', class: 'mild-concern', color: '#f1c40f' },
                    { label: 'Above normal - moderate concern', class: 'moderate-concern', color: '#e67e22' },
                    { label: 'Above normal - severe concern', class: 'severe-concern', color: '#e74c3c' }
                ];
            }
        }

        function getRandomPositions(numArrows, min, max, step) {
            // First check if we have saved positions
            const savedPositions = loadThresholdPositions(vitalSign.name);
            if (savedPositions && savedPositions.length === numArrows) {
                return savedPositions;
            }
    
            // If no saved positions, generate random ones
            const positions = [];
            const segmentSize = (max - min) / (numArrows + 1);
        
            for (let i = 0; i < numArrows; i++) {
                const segmentMin = min + i * segmentSize;
                const segmentMax = min + (i + 1) * segmentSize;
        
                let randomValue = segmentMin + Math.random() * (segmentMax - segmentMin);
                randomValue = Math.round(randomValue / step) * step;
                randomValue = Math.max(segmentMin, Math.min(randomValue, segmentMax));
        
                positions.push(randomValue);
            }
        
            return positions.sort((a, b) => a - b);
        }
    
        function initializeThresholds() {
            const levels = getConcernLevels(vitalSign);
            thresholds = [{ value: min, levelIndex: 0 }];
            const numArrows = getNumArrows(vitalSign);
            
            // Try to load saved positions first
            const savedPositions = loadThresholdPositions(vitalSign.name);
            const positions = savedPositions && savedPositions.length === numArrows ? 
                savedPositions : getRandomPositions(numArrows, min, max, vitalSign.step);
            
            positions.forEach((val, idx) => {
                thresholds.push({ value: val, levelIndex: idx + 1 });
            });
            thresholds.push({ value: max, levelIndex: levels.length - 1 });
        }

       function enforceBoundaries(index) {
    const threshold = thresholds[index];
    const levels = getConcernLevels(vitalSign);
    
    threshold.value = Math.max(min, Math.min(threshold.value, max));

    // Calculate the minor tick interval (1/5 of major tick, except for Temperature)
    const minorTickInterval = vitalSign.name === "Temperature" ? 0.2 : vitalSign.majorTick / 5;
    const minNoConcernWidth = minorTickInterval * 3; // 3 minor teeth worth of width

    // Special handling for oxygen-related vital signs
    if (vitalSign.name === "Supplementary oxygen" || vitalSign.name === "Inspired oxygen concentration") {
        if (index === 1) {
            const minSpace = vitalSign.step * 0.1;
            threshold.value = Math.max((min + 1) + minSpace, threshold.value);
        }

        if (index > 0) {
            threshold.value = Math.max(thresholds[index - 1].value, threshold.value);
        }
        if (index < thresholds.length - 1) {
            threshold.value = Math.min(thresholds[index + 1].value, threshold.value);
        }
        return;
    }

    // Modified logic for heart rate and respiratory rate
    if (vitalSign.name === "Heart Rate" || vitalSign.name === "Respiratory Rate") {
        const middleIndex = Math.floor(thresholds.length / 2);

        // When moving boundaries of "No concern" section
        if (index === middleIndex || index === middleIndex - 1) {
            const noConcernStart = thresholds[middleIndex - 1].value;
            const noConcernEnd = thresholds[middleIndex].value;
            
            // Moving left boundary of "No concern"
            if (index === middleIndex - 1) {
                const maxAllowedValue = thresholds[middleIndex].value - minNoConcernWidth;
                threshold.value = Math.min(threshold.value, maxAllowedValue);
                if (index > 0) {
                    threshold.value = Math.max(thresholds[index - 1].value, threshold.value);
                }
            }
            // Moving right boundary of "No concern"
            else if (index === middleIndex) {
                const minAllowedValue = thresholds[middleIndex - 1].value + minNoConcernWidth;
                threshold.value = Math.max(threshold.value, minAllowedValue);
                if (index < thresholds.length - 1) {
                    threshold.value = Math.min(thresholds[index + 1].value, threshold.value);
                }
            }
        }
        // For other thresholds, just maintain ordering
        else {
            if (index > 0) {
                threshold.value = Math.max(thresholds[index - 1].value, threshold.value);
            }
            if (index < thresholds.length - 1) {
                threshold.value = Math.min(thresholds[index + 1].value, threshold.value);
            }
        }
        return;
    }

    // Default handling for other vital signs
    if (vitalSign.name === "Oxygen Saturation") {
        if (index > 0) {
            threshold.value = Math.max(thresholds[index - 1].value, threshold.value);
        }
        if (index < thresholds.length - 1) {
            threshold.value = Math.min(thresholds[index + 1].value, threshold.value);
        }
    } else {
        const middleIndex = Math.floor(thresholds.length / 2);

        if (index === middleIndex || index === middleIndex - 1) {
            const noConcernStart = thresholds[middleIndex - 1].value;
            const noConcernEnd = thresholds[middleIndex].value;
            
            if (index === middleIndex - 1) {
                const maxAllowedValue = thresholds[middleIndex].value - minNoConcernWidth;
                threshold.value = Math.min(threshold.value, maxAllowedValue);
                if (index > 0) {
                    threshold.value = Math.max(thresholds[index - 1].value, threshold.value);
                }
            }
            else if (index === middleIndex) {
                const minAllowedValue = thresholds[middleIndex - 1].value + minNoConcernWidth;
                threshold.value = Math.max(threshold.value, minAllowedValue);
                if (index < thresholds.length - 1) {
                    threshold.value = Math.min(thresholds[index + 1].value, threshold.value);
                }
            }
        }
        else {
            if (index > 0) {
                threshold.value = Math.max(thresholds[index - 1].value, threshold.value);
            }
            if (index < thresholds.length - 1) {
                threshold.value = Math.min(thresholds[index + 1].value, threshold.value);
            }
        }
    }
}       function updatePositions() {
            thresholds.forEach((threshold, index) => {
                if (index > 0 && index < thresholds.length - 1) {
                    const thumb = thumbs[index - 1];
                    const percent = ((threshold.value - min) / (max - min)) * 100;
                    thumb.style.left = `${percent}%`;
                    thumb.style.transform = 'translateX(-50%)';
                }
            });
        
            ranges.forEach(range => range.remove());
            ranges.length = 0;
        
            const levels = getConcernLevels(vitalSign);
            for (let i = 1; i < thresholds.length; i++) {
                const startPercent = ((thresholds[i-1].value - min) / (max - min)) * 100;
                const endPercent = ((thresholds[i].value - min) / (max - min)) * 100;
                const width = endPercent - startPercent;
                const isNoConcern = levels[thresholds[i-1].levelIndex].label === "No concern";
        
                const range = document.createElement('div');
                range.className = 'range';
                range.style.position = 'absolute';
                range.style.height = '20px';
                range.style.backgroundColor = levels[thresholds[i-1].levelIndex].color;
                
                // Ensure minimum visual width only for "No concern" section
                if (width === 0 && isNoConcern) {
                    range.style.width = '2px';
                    range.style.left = `calc(${startPercent}% - 1px)`;
                    range.style.zIndex = '1';
                    range.style.opacity = '0.7';
                } else {
                    range.style.width = `${width}%`;
                    range.style.left = `${startPercent}%`;
                }
        
                scaleContainer.appendChild(range);
                ranges.push(range);
            }
        
            updateTickMarksColor();
            updateThresholdTable();
        }
        

        function createTickMarks() {
            const tickContainer = document.createElement('div');
            tickContainer.className = 'tick-container';
            tickContainer.style.position = 'relative';
            tickContainer.style.height = '20px';
            scaleContainer.appendChild(tickContainer);

            ticks.length = 0;

            let minorTickInterval = vitalSign.majorTick / 5;
            if (vitalSign.name === "Temperature") {
                minorTickInterval = 0.2;
            }

            const decimals = getMaxDecimalDigits(vitalSign.step);

            const majorTicks = [];
            let majorTickStart = Math.ceil(min / vitalSign.majorTick) * vitalSign.majorTick;
            if (min % vitalSign.majorTick === 0) {
                majorTickStart = min;
            }
            for (let value = majorTickStart; value <= max; value += vitalSign.majorTick) {
                value = parseFloat(value.toFixed(decimals));
                majorTicks.push(value);
            }

            const minorTicks = [];
            let minorTickStart = Math.ceil(min / minorTickInterval) * minorTickInterval;
            if (min % minorTickInterval === 0) {
                minorTickStart = min;
            }
            for (let value = minorTickStart; value <= max; value += minorTickInterval) {
                value = parseFloat(value.toFixed(decimals));
                if (!majorTicks.includes(value)) {
                    minorTicks.push(value);
                }
            }

            const allTicks = [...majorTicks, ...minorTicks];
            allTicks.sort((a, b) => a - b);

            allTicks.forEach(value => {
                const isMajorTick = majorTicks.includes(value);
                const tick = document.createElement('div');
                tick.className = isMajorTick ? 'tick' : 'minor-tick';
                tick.style.position = 'absolute';
                tick.style.height = isMajorTick ? '10px' : '5px';
                tick.style.width = '1px';
                tick.style.backgroundColor = isMajorTick ? '#999' : '#ccc';

                const percent = ((value - min) / (max - min)) * 100;
                tick.style.left = `${percent}%`;
                tick.style.transform = 'translateX(-50%)';

                if (isMajorTick) {
                    const tickLabel = document.createElement('span');
                    tickLabel.className = 'tick-label';
                    tickLabel.style.position = 'absolute';
                    tickLabel.style.top = '15px';
                    tickLabel.style.left = `${percent}%`;
                    tickLabel.style.transform = 'translateX(-50%)';
                    tickLabel.textContent = formatValue(value, vitalSign);
                    tickContainer.appendChild(tickLabel);
                }

                tickContainer.appendChild(tick);
                ticks.push({ tick, value });
            });
        }

        function updateTickMarksColor() {
            ticks.forEach(({ tick, value }) => {
                const color = getTickColor(value, thresholds, getConcernLevels(vitalSign));
                tick.style.backgroundColor = color;
            });
        }

        function getTickColor(value, thresholds, levels) {
            for (let i = thresholds.length - 1; i >= 0; i--) {
                if (value >= thresholds[i].value) {
                    return levels[thresholds[i].levelIndex].color;
                }
            }
            return '#999';
        }

        function createThumbs() {
            thumbs.forEach(thumb => thumb.remove());
            thumbs.length = 0;

            const tracker = arrowMovementTracker.get(vitalSign.name);

            for (let i = 1; i < thresholds.length - 1; i++) {
                const threshold = thresholds[i];
                const thumb = document.createElement('div');
                thumb.className = 'thumb';
                thumb.style.position = 'absolute';

                const arrowLevel = getArrowLevel(i, vitalSign);
                if (arrowLevel.thumbClass) {
                    thumb.classList.add(arrowLevel.thumbClass);
                }

                scaleContainer.appendChild(thumb);
                thumbs.push(thumb);

                let isDragging = false;

                // Store initial position if not already stored
                if (tracker.initialPositions[i-1] === null) {
                    tracker.initialPositions[i-1] = threshold.value;
                }

                thumb.addEventListener('mousedown', (event) => {
                    isDragging = true;
                    event.preventDefault();
                });

                document.addEventListener('mousemove', (event) => {
                    if (isDragging) {
                        const rect = scaleContainer.getBoundingClientRect();
                        let percent = ((event.clientX - rect.left) / rect.width) * 100;
                        percent = Math.max(0, Math.min(100, percent));

                        let value = min + (percent / 100) * (max - min);
                        value = Math.round(value / vitalSign.step) * vitalSign.step;
                        threshold.value = value;

                        enforceBoundaries(i);
                        updatePositions();
                    }
                });

                // Modify the mouseup event listener in createThumbs function
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            const currentPosition = threshold.value;
            const initialPosition = tracker.initialPositions[i-1];
            
            // Check if arrow has moved from initial position
            if (currentPosition !== initialPosition) {
                tracker.arrowsMoved.add(i-1);
                updateCompletionStatus();
                
                // Save both the moved arrows and the current positions
                saveMovedArrows(vitalSign.name, tracker.arrowsMoved);
                const currentThresholds = thresholds.slice(1, -1).map(t => t.value);
                saveThresholdPositions(vitalSign.name, currentThresholds);
            }
        }
        isDragging = false;
    });
            }

            updatePositions();
        }

        function formatValue(value, vitalSign) {
            const decimals = getMaxDecimalDigits(vitalSign.step);
            return value.toFixed(decimals);
        }

        function getMaxDecimalDigits(step) {
            const stepString = step.toString();
            if (stepString.includes('.')) {
                return stepString.split('.')[1].length;
            }
            return 0;
        }

        // Create table to show thresholds
        const table = document.createElement('table');
        table.className = 'threshold-table';
        
        const tableHead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const levelHeader = document.createElement('th');
        levelHeader.textContent = 'Category';
        const lowerHeader = document.createElement('th');
        lowerHeader.textContent = 'Lower Limit';
        const upperHeader = document.createElement('th');
        upperHeader.textContent = 'Upper Limit';
        
        headerRow.appendChild(levelHeader);
        headerRow.appendChild(lowerHeader);
        headerRow.appendChild(upperHeader);
        tableHead.appendChild(headerRow);
        table.appendChild(tableHead);
        
        const tableBody = document.createElement('tbody');
        table.appendChild(tableBody);
        container.appendChild(table);

       function updateThresholdTable() {
    tableBody.innerHTML = '';
    const levels = getConcernLevels(vitalSign);
    
    // Create an array of sections with their boundaries
    let sections = [];
    for (let i = 1; i < thresholds.length; i++) {
        const isNoConcern = levels[thresholds[i-1].levelIndex].label === "No concern";
        const sectionWidth = thresholds[i].value - thresholds[i-1].value;
        
        // Calculate step size based on vital sign
        const stepSize = vitalSign.step || 1;
        
        // Only include sections that have non-zero width OR are "No concern"
        if (sectionWidth > 0 || isNoConcern) {
            sections.push({
                level: levels[thresholds[i-1].levelIndex].label,
                lower: thresholds[i-1].value,
                upper: thresholds[i].value,
                zeroWidth: sectionWidth === 0,
                isNoConcern: isNoConcern,
                stepSize: stepSize
            });
        }
    }
    
    // Adjust the upper values while respecting step sizes
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        
        if (i < sections.length - 1) {
            // Calculate the next valid value below the next section's lower bound
            const nextLower = sections[i + 1].lower;
            const stepsToSubtract = 1;
            section.upper = nextLower - (section.stepSize * stepsToSubtract);
            
            // Handle edge case where upper would be less than lower
            if (section.upper < section.lower) {
                section.upper = section.lower;
            }
        }
        // The last section's upper value remains unchanged
    }
    
    // Render sections
    sections.forEach((section, index) => {
        const row = document.createElement('tr');
        
        const levelCell = document.createElement('td');
        levelCell.textContent = section.level;
       
        const lowerCell = document.createElement('td');
        lowerCell.textContent = formatValue(section.lower, vitalSign);
        
        const upperCell = document.createElement('td');
        upperCell.textContent = formatValue(section.upper, vitalSign);
        
        // Only add visual indicator for zero-width "No concern" sections
        if (section.zeroWidth && section.isNoConcern) {
            row.style.opacity = "0.7";
            row.title = "This category has minimal range but must remain visible";
        }
        
        row.appendChild(levelCell);
        row.appendChild(lowerCell);
        row.appendChild(upperCell);
        tableBody.appendChild(row);
    });
}    vitalSign.getValues = function() {
            return thresholds.slice(1, -1)
                .map(t => formatValue(t.value, vitalSign));
        };

        createTickMarks();
        initializeThresholds();
        createThumbs();
        
        return container;
    }

    const vitalSignsContainer = document.getElementById('vitalSignsContainer');
    vitalSignsData.forEach(sign => {
        const element = createVitalSignElement(sign);
        vitalSignsContainer.appendChild(element);
    });

    restoreCompletionStatus();

        // Handle navigation attempts
        window.addEventListener('beforeunload', (e) => {
            if (!checkAllComplete()) {
                e.preventDefault();
                e.returnValue = 'You must move all arrows before proceeding. Would you like to leave anyway?';
            }
        });
    
        // Prevent direct navigation to part2.html
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href') === 'part2.html') {
                e.preventDefault();
                if (!checkAllComplete()) {
                    alert('You must complete Part 1 before proceeding to Part 2.');
                } else {
                    window.location.href = 'part2.html';
                }
            }
        });
    
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (!checkAllComplete()) {
                    alert('Not all arrows have been moved. Please move all arrows before proceeding.');
                    return;
                }
                const data = collectData();
                if (data) {
                    sessionStorage.setItem('completionStatus', 'true');
                    window.location.href = 'part2.html';
                }
            });
        }
        
        // Check if user is trying to access part2.html directly
        if (window.location.href.includes('part2.html')) {
            const completionStatus = sessionStorage.getItem('completionStatus');
            if (completionStatus !== 'true') {
                alert('You must complete Part 1 first. Please move all arrows before proceeding.');
                window.location.href = 'index.html';
            }
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
        
        sessionStorage.setItem('part1Data', JSON.stringify(data));
        return data;
    }

    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .completion-indicator {
            font-size: 1.2em;
            font-weight: bold;
        }
        
        .vital-sign {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        .track {
            height: 20px;
            background: #f0f0f0;
            position: relative;
            margin: 20px 0;
        }

        .threshold-table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }

        .threshold-table th,
        .threshold-table td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: left;
        }

        .threshold-table th {
            background-color: #f5f5f5;
        }


    `;
    document.head.appendChild(style);
});
