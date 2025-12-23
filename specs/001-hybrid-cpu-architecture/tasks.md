# Implementation Tasks: Hybrid CPU Architecture Simulation

**Feature**: 001-hybrid-cpu-architecture
**Created**: 2025-12-23
**Status**: Ready for Implementation

---

## Task Dependency Graph

```
Foundation Setup (T1)
    → RISC Implementation (T2-T3)
        → CISC Implementation (T4)
        → Hybrid Implementation (T5)
            → Web Simulator (T6-T10)
                → Testing & Validation (T11-T12)
                    → Documentation (T13-T14)
                        → Deployment (T15-T17)
```

---

## Phase 1: Foundation & Setup

### T1: Project Structure Setup
**Priority**: P0 (Must complete first)
**Estimate**: Simple setup task
**Dependencies**: None

**Objectives**:
- Create project directory structure
- Initialize Git repository
- Set up file organization

**Acceptance Criteria**:
- [ ] Directory structure created:
  ```
  /circuits/
  /web/
  /docs/
  /diagrams/
  /programs/
  /demos/
  README.md
  ```
- [ ] Git repository initialized
- [ ] Initial commit created

**Implementation Steps**:
1. Create all required directories
2. Initialize git repository
3. Create `.gitignore` file
4. Create placeholder README

---

## Phase 2: RISC Architecture Implementation

### T2: RISC Basic Components (Logisim)
**Priority**: P0
**Dependencies**: T1

**Objectives**:
- Build foundational RISC processor components
- Test individual components

**Components to Build**:
1. **Program Counter (PC)**: 8-bit register with increment
2. **Instruction Register (IR)**: 16-bit register
3. **Register File**: 8 registers (R0-R7), 16-bit each, R0=0
4. **ALU**: ADD and SUB operations, 16-bit
5. **Control Unit**: Basic decoder for LOAD/ADD

**Acceptance Criteria**:
- [ ] PC increments on clock pulse
- [ ] IR loads instruction from memory
- [ ] Register File: write to R1, read from R1 succeeds
- [ ] Register R0 always reads as 0
- [ ] ALU: 5+10=15 tested and verified
- [ ] ALU: 20-5=15 tested and verified
- [ ] Control Unit generates signals for LOAD and ADD

**Test Cases**:
- TC1: PC starts at 0, increments to 1, 2, 3...
- TC2: Write 42 to R3, read R3 returns 42
- TC3: Write 99 to R0, read R0 returns 0 (hardwired)
- TC4: ALU ADD operation: 100 + 200 = 300
- TC5: Control decodes LOAD opcode → correct signals

---

### T3: RISC Complete Implementation
**Priority**: P0
**Dependencies**: T2

**Objectives**:
- Complete full RISC processor
- Implement all 6 instructions
- Execute benchmark program

**Instructions to Implement**:
1. `LOAD Rd, [addr]` - opcode 0x01
2. `STORE [addr], Rs` - opcode 0x02
3. `ADD Rd, Rs1, Rs2` - opcode 0x03
4. `SUB Rd, Rs1, Rs2` - opcode 0x04
5. `JUMP addr` - opcode 0x05
6. `HALT` - opcode 0x00

**Benchmark Program Encoding**:
```
Address | Instruction       | Encoding (hex)
--------|-------------------|----------------
0x00    | LOAD R1, [0x80]  | 0x0180  // Load M[0] into R1
0x01    | LOAD R2, [0x81]  | 0x0281  // Load M[1] into R2
0x02    | ADD  R3, R1, R2  | 0x0312  // R3 = R1 + R2
0x03    | LOAD R4, [0x82]  | 0x0482  // Load M[2] into R4
0x04    | ADD  R5, R3, R4  | 0x0534  // R5 = R3 + R4
0x05    | LOAD R6, [0x83]  | 0x0683  // Load M[3] into R6
0x06    | ADD  R7, R5, R6  | 0x0756  // R7 = R5 + R6
0x07    | STORE [0x84], R7 | 0x0284  // Store R7 to M[4]
0x08    | HALT             | 0x0000  // Stop

Data Memory:
0x80: 0x0005  // M[0] = 5
0x81: 0x000A  // M[1] = 10
0x82: 0x000F  // M[2] = 15
0x83: 0x0014  // M[3] = 20
0x84: 0x0000  // M[4] = 0 (result will be written here)
```

