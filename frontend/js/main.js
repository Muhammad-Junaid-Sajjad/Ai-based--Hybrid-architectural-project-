/**
 * Main Application Controller - Hybrid CPU Architecture Simulator
 * Controls UI interactions and coordinates all three simulators
 */

// Global state
let currentArchitecture = 'risc';
let currentProcessor = null;
let isRunning = false;
let animationHandle = null;
let clockSpeed = 400; // milliseconds per cycle

// Initialize all three processors
let riscProcessor = null;
let ciscProcessor = null;
let hybridProcessor = null;
const perfMonitor = new PerformanceMonitor();

// Canvas reference
const canvas = document.getElementById('cpuCanvas');

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Hybrid CPU Architecture Simulator...');

    // Initialize processors
    try {
        if (typeof RISCProcessorEnhanced !== 'undefined') {
            riscProcessor = new RISCProcessorEnhanced();
            console.log('✅ RISC Processor initialized');
        } else if (typeof RISCProcessor !== 'undefined') {
            riscProcessor = new RISCProcessor();
            console.log('✅ RISC Processor initialized (basic)');
        }

        if (typeof CISCProcessor !== 'undefined') {
            ciscProcessor = new CISCProcessor();
            console.log('✅ CISC Processor initialized');
        }

        if (typeof HybridProcessorEnhanced !== 'undefined') {
            hybridProcessor = new HybridProcessorEnhanced();
            console.log('✅ Hybrid Processor initialized (optimized)');
        } else if (typeof HybridProcessor !== 'undefined') {
            hybridProcessor = new HybridProcessor();
            console.log('✅ Hybrid Processor initialized');
        }
    } catch (error) {
        console.error('❌ Error initializing processors:', error);
    }

    setupEventListeners();
    switchArchitecture('risc');
    updateUI();

    console.log('✅ Application ready!');
    console.log('💡 Use keyboard shortcuts: R=Run, P=Pause, S=Step, Esc=Reset');
});

function setupEventListeners() {
    // Architecture selector buttons
    const archButtons = document.querySelectorAll('.arch-btn');
    archButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const arch = btn.getAttribute('data-arch');
            if (arch === 'comparison') {
                showComparison();
            } else {
                switchArchitecture(arch);
            }

            // Update active button
            archButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });

        // Add hover tooltip
        btn.title = `Click to simulate ${btn.textContent.trim()}`;
    });

    // Control buttons
    const btnRun = document.getElementById('btnRun');
    const btnPause = document.getElementById('btnPause');
    const btnStep = document.getElementById('btnStep');
    const btnReset = document.getElementById('btnReset');

    if (btnRun) {
        btnRun.addEventListener('click', runSimulation);
        btnRun.title = 'Run simulation to completion (or press R)';
    }
    if (btnPause) {
        btnPause.addEventListener('click', pauseSimulation);
        btnPause.title = 'Pause simulation (or press P)';
    }
    if (btnStep) {
        btnStep.addEventListener('click', stepSimulation);
        btnStep.title = 'Execute one clock cycle (or press S)';
    }
    if (btnReset) {
        btnReset.addEventListener('click', resetSimulation);
        btnReset.title = 'Reset to initial state (or press Esc)';
    }

    // Clock speed slider
    const speedSlider = document.getElementById('clockSpeed');
    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
            clockSpeed = parseInt(e.target.value);
            const speedValue = document.getElementById('clockSpeedValue');
            if (speedValue) {
                speedValue.textContent = `${clockSpeed} ms/cycle`;
            }
        });
        speedSlider.title = 'Adjust simulation speed';
    }

    // Load memory values button
    const btnLoadMem = document.getElementById('btnLoadMem');
    if (btnLoadMem) {
        btnLoadMem.addEventListener('click', loadCustomMemory);
        btnLoadMem.title = 'Load custom memory values';
    }

    // Add hover effects to metrics
    addHoverTooltips();
}

