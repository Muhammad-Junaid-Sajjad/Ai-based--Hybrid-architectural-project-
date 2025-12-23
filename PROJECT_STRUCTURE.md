# Hybrid CPU Architecture Project Structure

**Lahore Garrison University - Computer Architecture Project**

---

## 📁 Complete Directory Structure

```
hybrid-cpu-architecture/
├── README.md                                  # Main project documentation
├── PROJECT_STRUCTURE.md                       # This file - project organization guide
├── .gitignore                                 # Git ignore patterns
├── vercel.json                                # Vercel deployment configuration
│
├── frontend/                                  # Frontend web application
│   ├── index.html                             # Main HTML file
│   ├── css/
│   │   └── styles.css                         # Styling and responsive design
│   └── js/
│       ├── cache-system.js                    # L1/L2 cache implementation
│       ├── instruction-translator.js          # CISC→RISC translation
│       ├── risc-simulator-enhanced.js         # RISC 5-stage pipeline simulator
│       ├── cisc-simulator-enhanced.js         # CISC microcoded simulator
│       ├── hybrid-simulator-enhanced.js       # Hybrid optimized simulator ⭐
│       ├── performance-monitor.js             # Metrics collection & comparison
│       └── main.js                            # Main application controller
│
├── backend/                                   # Backend (if needed for future features)
│   └── README.md                              # Backend placeholder/documentation
│
├── docs/                                      # Comprehensive documentation
│   ├── PROJECT_REPORT.md                      # Full project report (30+ pages)
│   ├── ARCHITECTURE.md                        # Detailed architecture documentation
│   ├── COMPONENTS.md                          # Component definitions
│   └── DEPLOYMENT.md                          # Deployment guide
│
├── specs/                                     # Specification-driven development artifacts
│   └── 001-hybrid-cpu-architecture/
│       ├── spec.md                            # Feature specification
│       ├── plan.md                            # Implementation plan
│       └── tasks.md                           # Task breakdown
│
├── .specify/                                  # Specify framework configuration
│   ├── memory/
│   │   └── constitution.md                    # Project principles & requirements
│   ├── templates/                             # Document templates
│   └── scripts/                               # Automation scripts
│
└── assets/                                    # Static assets
    ├── diagrams/                              # Architecture diagrams
    └── screenshots/                           # Demo screenshots
```

---

## 🎯 Project Overview

**Title**: Hybrid Architecture (RISC + CISC) Dual-Core System Simulation

**Institution**: Lahore Garrison University

**Objective**: Demonstrate that Hybrid architecture (CISC interface + RISC execution core with Instruction Translator) achieves superior performance compared to pure RISC and pure CISC implementations.

---

## 📊 Performance Results

| Architecture | Instructions | Cycles | CPI | Winner |
|--------------|--------------|--------|-----|--------|
| **RISC** (5-Stage Pipeline) | 9 | 9 | 1.00 | No |
| **CISC** (Microcoded) | 1 | 16-20 | 16-20 | No |
| **Hybrid** (Optimized) 🏆 | 1 | **6** | **6.00** | **YES** ✅ |

**Key Achievement**: Hybrid achieves **6 cycles** - LOWER than RISC (9 cycles) and much lower than CISC (16-20 cycles)!

**How Hybrid Wins**:
1. **Instruction Translation**: CISC → RISC micro-ops (0 cycles, combinational logic)
2. **Micro-op Fusion**: Combines compatible operations (LOAD_DUAL, LOAD_ADD)
3. **Optimized Pipeline**: Parallel execution where dependencies allow
4. **Cache-Aware**: Efficient L1/L2 cache utilization

---

## 🏗️ System Architecture

### Core Components

#### 1. RISC Core (5-Stage Pipeline)
- **IF** (Instruction Fetch): Retrieve from L1 I-Cache
- **ID** (Instruction Decode): Decode opcode, read registers
- **EX** (Execute): ALU operations
- **MEM** (Memory Access): L1 D-Cache access
- **WB** (Write Back): Write to register file

**Features**:
- 8 General-purpose registers (R0-R7, R0 hardwired to 0)
- Load/Store architecture
- Fixed 16-bit instruction format
- L1 I-Cache + L1 D-Cache (private)

#### 2. CISC Core (Microcoded)
- Complex instruction decoder
- Micro-operation sequencer (FSM)
- Dual L1 Data Caches for high throughput
- Temporary registers for intermediate results

**Features**:
- Complex instructions (e.g., ADD4)
- Memory-to-memory operations
- Multi-cycle execution (16-20 cycles)
- Microcode ROM for instruction interpretation

#### 3. Hybrid Core (WINNER 🏆)
- **Instruction Translator**: Converts CISC to RISC micro-ops
- **Micro-op Fusion Engine**: Combines operations
- **Optimized RISC Execution Core**: Fast micro-op execution
- **Shared L2 Cache**: Efficient data sharing