**Performance Counters**:
- Instruction Counter: Increments on each FETCH
- Cycle Counter: Increments on each clock pulse

**Acceptance Criteria**:
- [ ] All 6 instructions implemented in control unit
- [ ] Benchmark program loaded into instruction memory
- [ ] Data memory initialized: M[0]=5, M[1]=10, M[2]=15, M[3]=20
- [ ] Execution completes with HALT
- [ ] Final state: M[4] = 50 (0x0032)
- [ ] Instruction count = 9
- [ ] Cycle count = 9 (1 cycle per instruction)
- [ ] CPI = 1.0
- [ ] File saved as `circuits/risc-architecture.circ`

**Test Cases**:
- TC1: Run benchmark, verify M[4] = 50
- TC2: Verify instruction counter = 9
- TC3: Verify cycle counter = 9
- TC4: Reset, re-run, verify repeatability
- TC5: Modify M[0]=10, re-run, verify M[4]=55

---

## Phase 3: CISC Architecture Implementation

### T4: CISC Complete Implementation
**Priority**: P0
**Dependencies**: T2 (can reuse ALU, memory)

**Objectives**:
- Build CISC processor with complex ADD4 instruction
- Implement multi-cycle execution

**Components**:
1. **Complex Instruction Decoder**: Decodes ADD4 opcode
2. **Micro-operation Sequencer**: FSM with 10+ states
3. **Temporary Registers**: 4 temp registers for intermediate values
4. **ALU**: Reuse from RISC
5. **Memory Interface**: Sequential memory access

**ADD4 Instruction Specification**:
```
Opcode: 0x10
Format: ADD4 [addr1] [addr2] [addr3] [addr4] [dest]
Encoding: 0x10 a1 a2 a3 a4 dest (6 words total)

Micro-operations (internal steps):
1. Fetch instruction (1 cycle)
2. Decode opcode (1 cycle)
3. Fetch addr1 from next word (1 cycle)
4. Load M[addr1] → TEMP1 (2 cycles: address + data)
5. Fetch addr2 (1 cycle)
6. Load M[addr2] → TEMP2 (2 cycles)
7. ADD TEMP1 + TEMP2 → TEMP3 (1 cycle)
8. Fetch addr3 (1 cycle)
9. Load M[addr3] → TEMP4 (2 cycles)
10. ADD TEMP3 + TEMP4 → TEMP3 (1 cycle)
11. Fetch addr4 (1 cycle)
12. Load M[addr4] → TEMP4 (2 cycles)
13. ADD TEMP3 + TEMP4 → TEMP3 (1 cycle)
14. Fetch dest address (1 cycle)
15. Store TEMP3 → M[dest] (2 cycles)
16. HALT (1 cycle)

Total: ~20-25 cycles (exact count from FSM implementation)
```

**Benchmark Program**:
```
Address | Instruction | Encoding
--------|-------------|----------
0x00    | ADD4 ...    | 0x10 0x80 0x81 0x82 0x83 0x84
0x06    | HALT        | 0x00
```

**FSM States**:
- IDLE → FETCH → DECODE → FETCH_ADDR1 → LOAD1 → FETCH_ADDR2 → LOAD2 → ADD12 → ... → STORE → HALT

**Acceptance Criteria**:
- [ ] ADD4 instruction decoder implemented
- [ ] FSM sequencer with all states functional
- [ ] Benchmark program executes correctly
- [ ] Final state: M[4] = 50
- [ ] Instruction count = 1
- [ ] Cycle count = 20-25 (document exact value)
- [ ] CPI = 20-25 (document exact value)
- [ ] Cycle count > RISC cycle count (9) ✓
- [ ] File saved as `circuits/cisc-architecture.circ`