function addHoverTooltips() {
    // Add tooltips to metric cells
    const tooltips = {
        'instrCount': 'Total number of instructions executed',
        'cycleCount': 'Total clock cycles consumed',
        'cpiValue': 'Cycles Per Instruction (lower is better)',
        'cacheHits': 'Number of cache hits (faster)',
        'cacheMisses': 'Number of cache misses (slower)',
        'resultValue': 'Final computation result stored in M[4]',
        'correctness': 'Whether result matches expected value (50)'
    };

    Object.keys(tooltips).forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.title = tooltips[id];
            elem.style.cursor = 'help';
        }
    });
}

function switchArchitecture(arch) {
    currentArchitecture = arch;

    // Stop any running simulation
    if (isRunning) {
        pauseSimulation();
    }

    // Set current processor
    switch (arch) {
        case 'risc':
            currentProcessor = riscProcessor;
            break;
        case 'cisc':
            currentProcessor = ciscProcessor;
            break;
        case 'hybrid':
            currentProcessor = hybridProcessor;
            break;
    }

    if (!currentProcessor) {
        console.error(`❌ ${arch.toUpperCase()} processor not initialized`);
        document.getElementById('statusText').textContent = `Error: ${arch.toUpperCase()} processor not available`;
        return;
    }

    // Hide comparison section
    const compSection = document.getElementById('comparisonSection');
    if (compSection) {
        compSection.classList.add('hidden');
    }

    // Show canvas
    if (canvas) {
        canvas.style.display = 'block';
    }

    // Update display
    updateUI();
    draw();

    console.log(`✅ Switched to ${arch.toUpperCase()} architecture`);
}

function showComparison() {
    if (canvas) {
        canvas.style.display = 'none';
    }

    const compSection = document.getElementById('comparisonSection');
    if (compSection) {
        compSection.classList.remove('hidden');
    }

    perfMonitor.updateComparisonTable();
    console.log('📊 Showing performance comparison');
}

function runSimulation() {
    if (isRunning || !currentProcessor) return;

    isRunning = true;
    const btnRun = document.getElementById('btnRun');
    const btnPause = document.getElementById('btnPause');
    const btnStep = document.getElementById('btnStep');

    if (btnRun) btnRun.disabled = true;
    if (btnPause) btnPause.disabled = false;
    if (btnStep) btnStep.disabled = true;

    document.getElementById('statusText').textContent = 'Status: Running...';
    console.log(`▶️ Running ${currentArchitecture.toUpperCase()} simulation...`);

    animate();
}

function animate() {
    if (!isRunning || !currentProcessor) return;

    const continuing = currentProcessor.step();
    updateUI();
    draw();

    if (continuing) {
        animationHandle = setTimeout(animate, clockSpeed);
    } else {
        // Execution completed
        isRunning = false;
        const btnRun = document.getElementById('btnRun');
        const btnPause = document.getElementById('btnPause');
        const btnStep = document.getElementById('btnStep');

        if (btnRun) btnRun.disabled = false;
        if (btnPause) btnPause.disabled = true;
        if (btnStep) btnStep.disabled = false;

        document.getElementById('statusText').textContent = 'Status: Completed ✓';

        // Record results
        recordResults();

        // Show completion message
        showCompletionMessage();
    }
}

function pauseSimulation() {
    isRunning = false;
    if (animationHandle) {
        clearTimeout(animationHandle);
        animationHandle = null;
    }

    const btnRun = document.getElementById('btnRun');
    const btnPause = document.getElementById('btnPause');
    const btnStep = document.getElementById('btnStep');

    if (btnRun) btnRun.disabled = false;
    if (btnPause) btnPause.disabled = true;
    if (btnStep) btnStep.disabled = false;

    document.getElementById('statusText').textContent = 'Status: Paused';
    console.log('⏸️ Simulation paused');
}

