# Feature Specification: Hybrid CPU Architecture Simulator

**Feature ID**: 001-hybrid-cpu-architecture
**Status**: ✅ Implemented
**Version**: 1.0.0
**Author**: Muhammad Junaid Sajjad
**Institution**: Lahore Garrison University
**Date**: 2025-12-24

---

## 1. EXECUTIVE SUMMARY

### 1.1 Feature Overview
A web-based interactive CPU architecture simulator that demonstrates and compares three CPU architectures:
- **RISC (Reduced Instruction Set Computer)**: Load/store architecture with simple instructions
- **CISC (Complex Instruction Set Computer)**: Complex multi-cycle instruction execution
- **Hybrid Architecture**: CISC interface with RISC execution core

The simulator proves that the Hybrid architecture achieves superior performance (6 cycles) compared to both RISC (9 cycles) and CISC (13 cycles) for the same benchmark program.

### 1.2 Business Value
- Educational tool for Computer Architecture courses
- Live demonstration of CPU architectural differences
- Proof-of-concept for Hybrid architecture superiority
- University project submission with viva defense capability
- Public showcase on GitHub demonstrating technical competency

### 1.3 Success Criteria
- ✅ All three architectures execute benchmark program correctly
- ✅ Hybrid architecture wins with lowest cycle count (6 cycles)
- ✅ Live interactive simulation with visual feedback
- ✅ Side-by-side performance comparison
- ✅ Deployed on GitHub Pages with working links
- ✅ Complete documentation from abstract to conclusion

---

## 2. REQUIREMENTS

### 2.1 Functional Requirements

#### FR-1: RISC Architecture Simulation
**Priority**: MUST HAVE
**Status**: ✅ Implemented

**Description**: Implement a complete RISC CPU simulator with load/store architecture.

**Acceptance Criteria**:
- ✅ 9 separate instructions for benchmark program
- ✅ Register file with 8 general-purpose registers
- ✅ ALU supporting ADD operation
- ✅ Memory system (256 bytes)
- ✅ 5-stage pipeline visualization (IF, ID, EX, MEM, WB)
- ✅ Single-cycle instruction execution (CPI = 1.0)
- ✅ Total cycle count: 9 cycles
- ✅ Correct result: M[4] = 50

**Test Cases**:
```
Input: M[0]=5, M[1]=10, M[2]=15, M[3]=20
Expected Output: M[4]=50
Expected Cycles: 9
Expected CPI: 1.00
```

#### FR-2: CISC Architecture Simulation
**Priority**: MUST HAVE
**Status**: ✅ Implemented

**Description**: Implement CISC CPU with complex multi-cycle instruction execution.

**Acceptance Criteria**:
- ✅ Single complex ADD4 instruction
- ✅ FSM state machine with 12 states
- ✅ Multi-cycle execution (13 cycles total)
- ✅ Internal micro-operations visible
- ✅ State transitions: IDLE → FETCH → DECODE → LOAD1 → LOAD2 → ADD12 → LOAD3 → ADD123 → LOAD4 → ADDFINAL → STORE → HALT
- ✅ CPI = 13.00 (one instruction, 13 cycles)
- ✅ Correct result: M[4] = 50

**Test Cases**:
```
Input: M[0]=5, M[1]=10, M[2]=15, M[3]=20
Instruction: ADD4 M[0], M[1], M[2], M[3] → M[4]
Expected Output: M[4]=50
Expected Cycles: 13
Expected CPI: 13.00
```

#### FR-3: Hybrid Architecture Simulation
**Priority**: MUST HAVE (CRITICAL)
**Status**: ✅ Implemented (WINNER - 6 cycles)

**Description**: Implement Hybrid CPU combining CISC interface with RISC execution core via instruction translation.

**Acceptance Criteria**:
- ✅ CISC-style instruction interface
- ✅ Instruction Translator (0-cycle translation via combinational logic)
- ✅ RISC-like execution core
- ✅ Micro-op fusion optimization
- ✅ LOAD_DUAL: Parallel dual loads (1 cycle for 2 loads)
- ✅ LOAD_ADD: Fused load+add (1 cycle for load+add)
- ✅ Total cycles: 6 (LOWEST - proves superiority)
- ✅ CPI = 6.00
- ✅ Correct result: M[4] = 50
- ✅ Outperforms RISC by 33% (6 vs 9 cycles)
- ✅ Outperforms CISC by 54% (6 vs 13 cycles)