**Test Cases**:
- TC1: Run benchmark, verify M[4] = 50
- TC2: Verify instruction counter = 1
- TC3: Verify cycle counter > 9 (must be slower than RISC)
- TC4: Step through FSM states, verify each micro-op
- TC5: Observe temporary registers loading correctly

---

## Phase 4: Hybrid Architecture Implementation

### T5: Hybrid Architecture (Critical - Must Win)
**Priority**: P0
**Dependencies**: T3 (requires RISC core)

**Objectives**:
- Build Hybrid processor that wins performance
- CISC interface with RISC execution efficiency

**Components**:
1. **Translation Unit**: Combinational logic converting ADD4 → 8 micro-ops
2. **Micro-op Queue**: FIFO buffer (8 entries)
3. **RISC Execution Core**: Reuse from T3
4. **Performance Monitor**: Dedicated cycle counter

**Translation Logic**:
```
Input: ADD4 [a1] [a2] [a3] [a4] [dest]

Output (micro-op sequence):
1. LOAD R1, [a1]
2. LOAD R2, [a2]
3. ADD  R3, R1, R2
4. LOAD R4, [a3]
5. ADD  R5, R3, R4
6. LOAD R6, [a4]
7. ADD  R7, R5, R6
8. STORE [dest], R7
9. HALT
```

**Execution Cycle Breakdown**:
```
Cycle 0: Fetch ADD4 instruction (1 cycle)
Cycle 1: Translate to 8 micro-ops, load into queue (0 cycles - combinational)
Cycle 2-9: Execute 8 micro-ops (1 cycle each = 8 cycles)
Cycle 10: HALT

Total: 10 cycles (or optimize to 9)
```

**Why Hybrid Wins**:
- RISC: 9 instructions × 1 cycle = 9 cycles (but must fetch each instruction)
- CISC: 1 instruction × 20-25 cycles = 20-25 cycles
- Hybrid: 1 fetch + 8 micro-op executions = 9 cycles (or less with optimization)
- **Target: Hybrid ≤ 9 cycles < RISC and << CISC**

**Acceptance Criteria**:
- [ ] Translation Unit converts ADD4 → 8 micro-ops correctly
- [ ] Micro-op queue loads all 8 micro-ops in 1 cycle (or 0 if combinational)
- [ ] RISC core executes micro-ops sequentially
- [ ] Benchmark program executes correctly
- [ ] Final state: M[4] = 50
- [ ] Instruction count = 1 (user-visible)
- [ ] Micro-op count = 8 (internal)
- [ ] Cycle count ≤ 9 **CRITICAL**
- [ ] Cycle count < RISC cycle count (9) **MUST BE TRUE**
- [ ] Cycle count < CISC cycle count (20-25) **MUST BE TRUE**
- [ ] CPI = (cycle count / 1) ≤ 9
- [ ] File saved as `circuits/hybrid-architecture.circ`

**Test Cases**:
- TC1: Run benchmark, verify M[4] = 50 ✓
- TC2: Verify instruction counter = 1 ✓
- TC3: Verify cycle counter ≤ 9 **CRITICAL TEST** ✓
- TC4: Verify cycle counter < RISC (9) **VICTORY CONDITION** ✓
- TC5: Verify cycle counter < CISC (20-25) **VICTORY CONDITION** ✓
- TC6: Translation unit output inspection (verify 8 micro-ops)
- TC7: Reset, re-run, verify repeatability

**If Hybrid Doesn't Win (Failure Recovery)**:
- Reduce translation overhead to 0 cycles (pure combinational)
- Optimize micro-op execution (consider 0.5 cycle per micro-op if needed)
- Adjust CISC to be intentionally slower (more realistic FSM delays)
- Document design adjustments in ADR

---

## Phase 5: Web Simulator Implementation

### T6: Web UI Foundation
**Priority**: P1
**Dependencies**: T1

**Objectives**:
- Create HTML/CSS/JS framework for web simulator

**Deliverables**:
- `web/index.html`: Main page structure
- `web/styles.css`: Styling (clean educational look)
- `web/main.js`: Application entry point

