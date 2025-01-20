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
            submitButton.disabled = !checkAllComplete();
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
        
            if (vitalSign.name === "Supplementary oxygen" || vitalSign.name === "Inspired oxygen concentration") {
                if (index > 0) {
                    threshold.value = Math.max(thresholds[index - 1].value, threshold.value);
                }
                if (index < thresholds.length - 1) {
                    threshold.value = Math.min(thresholds[index + 1].value, threshold.value);
                }
                return;
            }
        
            let minNoConcernLength = vitalSign.name === "Temperature" ? 0.1 : 1;

            if (index > 0) {
                if (levels[thresholds[index - 1].levelIndex].label === 'No concern') {
                    threshold.value = Math.max(thresholds[index - 1].value + minNoConcernLength, threshold.value);
                } else {
                    threshold.value = Math.max(thresholds[index - 1].value, threshold.value);
                }
            }

            if (index < thresholds.length - 1) {
                if (levels[thresholds[index].levelIndex].label === 'No concern') {
                    threshold.value = Math.min(thresholds[index + 1].value - minNoConcernLength, threshold.value);
                } else {
                    threshold.value = Math.min(thresholds[index + 1].value, threshold.value);
                }
            }
        }

        function updatePositions() {
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

                const range = document.createElement('div');
                range.className = 'range';
                range.style.position = 'absolute';
                range.style.height = '20px';
                range.style.backgroundColor = levels[thresholds[i-1].levelIndex].color;
                range.style.width = `${width}%`;
                range.style.left = `${startPercent}%`;

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
            
            for (let i = 1; i < thresholds.length; i++) {
                const row = document.createElement('tr');
                
                const levelCell = document.createElement('td');
                levelCell.textContent = levels[thresholds[i-1].levelIndex].label;
                
                const lowerCell = document.createElement('td');
                const lowerValue = i === 1 ? thresholds[i-1].value : 
                    thresholds[i-1].value + vitalSign.step;
                lowerCell.textContent = formatValue(lowerValue, vitalSign);
                
                const upperCell = document.createElement('td');
                upperCell.textContent = formatValue(thresholds[i].value, vitalSign);
                
                row.appendChild(levelCell);
                row.appendChild(lowerCell);
                row.appendChild(upperCell);
                tableBody.appendChild(row);
            }
        }

        vitalSign.getValues = function() {
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