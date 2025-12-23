/**
 * RISC Processor Simulator
 * Load/Store architecture with simple instructions
 * Target: 1 cycle per instruction execution
 */

class RISCProcessor {
    constructor() {
        this.reset();
    }

    reset() {
        // Program Counter
        this.pc = 0;

        // Instruction Register
        this.ir = 0;

        // Register File (8 registers, R0 hardwired to 0)
        this.registers = new Array(8).fill(0);

        // Memory (256 words, 16-bit each)
        // 0x00-0x7F: Instructions
        // 0x80-0xFF: Data
        this.memory = new Array(256).fill(0);

        // Performance counters
        this.instructionCount = 0;
        this.cycleCount = 0;

        // Execution state
        this.halted = false;
        this.currentInstruction = '';

        // Visual state
        this.activeComponent = '';
        this.currentPipelineStage = 'IDLE';

        // Cache simulation (simple)
        this.cacheHits = 0;
        this.cacheMisses = 0;

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

        // Program encoding (simplified 16-bit format)
        this.memory[0x00] = 0x1180; // LOAD R1, [0x80] - Load M[0]
        this.memory[0x01] = 0x1281; // LOAD R2, [0x81] - Load M[1]
        this.memory[0x02] = 0x3312; // ADD  R3, R1, R2 - R3 = R1 + R2
        this.memory[0x03] = 0x1482; // LOAD R4, [0x82] - Load M[2]
        this.memory[0x04] = 0x3534; // ADD  R5, R3, R4 - R5 = R3 + R4
        this.memory[0x05] = 0x1683; // LOAD R6, [0x83] - Load M[3]
        this.memory[0x06] = 0x3756; // ADD  R7, R5, R6 - R7 = R5 + R6
        this.memory[0x07] = 0x2784; // STORE [0x84], R7 - Store to M[4]
        this.memory[0x08] = 0x0000; // HALT
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

        // Fetch
        this.activeComponent = 'fetch';
        this.currentPipelineStage = 'IF';
        this.ir = this.memory[this.pc];
        this.cacheHits++; // Assume cache hit for instruction fetch

        // Decode
        const opcode = (this.ir >> 12) & 0xF;
        const rd = (this.ir >> 8) & 0xF;
        const rs1 = (this.ir >> 4) & 0xF;
        const rs2_or_addr = this.ir & 0xFF;

        this.activeComponent = 'decode';
        this.currentPipelineStage = 'ID';

        // Execute
        this.activeComponent = 'execute';
        this.currentPipelineStage = 'EX';

        switch(opcode) {
            case 0x0: // HALT
                this.currentInstruction = 'HALT';
                this.halted = true;
                break;

            case 0x1: // LOAD Rd, [addr]
                const loadAddr = rs2_or_addr;
                this.currentPipelineStage = 'MEM';
                this.registers[rd] = this.memory[loadAddr];
                this.currentInstruction = `LOAD R${rd}, [0x${loadAddr.toString(16).toUpperCase()}]`;
                this.registers[0] = 0; // R0 always 0
                this.cacheHits++; // Simulate cache hit
                break;

            case 0x2: // STORE [addr], Rs
                const storeAddr = rs2_or_addr;
                this.currentPipelineStage = 'MEM';
                this.memory[storeAddr] = this.registers[rs1];
                this.currentInstruction = `STORE [0x${storeAddr.toString(16).toUpperCase()}], R${rs1}`;
                this.cacheHits++; // Simulate cache hit
                break;

            case 0x3: // ADD Rd, Rs1, Rs2
                this.registers[rd] = (this.registers[rs1] + this.registers[rs2]) & 0xFFFF;
                this.currentInstruction = `ADD R${rd}, R${rs1}, R${rs2}`;
                this.registers[0] = 0; // R0 always 0
                break;

            case 0x4: // SUB Rd, Rs1, Rs2
                this.registers[rd] = (this.registers[rs1] - this.registers[rs2]) & 0xFFFF;
                this.currentInstruction = `SUB R${rd}, R${rs1}, R${rs2}`;
                this.registers[0] = 0; // R0 always 0
                break;

            case 0x5: // JUMP addr
                this.pc = rs2_or_addr;
                this.currentInstruction = `JUMP 0x${rs2_or_addr.toString(16).toUpperCase()}`;
                this.cycleCount++;
                this.instructionCount++;
                return true; // Don't increment PC

            default:
                this.currentInstruction = `UNKNOWN (0x${this.ir.toString(16).toUpperCase()})`;
                this.halted = true;
        }

        // Writeback
        this.activeComponent = 'writeback';
        this.currentPipelineStage = 'WB';

        // Update counters
        this.pc++;
        this.cycleCount++;
        this.instructionCount++;

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
            cacheHits: this.cacheHits,
            cacheMisses: this.cacheMisses,
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
        ctx.fillText('RISC Architecture (5-Stage Pipeline)', width / 2, 30);

        // Component positions
        const components = {
            pc: { x: 50, y: 80, width: 100, height: 60, label: 'PC', tooltip: 'Program Counter' },
            ir: { x: 50, y: 170, width: 100, height: 60, label: 'IR', tooltip: 'Instruction Register' },
            regFile: { x: 250, y: 80, width: 180, height: 150, label: 'Register File', tooltip: '8 Registers (R0-R7)' },
            alu: { x: 550, y: 120, width: 150, height: 100, label: 'ALU', tooltip: 'Arithmetic Logic Unit' },
            memory: { x: 50, y: 300, width: 200, height: 120, label: 'Memory + L1', tooltip: 'Memory with L1 Cache' },
            control: { x: 550, y: 300, width: 150, height: 100, label: 'Control Unit', tooltip: 'Generates control signals' }
        };

        // Draw components
        for (const [key, comp] of Object.entries(components)) {
            // Highlight active component
            if (key === this.activeComponent || (this.activeComponent === 'execute' && key === 'alu')) {
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
            ctx.font = '12px monospace';
            if (key === 'pc') {
                ctx.fillText(`Value: ${this.pc}`, comp.x + comp.width / 2, comp.y + 45);
            } else if (key === 'ir') {
                ctx.fillText(`0x${this.ir.toString(16).toUpperCase().padStart(4, '0')}`, comp.x + comp.width / 2, comp.y + 45);
            }
        }

        // Draw wires
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

        // IR to Control
        ctx.beginPath();
        ctx.moveTo(150, 200);
        ctx.lineTo(550, 350);
        ctx.stroke();

        // Register File to ALU
        ctx.beginPath();
        ctx.moveTo(430, 155);
        ctx.lineTo(550, 170);
        ctx.stroke();

        // ALU to Register File (writeback)
        ctx.beginPath();
        ctx.moveTo(625, 220);
        ctx.lineTo(625, 240);
        ctx.lineTo(340, 240);
        ctx.lineTo(340, 230);
        ctx.stroke();

        // Current instruction display
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Current: ${this.currentInstruction}`, 50, 460);

        // Pipeline stage
        ctx.fillStyle = '#ffc107';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`Pipeline: ${this.currentPipelineStage}`, 50, 485);

        // Status
        ctx.fillStyle = this.halted ? '#dc3545' : '#28a745';
        ctx.fillText(`Status: ${this.halted ? 'HALTED' : 'RUNNING'}`, 300, 485);

        // Cycle info
        ctx.fillStyle = '#333';
        ctx.fillText(`Cycles: ${this.cycleCount} | Instructions: ${this.instructionCount}`, 550, 485);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RISCProcessor;
}
