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
            min: 21,
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
    
        function enforceBoundaries(index) {
            const threshold = thresholds[index];
        
            // Ensure thresholds stay within min and max
            threshold.value = Math.max(min, Math.min(threshold.value, max));
        
            // Ensure thresholds do not overlap, allowing zero-width ranges except for "No concern"
            if (index > 0 && levels[thresholds[index - 1].levelIndex].label !== 'No concern') {
                threshold.value = Math.max(thresholds[index - 1].value, threshold.value);
            }
            if (index < thresholds.length - 1 && levels[thresholds[index + 1].levelIndex].label !== 'No concern') {
                threshold.value = Math.min(thresholds[index + 1].value, threshold.value);
            }
        
            // Set minimum length based on the vital sign (0.1 for Temperature, 1 for others)
            const minNoConcernLength = (vitalSign.name === "Temperature") ? 0.1 : 1;
        
            // Enforce minimum length for "No concern" when adjusting the boundary from the left (prevent reducing its width)
            // Allow zero-width for Inspired Oxygen "No concern" only
            if (
                index > 0 &&
                levels[thresholds[index - 1].levelIndex].label === 'No concern' &&
                !vitalSign.name.startsWith("Inspired Oxygen")
            ) {
                if (threshold.value < thresholds[index - 1].value + minNoConcernLength) {
                    threshold.value = thresholds[index - 1].value + minNoConcernLength;
                }
            }
        
            // Enforce minimum length for "No concern" when adjusting the boundary from the right (prevent reducing its width)
            // Allow zero-width for Inspired Oxygen "No concern" only
            if (
                index < thresholds.length - 1 &&
                levels[thresholds[index].levelIndex].label === 'No concern' &&
                !vitalSign.name.startsWith("Inspired Oxygen")
            ) {
                if (threshold.value + minNoConcernLength > thresholds[index + 1].value) {
                    threshold.value = thresholds[index + 1].value - minNoConcernLength;
                }
            }
        
            // Specifically allow "Low - mild concern" to collapse to zero-width, in both directions
            if (levels[threshold.levelIndex].label === 'Low - mild concern') {
                if (index > 0 && threshold.value <= thresholds[index - 1].value) {
                    threshold.value = thresholds[index - 1].value;
                }
                if (index < thresholds.length - 1 && threshold.value >= thresholds[index + 1].value) {
                    threshold.value = thresholds[index + 1].value;
                }
            }
        }
        
    
        function updatePositions() {
            // Update thumbs and labels
            thresholds.forEach((threshold, index) => {
                if (index > 0 && index < thresholds.length - 1) {
                    const thumb = thumbs[index - 1];
                    const percent = ((threshold.value - min) / (max - min)) * 100;
    
                    // Always show thumb
                    thumb.style.display = 'block';
                    thumb.style.left = `${percent}%`;
                    thumb.style.transform = 'translateX(-50%)';
    
                    // Adjust appearance if section is hidden
                    thumb.style.opacity = '1';
                }
            });
    
            // Update ranges
            const visibleRanges = [];
            let lastVisibleValue = min;
    
            for (let i = 1; i < thresholds.length; i++) {
                if (thresholds[i].value !== lastVisibleValue || levels[thresholds[i - 1].levelIndex].label === 'No concern') {
                    visibleRanges.push({
                        start: lastVisibleValue,
                        end: thresholds[i].value,
                        levelIndex: Math.max(0, Math.min(levels.length - 1, thresholds[i - 1].levelIndex))
                    });
                }
                lastVisibleValue = thresholds[i].value;
            }
    
            ranges.forEach(range => range.remove());
            ranges.length = 0;
    
            visibleRanges.forEach((rangeData) => {
                if (rangeData.start !== rangeData.end || levels[rangeData.levelIndex].label === 'No concern') {
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
    
            visibleRanges.forEach((range, index) => {
                if (range.start !== range.end || levels[range.levelIndex].label === 'No concern') {
                    const row = document.createElement('tr');
                    const levelCell = document.createElement('td');
                    levelCell.textContent = levels[range.levelIndex].label;
    
                    const lowerCell = document.createElement('td');
                    lowerCell.textContent = formatValue(
                        index === 0 ? range.start : range.start + (vitalSign.name === "Temperature" ? 0.1 : 1),
                        vitalSign
                    );
    
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
                        return { thumbClass: 'thumb-severe' };
                    case 2:
                        return { thumbClass: 'thumb-moderate' };
                    case 3:
                        return { thumbClass: 'thumb-mild' };
                    default:
                        return { thumbClass: '' };
                }
            } else if (vitalSign.name.startsWith("Inspired Oxygen")) {
                switch (index) {
                    case 1:
                        return { thumbClass: 'thumb-mild' };
                    case 2:
                        return { thumbClass: 'thumb-moderate' };
                    case 3:
                        return { thumbClass: 'thumb-severe' };
                    default:
                        return { thumbClass: '' };
                }
            }
            else {
                switch (index) {
                    case 1:
                        return { thumbClass: 'thumb-severe' };
                    case 2:
                        return { thumbClass: 'thumb-moderate' };
                    case 3:
                        return { thumbClass: 'thumb-mild' };
                    case 4:
                        return { thumbClass: 'thumb-mild' };
                    case 5:
                        return { thumbClass: 'thumb-moderate' };
                    case 6:
                        return { thumbClass: 'thumb-severe' };
                    default:
                        return { thumbClass: '' };
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
    
        function initializeThresholds() {
            thresholds = [{ value: min, levelIndex: 0 }];
    
            const initialPositions = getRandomPositions(numArrows, min, max, vitalSign.step);
    
            initialPositions.forEach((val, idx) => {
                thresholds.push({ value: val, levelIndex: idx + 1 });
            });
    
            thresholds.push({ value: max, levelIndex: levels.length - 1 });
        }
    
        function getRandomPositions(numArrows, min, max, step) {
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
    
        vitalSign.getValues = function() {
            return thresholds.slice(1, -1)
                .filter((t, index) => {
                    const prevValue = thresholds[index].value;
                    const nextValue = thresholds[index + 2].value;
                    return (
                        t.value !== prevValue &&
                        t.value !== nextValue
                    );
                })
                .map(t => formatValue(t.value, vitalSign));
        };
    
        vitalSign.thresholds = thresholds;
    
        function loadSavedData() {
            const savedData = JSON.parse(sessionStorage.getItem('part1Data'));
            if (savedData && savedData.thresholds) {
                const vitalSignData = savedData.thresholds.find(v => v['Vital Sign'] === vitalSign.name);
                if (vitalSignData && vitalSignData.Values) {
                    const savedValues = vitalSignData.Values.split(';').map(v => parseFloat(v));
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
    
        function createTickMarks() {
    const tickContainer = document.createElement('div');
    tickContainer.className = 'tick-container';
    tickContainer.style.position = 'relative';
    tickContainer.style.height = '20px';
    scaleContainer.appendChild(tickContainer);

    // Determine starting tick based on the nearest multiple of 5 above the minimum value
    const startingTick = vitalSign.name === "Inspired Oxygen (%)" || vitalSign.name === "Respiratory Rate"
        ? Math.ceil(min / 5) * 5
        : min;

    // Calculate the number of major ticks starting from the starting tick
    const numTicks = Math.floor((max - startingTick) / vitalSign.majorTick) + 1;

    for (let i = 0; i < numTicks; i++) {
        const value = startingTick + i * vitalSign.majorTick;

        // Only add ticks within the range
        if (value <= max) {
            const tick = document.createElement('div');
            tick.className = 'tick';
            tick.style.position = 'absolute';
            tick.style.height = '10px';
            tick.style.width = '1px';
            tick.style.backgroundColor = '#999';

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
    }

    // Add minor ticks (if needed) without interfering with major tick positioning
    const minorTickInterval = vitalSign.majorTick / 5;
    const numMinorTicks = Math.floor((max - min) / minorTickInterval);

    for (let i = 0; i < numMinorTicks; i++) {
        const minorTickValue = min + i * minorTickInterval;
        const percent = ((minorTickValue - min) / (max - min)) * 100;

        // Skip minor ticks that align with major ticks
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
    
        function createThumbs() {
            thumbs.forEach(thumb => thumb.remove());
            thumbs.length = 0;
    
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
    
                document.addEventListener('mouseup', () => {
                    isDragging = false;
                });
            }
    
            updatePositions();
        }
    
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
            collectData();
            alert('Your responses have been saved. Please proceed to Part 2.');
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
    
        sessionStorage.setItem('part1Data', JSON.stringify(data));
    
        console.log('Data collected and saved to sessionStorage:', data);
    
        return data;
    }
});