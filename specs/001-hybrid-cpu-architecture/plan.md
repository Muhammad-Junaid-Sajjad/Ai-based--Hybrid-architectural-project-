# Implementation Plan: Hybrid CPU Architecture Simulation

**Feature**: 001-hybrid-cpu-architecture
**Created**: 2025-12-23
**Status**: Planning

---

## Executive Summary

This plan outlines the implementation strategy for building a live, interactive CPU simulation system that demonstrates the performance superiority of Hybrid (RISC+CISC) architecture over pure RISC and CISC implementations.

**Key Decision**: Use **dual implementation** approach:
1. **Logisim Evolution** circuits for educational depth
2. **Web-based simulator** for online accessibility and live demo

---

## Architecture Decisions

### AD1: Tool Selection - Dual Implementation Approach

**Decision**: Implement in both Logisim Evolution AND custom web simulator

**Rationale**:
- Logisim: Educational standard, visual circuit design, university acceptance
- Web: Online accessibility, GitHub Pages deployment, interactive controls
- Both: Maximizes reach and demonstration flexibility

**Implementation**:
- Logisim (.circ files) for circuit-level detail
- HTML/JavaScript/Canvas for web visualization
- Both execute same benchmark program
- Performance metrics must match across both platforms

### AD2: Instruction Set Architecture Design

**Decision**: Minimal but complete ISA for each architecture

**RISC ISA (6 instructions)**:
```
1. LOAD  Rd, [addr]    - Load from memory to register
2. STORE [addr], Rs    - Store register to memory
3. ADD   Rd, Rs1, Rs2  - Add two registers
4. SUB   Rd, Rs1, Rs2  - Subtract registers
5. JUMP  addr          - Unconditional jump
6. HALT                - Stop execution
```

**CISC ISA (2 instructions)**:
```
1. ADD4  [a1],[a2],[a3],[a4] -> [dest]  - Add 4 memory locations
2. HALT                                   - Stop execution
```

**Hybrid ISA**:
- Accepts CISC instruction externally
- ADD4 translates internally to:
  ```
  LOAD R1, [a1]
  LOAD R2, [a2]
  ADD  R3, R1, R2
  LOAD R4, [a3]
  ADD  R5, R3, R4
  LOAD R6, [a4]
  ADD  R7, R5, R6
  STORE [dest], R7
  ```

**Rationale**: Minimal ISA simplifies implementation while proving the core concept.

### AD3: Register and Memory Configuration

**Decision**:
- **Word Size**: 16-bit (balance between simplicity and capability)
- **Register File**: 8 registers (R0-R7), R0 hardwired to 0
- **Memory Size**: 256 words (8-bit addressing)
- **Memory Layout**:
  - 0x00-0x7F: Program instructions (128 words)
  - 0x80-0xFF: Data memory (128 words)

**Rationale**: 16-bit simplifies Logisim design, 8 registers sufficient for benchmark, 256 words provides adequate space.

### AD4: Performance Measurement Strategy

**Decision**: Cycle-accurate simulation with visible counters

**Metrics Collected**:
- Instruction Count: Increment on each instruction fetch
- Cycle Count: Increment on each clock tick
- CPI: Calculated as Cycles / Instructions
- Execution Time: Cycles × Clock Period (conceptual)

**Instrumentation**:
- Hardware counters in Logisim (register components)
- JavaScript variables in web simulator
- Real-time display during execution
- Final comparison table after HALT

**Expected Results**:
```
Architecture | Instructions | Cycles | CPI   | Winner
-------------|--------------|--------|-------|-------
RISC         | 13          | 13     | 1.00  | No
CISC         | 1           | 32     | 32.00 | No
Hybrid       | 1           | 8      | 8.00  | YES ✓
```

### AD5: Hybrid Translation Mechanism Design

**Decision**: Zero-cycle translation with efficient micro-op execution

**Translation Process**:
1. CISC instruction arrives at fetch stage
2. Translation Unit (combinational logic) immediately generates micro-op sequence
3. Micro-ops queued and fed to RISC execution core
4. Each micro-op executes in 1 cycle (RISC core)

**Why Hybrid Wins**:
- CISC: Each memory access is sequential (load-wait-load-wait-add-wait...)
- RISC: Must fetch each instruction separately (fetch overhead per instruction)
- Hybrid: Single fetch, then pipelined micro-op execution (minimal overhead)

**Cycle Breakdown Example**:
- CISC ADD4:
  - Fetch: 1 cycle
  - Decode: 1 cycle
  - Load M[0]: 2 cycles (address + data)
  - Load M[1]: 2 cycles
  - Add: 1 cycle
  - Load M[2]: 2 cycles
  - Add: 1 cycle
  - Load M[3]: 2 cycles
  - Add: 1 cycle
  - Store M[4]: 2 cycles
  - **Total: 15 cycles per ADD4 instruction** × 1 instruction = 15 cycles (or slower depending on complexity)