**Optimization Techniques**:
1. **LOAD_DUAL**: Parallel load of two operands (1 cycle)
2. **LOAD_ADD**: Fused load+add operation (1 cycle)
3. **Cache Prefetching**: Anticipate data needs
4. **Translation Caching**: Reuse translated micro-ops

### Memory Hierarchy

```
┌─────────────────────────────────────────────────┐
│           Memory Hierarchy                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  L1 I-Cache (RISC)    L1 D-Cache (RISC)        │
│     4KB, 1-cycle         4KB, 1-cycle          │
│                                                 │
│  L1 D-Cache 1 (CISC)  L1 D-Cache 2 (CISC)      │
│     4KB, 1-cycle         4KB, 1-cycle          │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │     L2 Cache (Shared, 8-way)              │ │
│  │     256KB, 8-cycle access                 │ │
│  └───────────────────────────────────────────┘ │
│                       ↕                         │
│  ┌───────────────────────────────────────────┐ │
│  │     System Interconnect (Bus)             │ │
│  └───────────────────────────────────────────┘ │
│                       ↕                         │
│  ┌───────────────────────────────────────────┐ │
│  │     Main Memory (DRAM, 256 words)         │ │
│  │     16-bit words, 50-cycle latency        │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 💻 Frontend Structure

### HTML (`frontend/index.html`)
- Interactive UI with architecture selector
- Canvas-based visualization
- Control panel (Run/Pause/Step/Reset)
- Real-time metrics display
- Performance comparison dashboard

### CSS (`frontend/css/styles.css`)
- Responsive design (desktop & mobile)
- Professional educational styling
- Gradient backgrounds and animations
- Component highlighting and transitions

### JavaScript Modules

#### `cache-system.js`
- **Purpose**: Simulate L1 and L2 cache hierarchy
- **Features**:
  - Direct-mapped L1 cache (16 entries)
  - 8-way set-associative L2 cache (32 entries)
  - LRU replacement policy
  - Hit/miss tracking

#### `instruction-translator.js`
- **Purpose**: Core innovation - translate CISC to RISC
- **Features**:
  - CISC instruction parsing
  - Micro-op generation with fusion
  - Translation caching (memoization)
  - Optimization analysis

#### `risc-simulator-enhanced.js`
- **Purpose**: Simulate RISC processor with 5-stage pipeline
- **Features**:
  - 6-instruction ISA (LOAD, STORE, ADD, SUB, JUMP, HALT)
  - Pipeline stage visualization
  - Cache integration
  - Performance counters

#### `cisc-simulator-enhanced.js`
- **Purpose**: Simulate CISC processor with microcode
- **Features**:
  - Complex ADD4 instruction
  - FSM state machine (16+ states)
  - Dual L1 caches
  - Micro-operation sequencing

#### `hybrid-simulator-enhanced.js` ⭐
- **Purpose**: WINNING architecture with optimizations
- **Features**:
  - **Instruction Translation** (0 cycles)
  - **Micro-op Fusion** (LOAD_DUAL, LOAD_ADD)
  - **Optimized Execution** (6 cycles total)
  - **Cache-aware** translation
  - **Lowest cycle count achieved!**

#### `performance-monitor.js`
- **Purpose**: Collect and compare performance metrics
- **Features**:
  - Metric recording (instructions, cycles, CPI, cache hits)
  - Winner determination (lowest cycles)
  - Comparison table generation
  - CSV export functionality

#### `main.js`
- **Purpose**: Main application controller
- **Features**:
  - UI event handling
  - Simulation orchestration
  - Animation loop management
  - Keyboard shortcuts

---

## 📚 Documentation Structure

### `docs/PROJECT_REPORT.md`
**30+ page comprehensive report**:
1. Abstract
2. Problem Statement
3. Objectives
4. Methodology
5. Design & Architecture (with diagrams)
6. Implementation Details
7. Results & Validation
8. Limitations
9. Conclusion

### `docs/ARCHITECTURE.md`
- System architecture deep dive
- Component interaction diagrams
- Pipeline stage details
- Cache hierarchy explanation

### `docs/COMPONENTS.md`
- Detailed component definitions
- API documentation
- Code examples
- Integration guides

### `docs/DEPLOYMENT.md`
- GitHub setup instructions
- Vercel deployment guide
- Environment configuration
- Troubleshooting

---

## 🚀 Deployment

### GitHub Pages
```bash
# Repository structure for GitHub Pages
/frontend/  → deployed to https://YOUR_USERNAME.github.io/hybrid-cpu-architecture/
```

### Vercel
```json
// vercel.json configuration
{
  "buildCommand": "echo 'No build needed'",
  "outputDirectory": "frontend",
  "cleanUrls": true
}
```

**Live Demo URL**: `https://hybrid-cpu-architecture.vercel.app`

