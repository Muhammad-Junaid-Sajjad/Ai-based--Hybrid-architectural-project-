# Hybrid Architecture (RISC + CISC) CPU Simulation Project Constitution

## 🎯 PROJECT MISSION

Build a **LIVE, WORKING, INTERACTIVE CPU SIMULATION** that visually proves execution differences between RISC, CISC, and Hybrid architectures. The Hybrid architecture MUST demonstrably win in performance metrics.

**Success Criteria**: A fully functional, university-level Computer Architecture project with live demonstrations, complete documentation, GitHub repository, and online deployment.

---

## 🔴 CORE PRINCIPLES (NON-NEGOTIABLE)

### I. UltraThink Mode (MANDATORY)
**NO ASSUMPTIONS. NO HAND-WAVING. NO SKIPPED LOGIC.**

- Every decision must be justified with beginner-level clarity and expert-level correctness
- No theoretical claims without working proof
- No abstractions without concrete implementations
- Document every design choice, every tradeoff, every architecture decision
- Break down complex concepts into digestible, verifiable steps

### II. Live Simulation First (PRIMARY OBJECTIVE)
**IF IT'S NOT VISIBLE, IT DOESN'T EXIST.**

- Every internal CPU operation MUST be visually observable during execution
- Instruction fetch → decode → execute flow must be traceable in real-time
- Datapath activity, register changes, memory access all visible
- Clock cycles, performance counters shown live
- No black boxes - all micro-operations exposed

### III. Tool Freedom with Results Focus
**USE ANY TOOL NEEDED - ONLY THE WORKING SIMULATION MATTERS.**

- Not limited to Logisim Evolution (though preferred for educational clarity)
- May use: Ripes-like simulators, custom web simulators, visual CPU platforms
- Tool choice justified by: ease of use, visual clarity, demonstration capability
- Must support editable instruction input and program modification
- Must enable side-by-side architecture comparison

### IV. Program Editability (MANDATORY FEATURE)
**SAME PROGRAM, THREE ARCHITECTURES, VISIBLE DIFFERENCES.**

- System MUST accept user-defined instruction sequences
- Default benchmark program provided: Sum M[0] through M[3] → M[4]
- Instructions editable via ROM/RAM or instruction list interface
- Same program executable on RISC, CISC, and Hybrid without circuit redesign
- Re-runnable with modified programs for testing

### V. Hybrid Architecture Superiority (MUST PROVE)
**HYBRID WINS - WITH MEASURABLE EVIDENCE.**

- Hybrid architecture MUST outperform both RISC and CISC
- Victory proven by lower total cycles for same program
- Performance metrics: Instructions Executed, Total Cycles, CPI
- Expected outcome:
  - **RISC**: High instructions, Moderate cycles, Low CPI
  - **CISC**: Low instructions, High cycles, High CPI
  - **Hybrid**: Low instructions, Lowest cycles, Best CPI (WINNER)

### VI. Educational Clarity (DESIGN CONSTRAINT)
**BEGINNER-LEVEL UNDERSTANDING, EXPERT-LEVEL IMPLEMENTATION.**

- Suitable for university Computer Architecture submission
- Clear modular design with labeled components
- Step-by-step execution observable via clock pulses
- No advanced features: no caching, no speculation, no interrupts
- All three architectures use 5-stage pipeline (simplified educational model)
- Focus on fundamental concepts, not production-level complexity

### VII. Complete Documentation (DELIVERABLE REQUIREMENT)
**FROM ABSTRACT TO CONCLUSION - FULL PROJECT REPORT.**

Required documentation structure:
1. **Abstract**: Project summary and objectives
2. **Problem Statement**: Why compare RISC, CISC, Hybrid?
3. **Objectives**: What we aim to prove and why this project?
4. **Methodology**: How we designed and implemented the system
5. **Design/Simulation Architecture**: Block diagrams, datapath, control logic
6. **Implementation Details**: How each architecture works (especially Hybrid)
7. **Features**: Capabilities of the simulation system
8. **Results & Validation**: Performance comparison, benchmark outcomes
9. **Success Evaluation**: Did we achieve our goal? Proof with data.
10. **Limitations**: Known constraints and simplifications
11. **Live Demonstrations**: Screenshots, simulation runs, video links
12. **Conclusion**: Summary of findings and hybrid superiority

