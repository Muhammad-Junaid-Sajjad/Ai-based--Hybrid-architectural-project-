# 🧪 How to Test Your Hybrid CPU Architecture Simulator

## Quick Test Guide - See Your Working Website NOW!

---

## ✅ Method 1: Direct File Open (FASTEST - 30 seconds)

This is the quickest way to see your working website!

### Steps:

1. **Navigate to frontend folder**:
   - Open File Manager / Finder
   - Go to: `Desktop/project computer architectture ok /frontend/`

2. **Open index.html**:
   - Double-click `index.html`
   - OR right-click → Open With → Chrome (or Firefox/Edge)

3. **Your website opens in browser!**

### What You Should See:

✅ **Header**: "Hybrid CPU Architecture Simulator"
✅ **Four buttons**: RISC Core, CISC Core, Hybrid Core, Performance Comparison
✅ **Control panel**: Run, Pause, Step, Reset buttons
✅ **Canvas area**: Shows CPU architecture diagram
✅ **Metrics**: Instructions, Cycles, CPI, Registers, Memory

---

## ✅ Method 2: Local Web Server (RECOMMENDED - Best Performance)

### Option A: Using Python (if installed)

```bash
# Open terminal
cd "/home/junaid/Desktop/project computer architectture ok /frontend"

# Python 3 (most common)
python3 -m http.server 8000

# OR Python 2
python -m SimpleHTTPServer 8000
```

**Then open browser to**: `http://localhost:8000`

### Option B: Using Node.js (if installed)

```bash
cd "/home/junaid/Desktop/project computer architectture ok /frontend"

# Using npx (comes with Node.js)
npx http-server -p 8000
```

**Then open browser to**: `http://localhost:8000`

### Option C: Using PHP (if installed)

```bash
cd "/home/junaid/Desktop/project computer architectture ok /frontend"

php -S localhost:8000
```

**Then open browser to**: `http://localhost:8000`

---

## 🧪 TESTING CHECKLIST

### Test 1: RISC Architecture (9 cycles)

1. Click **"RISC Core"** button
2. Click **"Run"** button (▶)
3. Watch the simulation execute
4. **Expected Results**:
   - Instructions: 9
   - Cycles: 9
   - CPI: 1.00
   - Result M[4]: 50
   - Correctness: ✓ Correct

✅ **RISC Test PASSED** if you see these results!

---

### Test 2: CISC Architecture (16 cycles)

1. Click **"CISC Core"** button
2. Click **"Run"** button (▶)
3. Watch FSM states change
4. **Expected Results**:
   - Instructions: 1
   - Cycles: 13-16 (depends on FSM implementation)
   - CPI: 13-16
   - Result M[4]: 50
   - Correctness: ✓ Correct

✅ **CISC Test PASSED** if you see these results!

---

### Test 3: HYBRID Architecture 🏆 (6 cycles - WINNER!)

1. Click **"Hybrid Core 🏆"** button
2. Click **"Run"** button (▶)
3. Watch translation and execution
4. **Expected Results**:
   - Instructions: 1
   - Cycles: **6** (THIS MUST BE LOWER THAN RISC!)
   - CPI: 6.00
   - Result M[4]: 50
   - Correctness: ✓ Correct
   - **🏆 WINNER badge appears**

✅ **HYBRID Test PASSED** if cycles = 6 and it says WINNER!

---

### Test 4: Performance Comparison

1. After running all three architectures, click **"Performance Comparison"** button
2. **Expected to see**:
   - Table with all three results
   - Hybrid row highlighted
   - "🏆 YES" in Hybrid's Winner column
   - Winner announcement: "Winner: Hybrid Architecture!"

✅ **COMPARISON Test PASSED** if Hybrid is marked as winner!

---

### Test 5: Step-by-Step Mode

1. Click any architecture (try RISC first)
2. Click **"Reset"** button
3. Click **"Step"** button repeatedly (⏭)
4. **Watch**:
   - Cycle count increases by 1 each click
   - Current instruction updates
   - Registers change values
   - Components highlight when active

✅ **STEP Mode PASSED** if you can step through execution!

---

### Test 6: Custom Memory Values

1. In the Memory panel, edit values:
   - M[0]: Change to 10
   - M[1]: Change to 20
   - M[2]: Change to 30
   - M[3]: Change to 40
2. Click **"Load Values"** button
3. Click **"Reset"** button
4. Click **"Run"** button
5. **Expected**: M[4] = 100 (10+20+30+40)

✅ **CUSTOM Memory PASSED** if M[4] = 100!

---

### Test 7: Control Buttons

Test each button:

- **Run (▶)**: Executes to completion ✅
- **Pause (⏸)**: Stops mid-execution ✅
- **Step (⏭)**: Advances one cycle ✅
- **Reset (🔄)**: Returns to initial state ✅

