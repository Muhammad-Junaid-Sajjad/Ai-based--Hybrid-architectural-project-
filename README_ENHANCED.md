# 🖥️ Hybrid CPU Architecture Simulation

## Dual-Core System: RISC + CISC with 5-Stage Pipeline & Cache Hierarchy

**Lahore Garrison University - Computer Architecture Project**

[![Deploy Status](https://img.shields.io/badge/Deploy-Ready-success?style=for-the-badge)]()
[![Architecture](https://img.shields.io/badge/Architecture-RISC%20%2B%20CISC%20%2B%20Hybrid-blue?style=for-the-badge)]()
[![Winner](https://img.shields.io/badge/Winner-Hybrid%20(6%20cycles)-gold?style=for-the-badge)]()

---

## 🏆 **Hybrid Architecture Wins with 6 Cycles!**

| Architecture | Instructions | Cycles | CPI | Winner |
|--------------|--------------|--------|-----|--------|
| RISC (5-Stage) | 9 | 9 | 1.00 | ❌ |
| CISC (Microcoded) | 1 | 16-20 | 16-20 | ❌ |
| **Hybrid (Optimized)** | **1** | **6** | **6.00** | **✅ YES!** 🏆 |

**Hybrid achieves lower cycle count than RISC through Instruction Translation and Micro-op Fusion!**

---

## 🌐 Quick Links

- **🚀 Live Demo**: [https://hybrid-cpu-architecture.vercel.app](https://hybrid-cpu-architecture.vercel.app) *(Deploy and add your URL)*
- **📂 GitHub**: [https://github.com/YOUR_USERNAME/hybrid-cpu-architecture](https://github.com/YOUR_USERNAME/hybrid-cpu-architecture) *(Add your repo URL)*
- **📄 Full Documentation**: [`docs/PROJECT_REPORT.md`](docs/PROJECT_REPORT.md)
- **🏗️ Project Structure**: [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md)
- **🚀 Deployment Guide**: [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md)

---

## 🎯 Project Overview

This project implements a **dual-core CPU simulation system** comparing three architectures:

1. **RISC Core**: 5-stage pipeline, load/store architecture, L1 I-Cache + D-Cache
2. **CISC Core**: Microcoded instructions, dual L1 D-Caches, complex operations
3. **Hybrid Core**: **CISC interface + RISC execution + Instruction Translator** 🏆

### Key Innovation: Instruction Translator

The **Instruction Translator** is the core component that enables Hybrid to win:
- Converts CISC instructions to optimized RISC micro-operations
- **Translation time: 0 cycles** (combinational logic)
- **Micro-op fusion** enabled (LOAD_DUAL, LOAD_ADD)
- Result: **6 cycles** - faster than pure RISC (9 cycles)!

---

## 🚀 Quick Start

### Run Locally

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/hybrid-cpu-architecture.git
cd hybrid-cpu-architecture

# Option 1: Open directly
cd frontend/
# Double-click index.html in file browser

# Option 2: Local server (recommended)
python3 -m http.server 8000
# Open: http://localhost:8000/frontend/
```

### Try Online

Visit the live demo: **[Add your Vercel URL here]**

---

## 📖 How to Use

1. **Select Architecture**: Click RISC, CISC, or Hybrid button
2. **Run Simulation**: Click ▶ Run to execute benchmark program
3. **Step Mode**: Click ⏭ Step to advance one cycle at a time
4. **View Metrics**: See instructions, cycles, CPI, cache hits in real-time
5. **Compare**: Click "Performance Comparison" to see all results

### Keyboard Shortcuts
- `R` - Run
- `P` - Pause
- `S` - Step (one cycle)
- `Esc` - Reset
- `Ctrl+E` - Export data (CSV)

---

## 🏗️ System Architecture

### Memory Hierarchy

```
┌────────────────────────────────────────┐
│         Memory Hierarchy               │
├────────────────────────────────────────┤
│  L1 I-Cache (RISC) │ L1 D-Cache (RISC) │
│    4KB, 1-cycle   │    4KB, 1-cycle    │
├────────────────────┼────────────────────┤
│  L1 D-Cache (CISC) │ L1 D-Cache (CISC) │
│    4KB, 1-cycle   │    4KB, 1-cycle    │
├────────────────────┴────────────────────┤
│      L2 Cache (Shared, 8-way)          │
│      256KB, 8-cycle access             │
├────────────────────────────────────────┤
│      System Interconnect (Bus)         │
├────────────────────────────────────────┤
│      Main Memory (256 words)           │
│      16-bit, 50-cycle latency          │
└────────────────────────────────────────┘
```

### 5-Stage Pipeline

All architectures implement a 5-stage pipeline:
1. **IF** - Instruction Fetch
2. **ID** - Instruction Decode
3. **EX** - Execute
4. **MEM** - Memory Access
5. **WB** - Write Back

---

## ⚡ Why Hybrid Wins

### Standard RISC (9 cycles)
```
1. LOAD R1, [0x80]  → 1 cycle
2. LOAD R2, [0x81]  → 1 cycle
3. ADD  R3, R1, R2  → 1 cycle
4. LOAD R4, [0x82]  → 1 cycle
5. ADD  R5, R3, R4  → 1 cycle
6. LOAD R6, [0x83]  → 1 cycle
7. ADD  R7, R5, R6  → 1 cycle
8. STORE [0x84], R7 → 1 cycle
9. HALT             → 1 cycle
───────────────────────────
TOTAL: 9 cycles
```

### Optimized Hybrid (6 cycles) 🏆
```
1. FETCH ADD4 + Translate     → 1 cycle
2. LOAD_DUAL R1←M[0], R2←M[1] → 1 cycle (parallel!)
3. ADD R3, R1, R2              → 1 cycle
4. LOAD_ADD R4←M[2], R5←R3+R4 → 1 cycle (fused!)
5. LOAD_ADD R6←M[3], R7←R5+R6 → 1 cycle (fused!)
6. STORE M[4], R7              → 1 cycle
───────────────────────────
TOTAL: 6 cycles ⭐ WINNER!
```

**Key Optimizations**:
1. **LOAD_DUAL**: Parallel execution of two loads (saves 1 cycle)
2. **LOAD_ADD**: Fused load+add operations (saves 2 cycles)
3. **Zero Translation**: Combinational logic (instant)
4. **Single Fetch**: No repeated instruction fetches

**Savings**: 3 cycles → **33% faster than RISC!**

---

## 📁 Project Structure

```
hybrid-cpu-architecture/
├── frontend/                # Frontend web application
│   ├── index.html          # Main UI
│   ├── css/styles.css      # Styling
│   └── js/
│       ├── cache-system.js              # L1/L2 cache
│       ├── instruction-translator.js    # CISC→RISC translator
│       ├── hybrid-simulator-enhanced.js # Optimized (6 cycles!)
│       └── ... (other simulators)
│
├── docs/                    # Documentation
│   ├── PROJECT_REPORT.md   # Full 30+ page report
│   └── DEPLOYMENT_GUIDE.md # Deployment instructions
│
├── specs/                   # Specifications
├── README.md                # This file
└── vercel.json              # Deployment config
```

---

## 🎓 Educational Value

### What This Project Demonstrates

1. **RISC vs CISC Tradeoffs**:
   - RISC: Simple instructions, predictable performance
   - CISC: Complex instructions, variable execution time
   - Hybrid: Best of both worlds

2. **Modern CPU Design**:
   - Intel x86 uses similar approach (CISC to micro-ops)
   - ARM processors also use translation
   - This is how real CPUs work!

3. **Performance Optimization**:
   - Micro-op fusion reduces cycle count
   - Parallel execution when dependencies allow
   - Cache hierarchy impact on performance

4. **System Architecture**:
   - 5-stage pipeline operation
   - Multi-level cache design
   - Core interconnection and sharing

---

## 📊 Performance Data

### Benchmark Program
```
Input: M[0]=5, M[1]=10, M[2]=15, M[3]=20
Operation: SUM = M[0] + M[1] + M[2] + M[3]
Expected Output: M[4] = 50
```

### Results
- **RISC**: ✅ Correct (50), 9 cycles, CPI=1.0
- **CISC**: ✅ Correct (50), 16-20 cycles, CPI=16-20
- **Hybrid**: ✅ Correct (50), **6 cycles**, CPI=6.0 🏆

### Conclusion
**Hybrid architecture achieves 33% better performance than RISC and 62-70% better than CISC!**

---

## 🚀 Deployment

### GitHub
1. Create repository on GitHub
2. Push code: `git push origin main`
3. Repository URL: `https://github.com/YOUR_USERNAME/hybrid-cpu-architecture`

### Vercel (Automatic)
1. Sign up at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure output directory: `frontend`
4. Deploy!
5. Live URL: `https://hybrid-cpu-architecture.vercel.app`

**See full guide**: [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md)

---

## 🛠️ Technologies Used

- **HTML5**: Structure and UI
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Core simulation logic
- **Canvas API**: Visual circuit rendering
- **Cache System**: L1/L2 hierarchy simulation
- **Instruction Translator**: CISC→RISC conversion
- **Git**: Version control
- **Vercel/GitHub Pages**: Deployment

---

## 📚 Documentation

- **[Project Report](docs/PROJECT_REPORT.md)**: Complete 30+ page academic report
- **[Project Structure](PROJECT_STRUCTURE.md)**: Detailed file organization
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)**: Step-by-step deployment
- **[Final Summary](FINAL_PROJECT_SUMMARY.md)**: Project completion summary

---

## 🎯 Key Features

- ✅ Three complete CPU architectures (RISC, CISC, Hybrid)
- ✅ 5-stage pipeline implementation
- ✅ L1/L2 cache hierarchy
- ✅ Instruction Translator (CISC→RISC)
- ✅ Micro-op fusion optimization
- ✅ Live visual simulation
- ✅ Real-time performance metrics
- ✅ Interactive controls (Run/Pause/Step/Reset)
- ✅ Performance comparison dashboard
- ✅ Editable memory values
- ✅ Complete documentation
- ✅ Web deployment ready

---

## 🏆 Project Achievement

**Successfully demonstrated that Hybrid Architecture (RISC+CISC) achieves superior performance through intelligent design!**

- Hybrid: **6 cycles** 🏆
- RISC: 9 cycles
- CISC: 16-20 cycles

**Winner: Hybrid by 33% margin over RISC!**

---

## 👤 Author

**Lahore Garrison University**
Computer Architecture Course Project
December 2025

---

## 📝 License

Educational Project - Lahore Garrison University

---

## 🤝 Contributing

This is an educational project for university submission. Contributions, suggestions, and feedback are welcome!

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/YOUR_USERNAME/hybrid-cpu-architecture/issues)
- **Documentation**: Check `docs/` directory
- **Email**: *(Add your email if desired)*

---

## 🌟 Show Your Support

If you find this project helpful:
- ⭐ Star the repository on GitHub
- 🔗 Share with classmates
- 📝 Cite in your research

---

## 🎉 Acknowledgments

- Computer Architecture course materials
- Patterson & Hennessy textbooks
- Intel and ARM architecture documentation
- Open-source simulation tools

---

**Project Status**: ✅ Complete and Ready for Submission

**Live Demo**: [Add your URL]

**GitHub**: [Add your URL]

---

*Built with dedication for Computer Architecture education* 🖥️✨
