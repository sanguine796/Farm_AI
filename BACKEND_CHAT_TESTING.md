# Backend-Driven Chat AI - Testing Guide

## Quick Start (2 Minutes)

### Terminal 1: Start Backend
```powershell
cd d:\Sanguine\Downloads\hacka\backend
python -m uvicorn chat_api:app --host 0.0.0.0 --port 5000 --reload
```

### Terminal 2: Start Frontend
```powershell
cd d:\Sanguine\Downloads\hacka\frontend
npm start
```

### Browser: Open App
```
http://localhost:3000
```

---

## Test Cases

### Test 1: English Text Chat

**Step:**
1. Keep language as English
2. Type: "How do I grow rice?"
3. Click "Send"

**Expected:**
- ✅ Response about rice in English appears
- ✅ Contains agricultural advice
- ✅ No truncation or errors

**Console Check:**
```
[CHAT-API] Sending message: How do I grow rice?
[CHAT-API] Language: en
[CHAT-API] Backend response received: Based on current season...
```

---

### Test 2: Hindi Voice Input

**Step:**
1. Click language selector → हिंदी
2. Click microphone 🎤
3. Say: "फसलें कैसे उगाएं?" (How do I grow crops?)
4. Click microphone again to stop
5. Verify text appears
6. Click "Send"

**Expected:**
- ✅ Hindi text appears in input field
- ✅ Response is ENTIRELY in Hindi
- ✅ Audio plays in Hindi

**Console Check:**
```
[VOICE] Starting voice input for language: hi
[VOICE] Final result: फसलें कैसे उगाएं?
[CHAT-API] Sending message: फसलें कैसे उगाएं?
[CHAT-API] Language: hi
[CHAT-API] Backend response received: वर्तमान मौसम और आपके क्षेत्र...
```

---

### Test 3: Telugu Disease Question

**Step:**
1. Change language to తెలుగు
2. Type: "పంటల రోగాలను ఎలా నివారించాలి?" (How to prevent crop diseases?)
3. Send

**Expected:**
- ✅ Response about disease management in Telugu
- ✅ Contains pest control advice
- ✅ Response in Telugu only (no English)

**Backend Console:**
```
[CHAT] User input (te): పంటల రోగాలను ఎలా నివారించాలి?
[AI] Matched category: disease_management (score: 1)
[CHAT] Response generated (te): ...
```

---

### Test 4: Malayalam Multi-line Input

**Step:**
1. Change language to മലയാളം
2. Type multi-line question:
   ```
   എന്റെ നിലത്തിന് വരണ്ട സമയം വരാൻ പോകുന്നു.
   എനിക്ക് എന്താണ് സേനിപാലന കേന്ദ്രം?
   ```
3. Send

**Expected:**
- ✅ Full multi-line message sent (no truncation)
- ✅ Response in Malayalam
- ✅ Answers irrigation question

---

### Test 5: Language Auto-Detection

**Step:**
1. Select English
2. Type in Hindi: "मिट्टी कैसे तैयार करें?" (How to prepare soil?)
3. Send (without changing language selector)

**Expected:**
- ✅ Backend detects Hindi automatically
- ✅ Response in Hindi even though English was selected
- ✅ Shows language flexibility

**Backend Console:**
```
[CHAT] User input (hi): मिट्टी कैसे तैयार करें?
[AI] Matched category: soil_fertility (score: 1)
```

---

### Test 6: Error Handling - Empty Message

**Step:**
1. Click "Send" without typing anything

**Expected:**
- ✅ Clear error message appears
- ✅ Message: "Empty message. Please ask a question."
- ✅ No server crash

**Browser Console:**
```
[CHAT-API] Error: HTTP 400: Backend request failed
```

---

### Test 7: Error Handling - Backend Down

**Step:**
1. Stop the backend server (Ctrl+C in backend terminal)
2. Try to send a message
3. See the error

**Expected:**
- ✅ Clear error: "Server error. Please ensure the backend is running."
- ✅ No cryptic error codes
- ✅ User knows to restart backend

**Browser Console:**
```
[CHAT-API] Error: HTTP (unknown): Backend request failed
```

---

### Test 8: Continuous Language Switching

**Step:**
1. Send message in English: "Crop recommendations"
2. Switch to Hindi
3. Send: "फसल रोग"
4. Switch to Telugu
5. Send: "వాతావరణ సలహా"
6. Switch to Malayalam
7. Send: "വിപണി വിലകൾ"

**Expected:**
- ✅ Each response in correct language
- ✅ No cross-language contamination
- ✅ All responses relevant to topic

---

### Test 9: Knowledge Base Matching

Test that backend correctly identifies topics:

**Crop Selection Questions:**
- "What crops should I plant?" → ✅ Crop recommendation response
- "Best crops for rainy season?" → ✅ Crop recommendation response
- "How to grow wheat?" → ✅ Crop recommendation response

