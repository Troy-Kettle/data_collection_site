document.addEventListener('DOMContentLoaded', () => {
    // Vital Signs Data with unique names for Inspired Oxygen
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
            name: "Inspired Oxygen (L/min)",
            unit: "L/min",
            min: 0,
            max: 15,
            step: 1,
            majorTick: 5,
            hasBothDirections: false
        },
        {
            name: "Inspired Oxygen (%)",
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
        const ticks = []; // Added to keep track of ticks
    
        const levels = getConcernLevels(vitalSign);
    
        let thresholds = [];
        let numArrows = getNumArrows(vitalSign);
        const min = vitalSign.min;
        const max = vitalSign.max;
    
        // Initialize section visibility states if not already set
        if (!vitalSign.sectionStates) {
            vitalSign.sectionStates = Array(numArrows + 1).fill(true); // Adjusted to include last section
        }
    
        // Function to check if a section is visible
        function isSectionVisible(index) {
            return vitalSign.sectionStates[index - 1]; // Adjust index since thresholds include min/max
        }
    
        // Function to toggle section visibility
       // Function to toggle section visibility
    function toggleSection(index, visible) {
        // Check if this is the "No concern" section before allowing toggle
        const level = levels[thresholds[index - 1].levelIndex];
        if (level.label === 'No concern' && !visible) {
            return; // Prevent hiding the "No concern" section
        }
        vitalSign.sectionStates[index - 1] = visible;
        updatePositions();
    }
    
    function enforceBoundaries(index) {
        const threshold = thresholds[index];
        const originalValue = threshold.value;

        // Ensure thresholds stay within min and max
        threshold.value = Math.max(min, Math.min(threshold.value, max));

        // Check if this movement would make the "No concern" section too small
        let noConcernStart, noConcernEnd;
        
        if (vitalSign.name === "Oxygen Saturation") {
            noConcernStart = thresholds[thresholds.length - 2].value;
            noConcernEnd = max;
        } else if (vitalSign.name.startsWith("Inspired Oxygen")) {
            noConcernStart = min;
            noConcernEnd = thresholds[1].value;
        } else {
            noConcernStart = thresholds[3].value;
            noConcernEnd = thresholds[4].value;
        }

        // Minimum width for "No concern" section (adjust as needed)
        const minWidth = (max - min) * 0.01; // 5% of total range

        // If moving a boundary would make "No concern" section too small, prevent it
        if (index > 0 && index < thresholds.length - 1) {
            if (vitalSign.name === "Oxygen Saturation") {
                if (index === thresholds.length - 2 && (max - threshold.value) < minWidth) {
                    threshold.value = max - minWidth;
                }
            } else if (vitalSign.name.startsWith("Inspired Oxygen")) {
                if (index === 1 && (threshold.value - min) < minWidth) {
                    threshold.value = min + minWidth;
                }
            } else {
                if (index === 3 && (thresholds[4].value - threshold.value) < minWidth) {
                    threshold.value = thresholds[4].value - minWidth;
                }
                if (index === 4 && (threshold.value - thresholds[3].value) < minWidth) {
                    threshold.value = thresholds[3].value + minWidth;
                }
            }
        }

        // Continue with the rest of the original enforceBoundaries logic
        if (index > 0 && index < thresholds.length - 1) {
            // Check overlap with previous sections (going left to right)
            for (let i = index - 1; i > 0; i--) {
                const prevVisible = isSectionVisible(i);
                if (prevVisible && thresholds[i].value >= threshold.value) {
                    if (isNoConcernBoundary(i)) {
                        threshold.value = thresholds[i].value;
                    } else {
                        toggleSection(i, false);
                    }
                }
            }

            // Check overlap with next sections (going right to left)
            for (let i = index + 1; i < thresholds.length - 1; i++) {
                const nextVisible = isSectionVisible(i);
                if (nextVisible && thresholds[i].value <= threshold.value) {
                    if (isNoConcernBoundary(i)) {
                        threshold.value = thresholds[i].value;
                    } else {
                        toggleSection(i, false);
                    }
                }
            }
    
                // Restore hidden sections if moving away
                for (let i = index - 1; i > 0; i--) {
                    const prevHidden = !isSectionVisible(i);
                    if (prevHidden && thresholds[i].value < threshold.value) {
                        toggleSection(i, true);
                    }
                }
    
                for (let i = index + 1; i < thresholds.length - 1; i++) {
                    const nextHidden = !isSectionVisible(i);
                    if (nextHidden && thresholds[i].value > threshold.value) {
                        toggleSection(i, true);
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
    
                    // Always show thumb and label
                    thumb.style.display = 'block';
                    thumb.style.left = `${percent}%`;
                    thumb.style.transform = 'translateX(-50%)';
    
                    thumbLabel.style.display = 'block';
                    thumbLabel.style.left = `${percent}%`;
                    thumbLabel.style.transform = 'translateX(-50%)';
                    thumbLabel.textContent = formatValue(threshold.value, vitalSign);
    
                    // Adjust appearance if section is hidden
                    if (!isSectionVisible(index)) {
                        thumb.style.opacity = '0.5';
                        thumbLabel.style.opacity = '0.5';
                    } else {
                        thumb.style.opacity = '1';
                        thumbLabel.style.opacity = '1';
                    }
                }
            });
    
            // Update ranges
            const visibleRanges = [];
            let lastVisibleValue = min;
    
            for (let i = 1; i < thresholds.length; i++) {
                if (isSectionVisible(i)) {
                    // Only add ranges with non-zero width
                    if (thresholds[i].value !== lastVisibleValue) {
                        visibleRanges.push({
                            start: lastVisibleValue,
                            end: thresholds[i].value,
                            levelIndex: Math.max(0, Math.min(levels.length - 1, thresholds[i - 1].levelIndex))
                        });
                    }
                    lastVisibleValue = thresholds[i].value;
                }
            }
    
            // Clear existing ranges
            ranges.forEach(range => range.remove());
            ranges.length = 0;
    
            // Create new ranges without changing the colors of remaining sections
            visibleRanges.forEach((rangeData) => {
                if (rangeData.start !== rangeData.end) { // Only create ranges with non-zero width
                    const startPercent = ((rangeData.start - min) / (max - min)) * 100;
                    const endPercent = ((rangeData.end - min) / (max - min)) * 100;
                    const width = endPercent - startPercent;
    
                    const range = document.createElement('div');
                    range.className = 'range';
                    range.style.left = `${startPercent}%`;
                    range.style.width = `${width}%`;
                    range.style.backgroundColor = levels[rangeData.levelIndex].color;
                    range.style.position = 'absolute';
                    range.style.height = '20px';
                    scaleContainer.appendChild(range);
                    ranges.push(range);
                }
            });
    
            updateTickMarksColor();
            updateThresholdTable(visibleRanges);
        }
    
        function updateThresholdTable(visibleRanges) {
            tableBody.innerHTML = '';
    
            visibleRanges.forEach(range => {
                if (range.start !== range.end) { // Only add rows for ranges with non-zero width
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
                }
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
            else if (vitalSign.name.startsWith("Inspired Oxygen")) {
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
                    case 1:
                        return { thumbClass: 'thumb-mild', thumbLabelClass: 'thumb-label-mild' };
                    case 2:
                        return { thumbClass: 'thumb-moderate', thumbLabelClass: 'thumb-label-moderate' };
                    case 3:
                        return { thumbClass: 'thumb-severe', thumbLabelClass: 'thumb-label-severe' };
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
            if (vitalSign.name === "Oxygen Saturation") {
                return 3;
            } else if (vitalSign.name.startsWith("Inspired Oxygen")) {
                return 3;
            } else {
                return 6;
            }
        }
    
        // Initialize thresholds with random positions
        function initializeThresholds() {
            thresholds = [{ value: min, levelIndex: 0 }];
    
            const initialPositions = getRandomPositions(numArrows, min, max, vitalSign.step);
    
            initialPositions.forEach((val, idx) => {
                thresholds.push({ value: val, levelIndex: idx + 1 });
            });
    
            thresholds.push({ value: max, levelIndex: levels.length - 1 });
        }
    
        // Function to generate random positions for the arrows
        function getRandomPositions(numArrows, min, max, step) {
            const positions = [];
    
            // Divide the range into (numArrows + 1) segments
            const segmentSize = (max - min) / (numArrows + 1);
    
            for (let i = 0; i < numArrows; i++) {
                // Define segment boundaries
                const segmentMin = min + i * segmentSize;
                const segmentMax = min + (i + 1) * segmentSize;
    
                // Generate a random value within the segment
                let randomValue = segmentMin + Math.random() * (segmentMax - segmentMin);
    
                // Snap to nearest step
                randomValue = Math.round(randomValue / step) * step;
    
                // Ensure value is within segment boundaries after snapping
                randomValue = Math.max(segmentMin, Math.min(randomValue, segmentMax));
    
                positions.push(randomValue);
            }
    
            // Sort positions to ensure they are in order
            return positions.sort((a, b) => a - b);
        }
    
        vitalSign.getValues = function() {
            return thresholds.slice(1, -1)
                .filter((t, index) => {
                    const prevValue = thresholds[index].value;
                    const nextValue = thresholds[index + 2].value;
                    // Exclude thresholds that have same value as previous or next (zero-width ranges)
                    return (
                        //isSectionVisible(index + 1) &&
                        t.value !== prevValue &&
                        t.value !== nextValue
                    );
                })
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
                    initializeThresholds();
                    createThumbs();
                }
            } else {
                initializeThresholds();
                createThumbs();
            }
        }
    
        // Create tick marks
        function createTickMarks() {
            const numTicks = Math.floor((max - min) / vitalSign.majorTick) + 1;
            const tickContainer = document.createElement('div');
            tickContainer.className = 'tick-container';
            tickContainer.style.position = 'relative';
            tickContainer.style.height = '20px';
            scaleContainer.appendChild(tickContainer);
    
            for (let i = 0; i < numTicks; i++) {
                const tick = document.createElement('div');
                tick.className = 'tick';
                tick.style.position = 'absolute';
                tick.style.height = '10px';
                tick.style.width = '1px';
                tick.style.backgroundColor = '#999';
    
                const value = min + i * vitalSign.majorTick;
                const percent = ((value - min) / (max - min)) * 100;
                tick.style.left = `${percent}%`;
                tick.style.transform = 'translateX(-50%)';
    
                const tickLabel = document.createElement('span');
                tickLabel.className = 'tick-label';
                tickLabel.style.position = 'absolute';
                tickLabel.style.top = '15px';
                tickLabel.style.left = `${percent}%`;
                tickLabel.style.transform = 'translateX(-50%)';
                tickLabel.textContent = formatValue(value, vitalSign);
    
                tickContainer.appendChild(tick);
                tickContainer.appendChild(tickLabel);
                ticks.push({ tick, value });
            }
    
            // Create smaller ticks in between the major ticks
            const minorTickInterval = vitalSign.majorTick / 5; // Smaller ticks between major ticks
            const numMinorTicks = Math.floor((max - min) / minorTickInterval);
            for (let i = 0; i < numMinorTicks; i++) {
                const minorTickValue = min + i * minorTickInterval;
                const percent = ((minorTickValue - min) / (max - min)) * 100;
    
                // Skip if it's a major tick value
                if (i % 5 === 0) {
                    continue;
                }
    
                const minorTick = document.createElement('div');
                minorTick.className = 'minor-tick';
                minorTick.style.position = 'absolute';
                minorTick.style.height = '5px';
                minorTick.style.width = '1px';
                minorTick.style.backgroundColor = '#ccc';
                minorTick.style.left = `${percent}%`;
                minorTick.style.transform = 'translateX(-50%)';
    
                tickContainer.appendChild(minorTick);
            }
        }
    
        function updateTickMarksColor() {
            ticks.forEach(({ tick, value }) => {
                const color = getTickColor(value, thresholds, levels);
                tick.style.backgroundColor = color;
            });
        }
    
        // Create thumbs
        function createThumbs() {
            // Remove existing thumbs and labels
            thumbs.forEach(thumb => thumb.remove());
            thumbLabels.forEach(label => label.remove());
            thumbs.length = 0;
            thumbLabels.length = 0;
    
            // For each threshold between min and max, create a thumb
            for (let i = 1; i < thresholds.length - 1; i++) {
                const threshold = thresholds[i];
    
                const thumb = document.createElement('div');
                thumb.className = 'thumb';
                thumb.style.position = 'absolute';
    
                const thumbLabel = document.createElement('div');
                thumbLabel.className = 'thumb-label';
                thumbLabel.style.position = 'absolute';
    
                // Add level-specific classes
                const arrowLevel = getArrowLevel(i, vitalSign);
                if (arrowLevel.thumbClass) {
                    thumb.classList.add(arrowLevel.thumbClass);
                }
                if (arrowLevel.thumbLabelClass) {
                    thumbLabel.classList.add(arrowLevel.thumbLabelClass);
                }
    
                // Add thumb to scaleContainer
                scaleContainer.appendChild(thumb);
                scaleContainer.appendChild(thumbLabel);
    
                thumbs.push(thumb);
                thumbLabels.push(thumbLabel);
    
                // Add event listeners for dragging
                let isDragging = false;
    
                thumb.addEventListener('mousedown', (event) => {
                    isDragging = true;
                    event.preventDefault();
                });
    
                document.addEventListener('mousemove', (event) => {
                    if (isDragging) {
                        const rect = scaleContainer.getBoundingClientRect();
                        let percent = ((event.clientX - rect.left) / rect.width) * 100;
                        percent = Math.max(0, Math.min(100, percent));
    
                        // Convert percent to value
                        let value = min + (percent / 100) * (max - min);
                        // Snap to step
                        value = Math.round(value / vitalSign.step) * vitalSign.step;
                        threshold.value = value;
    
                        enforceBoundaries(i);
                        updatePositions();
                    }
                });
    
                document.addEventListener('mouseup', () => {
                    isDragging = false;
                });
            }
    
            updatePositions();
        }
    
        // Create table for displaying thresholds
        const table = document.createElement('table');
        table.className = 'threshold-table';
    
        const tableHead = document.createElement('thead');
        const headerRow = document.createElement('tr');
    
        const levelHeader = document.createElement('th');
        levelHeader.textContent = 'Level';
        const lowerHeader = document.createElement('th');
        lowerHeader.textContent = 'Lower Bound';
        const upperHeader = document.createElement('th');
        upperHeader.textContent = 'Upper Bound';
    
        headerRow.appendChild(levelHeader);
        headerRow.appendChild(lowerHeader);
        headerRow.appendChild(upperHeader);
        tableHead.appendChild(headerRow);
        table.appendChild(tableHead);
    
        const tableBody = document.createElement('tbody');
        table.appendChild(tableBody);
    
        container.appendChild(table);
    
        // Initialize the vital sign element
        createTickMarks();
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