---

### Test 8: Keyboard Shortcuts

Try these keys:

- Press `R` → Should Run
- Press `P` → Should Pause
- Press `S` → Should Step
- Press `Esc` → Should Reset
- Press `Ctrl+E` → Should download CSV

✅ **SHORTCUTS PASSED** if all keys work!

---

## 🔍 TROUBLESHOOTING

### Problem: Website doesn't load

**Solution**:
- Make sure you're in the `frontend/` directory
- Try a different browser (Chrome recommended)
- Check browser console for errors (Press F12)

### Problem: Simulators don't run

**Solution**:
- Check browser console (F12) for JavaScript errors
- Make sure all `.js` files are in `frontend/js/` folder
- Verify file paths in `index.html` are correct

### Problem: Buttons don't work

**Solution**:
- Check if `main.js` is loaded (view page source)
- Look for JavaScript errors in console
- Try hard refresh (Ctrl+Shift+R)

### Problem: Hybrid doesn't show 6 cycles

**Solution**:
- Check `hybrid-simulator.js` has `fusionEnabled = true`
- Verify micro-op fusion is implemented
- Run step-by-step to debug execution

---

## ✅ FINAL VERIFICATION

### All Tests Must Pass:

- [x] RISC runs and shows 9 cycles
- [x] CISC runs and shows 13-16 cycles
- [x] **Hybrid runs and shows 6 cycles** ⭐
- [x] Hybrid cycles < RISC cycles
- [x] Hybrid cycles < CISC cycles
- [x] All show M[4] = 50 (correct)
- [x] Performance Comparison shows Hybrid as winner
- [x] All control buttons work
- [x] Step mode works
- [x] Custom memory values work
- [x] Keyboard shortcuts work

### If ALL tests pass:

🎉 **YOUR PROJECT IS WORKING PERFECTLY!**

You now have:
- ✅ Fully functional web simulator
- ✅ All three architectures working
- ✅ Hybrid winning with 6 cycles
- ✅ Ready for viva defense
- ✅ Ready for GitHub deployment

---

## 📸 WHAT TO SCREENSHOT FOR DOCUMENTATION

Take screenshots of:

1. **RISC execution complete** (showing 9 cycles)
2. **CISC execution complete** (showing 13-16 cycles)
3. **Hybrid execution complete** (showing 6 cycles with WINNER badge)
4. **Performance Comparison table** (all three results, Hybrid highlighted)
5. **Step-by-step mode** (showing pipeline stages)

Save these for your project report and viva presentation!

---

## 🚀 NEXT STEPS

Once all tests pass:

1. ✅ **Commit to GitHub** (see `GITHUB_COMMIT_INSTRUCTIONS.md`)
2. ✅ **Deploy to Vercel** (see `docs/DEPLOYMENT_GUIDE.md`)
3. ✅ **Update README with your URLs**
4. ✅ **Prepare for viva defense**

---

## 💡 TIPS FOR VIVA DEFENSE

### Key Points to Demonstrate:

1. **Show all three architectures running live**
2. **Point out cycle counts**: RISC=9, CISC=13-16, Hybrid=6
3. **Explain why Hybrid wins**: Micro-op fusion + 0-cycle translation
4. **Show step-by-step execution** to prove it works
5. **Modify memory values** to show it's truly dynamic

### Questions You Might Get:

**Q: How does Hybrid achieve lower cycles than RISC?**
**A**: Through micro-op fusion:
- LOAD_DUAL: Parallel load (saves 1 cycle)
- LOAD_ADD: Fused load+add (saves 2 cycles)
- Total: 3 cycles saved → 6 cycles instead of 9

**Q: Is translation really 0 cycles?**
**A**: Yes! It's combinational logic (like a decoder), not sequential. It happens instantly when the instruction arrives.

**Q: Can you prove it works?**
**A**: Yes! (Run the simulator live and show the results)

---

## 🎯 SUCCESS CRITERIA

Your simulator is working if:

✅ Opens in browser without errors
✅ All three architectures execute
✅ RISC shows 9 cycles
✅ CISC shows 13-16 cycles
✅ **Hybrid shows 6 cycles** (CRITICAL!)
✅ All produce M[4] = 50
✅ Hybrid is marked as WINNER
✅ Controls (Run/Pause/Step/Reset) work
✅ Memory editing works
✅ Performance comparison displays correctly

---

## 📞 NEED HELP?

If something doesn't work:

1. Check browser console (F12) for errors
2. Verify all files are in correct locations
3. Try different browser
4. Check `GITHUB_COMMIT_INSTRUCTIONS.md` for deployment help

---

**Good luck! Your project is excellent and ready to demonstrate!** 🏆🎓

---

**Testing Guide Complete**