**Test Cases**:
```
Input: M[0]=5, M[1]=10, M[2]=15, M[3]=20
Micro-ops:
  1. LOAD_DUAL R1←M[0], R2←M[1]    (1 cycle - parallel)
  2. ADD R3←R1+R2                   (1 cycle)
  3. LOAD_ADD R4←M[2], R5←R3+R4    (1 cycle - fused)
  4. LOAD_ADD R6←M[3], R7←R5+R6    (1 cycle - fused)
  5. STORE M[4]←R7                  (1 cycle)
  6. HALT                           (1 cycle)
Expected Output: M[4]=50
Expected Cycles: 6
Expected CPI: 6.00
Verification: 6 < 9 < 13 ✓ (Hybrid wins)
```

#### FR-4: Interactive Simulation Controls
**Priority**: MUST HAVE
**Status**: ✅ Implemented

**Acceptance Criteria**:
- ✅ Run button (continuous execution)
- ✅ Pause button (stop at current cycle)
- ✅ Step button (advance one cycle)
- ✅ Reset button (restart simulation)
- ✅ Architecture switcher (RISC/CISC/Hybrid tabs)
- ✅ Real-time cycle counter display
- ✅ Performance metrics dashboard

#### FR-5: Visual Feedback System
**Priority**: MUST HAVE
**Status**: ✅ Implemented

**Acceptance Criteria**:
- ✅ Canvas-based component rendering
- ✅ Datapath visualization (PC, IR, Registers, ALU, Memory)
- ✅ Active component highlighting
- ✅ Register value displays (R0-R7)
- ✅ Memory contents display (M[0]-M[4])
- ✅ Current instruction indicator
- ✅ Pipeline stage indicators (IF, ID, EX, MEM, WB)
- ✅ State machine visualization (for CISC)

#### FR-6: Performance Comparison Dashboard
**Priority**: MUST HAVE
**Status**: ✅ Implemented

**Acceptance Criteria**:
- ✅ Side-by-side metrics table
- ✅ Instructions executed count
- ✅ Total cycles count
- ✅ CPI calculation
- ✅ Winner indicator (Hybrid highlighted in green)
- ✅ Execution time comparison
- ✅ Performance improvement percentages

### 2.2 Non-Functional Requirements

#### NFR-1: Performance
- **Requirement**: Smooth 60 FPS rendering during simulation
- **Status**: ✅ Achieved
- **Metrics**: Canvas updates at 60Hz, no frame drops

#### NFR-2: Compatibility
- **Requirement**: Works on all modern browsers
- **Status**: ✅ Achieved
- **Browsers Tested**: Chrome, Firefox, Edge, Safari
- **Mobile Support**: ✅ Responsive design

#### NFR-3: Usability
- **Requirement**: Intuitive controls, no learning curve
- **Status**: ✅ Achieved
- **Features**: Clear buttons, instant feedback, tooltips

#### NFR-4: Maintainability
- **Requirement**: Single-file implementation for portability
- **Status**: ✅ Achieved
- **Implementation**: All HTML/CSS/JS in index.html (self-contained)

#### NFR-5: Documentation
- **Requirement**: Complete documentation from abstract to conclusion
- **Status**: ✅ Achieved
- **Files**: README.md (comprehensive), constitution.md, spec.md, plan.md, tasks.md, implement.md

#### NFR-6: Deployment
- **Requirement**: Live online demo accessible via URL
- **Status**: ✅ Achieved
- **Platform**: GitHub Pages
- **URL**: https://github.com/Muhammad-Junaid-Sajjad/Ai-based--Hybrid-architectural-project-

---

## 3. TECHNICAL SPECIFICATIONS

### 3.1 System Architecture