- RISC equivalent (13 instructions):
  - Each instruction: 1 cycle (idealized)
  - **Total: 13 cycles**

- Hybrid:
  - Fetch CISC: 1 cycle
  - Translate: 0 cycles (combinational)
  - Execute 8 micro-ops: 8 cycles (RISC core efficiency)
  - **Total: 9 cycles** (or optimize to 8)

**Rationale**: This design ensures Hybrid achieves best performance by eliminating fetch overhead and leveraging RISC execution efficiency.

---

## System Architecture

### Component Hierarchy

```
CPU Simulation System
│
├── RISC Architecture Module
│   ├── Program Counter (PC)
│   ├── Instruction Register (IR)
│   ├── Register File (8x16-bit)
│   ├── ALU (ADD, SUB operations)
│   ├── Control Unit (instruction decoder)
│   ├── Memory Interface
│   └── Performance Counters
│
├── CISC Architecture Module
│   ├── Program Counter (PC)
│   ├── Instruction Register (IR)
│   ├── Instruction Decoder (complex)
│   ├── Micro-operation Sequencer (FSM)
│   ├── Temporary Registers (4x16-bit)
│   ├── ALU (same as RISC)
│   ├── Memory Interface
│   └── Performance Counters
│
├── Hybrid Architecture Module
│   ├── Instruction Fetch Unit
│   ├── Translation Unit (CISC → RISC micro-ops)
│   ├── Micro-op Queue (FIFO)
│   ├── RISC Execution Core (reuse from RISC module)
│   ├── Register File (shared)
│   ├── Memory Interface (shared)
│   └── Performance Counters
│
├── Shared Components
│   ├── Memory Module (256x16-bit)
│   ├── Clock Generator
│   └── I/O Display (registers, memory, metrics)
│
└── Control Interface
    ├── Run/Pause/Reset buttons
    ├── Single-Step button
    ├── Clock Speed Control
    └── Program Input Interface
```

### Datapath Design

**RISC Datapath**:
```
[Memory] <--> [IR] --> [Control Unit] --> Control Signals
             |                              |
             v                              v
[PC] --> [Addr Gen] --> [Memory]      [Reg File] <--> [ALU] --> [Reg File]
         ^                                                |
         |                                                v
         +---------------------------- [Result] ----------+
```

**CISC Datapath**:
```
[Memory] <--> [IR] --> [Complex Decoder] --> [Micro-op Sequencer] --> Control Signals
                                                    |
[Temp Regs] <--> [ALU] <--> [Memory Interface] <--+
                  |
                  v
            [Result Buffer] --> [Memory]
```

**Hybrid Datapath**:
```
[Memory] <--> [IR] --> [Translation Unit] --> [Micro-op Queue]
                              |                      |
                              v                      v
                    [RISC Execution Core] <--> [Reg File]
                              |
                              v
                         [Memory]
```

---

## Implementation Phases

### Phase 1: Foundation (Logisim Circuits)

**Task 1.1**: RISC Architecture Base
- Create basic RISC processor circuit in Logisim
- Components: PC, IR, 8-register file, ALU (ADD/SUB), control unit
- Test with simple 2-instruction program (LOAD, ADD)
- **Deliverable**: `risc-architecture.circ`

**Task 1.2**: RISC Complete Implementation
- Add all 6 instructions
- Implement memory interface (ROM for instructions, RAM for data)
- Add performance counters (instruction count, cycle count)
- Test with benchmark program (manually encoded)
- **Deliverable**: Working RISC executing benchmark

**Task 1.3**: CISC Architecture
- Create CISC processor circuit
- Complex instruction decoder
- Micro-operation sequencer (FSM with states)
- Implement ADD4 instruction (multi-cycle)
- Add performance counters
- Test with benchmark (single ADD4 instruction)
- **Deliverable**: `cisc-architecture.circ`

**Task 1.4**: Hybrid Architecture
- Create translation unit (combinational logic: CISC opcode → micro-op sequence)
- Implement micro-op queue (FIFO buffer)
- Integrate RISC execution core (reuse from Task 1.2)
- Add translation overhead measurement
- Test with benchmark
- Verify cycle count < both RISC and CISC
- **Deliverable**: `hybrid-architecture.circ`

### Phase 2: Web Simulator Implementation

**Task 2.1**: Web UI Framework
- HTML structure: canvas for circuit visualization, control panel, metrics display
- CSS styling: clean, educational look
- JavaScript architecture: modular components
- **Deliverable**: `index.html`, `styles.css`, `main.js`