### VIII. Public Demonstration (VISIBILITY REQUIREMENT)
**SHOW THE WORLD IT WORKS.**

- Full project hosted on GitHub repository
- Online interactive demo deployed (free hosting: GitHub Pages, Netlify, etc.)
- Live simulation accessible via web browser
- README with clear instructions to run and test
- Video demonstration or GIF showing execution flow
- Project suitable for viva defense and educational showcase

---

## 🏗️ ARCHITECTURE SPECIFICATIONS

### RISC Architecture Requirements
**Load/Store, One Operation Per Instruction, Single Cycle**

**Mandatory Components**:
- Program Counter (PC)
- Instruction Register (IR)
- Register File (minimum 8 registers)
- ALU (ADD operation sufficient for benchmark)
- Control Unit (generates control signals)
- Shared Memory (instruction + data)
- Clock (manual or adjustable speed)
- Cycle Counter (performance metric)

**Characteristics**:
- Fixed instruction format (e.g., 16-bit or 32-bit)
- One instruction = one simple operation
- One instruction executes in one clock cycle (idealized)
- More instructions required to complete tasks
- Example: `LOAD R1, M[0]`, `LOAD R2, M[1]`, `ADD R3, R1, R2`

### CISC Architecture Requirements
**Complex Instructions, Multi-Cycle Execution**

**Mandatory Components**:
- Instruction Decoder (complex)
- Micro-operation Control Sequencer (FSM or microcode)
- Temporary Registers (for intermediate results)
- ALU (same as RISC)
- Memory Interface
- Cycle Counter

**Characteristics**:
- Complex instructions (e.g., `ADD4 M[0], M[1], M[2], M[3] → M[4]`)
- One instruction performs multiple internal operations
- Execution takes multiple clock cycles (must be visible)
- Internal micro-operations shown step-by-step
- Fewer instructions, but slower execution per instruction

### Hybrid Architecture Requirements (INNOVATION - MUST WIN)
**CISC Interface, RISC Execution Core**

**Mandatory Components**:
- Instruction Translation Unit (CISC → RISC micro-ops)
- Micro-operation Queue or Sequencer
- RISC-like Execution Core (simplified datapath)
- Shared Register File
- Shared Memory System
- Performance Monitor (compare against RISC/CISC)

**Characteristics**:
- Accepts CISC-style complex instructions externally
- Internally translates to RISC-style micro-operations
- Executes micro-ops using efficient RISC core
- Best of both worlds: Fewer instructions (like CISC) + Fast execution (like RISC)
- Translation and execution flow MUST be visible in simulation
- **MUST outperform both RISC and CISC in total cycle count**

---

## 📋 SIMULATION REQUIREMENTS

### Live Simulation Controls (MANDATORY)
- **Run / Pause / Reset** buttons
- **Single-step clock execution** (advance one cycle at a time)
- **Adjustable clock speed** (fast/slow modes)
- **Visual indication of**:
  - Current instruction being executed
  - Active datapath (highlight active wires/components)
  - Register updates (show before/after values)
  - Memory access (read/write operations)

### Performance Evaluation (MANDATORY OUTPUT)
After program execution, display:
- **Total Instructions Executed**
- **Total Clock Cycles**
- **CPI (Cycles Per Instruction)**
- **Final Memory Contents** (verify correctness)

Performance comparison table:
```
Architecture | Instructions | Cycles | CPI    | Winner?
-------------|--------------|--------|--------|--------
RISC         | High         | Medium | Low    | No
CISC         | Low          | High   | High   | No
Hybrid       | Low          | Lowest | Best   | YES ✓
```

---

## 🚀 DELIVERABLES CHECKLIST

