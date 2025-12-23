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
        this.pc = 0;
        this.ir = 0;
        this.tempRegs = new Array(4).fill(0);
        this.memory = new Array(256).fill(0);
        this.instructionCount = 0;
        this.cycleCount = 0;
        this.fsmState = 'IDLE';
        this.microOpStep = 0;
        this.currentAddresses = [];
        this.halted = false;
        this.currentInstruction = '';
        this.activeComponent = '';
        this.microOps = [];
        this.currentMicroOp = '';
        this.cacheHits = 0;
        this.cacheMisses = 0;
        this.currentPipelineStage = 'IDLE';

        this.loadBenchmarkProgram();
    }

    loadBenchmarkProgram() {
        this.memory[0x80] = 5;
        this.memory[0x81] = 10;
        this.memory[0x82] = 15;
        this.memory[0x83] = 20;
        this.memory[0x84] = 0;

        this.memory[0x00] = 0x1000;
        this.memory[0x01] = 0x8081;
        this.memory[0x02] = 0x8283;
        this.memory[0x03] = 0x8400;
        this.memory[0x04] = 0x0000;
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

        switch (this.fsmState) {
            case 'IDLE':
                this.fsmState = 'FETCH';
                this.activeComponent = 'fetch';
                this.currentMicroOp = 'Fetch instruction';
                this.currentPipelineStage = 'IF';
                break;

            case 'FETCH':
                this.ir = this.memory[this.pc];
                this.pc++;
                this.fsmState = 'DECODE';
                this.activeComponent = 'decode';
                this.currentMicroOp = 'Decode opcode';
                this.currentPipelineStage = 'ID';
                break;

            case 'DECODE':
                const opcode = (this.ir >> 8) & 0xFF;
                if (opcode === 0x00) {
                    this.halted = true;
                    this.currentInstruction = 'HALT';
                    this.fsmState = 'IDLE';
                    return false;
                } else if (opcode === 0x10) {
                    this.currentInstruction = 'ADD4 M[0], M[1], M[2], M[3] -> M[4]';
                    this.instructionCount++;
                    this.fsmState = 'FETCH_ADDR1';
                    this.activeComponent = 'decoder';
                    this.currentMicroOp = 'Decode ADD4';
                    this.currentPipelineStage = 'ID';
                    this.microOpStep = 0;
                } else {
                    this.halted = true;
                    this.currentInstruction = `UNKNOWN (0x${this.ir.toString(16).toUpperCase()})`;
                    return false;
                }
                break;

            case 'FETCH_ADDR1':
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
                this.tempRegs[0] = this.memory[this.currentAddresses[0]];
                this.fsmState = 'LOAD2';
                this.activeComponent = 'memory';
                this.currentMicroOp = `Load M[0x${this.currentAddresses[0].toString(16)}] = ${this.tempRegs[0]} -> TEMP1`;
                this.currentPipelineStage = 'MEM';
                break;

            case 'LOAD2':
                this.tempRegs[1] = this.memory[this.currentAddresses[1]];
                this.fsmState = 'ADD12';
                this.activeComponent = 'memory';
                this.currentMicroOp = `Load M[0x${this.currentAddresses[1].toString(16)}] = ${this.tempRegs[1]} -> TEMP2`;
                this.currentPipelineStage = 'MEM';
                break;

            case 'ADD12':
                this.tempRegs[2] = (this.tempRegs[0] + this.tempRegs[1]) & 0xFFFF;
                this.fsmState = 'FETCH_ADDR2';
                this.activeComponent = 'alu';
                this.currentMicroOp = `ADD TEMP1(${this.tempRegs[0]}) + TEMP2(${this.tempRegs[1]}) = ${this.tempRegs[2]} -> TEMP3`;
                this.currentPipelineStage = 'EX';
                break;

            case 'FETCH_ADDR2':
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
                this.tempRegs[3] = this.memory[this.currentAddresses[2]];
                this.fsmState = 'ADD123';
                this.activeComponent = 'memory';
                this.currentMicroOp = `Load M[0x${this.currentAddresses[2].toString(16)}] = ${this.tempRegs[3]} -> TEMP4`;
                this.currentPipelineStage = 'MEM';
                break;

            case 'ADD123':
                this.tempRegs[2] = (this.tempRegs[2] + this.tempRegs[3]) & 0xFFFF;
                this.fsmState = 'LOAD4';
                this.activeComponent = 'alu';
                this.currentMicroOp = `ADD TEMP3 + TEMP4(${this.tempRegs[3]}) = ${this.tempRegs[2]} -> TEMP3`;
                this.currentPipelineStage = 'EX';
                break;

            case 'LOAD4':
                this.tempRegs[3] = this.memory[this.currentAddresses[3]];
                this.fsmState = 'ADD_FINAL';
                this.activeComponent = 'memory';
                this.currentMicroOp = `Load M[0x${this.currentAddresses[3].toString(16)}] = ${this.tempRegs[3]} -> TEMP4`;
                this.currentPipelineStage = 'MEM';
                break;

            case 'ADD_FINAL':
                this.tempRegs[2] = (this.tempRegs[2] + this.tempRegs[3]) & 0xFFFF;
                this.fsmState = 'FETCH_DEST';
                this.activeComponent = 'alu';
                this.currentMicroOp = `ADD TEMP3 + TEMP4(${this.tempRegs[3]}) = ${this.tempRegs[2]} (FINAL)`;
                this.currentPipelineStage = 'EX';
                break;

            case 'FETCH_DEST':
                const destWord = this.memory[this.pc];
                this.pc++;
                this.currentAddresses[4] = (destWord >> 8) & 0xFF;
                this.fsmState = 'STORE';
                this.activeComponent = 'memory';
                this.currentMicroOp = `Fetch destination: 0x${this.currentAddresses[4].toString(16)}`;
                break;

            case 'STORE':
                this.memory[this.currentAddresses[4]] = this.tempRegs[2];
                this.fsmState = 'FETCH';
                this.activeComponent = 'memory';
                this.currentMicroOp = `Store TEMP3(${this.tempRegs[2]}) -> M[0x${this.currentAddresses[4].toString(16)}]`;
                this.currentPipelineStage = 'WB';
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

        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CISC Architecture (Microcoded)', width / 2, 30);

        const components = {
            pc: { x: 50, y: 80, width: 100, height: 60, label: 'PC' },
            ir: { x: 50, y: 170, width: 100, height: 60, label: 'IR' },
            decoder: { x: 250, y: 80, width: 180, height: 80, label: 'Complex Decoder' },
            sequencer: { x: 250, y: 180, width: 180, height: 80, label: 'Micro-op Sequencer' },
            tempRegs: { x: 550, y: 80, width: 150, height: 120, label: 'Temp Registers' },
            alu: { x: 550, y: 220, width: 150, height: 100, label: 'ALU' },
            memory: { x: 50, y: 300, width: 200, height: 120, label: 'Memory' }
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

        // Draw wires
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(100, 140);
        ctx.lineTo(100, 300);
        ctx.stroke();

        // Current instruction
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 15px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Current: ${this.currentInstruction}`, 50, 450);

        // Micro-op
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CISCProcessor;
}
