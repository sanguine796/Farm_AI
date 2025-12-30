from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)

# ========== MOCK DATA ==========

CROPS_DATA = [
    {
        "name": "Rice (Jyothi)",
        "season": "Kharif",
        "duration": "120 days",
        "yield": "4–5 tons/acre",
        "water_requirement": "High",
        "climate": "Tropical",
        "details": "High-yielding variety, suitable for regions with good rainfall. Requires 1200-1500mm annual rainfall."
    },
    {
        "name": "Wheat (HD 2967)",
        "season": "Rabi",
        "duration": "145 days",
        "yield": "45-50 quintals/hectare",
        "water_requirement": "Medium",
        "climate": "Temperate",
        "details": "Popular winter crop. Requires 40-45cm of rainfall. Thrives in well-drained soil."
    },
    {
        "name": "Corn (Makka)",
        "season": "Kharif/Summer",
        "duration": "100-120 days",
        "yield": "40-50 quintals/hectare",
        "water_requirement": "Medium",
        "climate": "Tropical",
        "details": "Versatile crop, used for food and animal feed. Requires moderate water."
    },
    {
        "name": "Cotton (MCU 5)",
        "season": "Kharif",
        "duration": "180-210 days",
        "yield": "15-20 quintals/hectare",
        "water_requirement": "Medium",
        "climate": "Semi-arid",
        "details": "Cash crop, requires good sunshine. Popular in Gujarat, Maharashtra, and Telangana."
    },
    {
        "name": "Tomato",
        "season": "Year-round",
        "duration": "60-80 days",
        "yield": "300-400 quintals/hectare",
        "water_requirement": "High",
        "climate": "Tropical",
        "details": "Vegetable crop, high market demand. Requires regular irrigation and pest management."
    },
    {
        "name": "Onion",
        "season": "Kharif/Rabi",
        "duration": "120-150 days",
        "yield": "200-250 quintals/hectare",
        "water_requirement": "Medium",
        "climate": "Tropical",
        "details": "Spice crop, good export market. Suitable for well-drained soil."
    },
]

WEATHER_FORECAST = [
    {"day": "Monday", "date": "Dec 28", "temp": 30, "humidity": 65, "rain": 10, "wind": 12},
    {"day": "Tuesday", "date": "Dec 29", "temp": 32, "humidity": 55, "rain": 0, "wind": 8},
    {"day": "Wednesday", "date": "Dec 30", "temp": 28, "humidity": 75, "rain": 25, "wind": 15},
    {"day": "Thursday", "date": "Dec 31", "temp": 31, "humidity": 60, "rain": 5, "wind": 10},
    {"day": "Friday", "date": "Jan 1", "temp": 29, "humidity": 70, "rain": 15, "wind": 14},
    {"day": "Saturday", "date": "Jan 2", "temp": 33, "humidity": 50, "rain": 0, "wind": 6},
    {"day": "Sunday", "date": "Jan 3", "temp": 27, "humidity": 80, "rain": 40, "wind": 18},
]

MARKET_PRICES = [
    {"crop": "Rice", "market": "Thrissur", "price": 2450, "unit": "per quintal", "trend": "up", "change": 3.5},
    {"crop": "Tomato", "market": "Kurnool", "price": 1800, "unit": "per quintal", "trend": "down", "change": 2.1},
    {"crop": "Onion", "market": "Nashik", "price": 2200, "unit": "per quintal", "trend": "up", "change": 1.8},
    {"crop": "Wheat", "market": "Punjab", "price": 2100, "unit": "per quintal", "trend": "stable", "change": 0},
    {"crop": "Corn", "market": "Maharashtra", "price": 1950, "unit": "per quintal", "trend": "down", "change": 0.5},
    {"crop": "Cotton", "market": "Gujarat", "price": 5800, "unit": "per bale", "trend": "up", "change": 2.3},
]

PEST_DISEASES = [
    {
        "disease": "Leaf Rust",
        "crops": ["Wheat", "Rice"],
        "severity": "High",
        "treatment": "Spray with copper-based fungicide every 10 days. Remove infected leaves.",
        "prevention": "Ensure proper spacing and air circulation. Avoid overhead irrigation."
    },
    {
        "disease": "Powdery Mildew",
        "crops": ["Tomato", "Onion"],
        "severity": "Medium",
        "treatment": "Use sulfur dust or neem oil spray at 2-3% concentration.",
        "prevention": "Maintain proper humidity levels. Provide good air ventilation."
    },
    {
        "disease": "Stem Borer",
        "crops": ["Corn", "Rice"],
        "severity": "High",
        "treatment": "Use BT (Bacillus thuringiensis) spray or insecticides. Remove affected stems.",
        "prevention": "Clean crop residues. Rotate crops annually."
    },
    {
        "disease": "Jassids",
        "crops": ["Cotton", "Okra"],
        "severity": "Medium",
        "treatment": "Spray with recommended insecticides. Monitor crop regularly.",
        "prevention": "Use resistant varieties. Remove affected leaves."
    },
]

# ========== API ENDPOINTS ==========