### Phase 1: Specification & Planning
- [ ] Complete feature specification (sp.specify)
- [ ] Detailed architectural plan (sp.plan)
- [ ] Task breakdown with acceptance criteria (sp.tasks)
- [ ] Architecture Decision Records for key choices

### Phase 2: Implementation
- [ ] RISC architecture fully functional in simulation
- [ ] CISC architecture fully functional in simulation
- [ ] Hybrid architecture fully functional in simulation
- [ ] Program input system working (editable instructions)
- [ ] Default benchmark program executing correctly
- [ ] Performance counters displaying accurate metrics

### Phase 3: Validation & Testing
- [ ] Benchmark program produces correct results on all three architectures
- [ ] Hybrid architecture demonstrably outperforms RISC and CISC
- [ ] All simulation controls working (run/pause/step/reset)
- [ ] Visual indicators functioning (datapath, registers, memory)

### Phase 4: Documentation & Deployment
- [ ] Complete project report (abstract to conclusion)
- [ ] GitHub repository created with clear README
- [ ] Online demo deployed and accessible
- [ ] Live demonstration video or GIF recorded
- [ ] All source files, diagrams, documentation committed

---

## 🛡️ QUALITY GATES

### Code Quality
- Every component must be modular and clearly labeled
- Circuit designs must be logically correct (no race conditions)
- Simulation must be reproducible (same input → same output)

### Educational Quality
- Explanations at beginner level (no assumed advanced knowledge)
- Block diagrams provided for each architecture
- Comments and labels in simulation files

### Demonstration Quality
- Simulation runs smoothly without crashes
- All three architectures executable side-by-side
- Performance differences clearly visible

---

## 📊 SUCCESS METRICS

1. **Functional Success**: All three architectures execute benchmark program correctly
2. **Performance Success**: Hybrid architecture wins with lowest cycle count
3. **Educational Success**: Project suitable for university submission and viva defense
4. **Visibility Success**: Online demo accessible, GitHub repository public
5. **Documentation Success**: Complete project report from abstract to conclusion

---

## ⚠️ CONSTRAINTS & LIMITATIONS

### Educational Scope (Intentional Simplifications)
- No caching mechanisms
- No branch prediction or speculation
- No interrupt handling
- No advanced pipelining (basic 5-stage only)
- No out-of-order execution
- Focus on fundamental CPU operation concepts

### Tool Constraints
- Must use free, accessible tools (Logisim Evolution preferred)
- Must support visual simulation (not just code)
- Must enable beginner-level understanding

### Time Constraints
- Prioritize working simulation over perfect optimization
- Use simplest viable implementation for each component
- Break down into manageable, testable chunks

---

## 🔄 DEVELOPMENT WORKFLOW

### Specification-Driven Development (SDD)
1. **sp.clarify**: Identify underspecified areas, ask clarifying questions
2. **sp.specify**: Create detailed feature specification
3. **sp.plan**: Design implementation architecture with ADRs
4. **sp.tasks**: Generate actionable, dependency-ordered tasks
5. **sp.implement**: Execute all implementation tasks systematically

### Prompt History Records (PHR)
- Create PHR after every major user interaction
- Store in `history/prompts/` with appropriate routing
- Document decisions, implementations, debugging sessions

### Architecture Decision Records (ADR)
- Create ADR for significant architectural choices:
  - Tool selection (Logisim vs alternatives)
  - Instruction format design
  - Hybrid translation mechanism
  - Performance monitoring approach

---

## 🎓 GOVERNANCE

This constitution supersedes all other practices and preferences.

**Amendments require**:
- Documented rationale
- User approval
- Migration plan if affecting existing work

**All implementations must**:
- Verify compliance with core principles
- Prioritize working simulation over theoretical perfection
- Maintain educational clarity at all times

**Ultimate Rule**: If in doubt, prioritize **VISIBLE, WORKING SIMULATION** over everything else.

---

**Version**: 1.0.0 | **Ratified**: 2025-12-23 | **Last Amended**: 2025-12-23