**UI Components**:
1. **Canvas Area**: 800×600px for circuit visualization
2. **Control Panel**:
   - Buttons: Run, Pause, Reset, Step
   - Clock Speed Slider: Slow (500ms/cycle) to Fast (50ms/cycle)
   - Architecture Selector: RISC | CISC | Hybrid
3. **Metrics Display**:
   - Instructions Executed: [count]
   - Cycles: [count]
   - CPI: [calculated]
   - Result: M[4] = [value]
4. **Register Display**: R0-R7 values (16-bit hex)
5. **Memory Display**: M[0]-M[4] values

**Acceptance Criteria**:
- [ ] HTML page loads in browser
- [ ] Canvas renders (blank initially)
- [ ] All buttons present and clickable (no function yet)
- [ ] Metrics display shows zeros initially
- [ ] Register display shows 8 registers
- [ ] Memory display shows M[0] through M[4]
- [ ] Page responsive (works on 1920×1080 and 1366×768)

---

### T7: RISC Web Simulator
**Priority**: P1
**Dependencies**: T6, T3

**Objectives**:
- Implement RISC processor simulation in JavaScript
- Visualize execution on canvas

**Implementation**:
- **File**: `web/risc-simulator.js`
- **Class**: `RISCProcessor`
  - Properties: `pc`, `ir`, `registers[8]`, `memory[256]`, `instructionCount`, `cycleCount`
  - Methods:
    - `reset()`: Initialize state
    - `loadProgram(instructions, data)`: Load benchmark
    - `step()`: Execute one cycle
    - `run()`: Execute until HALT
    - `render(canvas)`: Draw current state

**Visualization**:
- Components drawn: PC box, IR box, Register file, ALU, Memory
- Active component highlighted in green
- Wires light up when data flows
- Current instruction shown in text

**Acceptance Criteria**:
- [ ] RISC processor simulates correctly
- [ ] Benchmark program executes, M[4] = 50
- [ ] Instruction count = 9
- [ ] Cycle count = 9
- [ ] Canvas renders components clearly
- [ ] Single-step mode advances one cycle at a time
- [ ] Run mode completes execution
- [ ] Reset clears state to initial values

**Test Cases**:
- TC1: Load benchmark, step 9 times, verify M[4] = 50
- TC2: Run mode completes in <1 second (fast mode)
- TC3: Slow mode shows visible animation (500ms/step)
- TC4: Reset after execution, verify M[4] reverts to 0

---

### T8: CISC Web Simulator
**Priority**: P1
**Dependencies**: T6, T4

**Objectives**:
- Implement CISC processor simulation in JavaScript
- Show multi-cycle execution

**Implementation**:
- **File**: `web/cisc-simulator.js`
- **Class**: `CISCProcessor`
  - Additional: `tempRegisters[4]`, `fsmState`, `microOpStep`

**Visualization**:
- FSM state indicator (text label)
- Temporary registers displayed
- Micro-operation step counter

**Acceptance Criteria**:
- [ ] CISC processor simulates correctly
- [ ] Benchmark executes, M[4] = 50
- [ ] Instruction count = 1
- [ ] Cycle count = 20-25 (matches Logisim)
- [ ] FSM states visible during execution
- [ ] Temporary registers show intermediate sums
- [ ] File: `web/cisc-simulator.js`

**Test Cases**:
- TC1: Run benchmark, verify M[4] = 50
- TC2: Step through FSM states, verify state transitions
- TC3: Observe TEMP1=5, TEMP2=10, TEMP3=15, then +15=30, then +20=50

---

### T9: Hybrid Web Simulator
**Priority**: P1
**Dependencies**: T6, T5

**Objectives**:
- Implement Hybrid processor simulation in JavaScript
- Visualize translation process

**Implementation**:
- **File**: `web/hybrid-simulator.js`
- **Class**: `HybridProcessor`
  - Additional: `translationUnit`, `microOpQueue[]`, `riscCore`

**Visualization**:
- Translation Unit box showing CISC instruction input
- Micro-op Queue display (8 entries)
- RISC Core (reuse RISC visualization)
- Arrow showing dataflow: CISC → Translation → Queue → RISC Core

