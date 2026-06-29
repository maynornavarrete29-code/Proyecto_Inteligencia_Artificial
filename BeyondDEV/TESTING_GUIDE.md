# 🧪 Face ID System - Testing & Demo Guide

## Quick Start Test (5 minutes)

### Prerequisites
- ✅ Node.js installed
- ✅ Browser with camera access
- ✅ Good lighting
- ✅ Git repository cloned

### Step 1: Start Backend Server (30 seconds)
```bash
cd BeyondDEV/api/
npm install              # First time only
npm start               # Start Express server
```

**Expected Output:**
```
═══════════════════════════════════════════════════
  🚀 BeyondDev Auth API corriendo en:
     http://localhost:3000
  
  🔐 Face ID Endpoints:
     POST  /api/auth/check-face-email
     POST  /api/auth/register-face
     POST  /api/auth/verify-face-login
     GET   /api/auth/face-profile
     DELETE /api/auth/face-profile
═══════════════════════════════════════════════════
```

### Step 2: Open Login Page (15 seconds)
1. Open browser → `http://localhost:3000/login.html`
2. You should see:
   - Login/Register tabs
   - "Ingresar con Face ID" button (red button)
   - DevMail widget on bottom right
   - Demo credentials in info box

### Step 3: Test Face ID Registration (2 minutes)

**3.1 Register Traditional Account First**
1. Click "Registrarse" tab
2. Fill in:
   - Name: `Test User Demo`
   - Email: `testdemo@faceid.com`
   - Password: `Demo123!`
   - Confirm: `Demo123!`
3. Click "Registrarse"
4. Check DevMail widget - should show verification email
5. Click the email → Click verification link in preview
6. You're now verified ✅

**3.2 Register Face ID** (Optional but recommended)
1. After verification, you should still see registration form
2. Click "Registrar Face ID (opcional)" button
3. **IMPORTANT**: Allow camera access when browser prompts
4. Capture 1/3:
   - Position face in center of video
   - Wait for quality meter to reach yellow/green
   - Click "Escanear Rostro (1/3)"
5. Capture 2/3:
   - Slight angle (tilt head slightly)
   - Click "Escanear Rostro (2/3)"
6. Capture 3/3:
   - Normal frontal face
   - Click "Escanear Rostro (3/3)"
7. Should show success message ✅

### Step 4: Test Face ID Login (1 minute)

**4.1 Using Face ID**
1. Go back to login page (refresh or navigate)
2. Click "Ingresar con Face ID" button
3. Enter email: `testdemo@faceid.com`
4. Click "Continuar"
5. Camera opens automatically
6. Position your face:
   - Frontal position (directly facing camera)
   - Good lighting (face clearly visible)
   - Entire face in frame
7. Quality meter should fill up as it detects face
8. Once quality ≥ 75%, "Capturar Rostro" button enables
9. Click "Capturar Rostro"
10. System should verify and auto-redirect to `backend.html` ✅

**4.2 Face ID Failure (Testing error handling)**
1. Try Face ID login again but move away during capture
2. Should see error message: "El rostro no coincide"
3. Can retry or use password login

### Step 5: Fallback to Password Login
1. If Face ID fails, click "Intentar de Nuevo"
2. Or close modal and use traditional email/password
3. Should still log in successfully

---

## Detailed Test Scenarios

### Scenario 1: Perfect Conditions ✅ (Should succeed)
**Lighting**: Bright, even illumination  
**Face**: Frontal, centered, no obstructions  
**Distance**: Normal camera distance (30-60cm)

**Steps:**
1. Find well-lit area
2. Face directly to camera
3. Entire face visible
4. Quality meter reaches 80%+
5. Click capture
6. **Expected**: Login success

**Success Criteria:**
- ✅ Face detected immediately
- ✅ Quality meter shows high values
- ✅ Capture button enabled
- ✅ Auto-redirect after capture
- ✅ Session created

---

### Scenario 2: Poor Lighting ⚠️ (May require retry)
**Lighting**: Dim, side lighting  
**Face**: Frontal but shadows  
**Distance**: Normal

**Steps:**
1. Move to dim area
2. Face camera
3. Quality meter shows lower values
4. Click capture if quality ≥ 50%
5. **Expected**: May fail or succeed with lower confidence

**Success Criteria:**
- ⚠️ Face detected but with lower quality
- ⚠️ Quality meter shows 50-70%
- ✅ System still processes
- ⚠️ May need retry or password login

---

### Scenario 3: Obstacles 🚫 (May fail)
**Lighting**: Good  
**Face**: Partially covered  
**Obstructions**: Glasses, mask, hand

**Steps:**
1. Wear glasses or sunglasses
2. Try Face ID login
3. System should detect but lower quality
4. **Expected**: Quality meter low, capture may fail

**Success Criteria:**
- ⚠️ Face may not detect
- ⚠️ Quality meter shows very low
- ✅ Error message shown
- ✅ Can remove obstruction and retry

---

### Scenario 4: Wrong Person 🚫 (Should fail)
**Testing**: Face matching verification

