# Chat AI System - Quick Test Guide

## Start Everything (3 Simple Steps)

### Step 1: Terminal 1 - Start Frontend
```powershell
cd d:\Sanguine\Downloads\hacka\frontend
npm start
```
Wait for: `webpack compiled successfully`

### Step 2: Terminal 2 - Start Backend  
```powershell
cd d:\Sanguine\Downloads\hacka\backend
python app.py
```
Wait for: `Running on http://0.0.0.0:5000`

### Step 3: Open Browser
```
http://localhost:3000
```

---

## Quick Test Sequence

### Test 1: Text Chat
1. Type: "How do I grow rice?"
2. Click "Send"
3. ✅ Should get response about rice

### Test 2: Voice Input (English)
1. Keep language as English
2. Click 🎤 microphone button
3. Say: "Tell me about crops"
4. Click 🎤 button again (stops listening)
5. ✅ Should see your speech in text field
6. ✅ Should get response and hear it read aloud

### Test 3: Language Switching (Hindi)
1. Click language selector → Select हिंदी
2. Type or say: "कीटों से कैसे बचें?"
3. Send
4. ✅ Response should be ENTIRELY in Hindi
5. ✅ Audio should speak in Hindi

### Test 4: Language Switching (Telugu)
1. Click language selector → Select తెలుగు
2. Say or type farming question
3. Send
4. ✅ Response should be ENTIRELY in Telugu
5. ✅ No English mixed in

### Test 5: Language Switching (Malayalam)
1. Click language selector → Select മലയാളം  
2. Ask about weather or prices
3. Send
4. ✅ Response should be ENTIRELY in Malayalam

### Test 6: Multi-line Input
1. Type multiple lines of text
2. Use Shift+Enter for line breaks
3. Send
4. ✅ Entire multi-line message should be sent
5. ✅ No truncation

### Test 7: Error Handling
1. Deny microphone permission (first time only)
2. Click 🎤
3. ✅ Should show: "Microphone access denied"
4. Stop backend server
5. Try to send message
6. ✅ Should show: "Server error. Backend not running"

---

## What To Look For

### Console Logs (F12 → Console Tab)

**Good Voice Input:**
```
[VOICE] Starting voice input for language: en
[VOICE] Final result: Tell me about crops
[VOICE] Speech recognition ended
```

**Good Chat:**
```
[CHAT-API] Sending message: Tell me about crops
[CHAT-API] Language: en
[CHAT-API] Backend response received: Based on current season...
```

**Bad Voice Input:**
```
[VOICE] Speech recognition error: no-speech
```

**Bad Chat:**
```
[CHAT-API] Error: HTTP 500: Backend request failed
```

---

## Expected Responses by Topic

### Crops Question
**English:** "Based on current season and weather, I recommend rice or wheat..."
**Hindi:** "वर्तमान मौसम के आधार पर, मैं चावल या गेहूं की सिफारिश करता हूं..."
**Telugu:** "ప్రస్తుత సీజన్ ఆధారంగా, నేను rice లేదా wheat సిఫారసు చేస్తాను..."
**Malayalam:** "നിലവിലെ സീസണും കാലാവസ്ഥയും ആധരിച്ച്, ഞാൻ അരി അല്ലെങ്കിൽ ഗോതമ്പ് ശുപാർശ ചെയ്യുന്നു..."

### Disease Question
**English:** "To detect diseases, upload a crop image in the Pest Detection section..."
**Hindi:** "रोग का पता लगाने के लिए, कीट पहचान अनुभाग में फसल की तस्वीर अपलोड करें..."

### Weather Question
**English:** "Check the Weather Advisory section for your region's forecast..."
**Hindi:** "मौसम सलाह अनुभाग में अपने क्षेत्र का पूर्वानुमान देखें..."

### Market/Price Question
**English:** "Visit the Market Prices page to see current crop prices..."
**Hindi:** "बाजार भाव पृष्ठ पर विभिन्न बाजारों में फसलों की मौजूदा कीमतें देखें..."

---

## If Something Breaks

### Chat not responding?
1. Check if backend is running: `python app.py`
2. Check browser console for `[CHAT-API]` errors
3. Verify backend at: http://localhost:5000

### Voice input not working?
1. Check browser microphone permission
2. Check console for `[VOICE]` errors
3. Try different language
4. Reload page (Ctrl+R)

### Wrong language responses?
1. Verify language is selected in navbar
2. Check console for language code
3. Refresh page if needed
4. Check that backend is running latest code

### Build failed?
1. Kill node processes: `Get-Process node | Stop-Process -Force`
2. Delete node_modules: `Remove-Item node_modules -Recurse`
3. Reinstall: `npm install`
4. Try again: `npm start`

---

## Quick Commands

```powershell
# Kill all node processes
Get-Process node | Stop-Process -Force

# Start frontend
cd frontend; npm start

# Start backend  
cd backend; python app.py

# Clear all installations and reinstall
cd frontend
Remove-Item node_modules -Recurse
Remove-Item package-lock.json
npm install
npm start
```

---

## Expected Flow

```
User speaks/types in language X
    ↓
Frontend records speech in language X
    ↓
Speech converted to text in language X
    ↓
Sends to backend with language parameter
    ↓
Backend generates response in language X
    ↓
Frontend displays response in language X
    ↓
Frontend reads response aloud in language X
    ↓
User hears answer in language X ✅
```

---

## Performance Notes

- Response time: 1-3 seconds (includes API call + text-to-speech setup)
- Voice recognition: Usually within 1-2 seconds of stopping
- Text sending: Should be instant
- Multiple languages: Seamless switching without reload needed

---

**Last Updated:** December 30, 2025
**Status:** Ready to Test