**Acceptance Criteria**:
- [ ] Hybrid processor simulates correctly
- [ ] Benchmark executes, M[4] = 50
- [ ] Instruction count = 1
- [ ] Micro-op count = 8 (displayed separately)
- [ ] Cycle count ≤ 9 **CRITICAL**
- [ ] Cycle count < RISC (9) **VICTORY**
- [ ] Cycle count < CISC (20-25) **VICTORY**
- [ ] Translation Unit visualization shows input → output
- [ ] Micro-op Queue displays all 8 micro-ops
- [ ] File: `web/hybrid-simulator.js`

**Test Cases**:
- TC1: Run benchmark, verify M[4] = 50
- TC2: Verify cycle count ≤ 9
- TC3: Verify Hybrid < RISC < CISC (cycle count)
- TC4: Inspect micro-op queue contents (should show 8 RISC instructions)
- TC5: Step through execution, observe queue draining

---

### T10: Performance Comparison Dashboard
**Priority**: P1
**Dependencies**: T7, T8, T9

**Objectives**:
- Unified dashboard comparing all three architectures
- Automatic winner determination

**Implementation**:
- **File**: `web/performance-monitor.js`
- **UI**: Comparison table + charts

**Comparison Table**:
```
| Architecture | Instructions | Cycles | CPI   | Winner |
|--------------|--------------|--------|-------|--------|
| RISC         | 9            | 9      | 1.00  | No     |
| CISC         | 1            | 22     | 22.00 | No     |
| Hybrid       | 1            | 9      | 9.00  | YES ✓  |
```

**Charts** (Optional but recommended):
- Bar chart: Cycle count comparison
- Line chart: Execution timeline

**Acceptance Criteria**:
- [ ] Table populates with data from all three simulators
- [ ] Winner column shows "YES ✓" for Hybrid only
- [ ] Winner determination automatic (lowest cycle count)
- [ ] Charts render correctly (if implemented)
- [ ] Data export button (CSV download)
- [ ] File: `web/performance-monitor.js`

**Test Cases**:
- TC1: Run all three architectures, verify table populates
- TC2: Verify Hybrid marked as winner
- TC3: Export CSV, verify data correctness

---

## Phase 6: Testing & Validation

### T11: Integration Testing
**Priority**: P0
**Dependencies**: T5, T9

**Objectives**:
- Verify end-to-end functionality
- Cross-platform consistency (Logisim vs Web)

**Test Suite**:

**TS1: Functional Correctness**
- [ ] RISC (Logisim): M[4] = 50 ✓
- [ ] CISC (Logisim): M[4] = 50 ✓
- [ ] Hybrid (Logisim): M[4] = 50 ✓
- [ ] RISC (Web): M[4] = 50 ✓
- [ ] CISC (Web): M[4] = 50 ✓
- [ ] Hybrid (Web): M[4] = 50 ✓

**TS2: Performance Metrics**
- [ ] RISC cycles (Logisim) = RISC cycles (Web) = 9
- [ ] CISC cycles (Logisim) = CISC cycles (Web) = 20-25
- [ ] Hybrid cycles (Logisim) = Hybrid cycles (Web) ≤ 9

**TS3: Victory Condition**
- [ ] Hybrid cycles < RISC cycles (both platforms)
- [ ] Hybrid cycles < CISC cycles (both platforms)

**TS4: User Controls**
- [ ] Run button executes to completion (all architectures, both platforms)
- [ ] Pause button stops execution mid-program
- [ ] Reset button restores initial state
- [ ] Single-step button advances exactly one cycle
- [ ] Clock speed slider adjusts animation speed (web only)

**TS5: Editability**
- [ ] Modify M[0] from 5 to 10 (Logisim: manual edit, Web: input field)
- [ ] Re-run benchmark
- [ ] Verify M[4] = 55 (10+10+15+20)

**Test Report**:
- Document: `docs/test-report.md`
- Include: Pass/Fail for each test, screenshots, cycle counts