**Steps:**
1. Register Face ID with Person A
2. Have Person B try to login with Person A's email
3. Capture face from Person B
4. **Expected**: Login fails with "El rostro no coincide"

**Success Criteria:**
- ✅ Face detected correctly
- ✅ Descriptor compared
- ✅ Mismatch detected
- ✅ Error message shown
- ✅ Can retry or use password

---

### Scenario 5: Database State ✅ (Testing persistence)
**Purpose**: Verify Face ID data saved

**Steps:**
1. Register and capture Face ID
2. Close browser completely
3. Restart browser
4. Go to login page
5. Try Face ID with same email
6. **Expected**: Face profile still exists and matches

**Success Criteria:**
- ✅ Face profile persisted in db.json
- ✅ Multiple logins work
- ✅ Verification count increments
- ✅ lastVerifiedAt updated

---

## Advanced Testing

### Test: Quality Scoring Accuracy

**Test Objective**: Verify quality assessment is accurate

**Steps:**
1. Open Face ID login modal
2. Observe quality meter with various conditions:

| Condition | Expected Quality | Result |
|-----------|-----------------|--------|
| Frontal, good light | 85-95% | ✅ |
| Slight angle | 70-85% | ✅ |
| Side angle | 50-70% | ✅ |
| Poor light | 40-60% | ✅ |
| Multiple faces | 0% (error) | ✅ |
| No face | 0% | ✅ |

---

### Test: Error Handling

**Test Objective**: Verify all error paths handled

| Scenario | Expected Behavior | Test |
|----------|------------------|------|
| No camera | Error message | Deny camera, click Face ID |
| Camera fails | Error message | Unplug camera during capture |
| Wrong email | Email not found | Try non-existent email |
| Email no Face | No Face ID registered | Register normally (no face) then try Face ID |
| Network offline | Connection error | Open DevTools, throttle network |
| Too many faces | Multiple faces error | Get 2+ faces in frame |
| Face too far | Quality too low | Move >1 meter away |
| Face too close | Quality too low | Move <20cm away |
| Dark image | Quality too low | Point camera at black area |

---

### Test: API Endpoints Directly

**Using cURL or Postman:**

#### 1. Check Face Email
```bash
curl -X POST http://localhost:3000/api/auth/check-face-email \
  -H "Content-Type: application/json" \
  -d '{"email":"testdemo@faceid.com"}'

# Expected: 
# {"success":true,"user":{"id":"user-123","name":"Test User Demo","email":"testdemo@faceid.com"}}
```

#### 2. Register Face
```bash
curl -X POST http://localhost:3000/api/auth/register-face \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testdemo@faceid.com",
    "descriptors":[
      {"descriptor":[0.1,0.2,...],"quality":85},
      {"descriptor":[0.15,0.25,...],"quality":87},
      {"descriptor":[0.12,0.22,...],"quality":86}
    ]
  }'

# Expected:
# {"success":true,"message":"Face ID registrado exitosamente.","devMail":{...}}
```

#### 3. Verify Face Login
```bash
curl -X POST http://localhost:3000/api/auth/verify-face-login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testdemo@faceid.com",
    "descriptor":{"descriptor":[0.11,0.21,...],"quality":88}
  }'

# Expected:
# {"success":true,"token":"eyJhbGc...","user":{...}}
```

---

## Browser DevTools Testing

### Check Console for Errors
1. Open DevTools: `F12`
2. Go to "Console" tab
3. Clear console
4. Try Face ID login
5. Check for any JavaScript errors (should be none)

**Expected Console Output:**
```javascript
🔐 Inicializando modelos de Face ID...
✅ Modelos de Face ID cargados exitosamente.
Detectando rostro...
Face quality: 87%
Extrayendo descriptor de face...
```

---

### Monitor Network Requests
1. Open DevTools: `F12`
2. Go to "Network" tab
3. Filter by XHR/Fetch
4. Try Face ID login
5. Watch requests in order:

**Expected Network Calls:**
```
1. check-face-email [POST] → 200 OK
   Response: user exists
   
2. verify-face-login [POST] → 200 OK
   Response: token + user
   
3. backend.html [GET] → 200 OK (redirect)
```

---

### Check LocalStorage
1. Open DevTools: `F12`
2. Go to "Application" → "Storage" → "Local Storage"
3. Select http://localhost:3000
4. After login, should see:

```
beyonddev_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
beyonddev_user: "{"id":"user-123","name":"Test User Demo","email":"testdemo@faceid.com"}"
```

---

## Mobile/Responsive Testing

### Test on Mobile Browser
1. Open http://localhost:3000/login.html on mobile
2. Click "Ingresar con Face ID"
3. Check:
   - Modal displays correctly ✅
   - Video stream fills screen ✅
   - Buttons are touchable ✅
   - Quality meter is visible ✅
   - Capture works with device camera ✅

### Test on Different Browsers
| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Supported | Best performance |
| Firefox | ✅ Supported | Similar performance |
| Safari | ✅ Supported | Requires HTTPS |
| Edge | ✅ Supported | Chromium-based |
| Mobile Safari | ✅ Supported | Requires HTTPS |
| Chrome Mobile | ✅ Supported | Works well |