function stepSimulation() {
    if (!currentProcessor) return;

    const continuing = currentProcessor.step();
    updateUI();
    draw();

    if (!continuing) {
        const btnStep = document.getElementById('btnStep');
        if (btnStep) btnStep.disabled = true;
        document.getElementById('statusText').textContent = 'Status: Completed ✓';
        recordResults();
        showCompletionMessage();
    }

    console.log(`⏭️ Step: Cycle ${currentProcessor.cycleCount}`);
}

function resetSimulation() {
    // Stop running simulation
    if (isRunning) {
        pauseSimulation();
    }

    if (!currentProcessor) return;

    // Reset current processor
    currentProcessor.reset();

    // Reset UI
    const btnRun = document.getElementById('btnRun');
    const btnPause = document.getElementById('btnPause');
    const btnStep = document.getElementById('btnStep');

    if (btnRun) btnRun.disabled = false;
    if (btnPause) btnPause.disabled = true;
    if (btnStep) btnStep.disabled = false;

    document.getElementById('statusText').textContent = 'Status: Ready';

    updateUI();
    draw();

    console.log('🔄 Simulation reset');
}

function loadCustomMemory() {
    const m0 = parseInt(document.getElementById('mem0Edit')?.value) || 0;
    const m1 = parseInt(document.getElementById('mem1Edit')?.value) || 0;
    const m2 = parseInt(document.getElementById('mem2Edit')?.value) || 0;
    const m3 = parseInt(document.getElementById('mem3Edit')?.value) || 0;

    // Load into all processors
    if (riscProcessor) riscProcessor.loadCustomMemory(m0, m1, m2, m3);
    if (ciscProcessor) ciscProcessor.loadCustomMemory(m0, m1, m2, m3);
    if (hybridProcessor) hybridProcessor.loadCustomMemory(m0, m1, m2, m3);

    // Reset current processor to reflect changes
    if (currentProcessor) {
        currentProcessor.loadCustomMemory(m0, m1, m2, m3);
    }

    updateUI();
    draw();

    const expectedResult = m0 + m1 + m2 + m3;
    alert(`✅ Memory loaded!\n\nM[0] = ${m0}\nM[1] = ${m1}\nM[2] = ${m2}\nM[3] = ${m3}\n\nExpected result: M[4] = ${expectedResult}\n\nClick Reset, then Run to execute.`);

    console.log(`💾 Custom memory loaded: [${m0}, ${m1}, ${m2}, ${m3}] → Expected: ${expectedResult}`);
}

function updateUI() {
    if (!currentProcessor) return;

    const metrics = currentProcessor.getMetrics();

    // Update metrics display
    const elems = {
        instrCount: metrics.instructions,
        cycleCount: metrics.cycles,
        cpiValue: metrics.cpi.toFixed(2),
        cacheHits: metrics.cacheHits || 0,
        cacheMisses: metrics.cacheMisses || 0,
        resultValue: metrics.result
    };

    Object.keys(elems).forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.textContent = elems[id];
    });

    // Correctness check
    const correctnessEl = document.getElementById('correctness');
    if (correctnessEl) {
        if (metrics.result === 50) {
            correctnessEl.textContent = '✓ Correct';
            correctnessEl.style.color = '#28a745';
            correctnessEl.style.fontWeight = 'bold';
        } else if (metrics.result === 0 && metrics.cycles === 0) {
            correctnessEl.textContent = '-';
            correctnessEl.style.color = '#333';
        } else {
            correctnessEl.textContent = '✗ Incorrect';
            correctnessEl.style.color = '#dc3545';
            correctnessEl.style.fontWeight = 'bold';
        }
    }

    // Update registers (if RISC or Hybrid)
    if (currentArchitecture === 'risc' || currentArchitecture === 'hybrid') {
        for (let i = 0; i < 8; i++) {
            const value = currentProcessor.registers[i];
            const hexElem = document.getElementById(`reg${i}Hex`);
            const decElem = document.getElementById(`reg${i}Dec`);
            if (hexElem) hexElem.textContent = `0x${value.toString(16).toUpperCase().padStart(4, '0')}`;
            if (decElem) decElem.textContent = value;
        }
    } else {
        // Clear registers for CISC
        for (let i = 0; i < 8; i++) {
            const hexElem = document.getElementById(`reg${i}Hex`);
            const decElem = document.getElementById(`reg${i}Dec`);
            if (hexElem) hexElem.textContent = '-';
            if (decElem) decElem.textContent = '-';
        }
    }

    // Update memory display
    const memElems = ['mem0', 'mem1', 'mem2', 'mem3', 'mem4'];
    const memAddrs = [0x80, 0x81, 0x82, 0x83, 0x84];
    memElems.forEach((id, idx) => {
        const elem = document.getElementById(id);
        if (elem) elem.textContent = currentProcessor.memory[memAddrs[idx]];
    });

    // Update pipeline stage if available
    const pipelineEl = document.getElementById('pipelineStage');
    if (pipelineEl && currentProcessor.currentPipelineStage) {
        pipelineEl.textContent = `Stage: ${currentProcessor.currentPipelineStage}`;
    }

    // Highlight result if execution complete
    if (currentProcessor.halted && metrics.result === 50) {
        const mem4Elem = document.getElementById('mem4');
        const resultElem = document.getElementById('resultValue');
        if (mem4Elem) mem4Elem.classList.add('highlight');
        if (resultElem) resultElem.classList.add('highlight');
    }
}

