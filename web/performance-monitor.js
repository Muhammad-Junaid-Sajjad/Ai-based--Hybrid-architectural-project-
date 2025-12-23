/**
 * Performance Monitor
 * Collects and compares performance metrics from all three architectures
 */

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
            result: metrics.result,
            correct: metrics.correct,
            microOps: metrics.microOps || metrics.instructions
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
            document.getElementById('riscInstr').textContent = this.results.risc.instructions;
            document.getElementById('riscCycles').textContent = this.results.risc.cycles;
            document.getElementById('riscCPI').textContent = this.results.risc.cpi;
            document.getElementById('riscCorrect').textContent = this.results.risc.correct ? '✓ Yes' : '✗ No';
            document.getElementById('riscWinner').textContent = winner === 'risc' ? '🏆 YES' : 'No';

            if (winner === 'risc') {
                document.getElementById('riscRow').style.background = '#90EE90';
            }
        }

        // Update CISC row
        if (this.results.cisc) {
            document.getElementById('ciscInstr').textContent = this.results.cisc.instructions;
            document.getElementById('ciscCycles').textContent = this.results.cisc.cycles;
            document.getElementById('ciscCPI').textContent = this.results.cisc.cpi;
            document.getElementById('ciscCorrect').textContent = this.results.cisc.correct ? '✓ Yes' : '✗ No';
            document.getElementById('ciscWinner').textContent = winner === 'cisc' ? '🏆 YES' : 'No';

            if (winner === 'cisc') {
                document.getElementById('ciscRow').style.background = '#90EE90';
            }
        }

        // Update Hybrid row
        if (this.results.hybrid) {
            document.getElementById('hybridInstr').textContent = this.results.hybrid.instructions;
            document.getElementById('hybridCycles').textContent = this.results.hybrid.cycles;
            document.getElementById('hybridCPI').textContent = this.results.hybrid.cpi;
            document.getElementById('hybridCorrect').textContent = this.results.hybrid.correct ? '✓ Yes' : '✗ No';
            document.getElementById('hybridWinner').textContent = winner === 'hybrid' ? '🏆 YES' : 'No';

            if (winner === 'hybrid') {
                document.getElementById('hybridRow').style.background = '#ffffcc';
                document.getElementById('winnerAnnouncement').classList.remove('hidden');
            }
        }

        // Show comparison section if all three have results
        if (this.results.risc && this.results.cisc && this.results.hybrid) {
            document.getElementById('comparisonSection').classList.remove('hidden');
        }
    }

    generateSummary() {
        const winner = this.getWinner();

        if (!winner) {
            return 'Run all three architectures to see comparison';
        }

        const winnerData = this.results[winner];
        const summary = {
            winner: winner.toUpperCase(),
            cycles: winnerData.cycles,
            instructions: winnerData.instructions,
            cpi: winnerData.cpi,
            analysis: this.generateAnalysis()
        };

        return summary;
    }

    generateAnalysis() {
        if (!this.results.risc || !this.results.cisc || !this.results.hybrid) {
            return 'Incomplete data';
        }

        const r = this.results.risc;
        const c = this.results.cisc;
        const h = this.results.hybrid;

        const analysis = [];

        // Instruction count analysis
        analysis.push(`**Instructions:**`);
        analysis.push(`- RISC: ${r.instructions} (most instructions - load/store architecture)`);
        analysis.push(`- CISC: ${c.instructions} (fewest instructions - complex ADD4)`);
        analysis.push(`- Hybrid: ${h.instructions} (same as CISC - CISC interface)`);
        analysis.push('');

        // Cycle count analysis
        analysis.push(`**Cycles:**`);
        analysis.push(`- RISC: ${r.cycles} (one cycle per instruction)`);
        analysis.push(`- CISC: ${c.cycles} (many cycles per complex instruction)`);
        analysis.push(`- Hybrid: ${h.cycles} (WINNER - efficient RISC execution)`);
        analysis.push('');

        // CPI analysis
        analysis.push(`**CPI (Cycles Per Instruction):**`);
        analysis.push(`- RISC: ${r.cpi} (ideal - simple instructions)`);
        analysis.push(`- CISC: ${c.cpi} (high - complex execution)`);
        analysis.push(`- Hybrid: ${h.cpi} (balanced - best of both worlds)`);
        analysis.push('');

        // Conclusion
        analysis.push(`**Why Hybrid Wins:**`);
        analysis.push(`- Accepts CISC instructions (programmer convenience)`);
        analysis.push(`- Translates to RISC micro-ops (0-cycle translation)`);
        analysis.push(`- Executes with RISC efficiency (1 cycle per micro-op)`);
        analysis.push(`- Result: Lowest total cycles = BEST PERFORMANCE`);

        return analysis.join('\n');
    }

    exportCSV() {
        let csv = 'Architecture,Instructions,Cycles,CPI,Result,Correct,Winner\n';

        const winner = this.getWinner();

        if (this.results.risc) {
            const r = this.results.risc;
            csv += `RISC,${r.instructions},${r.cycles},${r.cpi},${r.result},${r.correct ? 'Yes' : 'No'},${winner === 'risc' ? 'Yes' : 'No'}\n`;
        }

        if (this.results.cisc) {
            const c = this.results.cisc;
            csv += `CISC,${c.instructions},${c.cycles},${c.cpi},${c.result},${c.correct ? 'Yes' : 'No'},${winner === 'cisc' ? 'Yes' : 'No'}\n`;
        }

        if (this.results.hybrid) {
            const h = this.results.hybrid;
            csv += `Hybrid,${h.instructions},${h.cycles},${h.cpi},${h.result},${h.correct ? 'Yes' : 'No'},${winner === 'hybrid' ? 'Yes' : 'No'}\n`;
        }

        return csv;
    }

    downloadCSV() {
        const csv = this.exportCSV();
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

    reset() {
        this.results = {
            risc: null,
            cisc: null,
            hybrid: null
        };

        // Clear table
        const cells = ['risc', 'cisc', 'hybrid'];
        for (const arch of cells) {
            document.getElementById(`${arch}Instr`).textContent = '-';
            document.getElementById(`${arch}Cycles`).textContent = '-';
            document.getElementById(`${arch}CPI`).textContent = '-';
            document.getElementById(`${arch}Correct`).textContent = '-';
            document.getElementById(`${arch}Winner`).textContent = '-';
        }

        // Reset row backgrounds
        document.getElementById('riscRow').style.background = '';
        document.getElementById('ciscRow').style.background = '';
        document.getElementById('hybridRow').style.background = '#ffffcc';

        // Hide winner announcement
        document.getElementById('winnerAnnouncement').classList.add('hidden');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}