---

## Performance Testing

### Measure Load Times
1. Open DevTools: `F12`
2. Go to "Performance" tab
3. Start recording
4. Open login page
5. Click "Ingresar con Face ID"
6. Stop recording
7. Check metrics:

**Expected Metrics:**
- Page load: <2s
- Models load: 2-3s (first time)
- Modal open: <500ms
- Face detect: 100-200ms per frame
- Capture process: <2s total

---

### Memory Usage
1. Open DevTools: `F12`
2. Go to "Memory" tab
3. Take heap snapshot before Face ID
4. Open Face ID modal
5. Capture face
6. Take heap snapshot after
7. Compare memory usage

**Expected:**
- Model loading: +15-20MB
- Video stream: +5-10MB
- Total reasonable: <100MB

---

## Demo Script (for presentations)

**Duration**: 5 minutes

### Opening (30 seconds)
"Today I'll demonstrate Face ID authentication for BeyondDev - a biometric login system."

### Setup (1 minute)
1. Show login page
2. Explain traditional login vs Face ID
3. Point out "Ingresar con Face ID" button

### Workflow Demo (3 minutes)

**Part A: Registration (1:30)**
1. "First, let's register a new user..."
2. Fill registration form
3. Submit and verify email
4. Show Face ID registration option
5. Capture 3 face images
6. Show success message

**Part B: Login with Face ID (1:30)**
1. "Now let's log in with Face ID..."
2. Click "Ingresar con Face ID"
3. Enter email
4. Show real-time face detection
5. Point out quality meter
6. Capture face
7. Show auto-login and redirect

### Closing (1 minute)
1. Show user dashboard
2. Highlight that session was created via Face ID
3. Demonstrate fallback to password login
4. Discuss security benefits

---

## Acceptance Criteria Checklist

### Core Functionality ✅
- [ ] Face detection works in real-time
- [ ] Quality assessment provides meaningful feedback
- [ ] 3-image registration captures successfully
- [ ] Face matching works for login
- [ ] Token generation and session creation works
- [ ] Redirect to dashboard after successful login

### User Experience ✅
- [ ] Modal UI is clean and intuitive
- [ ] Camera permissions are requested properly
- [ ] Real-time feedback is clear
- [ ] Error messages are helpful
- [ ] Loading states are visible
- [ ] Responsive on mobile

### Security ✅
- [ ] Face descriptors are stored (not images)
- [ ] Email verification required before Face ID
- [ ] Account verification required
- [ ] Quality validation in place
- [ ] Distance threshold working
- [ ] JWT tokens generated correctly

### Error Handling ✅
- [ ] Camera permission denied handled
- [ ] No face detected handled
- [ ] Multiple faces detected handled
- [ ] Poor quality images rejected
- [ ] Network errors handled
- [ ] Face mismatch returns error

### Browser Support ✅
- [ ] Works on Chrome
- [ ] Works on Firefox
- [ ] Works on Safari
- [ ] Works on Edge
- [ ] Mobile browsers supported

---

## Troubleshooting During Testing

### Issue: Camera Not Working
**Solution:**
1. Check browser camera permissions
2. Try different browser
3. Unplug/replug camera
4. Restart browser

### Issue: "Models not loading"
**Solution:**
1. Check internet connection
2. Check browser console for CORS errors
3. Verify CDN is accessible
4. Clear browser cache

### Issue: Face Not Detecting
**Solution:**
1. Improve lighting
2. Move face to center of frame
3. Remove glasses/obstructions
4. Check camera is working (test on other sites)

### Issue: Quality Always Low
**Solution:**
1. Use brighter light
2. Remove shadows
3. Face camera directly
4. Remove glasses if possible

---

## Test Report Template

```
Date: _______________
Tester: _______________
Browser: _______________
OS: _______________

REGISTRATION TEST
[ ] User registration (email/password)
[ ] Email verification
[ ] Face ID capture (3 images)
[ ] Face profile saved
Result: PASS / FAIL

LOGIN TEST
[ ] Face ID modal opens
[ ] Camera access granted
[ ] Face detected
[ ] Quality meter working
[ ] Face captured successfully
[ ] Face matched with stored profile
[ ] Token generated
[ ] Redirect successful
Result: PASS / FAIL

ERROR HANDLING TEST
[ ] No camera error
[ ] No face error
[ ] Poor quality error
[ ] Face mismatch error
[ ] Network error handling
Result: PASS / FAIL

UI/UX TEST
[ ] Buttons responsive
[ ] Text clear and readable
[ ] Modals render properly
[ ] Mobile responsive
[ ] Animations smooth
Result: PASS / FAIL

NOTES:
_____________________________
_____________________________

SIGNED: _______________
```

---

## Regression Testing

After any code changes, re-run:
1. ✅ Full Face ID login workflow
2. ✅ Full Face ID registration workflow
3. ✅ All error scenarios
4. ✅ Performance metrics
5. ✅ Browser compatibility
6. ✅ Mobile responsiveness

---

**Last Updated**: 2026-06-29  
**Test Environment**: Local (Node.js + Express)  
**Status**: Ready for Testing