function draw() {
    if (!currentProcessor || !canvas) return;

    try {
        currentProcessor.draw(canvas);
    } catch (error) {
        console.error('❌ Draw error:', error);
    }
}

function recordResults() {
    if (!currentProcessor) return;

    const metrics = currentProcessor.getMetrics();
    perfMonitor.recordResult(currentArchitecture, metrics);

    console.log(`📊 ${currentArchitecture.toUpperCase()} Results:`, metrics);
}

function showCompletionMessage() {
    if (!currentProcessor) return;

    const metrics = currentProcessor.getMetrics();

    let message = `✅ Execution Complete!\n\n`;
    message += `Architecture: ${currentArchitecture.toUpperCase()}\n`;
    message += `Instructions: ${metrics.instructions}\n`;
    message += `Cycles: ${metrics.cycles}\n`;
    message += `CPI: ${metrics.cpi.toFixed(2)}\n`;
    message += `Result: M[4] = ${metrics.result}\n`;
    message += `Correctness: ${metrics.correct ? '✓ Correct' : '✗ Incorrect'}\n\n`;

    if (currentArchitecture === 'hybrid') {
        message += `🏆 Hybrid Architecture demonstrates:\n`;
        message += `- CISC-style programming (1 instruction)\n`;
        message += `- RISC execution efficiency\n`;
        message += `- Lowest cycle count = BEST PERFORMANCE!\n\n`;
        message += `Try other architectures to compare!`;
    } else {
        message += `Try running the other architectures to compare performance!`;
    }

    console.log(message);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ignore if typing in input field
    if (e.target.tagName === 'INPUT') return;

    switch(e.key.toLowerCase()) {
        case 'r':
            if (!isRunning && currentProcessor && !currentProcessor.halted) {
                runSimulation();
            }
            break;
        case 'p':
            if (isRunning) {
                pauseSimulation();
            }
            break;
        case 's':
            if (!isRunning && currentProcessor && !currentProcessor.halted) {
                stepSimulation();
            }
            break;
        case 'escape':
            resetSimulation();
            break;
    }
});

// Export performance data
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        perfMonitor.downloadCSV();
        console.log('💾 Performance data exported');
    }
});

