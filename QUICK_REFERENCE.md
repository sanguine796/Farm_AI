# Quick Reference: Frontend-Backend Integration Testing

## 🚀 Quick Start

### Prerequisites
- Backend: Running on `http://localhost:5000`
- Frontend: Running on `http://localhost:3000`
- Browser: With Developer Tools (F12)

### Verify Integration is Working
1. Open http://localhost:3000 in browser
2. Press `F12` to open Developer Console
3. Go to **Console** tab
4. Perform action below
5. Look for corresponding logs

---

## 📋 Test Procedures

### Test 1: Chat API Integration ✅
**Location**: AI Assistant page
**Action**: Type message and click Send
**Expected Logs**:
```
[CHAT] User message sent: "your message"
[CHAT] Sending request to /api/chat endpoint...
[API REQUEST] POST http://localhost:5000/api/chat
[API RESPONSE] Status: 200 OK
[CHAT] Backend response received: {reply: "..."}
[CHAT] Bot response added to UI: "..."
```
**Success**: Bot responds immediately with API message

---

### Test 2: Crop Recommendation API ✅
**Location**: Crops page
**Action**: Fill form → Click "Get Recommendations →"
**Expected Logs**:
```
[CROPS] Requesting crop recommendations...
[CROPS] Form data: {soilType: "...", farmSize: "...", region: "..."}
[CROPS] Sending request to /api/crops endpoint...
[API REQUEST] GET http://localhost:5000/api/crops?...
[API RESPONSE] Status: 200 OK
[CROPS] Backend response received: {crops: [...]}
[CROPS] Recommendations updated in UI: X crops
```
**Success**: Crop cards display with recommendations

---

### Test 3: Weather Data Fetch ✅
**Location**: Weather page
**Action**: Open page (automatic fetch on load)
**Expected Logs**:
```
[WEATHER] Fetching weather data from API...
[WEATHER] Sending request to /api/weather endpoint...
[API REQUEST] GET http://localhost:5000/api/weather?region=Default
[API RESPONSE] Status: 200 OK
[WEATHER] Backend response received: {region: "...", current: {...}, forecast: [...]}
[WEATHER] Weather data updated in UI
```
**Success**: Weather forecast displays immediately

---

### Test 4: Market Prices Fetch ✅
**Location**: Market Prices page
**Action**: Open page (automatic fetch on load)
**Expected Logs**:
```
[MARKET] Fetching market prices from API...
[MARKET] Sending request to /api/market endpoint...
[API REQUEST] GET http://localhost:5000/api/market
[API RESPONSE] Status: 200 OK
[MARKET] Backend response received: {timestamp: "...", prices: [...]}
[MARKET] Market data updated in UI
```
**Success**: Price table displays with current market data

---

### Test 5: Disease Detection API ✅
**Location**: Pest Detection page
**Action**: Upload image → Click "Analyze Image"
**Expected Logs**:
```
[PEST] Analyzing uploaded image...
[PEST] Image data: {name: "image.jpg", size: XXXX, type: "image/jpeg"}
[PEST] Sending request to /api/detect endpoint...
[API REQUEST] POST http://localhost:5000/api/detect (multipart/form-data)
[API RESPONSE] Status: 200 OK
[PEST] Backend response received: {disease_detected: "...", confidence: XX}
[PEST] Analysis result updated in UI: {...}
```
**Success**: Disease analysis displays with confidence score

---

### Test 6: Language Selection ✅
**Location**: Navbar language selector
**Action**: Click language icon → Select different language
**Expected Logs**:
```
[LANGUAGE] User selected language: hi (हिंदी)
[LANGUAGE] Updating language context...
[LANGUAGE] Language changed to: hi
```
**Success**: All page content immediately updates to selected language

---

## 🔍 Log Format Quick Reference

### Request Log
```
[API REQUEST] TIMESTAMP
  Method: GET/POST
  Endpoint: http://localhost:5000/api/[endpoint]
  Data: {...}
  Params: {...}
```

### Response Log
```
[API RESPONSE] TIMESTAMP
  Status: 200 OK
  Endpoint: /api/[endpoint]
  Data: {...}
```

### Error Log
```
[API ERROR] TIMESTAMP
  Status: 4xx/5xx
  Endpoint: /api/[endpoint]
  Error: "message"
```

### Section-Specific Logs
- `[LANGUAGE]` - Language selection
- `[CHAT]` - Chat operations
- `[CROPS]` - Crop recommendations
- `[WEATHER]` - Weather operations
- `[MARKET]` - Market price operations
- `[PEST]` - Disease detection

---

