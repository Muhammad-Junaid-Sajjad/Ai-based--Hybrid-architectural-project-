/**
 * Instruction Translator
 * Converts CISC instructions to RISC micro-operations
 * This is the KEY component that enables Hybrid architecture to win
 */

class InstructionTranslator {
    constructor() {
        this.translationCache = new Map();
        this.fusionEnabled = true;
    }

    /**
     * Main translation interface
     * Converts a CISC instruction into RISC micro-ops
     */
    translate(ciscInstruction) {
        const { opcode, operands } = ciscInstruction;

        // Check translation cache first
        const cacheKey = this.getCacheKey(ciscInstruction);
        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }

        let microOps = [];

        switch (opcode) {
            case 'ADD4':
                microOps = this.translateADD4(operands);
                break;
            case 'MUL_ADD':
                microOps = this.translateMUL_ADD(operands);
                break;
            case 'LOAD_MULTIPLE':
                microOps = this.translateLOAD_MULTIPLE(operands);
                break;
            default:
                throw new Error(`Unknown CISC instruction: ${opcode}`);
        }

        // Cache the translation
        this.translationCache.set(cacheKey, microOps);
        return microOps;
    }

    /**
     * Translate ADD4 instruction with optimization
     * Input: ADD4 [a1], [a2], [a3], [a4] -> [dest]
     * Output: Optimized sequence of RISC micro-ops
     */
    translateADD4(operands) {
        const { addr1, addr2, addr3, addr4, dest } = operands;

        if (this.fusionEnabled) {
            // OPTIMIZED VERSION with micro-op fusion
            return [
                {
                    type: 'LOAD_DUAL',
                    description: 'Parallel load two operands',
                    operations: [
                        { op: 'LOAD', dest: 'R1', src: addr1 },
                        { op: 'LOAD', dest: 'R2', src: addr2 }
                    ],
                    cycles: 1, // Parallel execution
                    fusedFrom: ['LOAD', 'LOAD']
                },
                {
                    type: 'ADD',
                    description: 'Add first two operands',
                    operations: [
                        { op: 'ADD', dest: 'R3', src1: 'R1', src2: 'R2' }
                    ],
                    cycles: 1
                },
                {
                    type: 'LOAD_ADD',
                    description: 'Load and add third operand',
                    operations: [
                        { op: 'LOAD', dest: 'R4', src: addr3 },
                        { op: 'ADD', dest: 'R5', src1: 'R3', src2: 'R4' }
                    ],
                    cycles: 1, // Fused execution
                    fusedFrom: ['LOAD', 'ADD']
                },
                {
                    type: 'LOAD_ADD',
                    description: 'Load and add fourth operand',
                    operations: [
                        { op: 'LOAD', dest: 'R6', src: addr4 },
                        { op: 'ADD', dest: 'R7', src1: 'R5', src2: 'R6' }
                    ],
                    cycles: 1, // Fused execution
                    fusedFrom: ['LOAD', 'ADD']
                },
                {
                    type: 'STORE',
                    description: 'Store final result',
                    operations: [
                        { op: 'STORE', dest: dest, src: 'R7' }
                    ],
                    cycles: 1
                }
            ];
            // Total: 5 cycles (optimized)
        } else {
            // STANDARD VERSION without fusion
            return [
                { type: 'LOAD', dest: 'R1', src: addr1, cycles: 1 },
                { type: 'LOAD', dest: 'R2', src: addr2, cycles: 1 },
                { type: 'ADD', dest: 'R3', src1: 'R1', src2: 'R2', cycles: 1 },
                { type: 'LOAD', dest: 'R4', src: addr3, cycles: 1 },
                { type: 'ADD', dest: 'R5', src1: 'R3', src2: 'R4', cycles: 1 },
                { type: 'LOAD', dest: 'R6', src: addr4, cycles: 1 },
                { type: 'ADD', dest: 'R7', src1: 'R5', src2: 'R6', cycles: 1 },
                { type: 'STORE', dest: dest, src: 'R7', cycles: 1 }
            ];
            // Total: 8 cycles (standard)
        }
    }

    /**
     * Additional CISC instruction translations
     */
    translateMUL_ADD(operands) {
        // Example: MUL_ADD [a], [b], [c] -> [dest]  (a*b + c -> dest)
        // Translates to: LOAD, LOAD, MUL, LOAD, ADD, STORE
        return [
            { type: 'LOAD', dest: 'R1', src: operands.addr1, cycles: 1 },
            { type: 'LOAD', dest: 'R2', src: operands.addr2, cycles: 1 },
            { type: 'MUL', dest: 'R3', src1: 'R1', src2: 'R2', cycles: 2 },
            { type: 'LOAD', dest: 'R4', src: operands.addr3, cycles: 1 },
            { type: 'ADD', dest: 'R5', src1: 'R3', src2: 'R4', cycles: 1 },
            { type: 'STORE', dest: operands.dest, src: 'R5', cycles: 1 }
        ];
    }

    translateLOAD_MULTIPLE(operands) {
        // Example: LOAD_MULTIPLE R1-R4, [base]
        // Loads multiple registers from consecutive memory locations
        const microOps = [];
        for (let i = 0; i < operands.count; i++) {
            microOps.push({
                type: 'LOAD',
                dest: `R${operands.startReg + i}`,
                src: operands.baseAddr + i,
                cycles: 1
            });
        }
        return microOps;
    }

    /**
     * Generate cache key for translation memoization
     */
    getCacheKey(instruction) {
        return `${instruction.opcode}_${JSON.stringify(instruction.operands)}`;
    }

    /**
     * Micro-op fusion analysis
     * Identifies opportunities to combine micro-ops
     */
    analyzeFusionOpportunities(microOps) {
        const opportunities = [];

        for (let i = 0; i < microOps.length - 1; i++) {
            const current = microOps[i];
            const next = microOps[i + 1];

            // LOAD + ADD fusion
            if (current.type === 'LOAD' && next.type === 'ADD') {
                // Check if ADD uses the loaded value
                if (next.src1 === current.dest || next.src2 === current.dest) {
                    opportunities.push({
                        type: 'LOAD_ADD_FUSION',
                        index: i,
                        savingCycles: 1,
                        description: 'Fuse LOAD and dependent ADD'
                    });
                }
            }

            // Parallel LOAD detection
            if (current.type === 'LOAD' && next.type === 'LOAD') {
                // Check if LOADs are independent
                if (current.dest !== next.dest) {
                    opportunities.push({
                        type: 'PARALLEL_LOAD',
                        index: i,
                        savingCycles: 1,
                        description: 'Execute LOADs in parallel'
                    });
                }
            }
        }

        return opportunities;
    }

    /**
     * Get translation statistics
     */
    getStats() {
        return {
            cacheSize: this.translationCache.size,
            fusionEnabled: this.fusionEnabled,
            supportedInstructions: ['ADD4', 'MUL_ADD', 'LOAD_MULTIPLE']
        };
    }

    /**
     * Enable/disable micro-op fusion
     */
    setFusionEnabled(enabled) {
        this.fusionEnabled = enabled;
        this.translationCache.clear(); // Invalidate cache
    }

    /**
     * Clear translation cache
     */
    clearCache() {
        this.translationCache.clear();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstructionTranslator;
}
