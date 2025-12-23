# 🧪 Testing Guide - Hybrid CPU Architecture Simulator

**Quick guide to test all features before deployment**

---

## 🚀 Quick Test (30 seconds)

1. Navigate to `frontend/` folder
2. Double-click `index.html`
3. Website opens in browser!

---

## ✅ Test Checklist

### Test 1: RISC (9 cycles)
- [ ] Click "RISC Core"
- [ ] Click "Run"
- [ ] Verify: Cycles = 9, M[4] = 50

### Test 2: CISC (13-16 cycles)
- [ ] Click "CISC Core"
- [ ] Click "Run"
- [ ] Verify: Cycles = 13-16, M[4] = 50

### Test 3: Hybrid (6 cycles) 🏆
- [ ] Click "Hybrid Core"
- [ ] Click "Run"
- [ ] Verify: Cycles = **6**, M[4] = 50
- [ ] Verify: "WINNER" badge appears

### Test 4: Comparison
- [ ] Click "Performance Comparison"
- [ ] Verify: Hybrid marked as winner
- [ ] Verify: Table shows all results

### Test 5: Controls
- [ ] Test Pause button
- [ ] Test Step button (single cycle)
- [ ] Test Reset button

### Test 6: Custom Memory
- [ ] Edit M[0]=10, M[1]=20, M[2]=30, M[3]=40
- [ ] Click "Load Values"
- [ ] Reset and Run
- [ ] Verify: M[4] = 100

---

## ✅ Expected Results

| Architecture | Cycles | Result | Status |
|--------------|--------|--------|--------|
| RISC | 9 | 50 | ✅ |
| CISC | 13-16 | 50 | ✅ |
| Hybrid | **6** | 50 | **🏆 WINNER** |

---

**All tests passing = Ready for deployment!** 🚀
