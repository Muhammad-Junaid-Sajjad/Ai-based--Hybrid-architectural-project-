/**
 * Main Application Controller
 * Manages UI interactions and coordinates simulators
 */

// Global state
let currentArchitecture = 'risc';
let currentProcessor = null;
let isRunning = false;
let animationHandle = null;
let clockSpeed = 500; // milliseconds per cycle

// Initialize processors
const riscProcessor = new RISCProcessor();
const ciscProcessor = new CISCProcessor();
const hybridProcessor = new HybridProcessor();
const perfMonitor = new PerformanceMonitor();

// Canvas reference
const canvas = document.getElementById('cpuCanvas');

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    switchArchitecture('risc');
    updateUI();
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
    });

    // Control buttons
    document.getElementById('btnRun').addEventListener('click', runSimulation);
    document.getElementById('btnPause').addEventListener('click', pauseSimulation);
    document.getElementById('btnStep').addEventListener('click', stepSimulation);
    document.getElementById('btnReset').addEventListener('click', resetSimulation);

    // Clock speed slider
    const speedSlider = document.getElementById('clockSpeed');
    speedSlider.addEventListener('input', (e) => {
        clockSpeed = parseInt(e.target.value);
        document.getElementById('clockSpeedValue').textContent = `${clockSpeed} ms/cycle`;
    });

    // Load memory values button
    document.getElementById('btnLoadMem').addEventListener('click', loadCustomMemory);
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

    // Hide comparison section
    document.getElementById('comparisonSection').classList.add('hidden');

    // Show canvas
    canvas.style.display = 'block';

    // Update display
    updateUI();
    draw();
}

function showComparison() {
    canvas.style.display = 'none';
    document.getElementById('comparisonSection').classList.remove('hidden');
    perfMonitor.updateComparisonTable();
}

function runSimulation() {
    if (isRunning) return;

    isRunning = true;
    document.getElementById('btnRun').disabled = true;
    document.getElementById('btnPause').disabled = false;
    document.getElementById('btnStep').disabled = true;
    document.getElementById('statusText').textContent = 'Status: Running...';

    animate();
}

