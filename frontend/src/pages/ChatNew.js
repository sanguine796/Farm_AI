import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import { useLanguage } from "../LanguageContext";
import { getTranslation } from "../i18n";
import API from "../services/api";

const ChatNew = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceTranscriptRef = useRef("");  // Track voice transcript

  // Language codes for Web Speech API
  const languageMap = {
    en: "en-IN",
    ml: "ml-IN",
    hi: "hi-IN",
    te: "te-IN",
  };

  // Bot responses in different languages
  const botResponses = {
    en: [
      "Welcome to Farm AI! I'm here to help you grow better crops. You can ask me about crop selection, pest management, irrigation schedules, fertilizer recommendations, weather impacts, market prices, and much more. What would you like to know today?",
      "Great question! The key to successful farming is matching your crops to your soil type and climate. I can help you select the best crops for your region, optimize your water usage, and protect your harvest from pests and diseases. What's your farm size?",
      "Pest management is crucial for a healthy harvest. Whether you're dealing with rust, powdery mildew, leaf spots, or insect infestations, we have proven solutions. Regular monitoring, timely intervention, and preventive measures are essential. Tell me what pests you're seeing.",
      "Proper irrigation is vital for crop health and water conservation. The best time to water is early morning (5-7 AM) to minimize evaporation and reduce disease pressure. Frequency depends on your soil type, weather, and crop stage. How much rainfall are you expecting?",
      "Fertilizers are essential for plant nutrition, but proper application is key. You should conduct soil testing annually and apply fertilizers based on soil nutrient levels and crop requirements. Organic options like compost and farm manure are also excellent. What crops are you growing?",
      "Weather significantly impacts farming operations. Timely access to accurate forecasts helps you plan irrigation, pest spraying, harvesting, and other field activities. Check our weather section for your region's 7-day forecast with farming-specific advice.",
    ],
    ml: [
      "ഫാം എഐ-ലേക്ക് സ്വാഗതം! നിങ്ങൾ കൂടുതൽ നല്ല വിളകൾ വളർത്തുന്നതിന് ഞാൻ ഇവിടെ സഹായിക്കാൻ ഉണ്ട്. നിങ്ങൾ വിളകളുടെ തിരഞ്ഞെടുപ്പ്, കീട നിയന്ത്രണം, നീരൊലിപ്പ് ഷെഡ്യൂളുകൾ, വളപ്രയോഗ ശുപാർശകൾ, കാലാവസ്ഥ ആഘാതം, വിപണി വിലകൾ, കൂടാതെ ബാക്കി കാര്യങ്ങളെ കുറിച്ച് എന്നോട് ചോദിക്കാൻ കഴിയും. ഇന്ന് നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?",
      "നല്ല ചോദ്യം! വിജയകരമായ കർഷണത്തിന്റെ താക്കോൽ നിങ്ങളുടെ വിളകളെ നിങ്ങളുടെ മണ്ണിന്റെ തരത്തിന്റെയും കാലാവസ്ഥയ്ക്കും പൊരുത്തപ്പെടുത്തുക എന്നതാണ്. നിങ്ങളുടെ പ്രദേശത്തിന് ഏറ്റവും നല്ല വിളകൾ തിരഞ്ഞെടുക്കാൻ, നിങ്ങളുടെ ജലോപയോഗം ഒപ്റ്റിമൈസ് ചെയ്യാൻ, കീടങ്ങളിൽ നിന്നും രോഗങ്ങളിൽ നിന്നും നിങ്ങളുടെ വിളവ് സംരക്ഷിക്കാൻ ഞാൻ സഹായിക്കാനാകും. നിങ്ങളുടെ വയലിന്റെ വലിപ്പം എത്ര?",
      "കീട നിയന്ത്രണം ആരോഗ്യകരമായ വിളവിനായി അത്യാവശ്യമാണ്. നിങ്ങൾ വെണ്ടയുകരി, പാൽ പൊടി, ഇലയിലെ പാടുകൾ, അല്ലെങ്കിൽ പ്രാണികളുടെ ബാധ നേരിടുന്നുണ്ടെങ്കിൽ, ഞങ്ങൾക്കാണ് തെളിയിക്കപ്പെട്ട പരിഹാരങ്ങൾ. സാധാരണ നിരീക്ഷണം, സമയബന്ധിതമായ ഇടപെടൽ, പ്രതിരോധ ব്യവസ്ഥകൾ അത്യാവശ്യമാണ്. നിങ്ങൾ ഏത് കീടങ്ങൾ കാണുന്നു?",
      "ശരിയായ നീരൊലിപ്പ് ചെടിയുടെ ആരോഗ്യത്തിനും ജല സംരക്ഷണത്തിനും സുപ്രധാനമാണ്. നീരൊലിപ്പിനുള്ള ഉത്തമ സമയം പ്രാതഃകാലം (5-7 AM) ആണ്, ഇത് ബാഷ്പീകരണവും രോഗ സമ്ভാവ്യതയും കുറയ്ക്കാൻ സഹായിക്കുന്നു. ഫ്രീക്വൻസി നിങ്ങളുടെ മണ്ണിന്റെ തരം, കാലാവസ്ഥ, വിളയുടെ ഘട്ടം എന്നിവയെ ആശ്രയിച്ചിരിക്കുന്നു. നിങ്ങൾ എത്ര മഴയ്ക്ക് പ്രതീക്ഷിക്കുന്നു?",
      "വളം ചെടിയുടെ പോഷണത്തിനായി അത്യാവശ്യമാണ്, പക്ഷേ ശരിയായ പ്രയോഗം പ്രധാനമാണ്. നിങ്ങൾ വാർഷികമായി മണ്ണ് പരിശോധന നടത്തുകയും മണ്ണിന്റെ പോഷകാംശ നിലവാരം അനുസരിച്ച് വളം പ്രയോഗിക്കുകയും വേണ്ടതുണ്ട്. കമ്പോസ്റ്റും വർത്തിത സാരവംവും ഉത്തമ ഓപ്ഷനുകളാണ്. നിങ്ങൾ എന്ത് വിളകൾ വളർത്തുന്നു?",
      "കാലാവസ്ഥ കർഷണ പ്രവർത്തനങ്ങളെ ഗണ്യമായി പ്രതിരൂപകരിക്കുന്നു. കൃത്യമായ നിരീക്ഷണ പൂർവ്വാനുമാനങ്ങൾ നിങ്ങളെ നീരൊലിപ്പ്, കീട നിയന്ത്രണ സ്പ്രേ, വിളവെട്ടൽ, മറ്റ് വയല്‍ പ്രവർത്തനങ്ങൾ ആസൂത്രണം ചെയ്യാൻ സഹായിക്കുന്നു. നിങ്ങളുടെ പ്രദേശത്തിന്റെ 7-ദിവസത്തെ പൂർവ്വാനുമാനം കർഷണ-നിർദ്ദിഷ്ട ഉപദേശ്യത്തോടുകൂടി നോക്കുക.",
    ],
    hi: [
      "फार्म एआई में स्वागत है! मैं आपको बेहतर फसलें उगाने में मदद करने के लिए यहां हूँ। आप मुझसे फसल चयन, कीट प्रबंधन, सिंचाई अनुसूची, खाद की सिफारिशें, मौसम के प्रभाव, बाजार मूल्य, और बहुत कुछ के बारे में पूछ सकते हैं। आज आप क्या जानना चाहते हैं?",
      "बहुत बढ़िया सवाल! सफल खेती की कुंजी आपकी फसलों को अपनी मिट्टी के प्रकार और जलवायु से मेल खाना है। मैं आपके क्षेत्र के लिए सर्वोत्तम फसलें चुनने, आपके जल उपयोग को अनुकूलित करने, और कीटों और बीमारियों से अपनी फसल की रक्षा करने में मदद कर सकता हूँ। आपका खेत कितना बड़ा है?",
      "कीट नियंत्रण एक स्वस्थ फसल के लिए महत्वपूर्ण है। चाहे आप जंग, पाउडरी फफूंदी, पत्ती धब्बे, या कीट संक्रमण से जूझ रहे हों, हमारे पास साबित समाधान हैं। नियमित निगरानी, समय पर हस्तक्षेप, और निवारक उपाय आवश्यक हैं। बताइए आप कौन सी कीटें देख रहे हैं?",
      "उचित सिंचाई फसल स्वास्थ्य और जल संरक्षण के लिए महत्वपूर्ण है। सिंचाई का सबसे अच्छा समय सुबह जल्दी (5-7 AM) है ताकि वाष्पीकरण और रोग दबाव को कम किया जा सके। आवृत्ति आपकी मिट्टी के प्रकार, मौसम, और फसल के चरण पर निर्भर करती है। आप कितनी वर्षा की उम्मीद कर रहे हैं?",
      "खाद पौधों के पोषण के लिए आवश्यक है, लेकिन उचित प्रयोग महत्वपूर्ण है। आपको वार्षिक रूप से मिट्टी परीक्षण करना चाहिए और मिट्टी के पोषक स्तर और फसल की आवश्यकताओं के आधार पर खाद लगानी चाहिए। खाद और गोबर जैसे जैविक विकल्प भी उत्कृष्ट हैं। आप कौन सी फसलें उगा रहे हैं?",
      "मौसम कृषि संचालन को महत्वपूर्ण रूप से प्रभावित करता है। समय पर सटीक पूर्वानुमान आपको सिंचाई, कीट छिड़काव, कटाई, और अन्य खेत गतिविधियों की योजना बनाने में मदद करता है। अपने क्षेत्र के लिए 7-दिवसीय पूर्वानुमान कृषि-विशिष्ट सलाह के साथ देखें।",
    ],
    te: [
      "ఫార్మ్ ఎআఈ కు స్వాగతం! నేను మీకు బెటర్ పంటలను పెంచడానికి సహాయం చేయడానికి ఇక్కడ ఉన్నాను. మీరు పంట ఎంపిక, కీటక నిర్వహణ, నీటిపటి షెడ్యూల్‍, సారవంత సిఫారసులు, వాతావరణ ప్రభావాలు, మార్కెట్ ధరలు, మరియు చాలా ఎక్కువ గురించి నన్ను అడగవచ్చు. ఈ రోజు మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
      "గ్రేట్ ప్రశ్న! సఫల పంటకు కీలకం మీ పంటలను మీ నేల రకం మరియు వాతావరణానికి సరిపోలడం. నేను మీ ప్రాంతానికి సరిబాటు పంటలను ఎంచుకోవడానికి, మీ నీటి వినియోగాన్ని ఆప్టిమైజ్ చేయడానికి, మరియు కీటకాలు మరియు వ్యాధుల నుండి మీ వాటను రక్షించడానికి సహాయం చేయగలను. మీ ఫార్మ్ పరిమాణం ఎంత?",
      "కీటక నిర్వహణ ఆరోగ్యకరమైన వాటకు కీలకమైనది. మీరు తుప్పు, పట్టులోయ, ఎండ్ బాగ్, లేదా కీటక సంక్రమణ నుండి వ్యవహరిస్తుంటే, మాకు నిరూపితమైన పరిష్కారాలు ఉన్నాయి. సాధారణ పర్యవేక్షణ, సమయానికి జోక్యం, మరియు నిరోధక చర్యలు ముఖ్యమైనవి. మీరు ఏ కీటకాలను చూస్తున్నారు?",
      "సరైన నీటిపటి పంట ఆరోగ్యం మరియు నీటి సంరక్షణకు ఎంతైనా ముఖ్యమైనది. నీటిపటి చేయడానికి ఉత్తమ సమయం ఉదయ నుండి (5-7 AM) ఆవిరిభవనం మరియు వ్యాధు పీడనను తగ్గించటానికి. ఫ్రీక్వెన్సీ మీ నేల రకం, వాతావరణం, మరియు పంట దశపై ఆధారపడి ఉంటుంది. మీరు ఎంత వర్షం చేయాలని ఆశిస్తున్నారు?",
      "సారవంత పంట పోషణకు ఎంతైనా ముఖ్యమైనది, కానీ సరైన అనువర్తనం ముఖ్యమైనది. మీరు వార్షిక నేల పరీక్ష చేయాలి మరియు నేల పోషకమైన స్థాయిలు మరియు పంట అవసరాల ఆధారంపై సారవంత చేయాలి. కంపోస్ట్ మరియు గోవర్ చెప్పిన సంస్థాలు కూడా ఉత్తమ ఎంపికలు. మీరు ఏ పంటలను పెంచుతున్నారు?",
      "వాతావరణం పంటకు కార్యకలాపాలను గణనీయంగా ప్రభావితం చేస్తుంది. సమయానికి ఖచ్చితమైన సూచనలు మీకు నీటిపటి, కీటక స్ప్రేయింగ్, కొట్టడం, మరియు ఇతర ఫీల్డ్ కార్యకలాపాల సంఘటన చేయడానికి సహాయం చేస్తాయి. మీ ప్రాంతానికి 7-రోజుల సూచన పంటకు-నిర్దిష్ట సలహా తో చూడండి.",
    ],
  };

  const quickQuestions = {
    en: [
      "What crops grow best in my region?",
      "How do I treat leaf spots?",
      "When should I water?",
    ],
    ml: [
      "എന്റെ പ്രദേശത്ത് ഏത് വിളകൾ നന്നായി വളരുന്നു?",
      "ഞാൻ ലീഫ് സ്പോട്ടുകൾ എങ്ങനെ ചികിത്സിക്കണം?",
      "ഞാൻ എപ്പോൾ ജലസേചനം ചെയ്യണം?",
    ],
    hi: [
      "मेरे क्षेत्र में कौन सी फसलें सबसे अच्छी बढ़ती हैं?",
      "मैं पत्ती के धब्बे का इलाज कैसे करूँ?",
      "मुझे कब पानी देना चाहिए?",
    ],
    te: [
      "నా ప్రాంతంలో ఏ పంటలు ఉత్తమంగా పెరుగుతాయి?",
      "నేను ఎండ్ బాగ్ చికిత్స చేయాలి?",
      "నేను ఎప్పుడు నీటిని పోయాలి?",
    ],
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: "user",
        timestamp: new Date(),
        language: language,
      };

      setMessages([...messages, newMessage]);
      setInputText("");

      // Log user message
      console.log(`[CHAT] User message sent: "${inputText}"`);

      // Send message to backend API
      try {
        console.log("[CHAT] Sending request to /api/chat endpoint...");
        const response = await API.post("/chat", {
          message: inputText,
          language: language,
        });

        console.log("[CHAT] Backend response received:", response.data);

        const botMessage = {
          id: messages.length + 2,
          text: response.data.reply || "I'm here to help. Please ask another question.",
          sender: "bot",
          timestamp: new Date(),
          language: language,
        };

        setMessages((prev) => [...prev, botMessage]);
        console.log("[CHAT] Bot response added to UI:", botMessage.text);

        // Auto-speak bot response
        speakText(botMessage.text);
      } catch (error) {
        console.error("[CHAT] API Error:", {
          message: error.message,
          endpoint: "/api/chat",
          requestData: { message: inputText, language: language },
          errorDetails: error.response?.data || error.message,
        });

        // Show error message to user
        const errorMessage = {
          id: messages.length + 2,
          text: "Sorry, I couldn't connect to the server. Please check your connection and try again.",
          sender: "bot",
          timestamp: new Date(),
          language: language,
          isError: true,
        };

        setMessages((prev) => [...prev, errorMessage]);
        console.log("[CHAT] Error message displayed to user");
      }
    }
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      // Cancel previous speech if any
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on selected language
      const langMap = {
        en: "en-IN",
        ml: "ml-IN",
        hi: "hi-IN",
        te: "te-IN",
      };

      utterance.lang = langMap[language] || "en-IN";
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition not supported in your browser");
      return;
    }

    if (!isListening) {
      setIsListening(true);
      voiceTranscriptRef.current = "";  // Reset transcript
      recognitionRef.current.lang = languageMap[language] || "en-IN";

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            voiceTranscriptRef.current += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        // Update input field with transcript (both interim and final)
        if (voiceTranscriptRef.current) {
          setInputText(voiceTranscriptRef.current.trim());
        } else if (interimTranscript) {
          setInputText(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Auto-send the message after voice input ends
        if (voiceTranscriptRef.current.trim()) {
          setTimeout(() => {
            handleSendMessage();
          }, 300);
        }
      };

      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleQuestionClick = (question) => {
    setInputText(question);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f9f0 0%, #ffffff 100%)",
        py: { xs: 2, sm: 3, md: 4 },
        pt: { xs: 10, sm: 12 },
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: "#2d5016",
              mb: 1,
              fontSize: { xs: "28px", sm: "32px", md: "36px" },
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {getTranslation(language, "chatWithAI")}
          </Typography>
          <Typography
            sx={{
              color: "#3d7e21",
              fontSize: { xs: "14px", sm: "15px" },
              fontWeight: 600,
            }}
          >
            {getTranslation(language, "voiceTextAssistance")}
          </Typography>
        </Box>

        {/* Chat Messages Area */}
        <Paper
          sx={{
            p: { xs: 2, md: 2.5 },
            mb: 2,
            minHeight: "400px",
            maxHeight: "500px",
            overflowY: "auto",
            background: "#f5f9f0",
            border: "3px solid #f57c00",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <SmartToyIcon sx={{ fontSize: 48, color: "#f57c00", mb: 2 }} />
              <Typography sx={{ color: "#999", fontSize: "14px" }}>
                Ready to help! Select a quick question or type yours.
              </Typography>
            </Box>
          )}

          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
                mb: 2,
                animation: "slideUp 0.3s ease-out",
              }}
            >
              {message.sender === "bot" && (
                <SmartToyIcon
                  sx={{
                    color: "#f57c00",
                    mr: 1,
                    mt: 0.5,
                    flexShrink: 0,
                  }}
                />
              )}

              <Card
                sx={{
                  maxWidth: "70%",
                  background:
                    message.sender === "user"
                      ? "linear-gradient(135deg, #f57c00 0%, #ff9800 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f5f9f0 100%)",
                  borderRadius: "12px",
                  border:
                    message.sender === "user"
                      ? "none"
                      : "2px solid #f57c00",
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                  <Typography
                    sx={{
                      color: message.sender === "user" ? "#fff" : "#2d5016",
                      fontSize: { xs: "13px", md: "14px" },
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    {message.text}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color:
                        message.sender === "user"
                          ? "rgba(255,255,255,0.7)"
                          : "#999",
                      mt: 0.5,
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </CardContent>
              </Card>

              {message.sender === "user" && (
                <PersonIcon
                  sx={{
                    color: "#f57c00",
                    ml: 1,
                    mt: 0.5,
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Paper>

        {/* Quick Questions */}
        {messages.length <= 2 && (
          <Paper
            sx={{
              p: { xs: 1.5, md: 2 },
              mb: 2,
              background: "linear-gradient(135deg, #fff8f0 0%, #ffffff 100%)",
              border: "3px solid #ff9800",
              borderRadius: "12px",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: "#888",
                fontWeight: 700,
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              🤔 {getTranslation(language, "quickQuestions")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {(quickQuestions[language] || quickQuestions.en).map((question, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleQuestionClick(question)}
                  sx={{
                    textAlign: "left",
                    justifyContent: "flex-start",
                    px: 2,
                    py: 1,
                    fontSize: { xs: "12px", md: "13px" },
                    color: "#2d5016",
                    border: "2px solid #ff9800",
                    borderRadius: "8px",
                    fontWeight: 600,
                    transition: "all 0.2s",
                    textTransform: "none",
                    "&:hover": {
                      background: "#ff9800",
                      color: "#fff",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {question}
                </Button>
              ))}
            </Box>
          </Paper>
        )}

        {/* Input Area */}
        <Paper
          sx={{
            p: { xs: 1.5, md: 2 },
            background: "linear-gradient(135deg, #ffffff 0%, #f5f9f0 100%)",
            border: "3px solid #f57c00",
            borderRadius: "16px",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            <TextField
              fullWidth
              placeholder={getTranslation(language, "typeYourQuestion")}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              multiline
              maxRows={3}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: { xs: "13px", md: "14px" },
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={handleVoiceInput}
                disabled={false}
                sx={{
                  background: isListening
                    ? "#ff9800"
                    : "linear-gradient(135deg, #f57c00 0%, #ff6f00 100%)",
                  color: "#fff",
                  width: { xs: "40px", md: "48px" },
                  height: { xs: "40px", md: "48px" },
                  borderRadius: "8px",
                  transition: "all 0.3s",
                  "&:hover:not(:disabled)": {
                    transform: "scale(1.05)",
                  },
                  animation: isListening ? "pulse 1.5s infinite" : "none",
                }}
                title={getTranslation(language, "voiceInput")}
              >
                <MicIcon sx={{ fontSize: { xs: "18px", md: "20px" } }} />
              </IconButton>

              <IconButton
                onClick={() => speakText(inputText)}
                disabled={!inputText || isSpeaking}
                sx={{
                  background: isSpeaking
                    ? "#ff9800"
                    : "linear-gradient(135deg, #f57c00 0%, #ff6f00 100%)",
                  color: "#fff",
                  width: { xs: "40px", md: "48px" },
                  height: { xs: "40px", md: "48px" },
                  borderRadius: "8px",
                  transition: "all 0.3s",
                  "&:hover:not(:disabled)": {
                    transform: "scale(1.05)",
                  },
                }}
                title={getTranslation(language, "textToSpeech")}
              >
                <VolumeUpIcon sx={{ fontSize: { xs: "18px", md: "20px" } }} />
              </IconButton>
            </Box>

            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #3d7e21 0%, #2d5016 100%)",
                color: "#fff",
                fontWeight: 700,
                px: { xs: 2, md: 3 },
                py: 1,
                borderRadius: "8px",
                fontSize: { xs: "12px", md: "13px" },
                textTransform: "uppercase",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                opacity: !inputText.trim() ? 0.5 : 1,
                cursor: !inputText.trim() ? "not-allowed" : "pointer",
                "&:hover:not(:disabled)": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(45, 80, 22, 0.3)",
                },
              }}
            >
              {getTranslation(language, "send")}
              <SendIcon sx={{ fontSize: "16px" }} />
            </Button>
          </Box>
        </Paper>

        {/* Features Info */}
        <Box sx={{ mt: 4 }}>
          <Typography
            sx={{
              fontWeight: 900,
              color: "#2d5016",
              mb: 2,
              fontSize: { xs: "16px", md: "18px" },
              textTransform: "uppercase",
              letterSpacing: 0.3,
            }}
          >
            ✨ {getTranslation(language, "chatFeatures")}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "3px solid #f57c00",
                  background: "linear-gradient(135deg, #fff8f0 0%, #ffffff 100%)",
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: "#2d5016",
                      mb: 1,
                      fontSize: { xs: "14px", md: "15px" },
                      textTransform: "uppercase",
                    }}
                  >
                    🎤 {getTranslation(language, "voiceInput")}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, color: "#555" }}>
                    {getTranslation(language, "voiceInputDesc")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "3px solid #f57c00",
                  background: "linear-gradient(135deg, #fff8f0 0%, #ffffff 100%)",
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: "#2d5016",
                      mb: 1,
                      fontSize: { xs: "14px", md: "15px" },
                      textTransform: "uppercase",
                    }}
                  >
                    🔊 {getTranslation(language, "textToSpeech")}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, color: "#555" }}>
                    {getTranslation(language, "textToSpeechDesc")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "3px solid #f57c00",
                  background: "linear-gradient(135deg, #fff8f0 0%, #ffffff 100%)",
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: "#2d5016",
                      mb: 1,
                      fontSize: { xs: "14px", md: "15px" },
                      textTransform: "uppercase",
                    }}
                  >
                    🌍 {getTranslation(language, "multilingual")}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, color: "#555" }}>
                    {getTranslation(language, "multilingualDesc")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "3px solid #f57c00",
                  background: "linear-gradient(135deg, #fff8f0 0%, #ffffff 100%)",
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: "#2d5016",
                      mb: 1,
                      fontSize: { xs: "14px", md: "15px" },
                      textTransform: "uppercase",
                    }}
                  >
                    💬 {getTranslation(language, "simpleLanguage")}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, color: "#555" }}>
                    {getTranslation(language, "simpleLanguageDesc")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
          }
        }
      `}</style>
    </Box>
  );
};

export default ChatNew;