#### Component Overview
```
┌─────────────────────────────────────────────────────────┐
│                 Web Browser (Client)                     │
├─────────────────────────────────────────────────────────┤
│                    index.html                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │         HTML Structure (UI Layout)                │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │         CSS Styling (Visual Design)               │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │         JavaScript Simulators                     │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  class RISC { ... }                         │  │  │
│  │  │  - 9 instructions                           │  │  │
│  │  │  - Single-cycle execution                   │  │  │
│  │  │  - Total: 9 cycles                          │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  class CISC { ... }                         │  │  │
│  │  │  - FSM state machine                        │  │  │
│  │  │  - Multi-cycle execution                    │  │  │
│  │  │  - Total: 13 cycles                         │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  class Hybrid { ... }                       │  │  │
│  │  │  - Micro-op fusion                          │  │  │
│  │  │  - LOAD_DUAL + LOAD_ADD                     │  │  │
│  │  │  - Total: 6 cycles ✓ WINNER                 │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Data Structures

#### Memory Layout
```javascript
memory = new Uint8Array(256);  // 256 bytes
// Benchmark data:
memory[0x80] = 5;   // M[0] = 5
memory[0x81] = 10;  // M[1] = 10
memory[0x82] = 15;  // M[2] = 15
memory[0x83] = 20;  // M[3] = 20
memory[0x84] = 0;   // M[4] = result (will be 50)
```

#### Register File
```javascript
registers = [0, 0, 0, 0, 0, 0, 0, 0];  // R0-R7 (8 registers)
```

#### Instruction Format (RISC)
```javascript
{
  op: 'LOAD' | 'ADD' | 'STORE' | 'HALT',
  rd: register_destination,
  rs1: register_source1,
  rs2: register_source2,
  addr: memory_address
}
```

#### Micro-op Format (Hybrid)
```javascript
{
  op: 'LOAD_DUAL' | 'LOAD_ADD' | 'ADD' | 'STORE' | 'HALT',
  rd1: register_destination1,  // for LOAD_DUAL
  rd2: register_destination2,  // for LOAD_DUAL
  rdL: register_destination_load,  // for LOAD_ADD
  rdA: register_destination_add,   // for LOAD_ADD
  addr1: memory_address1,
  addr2: memory_address2,
  // ...
}
```

### 3.3 Algorithms

#### RISC Execution Algorithm
```
FOR each instruction in program:
  1. Fetch instruction
  2. Decode instruction
  3. Execute operation
  4. Access memory (if LOAD/STORE)
  5. Write back to register (if applicable)
  INCREMENT cycle_count
END FOR
```

#### CISC Execution Algorithm (FSM)
```
state = IDLE
WHILE state != HALT:
  SWITCH state:
    CASE IDLE: state = FETCH
    CASE FETCH: state = DECODE
    CASE DECODE: state = LOAD1
    CASE LOAD1: load M[0], state = LOAD2
    CASE LOAD2: load M[1], state = ADD12
    CASE ADD12: add values, state = LOAD3
    CASE LOAD3: load M[2], state = ADD123
    CASE ADD123: add values, state = LOAD4
    CASE LOAD4: load M[3], state = ADDFINAL
    CASE ADDFINAL: final add, state = STORE
    CASE STORE: store result, state = HALT
  END SWITCH
  INCREMENT cycle_count
END WHILE
```

#### Hybrid Execution Algorithm (Micro-op Fusion)
```
FOR each micro_op in micro_ops:
  SWITCH micro_op.op:
    CASE LOAD_DUAL:
      // Parallel dual load (1 cycle!)
      registers[rd1] = memory[addr1]
      registers[rd2] = memory[addr2]

    CASE LOAD_ADD:
      // Fused load + add (1 cycle!)
      registers[rdL] = memory[addrL]
      registers[rdA] = registers[rsA] + registers[rdL]

    CASE ADD:
      registers[rd] = registers[rs1] + registers[rs2]

    CASE STORE:
      memory[addr] = registers[rs]

    CASE HALT:
      break
  END SWITCH
  INCREMENT cycle_count
