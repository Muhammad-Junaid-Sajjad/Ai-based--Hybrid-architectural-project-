/**
 * Enhanced RISC Processor Simulator with 5-Stage Pipeline
 * Includes L1 Cache integration and pipeline visualization
 */

class RISCProcessorEnhanced {
    constructor() {
        this.cacheSystem = new CacheSystem();
        this.reset();
    }

    reset() {
        this.pc = 0;
        this.ir = 0;
        this.registers = new Array(8).fill(0);
        this.memory = new Array(256).fill(0);

        // Pipeline stages
        this.pipelineStages = {
            IF: null,
            ID: null,
            EX: null,
            MEM: null,
            WB: null
        };

        this.cacheSystem.reset();
        this.cacheHits = 0;
        this.cacheMisses = 0;
        this.instructionCount = 0;
        this.cycleCount = 0;
        this.halted = false;
        this.currentInstruction = '';
        this.activeComponent = '';
        this.currentPipelineStage = '';

        this.loadBenchmarkProgram();
    }

    loadBenchmarkProgram() {
        this.memory[0x80] = 5;
        this.memory[0x81] = 10;
        this.memory[0x82] = 15;
        this.memory[0x83] = 20;
        this.memory[0x84] = 0;

        this.memory[0x00] = 0x1180; // LOAD R1, [0x80]
        this.memory[0x01] = 0x1281; // LOAD R2, [0x81]
        this.memory[0x02] = 0x3312; // ADD  R3, R1, R2
        this.memory[0x03] = 0x1482; // LOAD R4, [0x82]
        this.memory[0x04] = 0x3534; // ADD  R5, R3, R4
        this.memory[0x05] = 0x1683; // LOAD R6, [0x83]
        this.memory[0x06] = 0x3756; // ADD  R7, R5, R6
        this.memory[0x07] = 0x2784; // STORE [0x84], R7
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

        this.cycleCount++;

        // IF - Instruction Fetch
        this.activeComponent = 'fetch';
        this.currentPipelineStage = 'IF';
        const cacheHit = this.cacheSystem.access(this.pc, 'load');
        if (cacheHit) this.cacheHits++; else this.cacheMisses++;

        this.ir = this.memory[this.pc];

        // ID - Instruction Decode
        this.activeComponent = 'decode';
        this.currentPipelineStage = 'ID';
        const opcode = (this.ir >> 12) & 0xF;
        const rd = (this.ir >> 8) & 0xF;
        const rs1 = (this.ir >> 4) & 0xF;
        const rs2_or_addr = this.ir & 0xFF;

        // EX - Execute
        this.activeComponent = 'execute';
        this.currentPipelineStage = 'EX';

        switch(opcode) {
            case 0x0: // HALT
                this.currentInstruction = 'HALT';
                this.halted = true;
                break;

            case 0x1: // LOAD Rd, [addr]
                const loadAddr = rs2_or_addr;
                const loadHit = this.cacheSystem.access(loadAddr, 'load');
                if (loadHit) this.cacheHits++; else this.cacheMisses++;

                this.registers[rd] = this.memory[loadAddr];
                this.currentInstruction = `LOAD R${rd}, [0x${loadAddr.toString(16).toUpperCase()}]`;
                this.registers[0] = 0;
                break;

            case 0x2: // STORE [addr], Rs
                const storeAddr = rs2_or_addr;
                const storeHit = this.cacheSystem.access(storeAddr, 'store');
                if (storeHit) this.cacheHits++; else this.cacheMisses++;

                this.memory[storeAddr] = this.registers[rs1];
                this.currentInstruction = `STORE [0x${storeAddr.toString(16).toUpperCase()}], R${rs1}`;
                break;

            case 0x3: // ADD Rd, Rs1, Rs2
                this.registers[rd] = (this.registers[rs1] + this.registers[rs2]) & 0xFFFF;
                this.currentInstruction = `ADD R${rd}, R${rs1}, R${rs2}`;
                this.registers[0] = 0;
                break;

            case 0x4: // SUB Rd, Rs1, Rs2
                this.registers[rd] = (this.registers[rs1] - this.registers[rs2]) & 0xFFFF;
                this.currentInstruction = `SUB R${rd}, R${rs1}, R${rs2}`;
                this.registers[0] = 0;
                break;

            case 0x5: // JUMP addr
                this.pc = rs2_or_addr;
                this.currentInstruction = `JUMP 0x${rs2_or_addr.toString(16).toUpperCase()}`;
                this.instructionCount++;
                return true;

            default:
                this.currentInstruction = `UNKNOWN (0x${this.ir.toString(16).toUpperCase()})`;
                this.halted = true;
        }

        // WB - Write Back
        this.currentPipelineStage = 'WB';
        this.activeComponent = 'writeback';

        this.pc++;
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

        ctx.clearRect(0, 0, width, height);

        // Title
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('RISC Architecture (5-Stage Pipeline)', width / 2, 30);

        // Pipeline stages visualization
        const stages = ['IF', 'ID', 'EX', 'MEM', 'WB'];
        stages.forEach((stage, i) => {
            const x = 100 + i * 150;
            const y = 80;

            if (stage === this.currentPipelineStage) {
                ctx.fillStyle = '#90EE90';
                ctx.strokeStyle = '#28a745';
                ctx.lineWidth = 3;
            } else {
                ctx.fillStyle = '#f8f9fa';
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
            }

            ctx.fillRect(x, y, 120, 50);
            ctx.strokeRect(x, y, 120, 50);
            ctx.fillStyle = '#333';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(stage, x + 60, y + 30);
        });

        // Components
        const components = {
            pc: { x: 50, y: 180, width: 100, height: 60, label: 'PC' },
            ir: { x: 50, y: 270, width: 100, height: 60, label: 'IR' },
            regFile: { x: 250, y: 180, width: 180, height: 150, label: 'Register File' },
            alu: { x: 550, y: 200, width: 150, height: 100, label: 'ALU' },
            memory: { x: 50, y: 380, width: 200, height: 100, label: 'Memory + L1 Cache' }
        };

        for (const [key, comp] of Object.entries(components)) {
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

            ctx.fillStyle = '#333';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(comp.label, comp.x + comp.width / 2, comp.y + 20);

            ctx.font = '12px monospace';
            if (key === 'pc') {
                ctx.fillText(`${this.pc}`, comp.x + comp.width / 2, comp.y + 45);
            } else if (key === 'ir') {
                ctx.fillText(`0x${this.ir.toString(16).toUpperCase().padStart(4, '0')}`, comp.x + comp.width / 2, comp.y + 45);
            }
        }

        // Current instruction
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Current: ${this.currentInstruction}`, 50, 520);

        // Status
        ctx.fillStyle = this.halted ? '#dc3545' : '#28a745';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`Status: ${this.halted ? 'HALTED' : 'RUNNING'}`, 50, 545);

        // Metrics
        ctx.fillStyle = '#333';
        ctx.fillText(`Cycles: ${this.cycleCount} | Instructions: ${this.instructionCount} | Cache Hits: ${this.cacheHits}`, 400, 545);

        // Pipeline stage display
        const pipelineEl = document.getElementById('pipelineDisplay');
        if (pipelineEl) {
            pipelineEl.innerHTML = `
                <strong>Pipeline Stage:</strong><br>
                ${this.currentPipelineStage}<br><br>
                <strong>Instruction:</strong><br>
                ${this.currentInstruction}
            `;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = RISCProcessorEnhanced;
}