**Task 2.2**: RISC Web Simulator
- Canvas rendering: PC, registers, memory, ALU
- Instruction execution engine (JavaScript simulation)
- Animation: highlight active components each cycle
- Control buttons: Run, Pause, Reset, Step
- **Deliverable**: `risc-simulator.js`

**Task 2.3**: CISC Web Simulator
- Render CISC components (decoder, sequencer, temp regs)
- Multi-cycle execution visualization
- Micro-operation step display
- **Deliverable**: `cisc-simulator.js`

**Task 2.4**: Hybrid Web Simulator
- Translation unit visualization
- Micro-op queue rendering
- Integrated RISC core execution
- Side-by-side comparison mode
- **Deliverable**: `hybrid-simulator.js`

**Task 2.5**: Performance Dashboard
- Real-time metrics display
- Comparison table generation
- Chart/graph of cycle counts (optional)
- Victory indicator for Hybrid
- **Deliverable**: `performance-monitor.js`

### Phase 3: Integration & Testing

**Task 3.1**: Benchmark Verification
- Run benchmark on all three architectures (Logisim)
- Verify correctness: M[4] = 50 in all cases
- Record cycle counts
- Confirm Hybrid < RISC < CISC (cycle-wise)

**Task 3.2**: Cross-Platform Consistency
- Run benchmark on web simulators
- Verify web results match Logisim results
- Debug any discrepancies
- Document any platform-specific behaviors

**Task 3.3**: User Acceptance Testing
- Test all control buttons (Run/Pause/Reset/Step)
- Test program editability (modify memory values, re-run)
- Test clock speed adjustment
- Verify visual indicators (active components, register updates)

### Phase 4: Documentation

**Task 4.1**: Technical Documentation
- Block diagrams for each architecture (draw.io or Logisim screenshots)
- Datapath diagrams with annotations
- Instruction encoding tables
- Cycle-by-cycle execution traces

**Task 4.2**: Project Report
- Abstract (1 page)
- Problem Statement (1-2 pages)
- Objectives (1 page)
- Methodology (2-3 pages)
- Design/Architecture (5-7 pages with diagrams)
- Implementation Details (5-7 pages)
- Results & Validation (3-4 pages with performance data)
- Limitations (1-2 pages)
- Conclusion (1 page)
- **Deliverable**: `docs/project-report.pdf`

**Task 4.3**: README & Setup Guide
- Project overview
- Prerequisites (Logisim Evolution version, browser requirements)
- Installation instructions
- How to run Logisim circuits
- How to access web demo
- How to modify benchmark program
- **Deliverable**: `README.md`

### Phase 5: Deployment

**Task 5.1**: GitHub Repository Setup
- Create public repository: `hybrid-cpu-architecture`
- Organize file structure (circuits/, web/, docs/, diagrams/)
- Commit all source files
- Add LICENSE (MIT or Academic)
- **Deliverable**: GitHub repo URL

**Task 5.2**: GitHub Pages Deployment
- Configure GitHub Pages (gh-pages branch or /docs folder)
- Deploy web simulator
- Test online access
- Add link to README
- **Deliverable**: Live demo URL

**Task 5.3**: Demonstration Materials
- Record screen video of execution (all three architectures)
- Create GIF of single-step mode
- Take screenshots of performance comparison
- Upload to GitHub wiki or docs/
- **Deliverable**: `demos/` folder

---

## Data Flow & State Management

### Execution State Machine

**States**:
1. **IDLE**: System reset, awaiting input
2. **FETCH**: Retrieve instruction from memory
3. **DECODE**: Interpret instruction, generate control signals
4. **EXECUTE**: Perform operation (ALU, memory access)
5. **WRITEBACK**: Store result to register/memory
6. **HALT**: Execution complete

**Transitions**:
- IDLE → FETCH: User presses Run/Step
- FETCH → DECODE: Instruction loaded into IR
- DECODE → EXECUTE: Control signals generated
- EXECUTE → WRITEBACK: Operation complete
- WRITEBACK → FETCH: Cycle complete, increment PC (unless HALT)
- WRITEBACK → HALT: HALT instruction detected
- HALT → IDLE: User presses Reset

### Memory Management

**Instruction Memory (ROM)**:
- Pre-loaded with benchmark program
- Addressable by PC
- Read-only during execution

**Data Memory (RAM)**:
- Initialized with M[0]=5, M[1]=10, M[2]=15, M[3]=20
- Read/Write during execution
- Final state inspected after HALT

**Register File**:
- Dual-ported (2 read, 1 write per cycle for RISC)
- Synchronous write (on clock edge)
- Asynchronous read (combinational)

---

## Testing Strategy

### Unit Tests (Per Component)

**RISC ALU**:
- Test ADD: 5 + 10 = 15
- Test SUB: 20 - 5 = 15
- Test overflow: 65535 + 1 = 0 (16-bit wrap)