## 🐛 Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| No [API] logs | Backend not running | Start backend: `python app.py` |
| 404 error | Wrong endpoint | Check URL in logs vs backend routes |
| Network error | Backend unreachable | Verify http://localhost:5000 works |
| No UI update | API response missing | Check [RESPONSE] log for data |
| Fallback data showing | API failed | Check [ERROR] log for details |
| Language not saving | localStorage blocked | Check browser privacy settings |

---

## 📊 Verification Checklist

Run through all 6 tests above:

- [ ] Test 1: Chat API → See message in bot response
- [ ] Test 2: Crops API → See crop recommendations
- [ ] Test 3: Weather API → See forecast displayed
- [ ] Test 4: Market API → See price table
- [ ] Test 5: Pest API → See disease analysis
- [ ] Test 6: Language → See content in new language

**All tests green?** ✅ Integration is working correctly!

---

## 📝 Log Analysis Tips

### Look for Success Pattern
```
[SECTION] User action
[SECTION] Sending request
[API REQUEST] ...
[API RESPONSE] Status: 200
[SECTION] Response received
[SECTION] UI updated
```

### Look for Error Pattern  
```
[SECTION] User action
[SECTION] Sending request
[API REQUEST] ...
[API ERROR] Network/4xx/5xx
[SECTION] Using fallback
```

### Check Timestamps
- Request and response should be within 1-2 seconds
- If longer, network is slow
- If error, check backend logs

### Verify Data Flow
1. Check request parameters in [API REQUEST]
2. Check response data in [API RESPONSE]
3. Verify UI reflects response data
4. Look for [SECTION] confirmation log

---

## 🛠️ Manual Testing via Console

### Test Chat API Directly
```javascript
fetch("http://localhost:5000/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "What crops should I grow?",
    language: "en"
  })
})
  .then(r => r.json())
  .then(d => console.log("Response:", d))
  .catch(e => console.log("Error:", e.message));
```

### Test Weather API Directly
```javascript
fetch("http://localhost:5000/api/weather?region=Kerala")
  .then(r => r.json())
  .then(d => console.log("Weather:", d))
  .catch(e => console.log("Error:", e.message));
```

### Test Market API Directly
```javascript
fetch("http://localhost:5000/api/market")
  .then(r => r.json())
  .then(d => console.log("Prices:", d))
  .catch(e => console.log("Error:", e.message));
```

---

## 🎓 Understanding Log Output

### Example: Successful Chat
```
[CHAT] User message sent: "Tell me about rice"
[CHAT] Sending request to /api/chat endpoint...
[API REQUEST] 2025-12-29T10:15:30.123Z
  Method: POST
  Endpoint: http://localhost:5000/api/chat
  Data: {message: "Tell me about rice", language: "en"}
[API RESPONSE] 2025-12-29T10:15:30.456Z
  Status: 200 OK
  Endpoint: /api/chat
  Data: {reply: "Rice is a staple crop..."}
[CHAT] Backend response received: {reply: "Rice is a staple crop..."}
[CHAT] Bot response added to UI: "Rice is a staple crop..."
```

**What This Tells Us**:
- ✅ Request sent successfully (Method, Endpoint, Data all correct)
- ✅ Backend responded in 333ms (reasonable time)
- ✅ Response has expected data format
- ✅ UI was updated with response

---

## ⚡ Performance Expectations

| Operation | Expected Time | Status |
|-----------|---------------|--------|
| Chat response | < 2 seconds | ⚡ Fast |
| Crop fetch | < 2 seconds | ⚡ Fast |
| Weather fetch | < 2 seconds | ⚡ Fast |
| Market fetch | < 2 seconds | ⚡ Fast |
| Image analysis | 2-5 seconds | ⚡ Normal |
| Language change | < 100ms | ⚡ Instant |

**If slower**: Check network tab for actual request time

---

## 📞 Getting Help

### Check These First
1. Is backend running? `http://localhost:5000/` in browser
2. Is frontend running? Can you see the app?
3. Look in console for [API ERROR] logs
4. Check Network tab for HTTP response codes
5. Verify API endpoint URLs match backend

### Common Issues

**Error: CORS policy blocked**
- Backend CORS already configured
- Check backend is running
- No changes needed to frontend

**Error: Cannot POST /api/chat**
- Backend endpoint doesn't exist
- Check backend has this route
- Check URL spelling

**No logs appearing**
- Open Console tab (not Elements tab)
- Perform action while watching console
- Search for [SECTION] keyword

---

## 🔗 Related Documents

- `INTEGRATION_VERIFICATION.md` - Detailed integration guide
- `API_TEST_SCRIPT.js` - Copy-paste testing commands
- `IMPLEMENTATION_SUMMARY.md` - What was changed and why

---

**Last Updated**: December 29, 2025
**Status**: ✅ Ready for Testing