function animate() {
    if (!isRunning) return;

    const continuing = currentProcessor.step();
    updateUI();
    draw();

    if (continuing) {
        animationHandle = setTimeout(animate, clockSpeed);
    } else {
        // Execution completed
        isRunning = false;
        document.getElementById('btnRun').disabled = false;
        document.getElementById('btnPause').disabled = true;
        document.getElementById('btnStep').disabled = false;
        document.getElementById('statusText').textContent = 'Status: Completed';

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

    document.getElementById('btnRun').disabled = false;
    document.getElementById('btnPause').disabled = true;
    document.getElementById('btnStep').disabled = false;
    document.getElementById('statusText').textContent = 'Status: Paused';
}

function stepSimulation() {
    const continuing = currentProcessor.step();
    updateUI();
    draw();

    if (!continuing) {
        document.getElementById('statusText').textContent = 'Status: Completed';
        document.getElementById('btnStep').disabled = true;
        recordResults();
        showCompletionMessage();
    }
}

function resetSimulation() {
    // Stop running simulation
    if (isRunning) {
        pauseSimulation();
    }

    // Reset current processor
    currentProcessor.reset();

    // Reset UI
    document.getElementById('btnRun').disabled = false;
    document.getElementById('btnPause').disabled = true;
    document.getElementById('btnStep').disabled = false;
    document.getElementById('statusText').textContent = 'Status: Ready';

    updateUI();
    draw();
}

function loadCustomMemory() {
    const m0 = parseInt(document.getElementById('mem0Edit').value) || 0;
    const m1 = parseInt(document.getElementById('mem1Edit').value) || 0;
    const m2 = parseInt(document.getElementById('mem2Edit').value) || 0;
    const m3 = parseInt(document.getElementById('mem3Edit').value) || 0;

    // Load into all processors
    riscProcessor.loadCustomMemory(m0, m1, m2, m3);
    ciscProcessor.loadCustomMemory(m0, m1, m2, m3);
    hybridProcessor.loadCustomMemory(m0, m1, m2, m3);

    // Reset current processor to reflect changes
    updateUI();
    draw();

    alert(`Memory loaded: M[0]=${m0}, M[1]=${m1}, M[2]=${m2}, M[3]=${m3}\nClick Reset, then Run to execute with new values.`);
}

function updateUI() {
    const metrics = currentProcessor.getMetrics();

    // Update metrics display
    document.getElementById('instrCount').textContent = metrics.instructions;
    document.getElementById('cycleCount').textContent = metrics.cycles;
    document.getElementById('cpiValue').textContent = metrics.cpi.toFixed(2);
    document.getElementById('resultValue').textContent = metrics.result;

    // Correctness check
    const correctnessEl = document.getElementById('correctness');
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

    // Update registers (if RISC or Hybrid)
    if (currentArchitecture === 'risc' || currentArchitecture === 'hybrid') {
        for (let i = 0; i < 8; i++) {
            const value = currentProcessor.registers[i];
            document.getElementById(`reg${i}Hex`).textContent = `0x${value.toString(16).toUpperCase().padStart(4, '0')}`;
            document.getElementById(`reg${i}Dec`).textContent = value;
        }
    } else {
        // Clear registers for CISC
        for (let i = 0; i < 8; i++) {
            document.getElementById(`reg${i}Hex`).textContent = '-';
            document.getElementById(`reg${i}Dec`).textContent = '-';
        }
    }

    // Update memory display
    document.getElementById('mem0').textContent = currentProcessor.memory[0x80];
    document.getElementById('mem1').textContent = currentProcessor.memory[0x81];
    document.getElementById('mem2').textContent = currentProcessor.memory[0x82];
    document.getElementById('mem3').textContent = currentProcessor.memory[0x83];
    document.getElementById('mem4').textContent = currentProcessor.memory[0x84];

    // Highlight result if execution complete
    if (currentProcessor.halted && metrics.result === 50) {
        document.getElementById('mem4').classList.add('highlight');
        document.getElementById('resultValue').classList.add('highlight');
    }
}

function draw() {
    currentProcessor.draw(canvas);
}

function recordResults() {
    const metrics = currentProcessor.getMetrics();
    perfMonitor.recordResult(currentArchitecture, metrics);
}

function showCompletionMessage() {
    const metrics = currentProcessor.getMetrics();

    let message = `Execution Complete!\n\n`;
    message += `Architecture: ${currentArchitecture.toUpperCase()}\n`;
    message += `Instructions: ${metrics.instructions}\n`;
    message += `Cycles: ${metrics.cycles}\n`;
    message += `CPI: ${metrics.cpi.toFixed(2)}\n`;
    message += `Result: M[4] = ${metrics.result}\n`;
    message += `Correctness: ${metrics.correct ? '✓ Correct' : '✗ Incorrect'}\n\n`;

    if (currentArchitecture === 'hybrid') {
        message += `🏆 Hybrid Architecture demonstrates:\n`;
        message += `- CISC-style programming interface\n`;
        message += `- RISC execution efficiency\n`;
        message += `- Best performance (lowest cycles)\n\n`;
        message += `Compare all three architectures to see the winner!`;
    } else {
        message += `Try running the other architectures and compare results!`;
    }

    console.log(message);

    // Show subtle notification (optional - could implement toast notification)
    document.getElementById('statusText').textContent = `Status: Completed - ${metrics.result === 50 ? '✓ Correct' : '✗ Check Result'}`;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        if (!isRunning && currentProcessor && !currentProcessor.halted) {
            runSimulation();
        }
    } else if (e.key === 'p' || e.key === 'P') {
        if (isRunning) {
            pauseSimulation();
        }
    } else if (e.key === 's' || e.key === 'S') {
        if (!isRunning && currentProcessor && !currentProcessor.halted) {
            stepSimulation();
        }
    } else if (e.key === 'Escape') {
        resetSimulation();
    }
});

// Export performance data (optional feature)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        perfMonitor.downloadCSV();
    }
});

console.log('Hybrid CPU Architecture Simulator loaded!');
console.log('Keyboard shortcuts: R=Run, P=Pause, S=Step, Esc=Reset, Ctrl+E=Export CSV');
