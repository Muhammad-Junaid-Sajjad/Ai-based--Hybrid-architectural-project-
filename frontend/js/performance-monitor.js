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
            cacheHits: metrics.cacheHits || 0,
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
            const r = this.results.risc;
            this.updateTableCell('riscInstr', r.instructions);
            this.updateTableCell('riscCycles', r.cycles);
            this.updateTableCell('riscCPI', r.cpi);
            this.updateTableCell('riscHits', r.cacheHits);
            this.updateTableCell('riscCorrect', r.correct ? '✓ Yes' : '✗ No');
            this.updateTableCell('riscWinner', winner === 'risc' ? '🏆 YES' : 'No');

            if (winner === 'risc') {
                const row = document.getElementById('riscRow');
                if (row) row.style.background = '#90EE90';
            }
        }

        // Update CISC row
        if (this.results.cisc) {
            const c = this.results.cisc;
            this.updateTableCell('ciscInstr', c.instructions);
            this.updateTableCell('ciscCycles', c.cycles);
            this.updateTableCell('ciscCPI', c.cpi);
            this.updateTableCell('ciscHits', c.cacheHits);
            this.updateTableCell('ciscCorrect', c.correct ? '✓ Yes' : '✗ No');
            this.updateTableCell('ciscWinner', winner === 'cisc' ? '🏆 YES' : 'No');

            if (winner === 'cisc') {
                const row = document.getElementById('ciscRow');
                if (row) row.style.background = '#90EE90';
            }
        }

        // Update Hybrid row
        if (this.results.hybrid) {
            const h = this.results.hybrid;
            this.updateTableCell('hybridInstr', h.instructions);
            this.updateTableCell('hybridCycles', h.cycles);
            this.updateTableCell('hybridCPI', h.cpi);
            this.updateTableCell('hybridHits', h.cacheHits);
            this.updateTableCell('hybridCorrect', h.correct ? '✓ Yes' : '✗ No');
            this.updateTableCell('hybridWinner', winner === 'hybrid' ? '🏆 YES' : 'No');

            if (winner === 'hybrid') {
                const row = document.getElementById('hybridRow');
                if (row) row.style.background = '#ffffcc';

                const announcement = document.getElementById('winnerAnnouncement');
                if (announcement) announcement.classList.remove('hidden');

                // Calculate victory margin
                if (this.results.risc && this.results.cisc) {
                    const marginVsRISC = ((this.results.risc.cycles - h.cycles) / this.results.risc.cycles * 100).toFixed(1);
                    const marginVsCISC = ((this.results.cisc.cycles - h.cycles) / this.results.cisc.cycles * 100).toFixed(1);

                    const victoryEl = document.getElementById('victoryMargin');
                    if (victoryEl) {
                        victoryEl.innerHTML = `
                            <strong>Performance Improvement:</strong><br>
                            ${marginVsRISC}% faster than RISC (${this.results.risc.cycles} cycles)<br>
                            ${marginVsCISC}% faster than CISC (${this.results.cisc.cycles} cycles)
                        `;
                    }
                }
            }
        }

        // Show comparison section if all three have results
        if (this.results.risc && this.results.cisc && this.results.hybrid) {
            const section = document.getElementById('comparisonSection');
            if (section) section.classList.remove('hidden');
        }
    }

    updateTableCell(id, value) {
        const elem = document.getElementById(id);
        if (elem) elem.textContent = value;
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

    reset() {
        this.results = { risc: null, cisc: null, hybrid: null };

        const cells = ['risc', 'cisc', 'hybrid'];
        for (const arch of cells) {
            this.updateTableCell(`${arch}Instr`, '-');
            this.updateTableCell(`${arch}Cycles`, '-');
            this.updateTableCell(`${arch}CPI`, '-');
            this.updateTableCell(`${arch}Correct`, '-');
            this.updateTableCell(`${arch}Winner`, '-');
        }

        const rows = ['riscRow', 'ciscRow', 'hybridRow'];
        rows.forEach(id => {
            const row = document.getElementById(id);
            if (row) row.style.background = id === 'hybridRow' ? '#ffffcc' : '';
        });

        const announcement = document.getElementById('winnerAnnouncement');
        if (announcement) announcement.classList.add('hidden');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}
