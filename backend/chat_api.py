"""
FastAPI Backend for Farm AI Chat System
Implements language detection, AI-powered responses, and context-aware farming advice
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import logging
import json
import os
from typing import Optional, Dict, Any

# Optional: For language detection
try:
    from langdetect import detect, LangDetectException
    LANGDETECT_AVAILABLE = True
except ImportError:
    LANGDETECT_AVAILABLE = False

# Optional: For AI-powered responses using Hugging Face
try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="Farm AI Chat API", version="2.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== LANGUAGE-SPECIFIC KNOWLEDGE BASE ==========

FARMING_KNOWLEDGE_BASE = {
    "en": {
        "crop_selection": {
            "keywords": ["crop", "grow", "plant", "farm", "cultivation", "best"],
            "response": "Based on current season and your region, consider these crops:\n\n🌾 Rice: Suitable for tropical regions with rainfall. Kharif season crop.\n🌾 Wheat: Ideal for winter (Rabi) season. Needs moderate water.\n🌾 Corn: Versatile crop for both Kharif and summer. Good yield potential.\n\nPlease share your region and current season for better recommendations."
        },
        "disease_management": {
            "keywords": ["disease", "pest", "leaf", "spot", "blight", "wilt", "treat", "control"],
            "response": "For pest and disease management:\n\n🔬 Leaf Rust: Apply copper-based fungicide every 10 days. Remove infected leaves.\n🔬 Powdery Mildew: Use sulfur dust or neem oil at 2-3% concentration.\n🔬 Stem Borer: Apply BT spray or recommended insecticides. Remove affected stems.\n\nFor accurate diagnosis, upload an image in the Pest Detection section."
        },
        "irrigation": {
            "keywords": ["water", "irrigation", "rain", "rainfall", "moisture", "dry"],
            "response": "Irrigation guidance for your crops:\n\n💧 Rice: Needs 1200-1500mm annual rainfall. Maintain 5-10cm water level.\n💧 Wheat: Requires 40-45cm rainfall. 4-5 irrigations needed.\n💧 Corn: 50-60cm water requirement. Avoid waterlogging.\n\nCheck weather forecast before deciding irrigation timing."
        },
        "soil_fertility": {
            "keywords": ["soil", "fertility", "fertilizer", "nutrient", "npk", "manure"],
            "response": "Soil and nutrient management:\n\n🌱 Conduct soil testing to determine nutrient status.\n🌱 Use balanced NPK (Nitrogen-Phosphorus-Potassium) as recommended.\n🌱 Rice: N-P-K = 120-60-40 kg/hectare\n🌱 Wheat: N-P-K = 120-60-40 kg/hectare\n🌱 Corn: N-P-K = 150-80-40 kg/hectare\n\nIncorporate organic matter (3-5 tons/hectare) annually."
        },
        "weather": {
            "keywords": ["weather", "temperature", "humidity", "wind", "forecast", "climate"],
            "response": "For weather-specific farming advice:\n\n🌤️ High temperature: Increase irrigation frequency. Use mulching.\n🌤️ High humidity: Monitor for fungal diseases. Ensure proper spacing.\n🌤️ Strong wind: Support tall crops. Check for pest infestations.\n🌤️ Heavy rain: Avoid harvesting. Improve drainage systems.\n\nCheck the Weather Advisory section for detailed forecasts."
        },
        "market": {
            "keywords": ["price", "market", "sell", "cost", "profit", "demand"],
            "response": "Market and pricing information:\n\n💰 Current market rates vary by region and season.\n💰 Rice: ₹2000-2500 per quintal\n💰 Wheat: ₹2100-2400 per quintal\n💰 Vegetables: ₹1000-1500 per quintal (seasonal variation)\n\nCheck the Market Prices section for real-time rates in your region."
        }
    },
    "hi": {
        "crop_selection": {
            "keywords": ["फसल", "उगाएं", "लगाएं", "खेती", "खेत", "सर्वश्रेष्ठ"],
            "response": "वर्तमान मौसम और आपके क्षेत्र के आधार पर, इन फसलों पर विचार करें:\n\n🌾 चावल: उष्णकटिबंधीय क्षेत्रों के लिए उपयुक्त। खरीफ फसल।\n🌾 गेहूं: सर्दियों (रबी) के लिए आदर्श। मध्यम पानी चाहिए।\n🌾 मकई: खरीफ और गर्मी दोनों के लिए बहुमुखी। अच्छी उपज क्षमता।\n\nबेहतर सिफारिशों के लिए कृपया अपना क्षेत्र और मौसम बताएं।"
        },
        "disease_management": {
            "keywords": ["रोग", "कीट", "पत्ती", "चित्ती", "झुलसा", "इलाज", "नियंत्रण"],
            "response": "कीट और रोग प्रबंधन के लिए:\n\n🔬 पत्ती झुलसा: हर 10 दिन में तांबे-आधारित कवकनाशी लगाएं। संक्रमित पत्तियां हटाएं।\n🔬 पाउडरी मिल्ड्यू: सल्फर पाउडर या नीम तेल 2-3% सांद्रता में उपयोग करें।\n🔬 तना बेधक: बीटी स्प्रे या अनुशंसित कीटनाशक लगाएं।\n\nसटीक निदान के लिए कीट पहचान अनुभाग में एक छवि अपलोड करें।"
        },
        "irrigation": {
            "keywords": ["पानी", "सिंचाई", "बारिश", "वर्षा", "नमी", "सूखा"],
            "response": "आपकी फसलों के लिए सिंचाई मार्गदर्शन:\n\n💧 चावल: 1200-1500 मिमी वार्षिक वर्षा चाहिए। 5-10 सेमी पानी बनाए रखें।\n💧 गेहूं: 40-45 सेमी वर्षा चाहिए। 4-5 सिंचाई आवश्यक है।\n💧 मकई: 50-60 सेमी पानी चाहिए। जलभराव से बचें।\n\nसिंचाई का समय तय करने से पहले मौसम का पूर्वानुमान देखें।"
        },
        "soil_fertility": {
            "keywords": ["मिट्टी", "उर्वरता", "खाद", "पोषक", "एनपीके", "गोबर"],
            "response": "मिट्टी और पोषक तत्व प्रबंधन:\n\n🌱 पोषक स्थिति निर्धारित करने के लिए मिट्टी की जांच कराएं।\n🌱 अनुशंसित संतुलित एनपीके का उपयोग करें।\n🌱 चावल: एन-पी-के = 120-60-40 किग्रा/हेक्टेयर\n🌱 गेहूं: एन-पी-के = 120-60-40 किग्रा/हेक्टेयर\n🌱 मकई: एन-पी-के = 150-80-40 किग्रा/हेक्टेयर\n\nसालाना 3-5 टन/हेक्टेयर जैविक पदार्थ शामिल करें।"
        },
        "weather": {
            "keywords": ["मौसम", "तापमान", "नमी", "हवा", "पूर्वानुमान", "जलवायु"],
            "response": "मौसम-विशिष्ट खेती सलाह:\n\n🌤️ उच्च तापमान: सिंचाई आवृत्ति बढ़ाएं। मल्चिंग का उपयोग करें।\n🌤️ उच्च नमी: कवक रोगों की निगरानी करें। उचित दूरी सुनिश्चित करें।\n🌤️ तेज हवा: लंबी फसलों को सहारा दें। कीट संक्रमण की जांच करें।\n🌤️ भारी बारिश: कटाई न करें। जल निकासी प्रणाली में सुधार करें।\n\nविस्तृत पूर्वानुमान के लिए मौसम सलाह अनुभाग देखें।"
        },
        "market": {
            "keywords": ["कीमत", "बाजार", "बेचें", "लागत", "लाभ", "मांग"],
            "response": "बाजार और मूल्य निर्धारण जानकारी:\n\n💰 वर्तमान बाजार दरें क्षेत्र और मौसम के अनुसार अलग-अलग होती हैं।\n💰 चावल: ₹2000-2500 प्रति क्विंटल\n💰 गेहूं: ₹2100-2400 प्रति क्विंटल\n💰 सब्जियां: ₹1000-1500 प्रति क्विंटल (मौसमी भिन्नता)\n\nअपने क्षेत्र में वास्तविक दरों के लिए बाजार भाव अनुभाग देखें।"
        }
    },
    "te": {
        "crop_selection": {
            "keywords": ["పంట", "నాటండి", "పెంచండి", "వ్యవసాయం", "క్రాప్", "సరైనది"],
            "response": "ప్రస్తుత సీజన్ మరియు మీ ప్రాంతం ఆధారంగా ఈ పంటలను పరిగణించండి:\n\n🌾 వరి: ఉష్ణమండల ప్రాంతాలకు అనుకూలం. ఖరీఫ్ ఫసల్.\n🌾 గోధుమ: శీతకాలం (రబీ) కోసం ఆదర్శం. మధ్యమ నీరు అవసరం.\n🌾 మక్క: ఖరీఫ్ మరియు వేసవి రెండింటికీ బహుముఖ. మంచి ఫలితం సామర్థ్యం.\n\nచక్కని సిఫారసుల కోసం దయచేసి మీ ప్రాంతం మరియు సీజన్ చెప్పండి."
        },
        "disease_management": {
            "keywords": ["వ్యాధి", "పీడ", "ఆకు", "చుక్క", "ఆక్ష్యల్", "చికిత్స", "నియంత్రణ"],
            "response": "పీడ మరియు వ్యాధి నిర్వహణ కోసం:\n\n🔬 ఆకు ఆక్ష్యల్: ప్రతి 10 రోజులకు రాగి-ఆధారిత శిలీందన్ పూయండి. సংక్రమిత ఆకులను తీసివేయండి.\n🔬 పౌడర్ మిల్డ్యూ: సల్ఫర్ పౌడర్ లేదా నీమ నూనె 2-3% సాంద్రతలో ఉపయోగించండి.\n🔬 కాండం ఛేదకుడు: బీటీ స్ప్రే లేదా సిఫారసు చేసిన కీటకనాశకాలను ఉపయోగించండి.\n\nఖచ్చితమైన నిర్ధారణ కోసం పీడ గుర్తింపు విభాగంలో చిత్రం అపుడేట్ చేయండి."
        },
        "irrigation": {
            "keywords": ["నీరు", "నీటిపారపతి", "వర్ష", "వర్షపాతం", "తేమ", "건조"],
            "response": "మీ పంటలకు నీటిపారపతి మార్గదర్శకం:\n\n💧 వరి: 1200-1500 మిమీ సంవత్సర వర్షపాతం అవసరం. 5-10 సెంమీ నీరు నిర్వహించండి.\n💧 గోధుమ: 40-45 సెంమీ వర్షపాతం అవసరం. 4-5 నీటిపారపతి అవసరం.\n💧 మక్క: 50-60 సెంమీ నీరు అవసరం. జలయుక్తతను నివారించండి.\n\nనీటిపారపతి సమయం నిర్ణయించే ముందు వాతావరణ సూచన చూడండి."
        },
        "soil_fertility": {
            "keywords": ["మట్టి", "సంఖ్యాభూమి", "ఎరువు", "పోషక", "ఎన్పీకే", "గోవర"],
            "response": "మట్టి మరియు పోషక నిర్వహణ:\n\n🌱 పోషక స్థితిని నిర్ధారించడానికి మట్టి పరీక్ష నిర్వహించండి.\n🌱 సిఫారసు చేసిన సమతుల్య NPK ఉపయోగించండి.\n🌱 వరి: N-P-K = 120-60-40 కిలోలు/హెక్టారు\n🌱 గోధుమ: N-P-K = 120-60-40 కిలోలు/హెక్టారు\n🌱 మక్క: N-P-K = 150-80-40 కిలోలు/హెక్టారు\n\nవార్షికంగా 3-5 టన్నులు/హెక్టారు సేంద్రీయ పదార్థం చేర్చండి."
        },
        "weather": {
            "keywords": ["వాతావరణం", "ఉష్ణోగ్రత", "తేమ", "గాలి", "సూచన", "సుమారు"],
            "response": "వాతావరణ-నిర్దిష్ట వ్యవసాయ సలహా:\n\n🌤️ అధిక ఉష్ణోగ్రత: నీటిపారపతి ఫ్రీక్వెన్సీ పెంచండి. మల్చింగ్ ఉపయోగించండి.\n🌤️ అధిక తేమ: శిలీందన్ వ్యాధుల నిఘా చేయండి. సరైన ఖాళీని నిర్ధారించండి.\n🌤️ బలమైన గాలి: పొడవైన పంటలకు సమర్థన ఇవ్వండి. పీడ సంక్రమణ తనిఖీ చేయండి.\n🌤️ భారీ వర్ష: కోత చేయవద్దు. నీటి ఖాళీ వ్యవస్థలను మెరుగుపరచండి.\n\nవివరణాత్మక సూచనల కోసం వాతావరణ సలహా విభాగం చూడండి."
        },
        "market": {
            "keywords": ["ధర", "మార్కెట్", "అమ్మండి", "ఖర్చు", "లాభం", "డిమాండ్"],
            "response": "మార్కెట్ మరియు ధర నిర్ణయ సమాచారం:\n\n💰 ప్రస్తుత మార్కెట్ రేట్‌లు ప్రాంతం మరియు సీజన్ ప్రకారం విభిన్నంగా ఉంటాయి.\n💰 వరి: ₹2000-2500 ఒక్క క్విందలుకు\n💰 గోధుమ: ₹2100-2400 ఒక్క క్విందలుకు\n💰 కూరగాయలు: ₹1000-1500 ఒక్క క్విందలుకు (ఋతుపరమైన వైవిధ్యం)\n\nమీ ప్రాంతంలో నిజ సమయ రేట్‌ల కోసం మార్కెట్ ధరల విభాగం చూడండి."
        }
    },
    "ml": {
        "crop_selection": {
            "keywords": ["വിള", "നടയ്ക്കുക", "പെരുക്കുക", "കൃഷി", "വിളകൾ", "നല്ലത്"],
            "response": "നിലവിലെ സീസണും നിങ്ങളുടെ പ്രദേശവും അടിസ്ഥാനമാക്കി ഈ വിളകൾ പരിഗണിക്കുക:\n\n🌾 അരി: ഉഷ്ണമേഖലാ പ്രദേശങ്ങൾക്കായി അനുയോജ്യം. ഖരിഫ് ഫസല്.\n🌾 ഗോതമ്പ്: ശൈത്യകാലത്തിന് (രബി) അനുയോജ്യം. മിതമായ നീര് ആവശ്യമാണ്.\n🌾 ധാന്യം: ഖരിഫ് മരുന്നും വേനൽക്കാലത്തും ബഹുമുഖമാണ്. നല്ല വിളവ് സാധ്യത.\n\nកាន്നതരമായ ശുപാര്ശകൾക്കായി ദയവായി നിങ്ങളുടെ പ്രദേശം മഴ സീസണ്‍ എന്ന് പറയുക."
        },
        "disease_management": {
            "keywords": ["രോഗം", "കീട", "ഇല", "ബ്ലാച്ച്", "ബ്ലൈറ്റ്", "ചികിത്സ", "നിയന്ത്രണം"],
            "response": "കീടം മരുന്നും രോഗ നിര്വ്വഹണത്തിനായി:\n\n🔬 ഇലപറ്റ്: ഓരോ 10 ദിവസത്തിലും ചെമ്പ് അധിഷ്ഠിത കളരവാൻ ഉപയോഗിക്കുക. രോഗാന്വിതമായ ഇലകൾ നീക്കം ചെയ്യുക.\n🔬 പൗഡരി ചായ: സൾഫര് പൗഡര് അല്ലെങ്കിൽ നീം എണ്ണ 2-3% സാന്ദ്രതയില് ഉപയോഗിക്കുക.\n🔬 തണ്ട് വ്ധരാഭി: BTതെളിക്കം അല്ലെങ്കിൽ ശുപാരിതമായ കീടനാശകങ്ങള് ഉപയോഗിക്കുക.\n\nത്രുടിയായ നിര്ണയത്തിനായി കീട കണ്ടെത്തൽ വിഭാഗത്തില് ഒരു ചിത്രം കയറ്റുക."
        },
        "irrigation": {
            "keywords": ["നീര്", "നീരാൽപാലനം", "മഴ", "മേഘ", "ഈര്ത്തം", "വറ്റിയ"],
            "response": "നിങ്ങളുടെ വിളകൾക്കായി നീരാൽപാലന നിര്ദേശം:\n\n💧 അരി: 1200-1500 എമിഎം വാർഷിക മൂലാധാരം ആവശ്യമാണ്. 5-10 സെന്റിമീറ്റർ നീര് നിലനിര്ത്തുക.\n💧 ഗോതമ്പ്: 40-45 സെന്റിമീറ്റർ മൂലാധാരം ആവശ്യമാണ്. 4-5 നീരാൽപാലന വേണ്ടിവരും.\n💧 ധാന്യം: 50-60 സെന്റിമീറ്റർ നീര് ആവശ്യമാണ്. ജലബന്ധും വേണ്ടാ.\n\nനീരാൽപാലന സമയം നിര്ണയിക്കുന്നതിനു മുന്നേ കാലാവസ്ഥ പൂര്വാനുമാനം കാണുക."
        },
        "soil_fertility": {
            "keywords": ["മണ്ണ്", "ഭൂര്വതൃ", "വളം", "പോഷകം", "എൻപികെ", "മൃഗ"],
            "response": "മണ്ണും പോഷക നിര്വ്വഹണം:\n\n🌱 പോഷക സ്വരൂപം നിര്ണയിക്കാൻ മണ്ണിന് പരിശോധനയ്ക്കു വിടുക.\n🌱 ശുപാരിതമായ സന്തുലിത എൻപികെ ഉപയോഗിക്കുക.\n🌱 അരി: എൻ-പി-കെ = 120-60-40 കിലോ/ഹെക്ടര്\n🌱 ഗോതമ്പ്: എൻ-പി-കെ = 120-60-40 കിലോ/ഹെക്ടര്\n🌱 ധാന്യം: എൻ-പി-കെ = 150-80-40 കിലോ/ഹെക്ടര്\n\nവാര്ഷികമായി 3-5 ടണ്/ഹെക്ടര് ജൈവ വിഷയം ഉൾപ്പെടുത്തുക."
        },
        "weather": {
            "keywords": ["കാലാവസ്ഥ", "സ്നേഹം", "ഭഗ്നത", "കാറ്റ്", "പൂര്വാനുമാനം", "ആംബ്"],
            "response": "കാലാവസ്ഥ-നിര്ദിഷ്ട കൃഷി സലാഹ:\n\n🌤️ ഉയര്ന്ന താപനില: നീരാൽപാലന ആവര്ത്തനം വര്ധിപ്പിക്കുക. മള്ച്ചിംഗ് ഉപയോഗിക്കുക.\n🌤️ ഉയര്ന്ന ഈര്ത്തം: ശിലീന്ദ്ര രോഗങ്ങള്ക്കുവേണ്ടി നിരീക്ഷണം നടത്തുക. ശരിയായ ഇടം ഉറപ്പുവരുത്തുക.\n🌤️ ശക്തമായ കാറ്റ്: നീണ്ട വിളകൾക്കുവേണ്ടി പിന്തുണ നല്കുക. കീട ദ്ധരാഭി പരിശോധന ചെയ്യുക.\n🌤️ വലിയ മഴ: കൊയ്ത്തിരുത്തം ചെയ്യരുത്. ജലനിഷ്കാസന സംവിധാനങ്ങൾ ഉന്നയിക്കുക.\n\nവിശദമായ പൂര്വാനുമാനങ്ങൾക്കായി കാലാവസ്ഥ സലാഹ വിഭാഗം കാണുക."
        },
        "market": {
            "keywords": ["വിലയും", "മാര്കെറ്റ്", "വിറ്റ", "ചെലവ്", "ലാഭം", "ചാഹ"],
            "response": "മാര്കെറ്റും വിലയും നിര്ണയന സൂചന:\n\n💰 നിലവിലെ മാര്കെറ്റ് നിരക്കുകൾ പ്രദേശത്തിനും സീസണിനും അനുസരിച്ച് ഭിന്നമാണ്.\n💰 അരി: ₹2000-2500 ഒരു കിന്നരത്തിനു\n💰 ഗോതമ്പ്: ₹2100-2400 ഒരു കിന്നരത്തിനു\n💰 പച്ചക്കറികൾ: ₹1000-1500 ഒരു കിന്നരത്തിനു (കാലപ്രാപ്ത വ്യത്യാസം)\n\nനിങ്ങളുടെ പ്രദേശത്ത് സജീവ നിരക്കുകൾക്കായി മാര്കെറ്റ് വിലകൾ വിഭാഗം കാണുക."
        }
    }
}

# ========== REQUEST/RESPONSE MODELS ==========

class ChatRequest(BaseModel):
    message: str
    question: Optional[str] = None
    language: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    answer: str
    response: str
    language: str
    timestamp: str
    confidence: float = 0.8


# ========== LANGUAGE DETECTION ==========

def detect_language_from_text(text: str) -> str:
    """
    Detect language from input text.
    Returns: 'en', 'hi', 'te', 'ml'
    """
    if not text or not text.strip():
        return "en"  # Default to English
    
    if LANGDETECT_AVAILABLE:
        try:
            detected = detect(text)
            # Map detected language codes to our supported languages
            language_map = {
                'en': 'en',
                'hi': 'hi',
                'te': 'te',
                'ml': 'ml',
                'kn': 'te',  # Close to Telugu
                'ta': 'te',  # Close to Telugu
            }
            return language_map.get(detected, 'en')
        except LangDetectException:
            return "en"
    
    # Fallback: Simple keyword detection
    text_lower = text.lower()
    
    # Telugu keywords
    if any(telugu_char in text for telugu_char in 'ఆఇీెెోోౌఌ్్్్్్్్్్్్్్్్'):
        return 'te'
    
    # Hindi keywords
    if any(hindi_char in text for hindi_char in 'अइईएओऔाིીుૂૃેૈોૌં'):
        return 'hi'
    
    # Malayalam keywords
    if any(malayalam_char in text for malayalam_char in 'അഈഉഊഋഎഏഐഒഓഔാിീുൂൃെേൈോോൌം'):
        return 'ml'
    
    # Default to English
    return 'en'


# ========== AI RESPONSE GENERATION ==========

def generate_ai_response(user_input: str, detected_language: str) -> str:
    """
    Generate AI-powered response based on user input and language.
    Uses knowledge base for context-aware farming advice.
    """
    
    # Normalize input
    text_lower = user_input.lower().strip()
    
    # Get knowledge base for the language
    kb = FARMING_KNOWLEDGE_BASE.get(detected_language, FARMING_KNOWLEDGE_BASE.get('en'))
    
    # Find best matching category
    best_match = None
    best_score = 0
    
    for category, content in kb.items():
        keywords = content.get('keywords', [])
        score = 0
        
        for keyword in keywords:
            if keyword in text_lower:
                score += 1
        
        if score > best_score:
            best_score = score
            best_match = category
    
    # Return response from knowledge base
    if best_match and best_score > 0:
        response = kb[best_match]['response']
        logger.info(f"[AI] Matched category: {best_match} (score: {best_score})")
        return response
    
    # Default fallback response (should be in correct language)
    fallback_responses = {
        'en': "I'm here to help with your farming questions. Please ask me about crops, pest management, irrigation, soil fertility, weather, or market prices.",
        'hi': "मैं आपकी कृषि संबंधी प्रश्नों में मदद करने के लिए यहां हूं। मुझसे फसलों, कीट प्रबंधन, सिंचाई, मिट्टी की उर्वरता, मौसम, या बाजार भाव के बारे में पूछें।",
        'te': "నేను మీ వ్యవసాయ ప్రశ్నలకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను. పంటలు, పీడ నిర్వహణ, నీటిపారపతి, మట్టి సంపద, వాతావరణం, లేదా మార్కెట్ ధరల గురించి నా నుండి ప్రశ్నించండి.",
        'ml': "ഞാൻ നിങ്ങളുടെ കൃഷി ചോദ്യങ്ങൾക്കു സഹായിക്കാൻ ഇവിടെയുണ്ട്. വിളകൾ, കീട നിര്വഹണം, നീരാൽപാലനം, മണ്ണ് സമൃദ്ധി, കാലാവസ്ഥ, അല്ലെങ്കിൽ വിപണി വിലകൾ എന്നിവയെ കുറിച്ച് എന്നോട് ചോദിക്കുക."
    }
    
    return fallback_responses.get(detected_language, fallback_responses['en'])


# ========== API ENDPOINTS ==========

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main chat endpoint - backend-driven AI response generation
    """
    
    # Extract user input
    user_input = request.message or request.question or ""
    
    if not user_input or not user_input.strip():
        raise HTTPException(
            status_code=400,
            detail="Empty message. Please ask a question."
        )
    
    # Detect language from input (or use provided language)
    if request.language and request.language in ['en', 'hi', 'te', 'ml']:
        detected_language = request.language
    else:
        detected_language = detect_language_from_text(user_input)
    
    logger.info(f"[CHAT] User input ({detected_language}): {user_input}")
    
    try:
        # Generate AI response
        ai_response = generate_ai_response(user_input, detected_language)
        
        logger.info(f"[CHAT] Response generated ({detected_language}): {ai_response[:100]}...")
        
        return ChatResponse(
            reply=ai_response,
            answer=ai_response,
            response=ai_response,
            language=detected_language,
            timestamp=datetime.now().isoformat(),
            confidence=0.85
        )
    
    except Exception as e:
        logger.error(f"[CHAT] Error generating response: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )


@app.get("/api/chat/health")
async def chat_health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Farm AI Chat API",
        "version": "2.0",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Farm AI Backend API",
        "version": "2.0",
        "endpoints": {
            "chat": "/api/chat",
            "health": "/api/chat/health"
        }
    }


# ========== ERROR HANDLERS ==========

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom HTTP exception handler"""
    return {
        "error": exc.detail,
        "status_code": exc.status_code,
        "timestamp": datetime.now().isoformat()
    }