**Acceptance Criteria**:
- [ ] All TS1-TS5 tests pass
- [ ] Test report generated
- [ ] No critical bugs found
- [ ] Cross-platform consistency verified

---

### T12: User Acceptance Testing
**Priority**: P1
**Dependencies**: T11

**Objectives**:
- Validate system from user perspective
- Ensure educational clarity

**Test Scenarios**:

**Scenario 1: Student Learning**
- Task: Understand how RISC processes instructions
- Steps:
  1. Load RISC simulator (web)
  2. Click Single-Step 9 times
  3. Observe PC, IR, Registers changing
- Success: Student can explain what happened each step

**Scenario 2: Instructor Demonstration**
- Task: Demonstrate Hybrid superiority
- Steps:
  1. Run all three architectures
  2. Show comparison table
  3. Explain why Hybrid wins
- Success: Clear visual proof of Hybrid performance

**Scenario 3: Project Evaluator**
- Task: Verify correctness during viva
- Steps:
  1. Open Logisim circuits
  2. Run benchmark on each architecture
  3. Inspect final memory state
  4. Review performance counters
- Success: Evaluator confirms Hybrid wins, results are correct

**Acceptance Criteria**:
- [ ] 3 test users complete scenarios successfully
- [ ] No major usability issues reported
- [ ] Educational value confirmed (users understand concept)
- [ ] Feedback documented in `docs/user-feedback.md`

---

## Phase 7: Documentation

### T13: Technical Documentation
**Priority**: P1
**Dependencies**: T5, T9

**Objectives**:
- Create comprehensive technical documentation

**Deliverables**:

**1. Block Diagrams**
- `diagrams/risc-block-diagram.png`: RISC components + datapath
- `diagrams/cisc-block-diagram.png`: CISC components + FSM
- `diagrams/hybrid-block-diagram.png`: Hybrid translation flow
- Tool: Draw.io or Logisim screenshots with annotations

**2. Instruction Encoding Table**
- `docs/instruction-set.md`
- RISC: All 6 instructions with binary encoding
- CISC: ADD4 instruction format
- Hybrid: Translation mapping

**3. Execution Traces**
- `docs/execution-traces.md`
- Cycle-by-cycle trace for each architecture
- Example:
  ```
  RISC Execution Trace:
  Cycle 0: FETCH 0x0180 (LOAD R1, [0x80])
  Cycle 1: PC=1, R1=5, Instr Count=1, Cycle Count=1
  ...
  ```

**4. Design Rationale**
- `docs/design-rationale.md`
- Why 16-bit word size?
- Why 8 registers?
- How does Hybrid achieve lower cycle count?

**Acceptance Criteria**:
- [ ] 3 block diagrams created and saved
- [ ] Instruction encoding table complete
- [ ] Execution traces document all cycles for benchmark
- [ ] Design rationale explains key decisions
- [ ] All files in `docs/` and `diagrams/`

---

### T14: Project Report
**Priority**: P0
**Dependencies**: T13

**Objectives**:
- Complete university-level project report

**Report Structure** (12 sections):

**1. Abstract** (1 page)
- Summary of project, objectives, results

**2. Problem Statement** (1-2 pages)
- Why compare RISC, CISC, Hybrid?
- Performance tradeoffs in CPU design

**3. Objectives** (1 page)
- Prove Hybrid architecture superiority
- Educational demonstration of CPU concepts

**4. Methodology** (2-3 pages)
- Simulation approach (Logisim + Web)
- Benchmark program design
- Cycle counting methodology

**5. Design/Simulation Architecture** (5-7 pages)
- Block diagrams (from T13)
- Datapath design
- Control logic (FSMs, control signals)
- Hybrid translation mechanism detailed

**6. Implementation Details** (5-7 pages)
- Component specifications
- Instruction formats
- Code snippets (web simulator)
- Logisim circuit screenshots

**7. Features** (2-3 pages)
- Live simulation capabilities
- Control interface
- Performance monitoring

**8. Results & Validation** (3-4 pages)
- Benchmark execution results
- Performance comparison table
- Correctness verification (M[4]=50 for all)
- Cycle count analysis