**Register File**:
- Write to R1, read from R1 (verify data)
- Write to R0, read R0 (verify always 0)
- Simultaneous read from R1 and R2

**Memory**:
- Write data, read back (verify persistence)
- Boundary test: address 0x00, 0xFF

**Control Unit**:
- Each instruction opcode → correct control signals
- Verify signal timing (setup/hold)

### Integration Tests

**RISC End-to-End**:
- Load benchmark program
- Execute to HALT
- Verify M[4] = 50
- Verify instruction count = 13
- Verify cycle count = 13

**CISC End-to-End**:
- Load benchmark program (single ADD4 instruction)
- Execute to HALT
- Verify M[4] = 50
- Verify instruction count = 1
- Verify cycle count > RISC

**Hybrid End-to-End**:
- Load benchmark program (single ADD4 instruction)
- Execute to HALT
- Verify M[4] = 50
- Verify instruction count = 1
- Verify cycle count < RISC (CRITICAL TEST)

### Performance Validation

**Comparative Test**:
- Run benchmark on all three architectures
- Record: instructions, cycles, CPI
- Generate comparison table
- Assert: Hybrid cycles < min(RISC cycles, CISC cycles)

---

## Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| **Hybrid doesn't win** | Design translation carefully; ensure micro-op execution is efficient; adjust CISC to be intentionally slower (realistic) |
| **Logisim too complex** | Simplify components; use built-in modules (adder, mux); prioritize web simulator if needed |
| **Web simulator lags** | Optimize rendering (only redraw changed components); use requestAnimationFrame; reduce canvas size |
| **Cross-platform inconsistency** | Define precise specification for cycle counting; document intentional differences |
| **Time constraint** | Prioritize Hybrid implementation; simplify RISC/CISC to minimum viable; cut optional features (charts, animations) |

---

## Acceptance Criteria (Detailed)

### Functional Requirements
- [ ] RISC executes benchmark, outputs M[4]=50, counts correctly
- [ ] CISC executes benchmark, outputs M[4]=50, counts correctly
- [ ] Hybrid executes benchmark, outputs M[4]=50, counts correctly
- [ ] Hybrid cycle count < RISC cycle count
- [ ] Hybrid cycle count < CISC cycle count
- [ ] All control buttons functional (Run/Pause/Reset/Step)
- [ ] Single-step advances exactly one clock cycle
- [ ] Visual indicators show active components

### Documentation Requirements
- [ ] Complete project report (12 sections as specified)
- [ ] Block diagram for each architecture
- [ ] README with setup instructions
- [ ] Video/GIF demonstration

### Deployment Requirements
- [ ] GitHub repository public and organized
- [ ] Web demo accessible via public URL
- [ ] All source files committed (.circ, .html, .js)

---

## Tools & Technologies

### Primary Tools
- **Logisim Evolution**: v3.8.0+ (circuit design)
- **Web Technologies**: HTML5, CSS3, JavaScript (ES6+)
- **Canvas API**: For circuit visualization
- **GitHub**: Version control and hosting
- **GitHub Pages**: Web deployment

### Optional Tools
- **Draw.io**: Block diagrams (alternative: Logisim screenshots)
- **OBS Studio**: Screen recording for demo video
- **FFmpeg**: Video editing/conversion
- **Markdown**: Documentation (README, reports)

---

## Glossary (Expanded)

- **Micro-op (μop)**: Elementary RISC-like operation generated by translating a CISC instruction
- **Translation Unit**: Hardware/logic that converts complex instructions into micro-op sequences
- **Micro-op Queue**: FIFO buffer holding micro-ops awaiting execution
- **Control Signal**: Binary signal that controls datapath components (e.g., ALU_OP, REG_WRITE)
- **Combinational Logic**: Logic gates with no memory/state (output depends only on current inputs)
- **Sequential Logic**: Logic with state (registers, FSMs), output depends on current inputs and past state
- **FSM (Finite State Machine)**: Sequential circuit with defined states and transitions
- **Datapath**: Collection of functional units (ALU, registers, buses) that process data
- **Von Neumann Architecture**: Shared memory for instructions and data (used in all three implementations)

---

## Open Questions (To Be Resolved in Tasks Phase)

1. Exact cycle count for CISC ADD4 instruction (requires FSM design)
2. Translation Unit implementation detail (lookup table vs. hardcoded logic)
3. Web simulator rendering approach (full circuit vs. abstract blocks)
4. Video hosting location (GitHub repo vs. YouTube unlisted)
5. Report format (PDF vs. Markdown vs. both)

---

**Plan Version**: 1.0
**Status**: Ready for task breakdown (sp.tasks)
**Next Step**: Generate actionable task list with dependencies