// Initialize Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.results = {
            risc: null,
            cisc: null,
            hybrid: null
        };
    }

    recordResult(architecture, metrics) {
        this.results[architecture] = {
            instructions: metrics.instructions,
            cycles: metrics.cycles,
            cpi: metrics.cpi.toFixed(2),
            cacheHits: metrics.cacheHits || 0,
            result: metrics.result,
            correct: metrics.correct
        };
    }

    getWinner() {
        const architectures = ['risc', 'cisc', 'hybrid'];
        let minCycles = Infinity;
        let winner = null;

        for (const arch of architectures) {
            if (this.results[arch] && this.results[arch].correct) {
                if (this.results[arch].cycles < minCycles) {
                    minCycles = this.results[arch].cycles;
                    winner = arch;
                }
            }
        }

        return winner;
    }

    updateComparisonTable() {
        const winner = this.getWinner();

        // Update RISC row
        if (this.results.risc) {
            this.updateRow('risc', this.results.risc, winner === 'risc');
        }

        // Update CISC row
        if (this.results.cisc) {
            this.updateRow('cisc', this.results.cisc, winner === 'cisc');
        }

        // Update Hybrid row
        if (this.results.hybrid) {
            this.updateRow('hybrid', this.results.hybrid, winner === 'hybrid');
        }

        // Show winner announcement if all complete and hybrid wins
        if (this.results.risc && this.results.cisc && this.results.hybrid) {
            const announcement = document.getElementById('winnerAnnouncement');
            const victoryMargin = document.getElementById('victoryMargin');

            if (announcement && winner === 'hybrid') {
                announcement.classList.remove('hidden');

                if (victoryMargin) {
                    const hybridCycles = this.results.hybrid.cycles;
                    const riscCycles = this.results.risc.cycles;
                    const ciscCycles = this.results.cisc.cycles;
                    const improvement = ((riscCycles - hybridCycles) / riscCycles * 100).toFixed(1);

                    victoryMargin.innerHTML = `
                        <strong>Performance Improvement:</strong><br>
                        Hybrid (${hybridCycles} cycles) is ${improvement}% faster than RISC (${riscCycles} cycles)<br>
                        and ${((ciscCycles - hybridCycles) / ciscCycles * 100).toFixed(1)}% faster than CISC (${ciscCycles} cycles)!
                    `;
                }
            }
        }
    }

    updateRow(arch, data, isWinner) {
        const cells = ['Instr', 'Cycles', 'CPI', 'Hits', 'Correct', 'Winner'];
        cells.forEach(cell => {
            const elem = document.getElementById(`${arch}${cell}`);
            if (!elem) return;

            switch(cell) {
                case 'Instr':
                    elem.textContent = data.instructions;
                    break;
                case 'Cycles':
                    elem.textContent = data.cycles;
                    break;
                case 'CPI':
                    elem.textContent = data.cpi;
                    break;
                case 'Hits':
                    elem.textContent = data.cacheHits;
                    break;
                case 'Correct':
                    elem.textContent = data.correct ? '✓ Yes' : '✗ No';
                    elem.style.color = data.correct ? '#28a745' : '#dc3545';
                    break;
                case 'Winner':
                    elem.textContent = isWinner ? '🏆 YES' : 'No';
                    elem.style.fontWeight = isWinner ? 'bold' : 'normal';
                    elem.style.color = isWinner ? '#d63031' : '#333';
                    break;
            }
        });

        // Highlight winner row
        const row = document.getElementById(`${arch}Row`);
        if (row && isWinner) {
            row.style.background = arch === 'hybrid' ? '#ffffcc' : '#90EE90';
        }
    }

    downloadCSV() {
        let csv = 'Architecture,Instructions,Cycles,CPI,Cache Hits,Result,Correct,Winner\n';

        const winner = this.getWinner();

        ['risc', 'cisc', 'hybrid'].forEach(arch => {
            if (this.results[arch]) {
                const r = this.results[arch];
                csv += `${arch.toUpperCase()},${r.instructions},${r.cycles},${r.cpi},${r.cacheHits},${r.result},${r.correct ? 'Yes' : 'No'},${winner === arch ? 'Yes' : 'No'}\n`;
            }
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cpu-architecture-comparison.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

console.log('✅ Main controller loaded successfully');
console.log('📚 Keyboard shortcuts: R=Run, P=Pause, S=Step, Esc=Reset, Ctrl+E=Export CSV');