---

## 📖 How to Run Locally

### Option 1: Direct File Open
1. Navigate to `frontend/` directory
2. Double-click `index.html`
3. Opens in default browser

### Option 2: Local Server (Recommended)
```bash
# Python 3
cd frontend/
python3 -m http.server 8000

# Node.js
npx http-server frontend/ -p 8000

# Open: http://localhost:8000
```

---

## 🎓 Educational Value

### Learning Outcomes
1. **Pipeline Concepts**: Understand 5-stage pipeline execution
2. **Cache Hierarchy**: Learn L1/L2 cache interactions
3. **ISA Design**: Compare RISC vs CISC philosophies
4. **Optimization**: See how Hybrid combines best of both
5. **Performance Analysis**: Measure with real metrics

### Suitable For
- ✅ University Computer Architecture courses
- ✅ Viva defense demonstrations
- ✅ Educational showcases
- ✅ Research presentations

---

## 🔧 Customization & Extension

### Adding New Instructions
1. Update ISA in respective simulator file
2. Add encoding in `loadBenchmarkProgram()`
3. Update translator if needed
4. Test with custom program

### Modifying Cache Parameters
Edit `cache-system.js`:
```javascript
// L1 Cache size
this.l1Cache = new Array(32).fill(null); // Increase to 32 entries

// L2 Associativity
this.l2Cache = new Array(8).fill(null).map(() =>
    new Array(8).fill(null) // Change to 8-way
);
```

### Adjusting Optimization Level
Edit `hybrid-simulator-enhanced.js`:
```javascript
// Enable/disable fusion
this.fusionEnabled = true; // Set to false for standard translation
```

---

## 📊 Performance Benchmarks

### Benchmark Program
```
Input: M[0]=5, M[1]=10, M[2]=15, M[3]=20
Operation: SUM = M[0] + M[1] + M[2] + M[3]
Output: M[4] = 50 (expected)
```

### Detailed Cycle Breakdown

**RISC (9 cycles)**:
```
1. LOAD R1, [0x80]  // 1 cycle
2. LOAD R2, [0x81]  // 1 cycle
3. ADD  R3, R1, R2  // 1 cycle
4. LOAD R4, [0x82]  // 1 cycle
5. ADD  R5, R3, R4  // 1 cycle
6. LOAD R6, [0x83]  // 1 cycle
7. ADD  R7, R5, R6  // 1 cycle
8. STORE [0x84], R7 // 1 cycle
9. HALT             // 1 cycle
Total: 9 cycles
```

**CISC (16-20 cycles)**:
```
1. FETCH ADD4       // 1-2 cycles
2. DECODE           // 1-2 cycles
3. LOAD M[0]        // 2 cycles
4. LOAD M[1]        // 2 cycles
5. ADD              // 1 cycle
6. LOAD M[2]        // 2 cycles
7. ADD              // 1 cycle
8. LOAD M[3]        // 2 cycles
9. ADD              // 1 cycle
10. STORE M[4]      // 2 cycles
11. HALT            // 1 cycle
Total: 16-20 cycles (FSM overhead)
```

**Hybrid (6 cycles)** 🏆:
```
1. FETCH ADD4 + Translate (0 cycle translation)  // 1 cycle
2. LOAD_DUAL R1←M[0], R2←M[1] (parallel)        // 1 cycle
3. ADD R3, R1, R2                                // 1 cycle
4. LOAD_ADD R4←M[2], R5←R3+R4 (fused)          // 1 cycle
5. LOAD_ADD R6←M[3], R7←R5+R6 (fused)          // 1 cycle
6. STORE M[4], R7                                // 1 cycle
Total: 6 cycles ⭐ WINNER!
```

---

## 🏆 Key Achievements

1. ✅ **Hybrid Wins**: 6 cycles < RISC 9 cycles < CISC 16-20 cycles
2. ✅ **Live Simulation**: Real-time visualization of all architectures
3. ✅ **Complete Documentation**: 30+ pages from abstract to conclusion
4. ✅ **Web Deployment**: Accessible online via Vercel/GitHub Pages
5. ✅ **Educational Quality**: Suitable for university submission
6. ✅ **Open Source**: Full code available on GitHub

---

## 📞 Support & Contact

**GitHub Repository**: https://github.com/YOUR_USERNAME/hybrid-cpu-architecture

**Live Demo**: https://hybrid-cpu-architecture.vercel.app

**Documentation**: See `docs/` directory

**Issues**: Open an issue on GitHub

---

## 📜 License

Educational Project - Lahore Garrison University

---

**Status**: ✅ Complete and Functional

**Last Updated**: December 2025

**Project Achievement**: Hybrid Architecture Demonstrates Superior Performance! 🏆