@app.route("/")
def home():
    return jsonify({
        "status": "AI Farming Assistant Backend Running",
        "version": "1.0",
        "endpoints": [
            "/api/crops",
            "/api/weather",
            "/api/market",
            "/api/pests",
            "/api/chat",
            "/api/detect"
        ]
    })

@app.route("/api/crops", methods=["GET"])
def get_crops():
    """Get crop recommendations based on season/region"""
    season = request.args.get("season", "").lower()
    
    if season:
        filtered = [c for c in CROPS_DATA if season in c["season"].lower()]
        return jsonify({"crops": filtered if filtered else CROPS_DATA})
    
    return jsonify({"crops": CROPS_DATA})

@app.route("/api/weather", methods=["GET"])
def get_weather():
    """Get 7-day weather forecast"""
    region = request.args.get("region", "Default")
    return jsonify({
        "region": region,
        "forecast": WEATHER_FORECAST,
        "current": {
            "temperature": "28°C",
            "humidity": "72%",
            "condition": "Partly Cloudy",
            "wind_speed": "10 km/h"
        }
    })

@app.route("/api/market", methods=["GET"])
def get_market():
    """Get current market prices for crops"""
    return jsonify({
        "timestamp": datetime.now().isoformat(),
        "prices": MARKET_PRICES,
        "message": "Prices updated hourly from major agricultural markets"
    })

@app.route("/api/pests", methods=["GET"])
def get_pests():
    """Get pest and disease information"""
    crop = request.args.get("crop", "").lower()
    
    if crop:
        filtered = [p for p in PEST_DISEASES if crop in [c.lower() for c in p["crops"]]]
        return jsonify({"pests": filtered if filtered else PEST_DISEASES})
    
    return jsonify({"pests": PEST_DISEASES})

@app.route("/api/detect", methods=["POST"])
def detect_disease():
    """Mock disease detection from image"""
    # In production, this would use a real ML model
    diseases = [d["disease"] for d in PEST_DISEASES]
    detected = random.choice(diseases)
    
    disease_info = next((d for d in PEST_DISEASES if d["disease"] == detected), None)
    
    return jsonify({
        "disease_detected": detected,
        "confidence": round(85 + random.random() * 15, 1),
        "severity": disease_info["severity"] if disease_info else "Unknown",
        "treatment": disease_info["treatment"] if disease_info else "Consult expert",
        "prevention": disease_info["prevention"] if disease_info else "Monitor crop regularly"
    })