**Disease Management Questions:**
- "I see brown spots on leaves" → ✅ Disease management response
- "How to treat powdery mildew?" → ✅ Disease management response
- "Pest control methods?" → ✅ Disease management response

**Irrigation Questions:**
- "How much water does rice need?" → ✅ Irrigation response
- "When should I water?" → ✅ Irrigation response
- "My field is very dry" → ✅ Irrigation response

**Soil & Fertility Questions:**
- "What fertilizer to use?" → ✅ Soil fertility response
- "My soil is not fertile" → ✅ Soil fertility response
- "NPK ratio for wheat?" → ✅ Soil fertility response

**Weather Questions:**
- "What to do in high temperature?" → ✅ Weather response
- "How to protect from rain?" → ✅ Weather response
- "Humidity is too high" → ✅ Weather response

**Market Questions:**
- "What are current prices?" → ✅ Market response
- "When should I sell?" → ✅ Market response
- "Market demand for cotton?" → ✅ Market response

---

### Test 10: Stress Test - Multiple Messages

**Step:**
1. Send 10 messages rapidly
2. Mix of English, Hindi, Telugu, Malayalam
3. Different topics

**Expected:**
- ✅ All messages processed
- ✅ Responses for each message
- ✅ No delays or timeouts
- ✅ No memory leaks

---

## API Testing (Using curl or Postman)

### Test: Direct API Call

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I grow wheat in winter?",
    "question": "How do I grow wheat in winter?",
    "language": "en"
  }'
```

**Expected Response:**
```json
{
  "reply": "Based on current season and your region, consider these crops...",
  "answer": "Based on current season and your region, consider these crops...",
  "response": "Based on current season and your region, consider these crops...",
  "language": "en",
  "timestamp": "2025-12-30T10:30:45.123456",
  "confidence": 0.85
}
```

### Test: Health Check

```bash
curl http://localhost:5000/api/chat/health
```

**Expected:**
```json
{
  "status": "healthy",
  "service": "Farm AI Chat API",
  "version": "2.0",
  "timestamp": "2025-12-30T10:30:45.123456"
}
```

### Test: Invalid Request (Empty Message)

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "",
    "language": "en"
  }'
```

**Expected:**
```json
{
  "error": "Empty message. Please ask a question.",
  "status_code": 400,
  "timestamp": "2025-12-30T10:30:45.123456"
}
```

---

## Console Output Analysis

### Good Backend Startup

```
 INFO:     Uvicorn running on http://0.0.0.0:5000
 INFO:     Application startup complete
```

### Good Chat Request

```
INFO:app:[CHAT] User input (en): How do I grow rice?
INFO:app:[AI] Matched category: crop_selection (score: 1)
INFO:app:[CHAT] Response generated (en): Based on current season...
```

### Error in Request

```
ERROR:app:[CHAT] Error generating response: Missing field 'message'
```

---

## Troubleshooting

### Issue: "Address already in use"

```
ERROR: Address already in use
Port 5000 is already occupied
```

**Solution:**
```powershell
# Kill process on port 5000
Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force

# Or change port in chat_api.py line (last line):
# uvicorn.run(..., port=5001, ...)
```

### Issue: "No module named 'fastapi'"

```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
```powershell
pip install fastapi uvicorn langdetect
```

### Issue: Frontend can't connect to backend

**Check:**
1. Backend is running: `python -m uvicorn chat_api:app --host 0.0.0.0 --port 5000`
2. Port 5000 is open (not blocked by firewall)
3. Browser console shows which URL it's trying to connect to
4. Test with: `curl http://localhost:5000/api/chat/health`

### Issue: Wrong language in response

**Check:**
1. Language parameter is being sent
2. Language code is correct: en, hi, te, ml
3. Backend logs show correct language detection
4. Check if langdetect module is installed

---

## Success Criteria Checklist

- [ ] Backend starts without errors
- [ ] Frontend connects to backend (no network errors)
- [ ] English text queries work
- [ ] Hindi voice input works
- [ ] Telugu text queries work
- [ ] Malayalam queries work
- [ ] Multi-line text is not truncated
- [ ] Error messages are clear and helpful
- [ ] Language detection works automatically
- [ ] Responses are in correct language
- [ ] No hardcoded or cached responses
- [ ] Each message gets a fresh response
- [ ] Backend handles concurrent requests
- [ ] Health check endpoint works
- [ ] API documentation is accessible at /docs

---

## Performance Metrics to Monitor

**Response Time:**
```
[CHAT] Received request
[CHAT] Language detected: 5ms
[AI] Category matched: 10ms
[CHAT] Response generated: 30ms
[CHAT] Response sent: 2ms
Total: ~50ms
```

**Backend Resource Usage:**
- Memory: Should stay under 100MB
- CPU: Should be near 0% when idle
- Thread count: Should match number of API workers

**Frontend Connection:**
- Network tab should show /api/chat requests
- Response times: 50-500ms (including network latency)
- No CORS errors
- No hung requests

---

**Date:** December 30, 2025
**Status:** Production Ready