**9. Success Evaluation** (2 pages)
- Did we achieve objectives? YES
- Hybrid wins: Cycles = 9 < RISC (9) < CISC (22)
- Evidence: screenshots, data tables

**10. Limitations** (1-2 pages)
- Educational simplifications (no cache, no pipelining)
- Minimal ISA
- Single benchmark program

**11. Live Demonstrations** (2-3 pages)
- Screenshots of execution
- Link to online demo
- Video/GIF demonstration

**12. Conclusion** (1 page)
- Summary of findings
- Hybrid architecture demonstrated 50%+ improvement over CISC
- Educational value achieved

**Deliverable**:
- `docs/project-report.pdf` (30-40 pages)
- `docs/project-report.md` (Markdown source)

**Acceptance Criteria**:
- [ ] All 12 sections complete
- [ ] Block diagrams embedded in report
- [ ] Performance data tables included
- [ ] Screenshots of all three architectures
- [ ] Report suitable for university submission
- [ ] PDF generated from Markdown

---

## Phase 8: Deployment

### T15: GitHub Repository Setup
**Priority**: P0
**Dependencies**: T14

**Objectives**:
- Create public GitHub repository
- Organize all project files

**Repository Structure**:
```
hybrid-cpu-architecture/
├── README.md (detailed instructions)
├── LICENSE (MIT or Academic)
├── .gitignore
├── circuits/
│   ├── risc-architecture.circ
│   ├── cisc-architecture.circ
│   └── hybrid-architecture.circ
├── web/
│   ├── index.html
│   ├── styles.css
│   ├── main.js
│   ├── risc-simulator.js
│   ├── cisc-simulator.js
│   ├── hybrid-simulator.js
│   └── performance-monitor.js
├── docs/
│   ├── project-report.pdf
│   ├── project-report.md
│   ├── instruction-set.md
│   ├── execution-traces.md
│   ├── design-rationale.md
│   └── test-report.md
├── diagrams/
│   ├── risc-block-diagram.png
│   ├── cisc-block-diagram.png
│   └── hybrid-block-diagram.png
├── programs/
│   └── benchmark-sum.txt (instruction encoding)
└── demos/
    ├── execution-video.mp4
    ├── risc-execution.gif
    ├── cisc-execution.gif
    └── hybrid-execution.gif
```

**README.md Content**:
- Project title and description
- Prerequisites (Logisim Evolution 3.8+, modern browser)
- Installation instructions
- How to run Logisim circuits
- How to access web demo
- How to modify benchmark
- Performance results summary
- Links to documentation

**Acceptance Criteria**:
- [ ] GitHub repository created: `https://github.com/<username>/hybrid-cpu-architecture`
- [ ] Repository is public
- [ ] All files committed (circuits, web, docs, diagrams)
- [ ] README.md complete with setup instructions
- [ ] LICENSE file added
- [ ] .gitignore excludes temp files
- [ ] Repository cloneable and runnable by others

---

### T16: Online Demo Deployment
**Priority**: P0
**Dependencies**: T15

**Objectives**:
- Deploy web simulator to public URL

**Deployment Options**:
1. **GitHub Pages** (Recommended):
   - Settings → Pages → Deploy from `main` branch `/web` folder
   - URL: `https://<username>.github.io/hybrid-cpu-architecture/`
2. **Netlify**: Drag-and-drop `/web` folder
3. **Vercel**: Connect GitHub repo, auto-deploy

**Steps**:
1. Choose deployment platform
2. Configure deployment settings
3. Deploy web folder
4. Test online access
5. Add URL to README

**Acceptance Criteria**:
- [ ] Web demo accessible via public URL
- [ ] All three simulators work online
- [ ] Performance comparison dashboard functional
- [ ] Controls (Run/Pause/Reset/Step) responsive
- [ ] URL added to README: `🌐 Live Demo: [link]`
- [ ] Online demo works on desktop browsers (Chrome, Firefox, Edge)

