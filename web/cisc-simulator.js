/**
 * CISC Processor Simulator
 * Complex instructions with multi-cycle execution
 * Target: Fewer instructions, but more cycles per instruction
 */

class CISCProcessor {
    constructor() {
        this.reset();
    }

    reset() {
        // Program Counter
        this.pc = 0;

        // Instruction Register
        this.ir = 0;

        // Temporary Registers (for intermediate calculations)
        this.tempRegs = new Array(4).fill(0);

        // Memory (256 words, 16-bit each)
        this.memory = new Array(256).fill(0);

        // Performance counters
        this.instructionCount = 0;
        this.cycleCount = 0;

        // FSM State
        this.fsmState = 'IDLE';
        this.microOpStep = 0;
        this.currentAddresses = [];

        // Execution state
        this.halted = false;
        this.currentInstruction = '';

        // Visual state
        this.activeComponent = '';
        this.microOps = [];
        this.currentMicroOp = '';

        // Load default benchmark program
        this.loadBenchmarkProgram();
    }

    loadBenchmarkProgram() {
        // Data memory initialization
        this.memory[0x80] = 5;   // M[0] = 5
        this.memory[0x81] = 10;  // M[1] = 10
        this.memory[0x82] = 15;  // M[2] = 15
        this.memory[0x83] = 20;  // M[3] = 20
        this.memory[0x84] = 0;   // M[4] = 0 (result)

        // CISC Instruction Set:
        // Format: [opcode][addr1][addr2][addr3][addr4][dest]
        //
        // Opcodes:
        // 0x00: HALT
        // 0x10: ADD4 [addr1] [addr2] [addr3] [addr4] -> [dest]
        //       Adds four memory locations and stores result

        // Program: Single ADD4 instruction
        this.memory[0x00] = 0x1000; // ADD4 opcode
        this.memory[0x01] = 0x8081; // addr1=0x80, addr2=0x81
        this.memory[0x02] = 0x8283; // addr3=0x82, addr4=0x83
        this.memory[0x03] = 0x8400; // dest=0x84
        this.memory[0x04] = 0x0000; // HALT
    }

    loadCustomMemory(m0, m1, m2, m3) {
        this.memory[0x80] = m0;
        this.memory[0x81] = m1;
        this.memory[0x82] = m2;
        this.memory[0x83] = m3;
        this.memory[0x84] = 0;
    }

