// ========== FRONTEND-BACKEND INTEGRATION TEST SCRIPT ==========
// 
// Copy and paste these commands in browser console (F12 → Console)
// to manually test each API endpoint
//
// ============================================================

// TEST 1: VERIFY API SERVICE IS LOADED
// Expected: Should show axios instance with interceptors
console.log("=== TEST 1: API Service ===");
fetch("http://localhost:5000/")
  .then(r => r.json())
  .then(data => {
    console.log("✅ Backend is running!");
    console.log("Available endpoints:", data.endpoints);
  })
  .catch(e => console.log("❌ Backend not responding:", e.message));

// ============================================================

// TEST 2: TEST CHAT ENDPOINT
// Expected: Bot response in console + API logs
console.log("\n=== TEST 2: Chat API (/api/chat) ===");
fetch("http://localhost:5000/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "What crops should I grow?",
    language: "en"
  })
})
  .then(r => r.json())
  .then(data => {
    console.log("✅ Chat API Response:");
    console.log("Bot Reply:", data.reply);
    console.log("\nCheck browser console for [CHAT] logs");
  })
  .catch(e => console.log("❌ Chat API Error:", e.message));

// ============================================================

// TEST 3: TEST CROPS ENDPOINT
// Expected: Crop recommendations in console + API logs
console.log("\n=== TEST 3: Crops API (/api/crops) ===");
fetch("http://localhost:5000/api/crops?season=kharif&region=kerala")
  .then(r => r.json())
  .then(data => {
    console.log("✅ Crops API Response:");
    console.log("Total crops:", data.crops.length);
    console.log("First crop:", data.crops[0]?.name);
    console.log("\nCheck browser console for [CROPS] logs");
  })
  .catch(e => console.log("❌ Crops API Error:", e.message));

// ============================================================

// TEST 4: TEST WEATHER ENDPOINT
// Expected: Weather forecast in console + API logs
console.log("\n=== TEST 4: Weather API (/api/weather) ===");
fetch("http://localhost:5000/api/weather?region=Kerala")
  .then(r => r.json())
  .then(data => {
    console.log("✅ Weather API Response:");
    console.log("Region:", data.region);
    console.log("Current temp:", data.current.temperature);
    console.log("Forecast days:", data.forecast.length);
    console.log("\nCheck browser console for [WEATHER] logs");
  })
  .catch(e => console.log("❌ Weather API Error:", e.message));

// ============================================================

// TEST 5: TEST MARKET ENDPOINT
// Expected: Market prices in console + API logs
console.log("\n=== TEST 5: Market API (/api/market) ===");
fetch("http://localhost:5000/api/market")
  .then(r => r.json())
  .then(data => {
    console.log("✅ Market API Response:");
    console.log("Updated at:", data.timestamp);
    console.log("Total crops:", data.prices.length);
    console.log("First crop:", data.prices[0]?.crop, "at", data.prices[0]?.price);
    console.log("\nCheck browser console for [MARKET] logs");
  })
  .catch(e => console.log("❌ Market API Error:", e.message));

// ============================================================

// TEST 6: TEST DISEASE DETECTION ENDPOINT
// Expected: Disease detection result in console + API logs
// Note: This requires file upload, tested via UI instead
console.log("\n=== TEST 6: Disease Detection API (/api/detect) ===");
console.log("This endpoint requires file upload.");
console.log("To test: Navigate to Pest page → Upload image → Click Analyze");
console.log("Check browser console for [PEST] logs");

// ============================================================

// TEST 7: VERIFY LANGUAGE PERSISTENCE
// Expected: Language saved to localStorage
console.log("\n=== TEST 7: Language Persistence ===");
console.log("Current language in storage:", localStorage.getItem("farmAiLanguage"));
console.log("To test: Click language selector → Choose different language");
console.log("Check console for [LANGUAGE] logs");

// ============================================================

// TEST 8: MONITOR ALL API CALLS
// Expected: Every API call should log with [API REQUEST] and [API RESPONSE]
console.log("\n=== TEST 8: API Call Monitoring ===");
console.log("All API calls are automatically logged with:");
console.log("  - [API REQUEST] for outgoing requests");
console.log("  - [API RESPONSE] for successful responses");
console.log("  - [API ERROR] for failed requests");
console.log("\nPerform any action in the app and watch the console logs.");

// ============================================================

// QUICK REFERENCE: LOG PATTERNS
// ============================================================
/*

Pattern: [SECTION] Message Details

LANGUAGE LOGS:
  [LANGUAGE] User selected language: hi (हिंदी)
  [LANGUAGE] Updating language context...
  [LANGUAGE] Language changed to: hi

CHAT LOGS:
  [CHAT] User message sent: "..."
  [CHAT] Sending request to /api/chat endpoint...
  [CHAT] Backend response received: {...}
  [CHAT] Bot response added to UI: "..."
  [CHAT] API Error: {...}

CROPS LOGS:
  [CROPS] Requesting crop recommendations...
  [CROPS] Form data: {...}
  [CROPS] Sending request to /api/crops endpoint...
  [CROPS] Backend response received: {...}
  [CROPS] Recommendations updated in UI: X crops
  [CROPS] API Error: {...}

WEATHER LOGS:
  [WEATHER] Fetching weather data from API...
  [WEATHER] Sending request to /api/weather endpoint...
  [WEATHER] Backend response received: {...}
  [WEATHER] Weather data updated in UI
  [WEATHER] API Error: {...}

MARKET LOGS:
  [MARKET] Fetching market prices from API...
  [MARKET] Sending request to /api/market endpoint...
  [MARKET] Backend response received: {...}
  [MARKET] Market data updated in UI
  [MARKET] API Error: {...}

PEST LOGS:
  [PEST] Analyzing uploaded image...
  [PEST] Image data: {name, size, type}
  [PEST] Sending request to /api/detect endpoint...
  [PEST] Backend response received: {...}
  [PEST] Analysis result updated in UI: {...}
  [PEST] API Error: {...}

API LOGS:
  [API REQUEST] timestamp
    Method: GET/POST
    Endpoint: http://localhost:5000/api/...
    Data/Params: {...}
  
  [API RESPONSE] timestamp
    Status: 200 OK
    Endpoint: /api/...
    Data: {...}
  
  [API ERROR] timestamp
    Status: 4xx/5xx
    Endpoint: /api/...
    Error: {...}

*/

// ============================================================

// TROUBLESHOOTING CHECKLIST
console.log("\n=== TROUBLESHOOTING CHECKLIST ===");
console.log("□ Backend running on http://localhost:5000?");
console.log("□ Frontend running on http://localhost:3000?");
console.log("□ Both servers configured correctly?");
console.log("□ No CORS errors in browser console?");
console.log("□ Network tab shows successful requests?");
console.log("□ Console shows [API] logs?");
console.log("□ UI updates match API responses?");

// ============================================================
// End of test script
// ============================================================