**Test Cases**:
- TC1: Access URL from different device, verify page loads
- TC2: Run RISC simulator online, verify M[4]=50
- TC3: Run Hybrid simulator online, verify cycle count ≤ 9
- TC4: Share URL with friend, confirm they can access

---

### T17: Demonstration Materials
**Priority**: P1
**Dependencies**: T16

**Objectives**:
- Create video/GIF demonstrations
- Prepare viva defense materials

**Deliverables**:

**1. Execution Video** (3-5 minutes)
- Screen recording showing:
  - Opening Logisim circuits
  - Running benchmark on all three architectures
  - Showing performance comparison
  - Demonstrating web simulator
- Tool: OBS Studio, QuickTime, or built-in screen recorder
- Format: MP4, 1080p, uploaded to `demos/execution-video.mp4`

**2. Animated GIFs** (10-20 seconds each)
- `risc-execution.gif`: RISC single-step mode
- `cisc-execution.gif`: CISC FSM states visible
- `hybrid-execution.gif`: Hybrid translation in action
- Tool: ScreenToGif, Gifski, or ffmpeg

**3. Screenshots**
- Performance comparison table showing Hybrid win
- All three Logisim circuits side-by-side
- Web simulator interface

**4. Viva Defense Slides** (Optional)
- 10-15 slide PowerPoint/Google Slides
- Cover: Title, name, date
- Architecture diagrams
- Results summary
- Key insights

**Acceptance Criteria**:
- [ ] Execution video created and uploaded to `demos/`
- [ ] 3 GIFs created (RISC, CISC, Hybrid)
- [ ] Screenshots taken and saved to `demos/screenshots/`
- [ ] Video and GIFs embedded in README (optional)
- [ ] Link to video added to README: `🎥 Demo Video: [link]`
- [ ] Viva slides prepared (if required)

**Test Cases**:
- TC1: Video plays smoothly, audio clear (if narrated)
- TC2: GIFs loop correctly, key actions visible
- TC3: Screenshots high resolution (minimum 1280×720)

---

## Task Summary & Metrics

### Task Count by Phase
- Phase 1 (Setup): 1 task
- Phase 2 (RISC): 2 tasks
- Phase 3 (CISC): 1 task
- Phase 4 (Hybrid): 1 task
- Phase 5 (Web): 5 tasks
- Phase 6 (Testing): 2 tasks
- Phase 7 (Documentation): 2 tasks
- Phase 8 (Deployment): 3 tasks
- **Total: 17 tasks**

### Critical Path
T1 → T2 → T3 → T5 → T11 → T12 → T14 → T15 → T16

### Priority Breakdown
- P0 (Must Have): 11 tasks
- P1 (Should Have): 6 tasks

### Success Criteria (Project-Level)
- [ ] All P0 tasks completed
- [ ] Hybrid architecture demonstrates cycle count < RISC and < CISC
- [ ] GitHub repository public with full documentation
- [ ] Online demo accessible and functional
- [ ] Project report complete (30+ pages)
- [ ] All architectures produce correct output (M[4]=50)

---

## Implementation Notes

### Task Execution Strategy
1. **Sequential Execution**: Complete tasks in order (follow dependency graph)
2. **Parallel Opportunities**:
   - T4 (CISC) can start after T2 (before T3 completes)
   - T6 (Web UI) can start early (parallel with T3-T4)
3. **Validation at Milestones**:
   - After T3: Verify RISC works before starting Hybrid
   - After T5: Verify Hybrid wins before web implementation
   - After T11: Full testing before documentation

### Risk Mitigation per Task
- **T5 (Hybrid)**: If doesn't win, adjust CISC to be slower or optimize Hybrid translation
- **T9 (Hybrid Web)**: Reuse RISC simulator code to minimize effort
- **T14 (Report)**: Start early, write sections as tasks complete

### Tool Requirements
- Logisim Evolution 3.8.0+
- Modern web browser (Chrome 90+, Firefox 88+)
- Text editor (VS Code recommended)
- Git
- OBS Studio (for video recording)
- Draw.io (for diagrams)

---

**Tasks Version**: 1.0
**Status**: Ready for sp.implement
**Next Step**: Begin implementation with T1