    step() {
        if (this.halted) return false;

        // Increment cycle counter every step
        this.cycleCount++;

        // FSM for ADD4 execution
        switch (this.fsmState) {
            case 'IDLE':
                this.fsmState = 'FETCH';
                this.activeComponent = 'fetch';
                this.currentMicroOp = 'Fetch instruction';
                break;

            case 'FETCH':
                this.ir = this.memory[this.pc];
                this.pc++;
                this.fsmState = 'DECODE';
                this.activeComponent = 'decode';
                this.currentMicroOp = 'Decode opcode';
                break;

            case 'DECODE':
                const opcode = (this.ir >> 8) & 0xFF;
                if (opcode === 0x00) {
                    // HALT instruction
                    this.halted = true;
                    this.currentInstruction = 'HALT';
                    this.fsmState = 'IDLE';
                    return false;
                } else if (opcode === 0x10) {
                    // ADD4 instruction
                    this.currentInstruction = 'ADD4 M[0], M[1], M[2], M[3] -> M[4]';
                    this.instructionCount++;
                    this.fsmState = 'FETCH_ADDR1';
                    this.activeComponent = 'decoder';
                    this.currentMicroOp = 'Decode ADD4';
                    this.microOpStep = 0;
                } else {
                    this.halted = true;
                    this.currentInstruction = `UNKNOWN (0x${this.ir.toString(16).toUpperCase()})`;
                    return false;
                }
                break;

            case 'FETCH_ADDR1':
                // Fetch first two addresses
                const addr12 = this.memory[this.pc];
                this.pc++;
                const addr1 = (addr12 >> 8) & 0xFF;
                const addr2 = addr12 & 0xFF;
                this.currentAddresses[0] = addr1;
                this.currentAddresses[1] = addr2;
                this.fsmState = 'LOAD1';
                this.activeComponent = 'memory';
                this.currentMicroOp = `Fetch addresses: 0x${addr1.toString(16)}, 0x${addr2.toString(16)}`;
                break;

            case 'LOAD1':
                // Load M[addr1]
                this.tempRegs[0] = this.memory[this.currentAddresses[0]];
                this.fsmState = 'LOAD2';
                this.activeComponent = 'memory';
                this.currentMicroOp = `Load M[0x${this.currentAddresses[0].toString(16)}] = ${this.tempRegs[0]} -> TEMP1`;
                break;

            case 'LOAD2':
                // Load M[addr2]
                this.tempRegs[1] = this.memory[this.currentAddresses[1]];
                this.fsmState = 'ADD12';
                this.activeComponent = 'memory';
                this.currentMicroOp = `Load M[0x${this.currentAddresses[1].toString(16)}] = ${this.tempRegs[1]} -> TEMP2`;
                break;

            case 'ADD12':
                // Add TEMP1 + TEMP2
                this.tempRegs[2] = (this.tempRegs[0] + this.tempRegs[1]) & 0xFFFF;
                this.fsmState = 'FETCH_ADDR2';
                this.activeComponent = 'alu';
                this.currentMicroOp = `ADD TEMP1(${this.tempRegs[0]}) + TEMP2(${this.tempRegs[1]}) = ${this.tempRegs[2]} -> TEMP3`;
                break;

            case 'FETCH_ADDR2':
                // Fetch next two addresses
                const addr34 = this.memory[this.pc];
                this.pc++;
                const addr3 = (addr34 >> 8) & 0xFF;
                const addr4 = addr34 & 0xFF;
                this.currentAddresses[2] = addr3;
                this.currentAddresses[3] = addr4;
                this.fsmState = 'LOAD3';
                this.activeComponent = 'memory';
                this.currentMicroOp = `Fetch addresses: 0x${addr3.toString(16)}, 0x${addr4.toString(16)}`;
                break;

            case 'LOAD3':
                // Load M[addr3]
                this.tempRegs[3] = this.memory[this.currentAddresses[2]];
                this.fsmState = 'ADD123';
                this.activeComponent = 'memory';
                this.currentMicroOp = `Load M[0x${this.currentAddresses[2].toString(16)}] = ${this.tempRegs[3]} -> TEMP4`;
                break;

            case 'ADD123':
                // Add TEMP3 + TEMP4
                this.tempRegs[2] = (this.tempRegs[2] + this.tempRegs[3]) & 0xFFFF;
                this.fsmState = 'LOAD4';
                this.activeComponent = 'alu';
                this.currentMicroOp = `ADD TEMP3(${this.tempRegs[2] - this.tempRegs[3]}) + TEMP4(${this.tempRegs[3]}) = ${this.tempRegs[2]} -> TEMP3`;
                break;

            case 'LOAD4':
                // Load M[addr4]
                this.tempRegs[3] = this.memory[this.currentAddresses[3]];
                this.fsmState = 'ADD_FINAL';
                this.activeComponent = 'memory';
                this.currentMicroOp = `Load M[0x${this.currentAddresses[3].toString(16)}] = ${this.tempRegs[3]} -> TEMP4`;
                break;

            case 'ADD_FINAL':
                // Final addition
                this.tempRegs[2] = (this.tempRegs[2] + this.tempRegs[3]) & 0xFFFF;
                this.fsmState = 'FETCH_DEST';
                this.activeComponent = 'alu';
                this.currentMicroOp = `ADD TEMP3 + TEMP4(${this.tempRegs[3]}) = ${this.tempRegs[2]} (FINAL)`;
                break;

            case 'FETCH_DEST':
                // Fetch destination address
                const destWord = this.memory[this.pc];
                this.pc++;
                this.currentAddresses[4] = (destWord >> 8) & 0xFF;
                this.fsmState = 'STORE';
                this.activeComponent = 'memory';
                this.currentMicroOp = `Fetch destination: 0x${this.currentAddresses[4].toString(16)}`;
                break;

            case 'STORE':
                // Store result
                this.memory[this.currentAddresses[4]] = this.tempRegs[2];
                this.fsmState = 'FETCH'; // Back to fetch for next instruction
                this.activeComponent = 'memory';
                this.currentMicroOp = `Store TEMP3(${this.tempRegs[2]}) -> M[0x${this.currentAddresses[4].toString(16)}]`;
                break;
        }

        return !this.halted;
    }

    run(callback) {
        let running = true;
        while (running && !this.halted) {
            running = this.step();
            if (callback) callback();
        }
    }

