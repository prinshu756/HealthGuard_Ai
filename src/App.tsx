

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import {
  MessageCircle,
  // Heart,
  Shield,
  CheckCircle,
  Mic,
  Send,
  Bot,
  User,
  Globe,
  // Activity,
  Bell,
  Search,
  Phone,
  Menu,
  X,
  Activity,
} from "lucide-react";

import {Heart_Animation , Globe_Animation }from "./Animation";
// import { Heartbeat_Animation } from "./Animation";

// -------------------- Three.js Background --------------------
const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const materials = [
      new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.6,
      }),
      new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.6,
      }),
      new THREE.MeshBasicMaterial({
        color: 0xff0088,
        transparent: true,
        opacity: 0.6,
      }),
    ];

    const particles: THREE.Mesh[] = [];
    for (let i = 0; i < 50; i++) {
      const material = materials[Math.floor(Math.random() * materials.length)];
      const particle = new THREE.Mesh(geometry, material);
      particle.position.x = (Math.random() - 0.5) * 100;
      particle.position.y = (Math.random() - 0.5) * 100;
      particle.position.z = (Math.random() - 0.5) * 100;
      scene.add(particle);
      particles.push(particle);
    }

    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);
      particles.forEach((particle) => {
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
        particle.position.y +=
          Math.sin(Date.now() * 0.001 + particle.position.x) * 0.01;
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10" />;
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = ["Home", "Features", "About", "Sign Up"];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900/90 to-teal-900/90 backdrop-blur-lg border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto  flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Heart_Animation />
          <h1 className="text-xl md:text-2xl font-bold text-white">
            HealthGuard AI
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link, idx) => (
            <motion.a
              key={idx}
              href={`#${link.toLowerCase()}`}
              className="relative text-white/80 hover:text-white transition-colors"
              whileHover="hover"
              initial="rest"
              animate="rest"
            >
              {link}
              <motion.span
                variants={{
                  rest: { width: 0, opacity: 0 },
                  hover: { width: "100%", opacity: 1 },
                }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-blue-400 to-teal-400"
              />
            </motion.a>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none mr-1.5"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gradient-to-r from-blue-900/95 to-teal-900/95 border-t border-white/10"
          >
            <ul className="flex flex-col items-center py-6 space-y-6">
              {links.map((link, idx) => (
                <motion.li
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-lg text-white/90 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// -------------------- Hero Section --------------------
const HeroSection: React.FC<{ onStartChat: () => void }> = ({
  onStartChat,
}) => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 mb-8">
            AI-Powered Healthcare
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Get instant, reliable health information, symptom assessment, and
            personalized awareness campaigns powered by advanced AI and verified
            medical databases.
          </p>
          <motion.button
            onClick={onStartChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl text-lg md:text-xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
          >
            Start Health Assessment
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
// Features Section
const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Symptom Assessment",
      description:
        "AI-powered analysis of symptoms with risk assessment and educational content",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Personalized Campaigns",
      description:
        "Tailored health awareness messages based on your profile and location",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Misinformation Combat",
      description:
        "Cross-reference with reliable sources to debunk health myths",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Real-time Integration",
      description:
        "Connected to public health APIs for latest disease outbreak data",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h3 className="text-5xl font-bold text-white mb-6">
            Powerful Features
          </h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive healthcare AI tools designed to educate, inform, and
            protect public health
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -10,
                scale: 1.05,
                rotateX: 5,
                rotateY: -5,
                boxShadow: "0px 20px 40px rgba(0, 200, 255, 0.3)",
                borderColor: "rgba(255,255,255,0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 transition-all duration-300 cursor-pointer"
            >
              <motion.div
                className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {feature.icon}
              </motion.div>
              <h4 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h4>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
// Chatbot Interface Component
const ChatInterface: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI health assistant. I can help with symptom assessment, health education, and provide reliable medical information. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      type: "education",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  // const [userProfile, setUserProfile] = useState<UserProfile>({});

  // API Integration Points - Replace with actual API calls
  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // TODO: Integrate with backend API for AI response
    // Example API call structure:
    /*
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userProfile,
          conversationHistory: messages
        })
      });
      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        type: data.type // 'symptom' | 'education' | 'alert' | 'misinformation'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error);
    }
    */

    // Simulate AI response for demo
    setTimeout(() => {
      let botResponse =
        "I understand your concern. Based on the information provided, I recommend consulting with a healthcare professional for proper evaluation. Here are some general guidelines...";
      let messageType: Message["type"] = "education";

      if (text.toLowerCase().includes("symptom")) {
        botResponse =
          "I can help assess your symptoms. Please note that this is for educational purposes only and doesn't replace professional medical advice. Can you describe your symptoms in detail?";
        messageType = "symptom";
      } else if (
        text.toLowerCase().includes("vaccine") ||
        text.toLowerCase().includes("covid")
      ) {
        botResponse =
          "I can provide evidence-based information about vaccines and COVID-19 from WHO and CDC sources. Vaccines are safe and effective at preventing serious illness. Would you like specific information?";
        messageType = "misinformation";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        type: messageType,
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const startVoiceRecognition = () => {
    setIsListening(true);
    // TODO: Integrate with Web Speech API or external speech recognition service
    /*
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      recognition.start();
    }
    */

    // Simulate voice recognition for demo
    setTimeout(() => {
      setIsListening(false);
      setInputValue("I have been experiencing headaches and fatigue");
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl w-full max-w-4xl h-[80vh] border border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-teal-400 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    HealthGuard AI Assistant
                  </h3>
                  <p className="text-sm text-gray-400">
                    Always consult healthcare professionals
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${
                      message.sender === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user"
                          ? "bg-blue-500"
                          : message.type === "symptom"
                          ? "bg-orange-500"
                          : message.type === "alert"
                          ? "bg-red-500"
                          : message.type === "misinformation"
                          ? "bg-yellow-500"
                          : "bg-teal-500"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`rounded-2xl p-4 ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-white border border-white/10"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/10">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      inputValue.trim() &&
                      sendMessage(inputValue.trim())
                    }
                    placeholder="Type your health question..."
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <button
                  onClick={startVoiceRecognition}
                  disabled={isListening}
                  className={`p-4 rounded-2xl transition-colors ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <Mic
                    className={`w-5 h-5 ${
                      isListening ? "text-white animate-pulse" : "text-gray-400"
                    }`}
                  />
                </button>
                <button
                  onClick={() =>
                    inputValue.trim() && sendMessage(inputValue.trim())
                  }
                  className="bg-gradient-to-r from-blue-500 to-teal-500 p-4 rounded-2xl hover:from-blue-600 hover:to-teal-600 transition-all"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Statistics Section
const StatsSection: React.FC = () => {
  const stats = [
    {
      number: "123",
      label: "Health Queries Answered",
      icon: <MessageCircle className="w-8 h-8" />,
    },
    {
      number: "99.7%",
      label: "Accuracy Rate",
      icon: <CheckCircle className="w-8 h-8" />,
    },
    {
      number: "24/7",
      label: "Available Support",
      icon: <Activity />,
    },
    {
      number: "50+",
      label: "Languages Supported",
      icon: <Globe_Animation />,
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-r from-blue-900/20 to-teal-900/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <h4 className="text-4xl font-bold text-white mb-2">
                {stat.number}
              </h4>
              <p className="text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/80 backdrop-blur-lg border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-teal-400 rounded-xl flex items-center justify-center">
                <Heart_Animation/>
              </div>
              <h3 className="text-xl font-bold text-white">HealthGuard AI</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Empowering communities with AI-driven healthcare information and
              disease awareness.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Symptom Assessment</li>
              <li>Health Education</li>
              <li>Misinformation Combat</li>
              <li>Real-time Updates</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>WHO Guidelines</li>
              <li>CDC Information</li>
              <li>Medical Databases</li>
              <li>Research Papers</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Emergency: 911</span>
              </li>
              <li>support@healthguard.ai</li>
              <li>www.healthguard.ai</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 HealthGuard AI. This is not a substitute for
            professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

// -------------------- (Keep the rest of your FeaturesSection, ChatInterface, StatsSection, Footer unchanged) --------------------
// ⚠️ Just replace your existing `Header` with this new version, rest of file stays same.

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-teal-900 text-white overflow-x-hidden">
      <ThreeBackground />
      <Header />
      <HeroSection onStartChat={() => setIsChatOpen(true)} />
      {/* Keep your FeaturesSection, ChatInterface, StatsSection, Footer */}
      <FeaturesSection />
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
        }}
      />
      <StatsSection />
      <Footer />
    </div>
  );
}