@app.route("/api/chat", methods=["POST"])
def chat():
    """AI chatbot responses with language support"""
    data = request.json
    
    # Accept both 'message' and 'question' field names
    user_input = data.get("message") or data.get("question") or ""
    user_language = data.get("language", "en").lower()
    
    # Validate inputs
    if not user_input or not user_input.strip():
        return jsonify({
            "error": "Empty message",
            "reply": "Please ask a question."
        }), 400
    
    message_lower = user_input.lower().strip()
    
    # Response templates for different languages
    responses = {
        "en": {
            "crop": "Based on current season and weather, I recommend rice or wheat. Both have good market demand and suitable growing conditions.",
            "disease": "To detect diseases, upload a crop image in the Pest Detection section. Or tell me which crop you're growing and what symptoms you see.",
            "weather": "Check the Weather Advisory section for your region's forecast. It includes temperature, humidity, rainfall, and farming recommendations.",
            "price": "Visit the Market Prices page to see current crop prices across different markets. Prices update hourly from major agricultural markets.",
            "rain": "Avoid irrigation on rainy days. Check the weather forecast before watering your crops.",
            "pest": "Use neem oil or recommended insecticides for pest control. Early detection prevents crop loss.",
            "fertilizer": "Choose fertilizers based on soil testing. Use NPK (nitrogen-phosphorus-potassium) as recommended by agricultural experts.",
            "irrigation": "Irrigation frequency depends on crop type, soil, and weather. Rice needs 1200-1500mm annually, while wheat needs 40-45cm.",
            "default": "I'm here to help with your farming needs. Ask me about crops, pests, weather, prices, or any agricultural practices."
        },
        "hi": {
            "crop": "वर्तमान मौसम और मौसम के आधार पर, मैं चावल या गेहूं की सिफारिश करता हूं। दोनों का अच्छा बाजार मांग है।",
            "disease": "रोग का पता लगाने के लिए, कीट पहचान अनुभाग में फसल की तस्वीर अपलोड करें।",
            "weather": "मौसम सलाह अनुभाग में अपने क्षेत्र का पूर्वानुमान देखें।",
            "price": "बाजार भाव पृष्ठ पर विभिन्न बाजारों में फसलों की मौजूदा कीमतें देखें।",
            "rain": "बरसात के दिनों में सिंचाई न करें। पानी देने से पहले मौसम का पूर्वानुमान देखें।",
            "pest": "कीट नियंत्रण के लिए नीम का तेल या अनुशंसित कीटनाशकों का उपयोग करें।",
            "fertilizer": "मिट्टी परीक्षण के आधार पर उर्वरक चुनें।",
            "irrigation": "सिंचाई की आवृत्ति फसल के प्रकार पर निर्भर करती है।",
            "default": "मैं आपकी कृषि जरूरतों में मदद के लिए यहां हूं। मुझसे फसलों, कीटों, मौसम, या कीमतों के बारे में पूछें।"
        },
        "te": {
            "crop": "ప్రస్తుత సీజన్ మరియు వాతావరణం ఆధారంగా, నేను rice లేదా wheat సిఫారసు చేస్తాను.",
            "disease": "పూర్ణ పతనం గుర్తించడానికి, పీడ నిర్ధారణ విభాగంలో పంటల చిత్రం అప్‌లోడ్ చేయండి.",
            "weather": "వాతావరణ సలహా విభాగంలో మీ ప్రాంతం యొక్క సూచన చూడండి.",
            "price": "మార్కెట్ ధరల పేజీలో విభిన్న మార్కెట్‌లలో నిలకడ ధరలను చూడండి.",
            "rain": "వర్షపు రోజుల్లో నీటిని పోయవద్దు. నీటిని పోయడానికి ముందు వాతావరణ సూచనను చూడండి.",
            "pest": "పీడ నియంత్రణ కోసం నీమ చెయ్యడం లేదా సిఫారసు చేసిన కీటనాశకాలను ఉపయోగించండి.",
            "fertilizer": "మట్టి పరీక్ష ఆధారంగా ఎరువులను ఎంచుకోండి.",
            "irrigation": "నీటిపారపతి యొక్క ఫ్రీక్వెన్సీ పంట రకంపై ఆధారపడి ఉంటుంది.",
            "default": "నేను మీ వ్యవసాయ అవసరాలకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను. మన్నుకోండి పంటలు, కీటలు, వాతావరణం, లేదా ధరల గురించి."
        },
        "ml": {
            "crop": "നിലവിലെ സീസണും കാലാവസ്ഥയും ആധരിച്ച്, ഞാൻ അരി അല്ലെങ്കിൽ ഗോതമ്പ് ശുപാർശ ചെയ്യുന്നു.",
            "disease": "രോഗ കണ്ടെത്തുന്നതിന്, കീട നിയന്ത്രണ വിഭാഗത്തിൽ വിള ചിത്രം അപ്‌ലോഡ് ചെയ്യുക.",
            "weather": "കാലാവസ്ഥ ഉപദേശ വിഭാഗത്തിൽ നിങ്ങളുടെ പ്രദേശത്തിന്റെ പൂർവ്വാനുമാനം കാണുക.",
            "price": "വിപണി വിലകൾ പേജിൽ വിവിധ വിപണികളിൽ നിലവിലെ വിള വിലകൾ കാണുക.",
            "rain": "വർഷാ കാലത്ത് നീരാൽ പാലിക്കരുത്. നൈരാണമമ് പാലിക്കുന്നതിന് മുമ്പ് കാലാവസ്ഥ കാണുക.",
            "pest": "കീട നിയന്ത്രണത്തിനായി നീം എണ്ണ ഉപയോഗിക്കുക അല്ലെങ്കിൽ സുപാരിശ ചെയ്ത കീടനാശകങ്ങൾ.",
            "fertilizer": "മണ്ണിന്റെ പരീക്ഷയ്ക്ക് അനുസരിച്ച് വളം തെരഞ്ഞെടുക്കുക.",
            "irrigation": "നീരാൽ പാലിക്കാത്തിന്റെ ആവൃത്തി വിള തരത്തെ ആശ്രയിച്ചിരിക്കുന്നു.",
            "default": "നിങ്ങളുടെ കാർഷിക ആവശ്യങ്ങൾക്കായി ഞാൻ ഇവിടെ സഹായിക്കാൻ ഉണ്ട്. വിളകൾ, കീടങ്ങൾ, കാലാവസ്ഥ, വിലകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക."
        }
    }
    
    # Get responses for the requested language, fallback to English
    language_responses = responses.get(user_language, responses["en"])
    
    # Match keywords in the user input
    reply = language_responses.get("default")
    
    for keyword, response_text in language_responses.items():
        if keyword != "default" and keyword in message_lower:
            reply = response_text
            break
    
    print(f"[CHAT] User ({user_language}): {user_input}")
    print(f"[CHAT] Response ({user_language}): {reply}")
    
    return jsonify({
        "reply": reply,
        "answer": reply,
        "response": reply,
        "language": user_language,
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/advisory", methods=["GET"])
def farming_advisory():
    """Get farming advisory based on current conditions"""
    return jsonify({
        "advisory": [
            "Rainfall expected next week. Plan irrigation accordingly.",
            "High humidity today. Monitor for fungal diseases.",
            "Good market prices for rice. Consider selling if you have surplus.",
            "Pest activity reported in your region. Increase field visits.",
            "Proper spacing prevents disease spread. Maintain recommended plant density."
        ],
        "timestamp": datetime.now().isoformat()
    })

# ========== ERROR HANDLERS ==========

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ========== RUN ==========

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