    getMetrics() {
        return {
            instructions: this.instructionCount,
            cycles: this.cycleCount,
            cpi: this.cycleCount / (this.instructionCount || 1),
            result: this.memory[0x84],
            correct: this.memory[0x84] === 50
        };
    }

    draw(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Title
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CISC Architecture', width / 2, 30);

        // Component positions
        const components = {
            pc: { x: 50, y: 80, width: 100, height: 60, label: 'PC' },
            ir: { x: 50, y: 170, width: 100, height: 60, label: 'IR' },
            decoder: { x: 250, y: 80, width: 180, height: 80, label: 'Complex Decoder' },
            sequencer: { x: 250, y: 180, width: 180, height: 80, label: 'Micro-op Sequencer' },
            tempRegs: { x: 550, y: 80, width: 150, height: 120, label: 'Temp Registers' },
            alu: { x: 550, y: 220, width: 150, height: 100, label: 'ALU' },
            memory: { x: 50, y: 300, width: 200, height: 120, label: 'Memory' }
        };

        // Draw components
        for (const [key, comp] of Object.entries(components)) {
            // Highlight active component
            if (key === this.activeComponent) {
                ctx.fillStyle = '#90EE90';
                ctx.strokeStyle = '#28a745';
                ctx.lineWidth = 4;
            } else {
                ctx.fillStyle = '#f8f9fa';
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
            }

            ctx.fillRect(comp.x, comp.y, comp.width, comp.height);
            ctx.strokeRect(comp.x, comp.y, comp.width, comp.height);

            // Label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(comp.label, comp.x + comp.width / 2, comp.y + 20);

            // Values
            ctx.font = '11px monospace';
            if (key === 'pc') {
                ctx.fillText(`${this.pc}`, comp.x + comp.width / 2, comp.y + 45);
            } else if (key === 'ir') {
                ctx.fillText(`0x${this.ir.toString(16).toUpperCase().padStart(4, '0')}`, comp.x + comp.width / 2, comp.y + 45);
            } else if (key === 'tempRegs') {
                ctx.fillText(`T1:${this.tempRegs[0]} T2:${this.tempRegs[1]}`, comp.x + comp.width / 2, comp.y + 45);
                ctx.fillText(`T3:${this.tempRegs[2]} T4:${this.tempRegs[3]}`, comp.x + comp.width / 2, comp.y + 65);
            } else if (key === 'sequencer') {
                ctx.font = 'bold 12px Arial';
                ctx.fillStyle = '#dc3545';
                ctx.fillText(this.fsmState, comp.x + comp.width / 2, comp.y + 50);
            }
        }

        // Draw wires (simplified)
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);

        // PC to Memory
        ctx.beginPath();
        ctx.moveTo(100, 140);
        ctx.lineTo(100, 300);
        ctx.stroke();

        // Memory to IR
        ctx.beginPath();
        ctx.moveTo(150, 350);
        ctx.lineTo(200, 350);
        ctx.lineTo(200, 200);
        ctx.lineTo(150, 200);
        ctx.stroke();

        // IR to Decoder
        ctx.beginPath();
        ctx.moveTo(150, 200);
        ctx.lineTo(250, 120);
        ctx.stroke();

        // Decoder to Sequencer
        ctx.beginPath();
        ctx.moveTo(340, 160);
        ctx.lineTo(340, 180);
        ctx.stroke();

        // Sequencer to ALU
        ctx.beginPath();
        ctx.moveTo(430, 220);
        ctx.lineTo(550, 270);
        ctx.stroke();

        // Temp Regs to ALU
        ctx.beginPath();
        ctx.moveTo(625, 200);
        ctx.lineTo(625, 220);
        ctx.stroke();

        // Current instruction display
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 15px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Current: ${this.currentInstruction}`, 50, 450);

        // Micro-operation display
        ctx.fillStyle = '#dc3545';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(`Micro-op: ${this.currentMicroOp}`, 50, 470);

        // Status
        ctx.fillStyle = this.halted ? '#dc3545' : '#28a745';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`Status: ${this.halted ? 'HALTED' : 'RUNNING'}`, 50, 490);

        // Cycle info
        ctx.fillStyle = '#333';
        ctx.fillText(`Cycles: ${this.cycleCount} | Instructions: ${this.instructionCount}`, 450, 490);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CISCProcessor;
}