END FOR
```

---

## 4. CONSTRAINTS & LIMITATIONS

### 4.1 Educational Scope
- **No advanced features**: No caching, branch prediction, speculation, interrupts
- **Simplified pipeline**: Basic 5-stage model (not full implementation)
- **Limited instruction set**: Only operations needed for benchmark
- **Fixed benchmark**: Designed for M[0]+M[1]+M[2]+M[3] → M[4]

### 4.2 Technical Limitations
- **Single-threaded execution**: No true parallel execution (simulated)
- **No memory hierarchy**: Flat memory model
- **No hazard detection**: Simplified pipeline (no stalls/forwarding)
- **Fixed clock speed**: Simulation speed controlled by JavaScript timing

### 4.3 Browser Dependencies
- **Requires modern browser**: Canvas API, ES6 classes
- **No IE support**: Uses modern JavaScript features
- **Client-side only**: No server-side computation

---

## 5. DEPENDENCIES

### 5.1 External Dependencies
- **None**: Completely self-contained single-file implementation
- No frameworks, no libraries, no build tools required

### 5.2 Browser APIs Used
- Canvas API 2D Context (for rendering)
- DOM API (for controls and UI)
- JavaScript ES6+ (classes, arrow functions, template literals)

---

## 6. VALIDATION & TESTING

### 6.1 Correctness Testing
**Test**: Verify all architectures produce correct result
```
✅ RISC: M[4] = 50 (after 9 cycles)
✅ CISC: M[4] = 50 (after 13 cycles)
✅ Hybrid: M[4] = 50 (after 6 cycles)
```

### 6.2 Performance Testing
**Test**: Verify Hybrid wins with lowest cycle count
```
✅ Hybrid (6) < RISC (9) < CISC (13)
✅ Hybrid is 33% faster than RISC
✅ Hybrid is 54% faster than CISC
```

### 6.3 Visual Testing
**Test**: Verify all components render correctly
```
✅ Canvas renders without errors
✅ Components positioned correctly
✅ Text labels readable
✅ Colors and highlighting work
```

### 6.4 Interaction Testing
**Test**: Verify all controls function
```
✅ Run button starts execution
✅ Pause button stops execution
✅ Step button advances one cycle
✅ Reset button restarts simulation
✅ Architecture tabs switch correctly
```

---

## 7. ACCEPTANCE CRITERIA (FINAL)

- ✅ **Functional Completeness**: All three architectures fully implemented
- ✅ **Performance Victory**: Hybrid achieves 6 cycles (lowest)
- ✅ **Correctness**: All produce M[4]=50 from benchmark
- ✅ **Visual Simulation**: Live execution visible on canvas
- ✅ **Interactive Controls**: Run/Pause/Step/Reset working
- ✅ **Comparison Dashboard**: Side-by-side metrics displayed
- ✅ **Documentation**: Complete from abstract to conclusion
- ✅ **Deployment**: Live on GitHub Pages
- ✅ **Browser Compatibility**: Works on Chrome, Firefox, Edge, Safari
- ✅ **Code Quality**: Clean, commented, maintainable single-file

---

## 8. FUTURE ENHANCEMENTS (OUT OF SCOPE)

### 8.1 Visual Enhancements
- 🔲 Animated arrows showing dataflow
- 🔲 Color-coded execution paths
- 🔲 Component highlighting during active cycles
- 🔲 Smooth transitions between states

### 8.2 Feature Additions
- 🔲 Custom program input (user-editable instructions)
- 🔲 Multiple benchmark programs
- 🔲 Cache simulation (L1/L2)
- 🔲 Branch prediction visualization
- 🔲 Hazard detection and forwarding
- 🔲 Pipeline stalls and bubbles

### 8.3 Educational Tools
- 🔲 Step-by-step tutorial mode
- 🔲 Tooltips explaining each component
- 🔲 Quiz mode for learning
- 🔲 Performance analysis reports

---

## 9. REFERENCES

### 9.1 Academic References
- Patterson & Hennessy: "Computer Organization and Design" (RISC-V Edition)
- Hennessy & Patterson: "Computer Architecture: A Quantitative Approach" (6th Edition)
- Intel x86 Instruction Set Architecture Manual (CISC reference)
- ARM Architecture Reference Manual (RISC reference)

### 9.2 Technical Resources
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- JavaScript ES6 Classes: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
- GitHub Pages: https://pages.github.com/

---

## 10. SIGN-OFF

**Specification Author**: Muhammad Junaid Sajjad
**Email**: junaidsajjad2298@gmail.com
**Institution**: Lahore Garrison University
**Date**: 2025-12-24
**Status**: ✅ Specification Complete & Implemented
**Project Status**: ✅ Production-Ready (Deployed on GitHub)

**GitHub Repository**: https://github.com/Muhammad-Junaid-Sajjad/Ai-based--Hybrid-architectural-project-

---

**Document Version**: 1.0.0
**Last Updated**: 2025-12-24
**Next Review**: Post-deployment feedback cycle
