import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Using lucide-react icons as requested
import {
  MessageCircle,
  X,
  Send,
  ChevronDown,
  Globe,
  Users,
  CloudUpload,
  BarChart3,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";

// Helper component to display the chat message content
const MessageContent = ({ text }) => {
  // Simple replacement for **bold** text and converts ** to strong tags
  const formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

export default function AdminChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentOptions, setCurrentOptions] = useState("main");
  const chatBodyRef = useRef(null);

  // AUTO-SCROLL IMPLEMENTATION
  useEffect(() => {
    if (chatBodyRef.current) {
      requestAnimationFrame(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      });
    }
  }, [chatHistory, currentOptions]);

  // Updated Chat flow using data from the provided document
  const flow = {
    main: {
      question: "Hi Admin 👋, how can I help you today?",
      options: [
        { text: "Manage Claims & Users", next: "users", icon: Users },
        {
          text: "Data Uploads & Validation",
          next: "uploads",
          icon: CloudUpload,
        },
        { text: "GIS & Asset Mapping", next: "gis", icon: Globe },
        {
          text: "Reports & DSS (Decisions)",
          next: "reports_settings",
          icon: BarChart3,
        },
        { text: "General Help & Security", next: "support", icon: HelpCircle },
      ],
    },

    // Aligns with Q2, Q13, Q14
    users: {
      question: "Claims, User & Security Help",
      options: [
        {
          text: "Where can I view all FRA claims?",
          answer:
            "Go to **Claims Management** → **View Claims**. You can filter by district, block, village, or claim type (Individual/Community).",
        },
        {
          text: "Can multiple users work on the same dataset?",
          answer:
            "Yes. The system supports **role-based access control**, allowing multiple authorized users to collaborate without data conflicts.",
        },
        {
          text: "How is user data privacy maintained?",
          answer:
            "All claim and asset data are stored on secure government servers. Only authorized officials can access or modify records through verified logins.",
        },
        {
          text: (
            <span className="flex items-center">
              <ArrowLeft size={16} className="mr-1" /> Back to Main Menu
            </span>
          ),
          next: "main",
        },
      ],
    },

    // Aligns with Q3, Q9, Q15
    uploads: {
      question: "Need help with Data Uploads and Validation?",
      options: [
        {
          text: "How do I upload a new data file?",
          answer:
            "Navigate to **Data Upload** → **Bulk Upload** and select the CSV or GeoJSON file format. The system will automatically validate and integrate it into the GIS layer.",
        },
        {
          text: "What happens if the system detects duplicate claims?",
          answer:
            "The portal flags potential duplicates and sends them for manual review under **Data Validation → Duplicate Check**.",
        },
        {
          text: "What is the AI-based asset detection feature?",
          answer:
            "The system analyzes recent satellite imagery to automatically detect assets such as farmland or habitation clusters and links them to corresponding FRA plots.",
        },
        {
          text: (
            <span className="flex items-center">
              <ArrowLeft size={16} className="mr-1" /> Back to Main Menu
            </span>
          ),
          next: "main",
        },
      ],
    },

    // Aligns with Q4, Q5, Q22
    gis: {
      question: "GIS and Asset Mapping Help",
      options: [
        {
          text: "How can I see land assets on the map?",
          answer:
            "Open **WebGIS Viewer** from the main menu. Select your region from the dropdown and toggle asset layers like forest land, habitation, water bodies, agriculture, etc.",
        },
        {
          text: "Can I overlay FRA claim boundaries with other datasets?",
          answer:
            "Yes. In the WebGIS, click **Add Layer** → **Select Source** to integrate external shapefiles or API-based data feeds (like Bhuvan or HARSAC).",
        },
        {
          text: "Show me a list of available GIS layers.",
          answer:
            "You can view all available spatial layers under **Layer Catalogue** in the WebGIS menu — including forest types, habitation zones, water assets, and claim boundaries.",
        },
        {
          text: (
            <span className="flex items-center">
              <ArrowLeft size={16} className="mr-1" /> Back to Main Menu
            </span>
          ),
          next: "main",
        },
      ],
    },

    // Combines Q7, Q8, Q10, Q11, Q12
    reports_settings: {
      question: "Reports, Analytics, and DSS Help",
      options: [
        {
          text: "How do I generate a summary report?",
          answer:
            "Go to **Reports** → **Generate New Report**, choose the timeframe and category (claims processed, pending, approved, etc.), and click **Download PDF**.",
        },
        {
          text: "What is the Decision Support System (DSS)?",
          answer:
            "The DSS uses AI-based logic to match FRA land assets with relevant **welfare schemes** such as MGNREGA, PM-Kisan, Jal Jeevan Mission, etc., based on land type, ownership, and location.",
        },
        {
          text: "How to check schemes suggested for a claim?",
          answer:
            "Go to the claim record → Click **DSS Recommendations** tab → You'll see a list of eligible schemes with implementation priority and links.",
        },
        {
          text: "Can I add or update schemes in DSS?",
          answer:
            "Only state-level admins can modify the DSS rule base. Contact your **nodal officer** for new scheme inclusion or updates.",
        },
        {
          text: (
            <span className="flex items-center">
              <ArrowLeft size={16} className="mr-1" /> Back to Main Menu
            </span>
          ),
          next: "main",
        },
      ],
    },

    // Aligns with Q19, Q20, Q24, Q1
    support: {
      question: "Need Technical or General Support?",
      options: [
        {
          text: "How do I contact support?",
          answer:
            "Use **Help → Contact Admin Support** for chat or email-based queries. You can also type 'connect me to support' here and I’ll direct you automatically.",
        },
        {
          text: "How do I log in to the FRA Admin Dashboard?",
          answer:
            "Click on **Admin Login** in the top-right corner and enter your credentials. If you’re a new user, contact your district FRA coordinator for access.",
        },
        {
          text: "How can I reset my password?",
          answer:
            "Click on **Forgot Password** at login, enter your registered email or mobile number, and follow the verification steps.",
        },
        {
          text: "The dashboard map is not loading.",
          answer:
            "Try refreshing your browser or clearing cache. If the issue persists, report it under **Help → Technical Support** with the error message.",
        },
        {
          text: (
            <span className="flex items-center">
              <ArrowLeft size={16} className="mr-1" /> Back to Main Menu
            </span>
          ),
          next: "main",
        },
      ],
    },
  };

  const handleOptionClick = (option) => {
    if (option.answer) {
      // show question + answer
      setChatHistory((prev) => [
        ...prev,
        { type: "user", text: option.text },
        { type: "bot", text: option.answer },
      ]);
    } else if (option.next) {
      // Only add to history if it's not the 'Back' button, which has a React element for text
      if (typeof option.text === "string" && option.text !== "⬅️ Back") {
        setChatHistory((prev) => [
          ...prev,
          { type: "user", text: option.text },
        ]);
      }
      setCurrentOptions(option.next);
    }
  };

  const resetChat = () => {
    setChatHistory([]);
    setCurrentOptions("main");
  };

  const currentFlow = flow[currentOptions];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            setIsOpen(true);
            resetChat();
          }
        }}
        className="bg-green-600 text-white rounded-full p-4 shadow-xl hover:bg-green-700 transition"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-16 right-0 w-80 h-[560px] bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-600 text-white p-3 font-semibold flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-2">
                <MessageCircle size={20} />
                {/* RENAMED TO SMARTSAHAYAK */}
                <span className="text-base">SmartSahayak</span>
              </div>
              <ChevronDown
                size={20}
                className="cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
            </div>

            {/* Chat Body */}
            <div
              ref={chatBodyRef}
              className="h-[440px] overflow-y-auto pt-4 pb-0 space-y-3 text-sm"
            >
              <div className="px-4">
                {/* Initial Bot Greeting when chat is first opened (matches the image) */}
                {chatHistory.length === 0 && currentOptions === "main" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gray-100 text-left mr-auto max-w-[85%] rounded-lg rounded-tl-none font-medium"
                  >
                    <MessageContent text={currentFlow.question} />
                  </motion.div>
                )}

                {/* Render full history for subsequent messages */}
                {chatHistory.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className={`my-3 p-3 rounded-xl ${
                      msg.type === "user"
                        ? "bg-green-50 text-right ml-auto max-w-[80%] rounded-br-none font-medium"
                        : "bg-gray-100 text-left mr-auto max-w-[85%] rounded-tl-none font-medium"
                    }`}
                  >
                    {/* Render message content. If text is a string, use MessageContent. */}
                    {typeof msg.text === "string" ? (
                      <MessageContent text={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </motion.div>
                ))}

                {/* Bot's follow-up question when moving to a sub-menu */}
                {chatHistory.length > 0 && currentOptions !== "main" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="my-3 p-3 bg-gray-100 text-left mr-auto max-w-[85%] rounded-xl rounded-tl-none font-medium"
                  >
                    <MessageContent text={currentFlow.question} />
                  </motion.div>
                )}
              </div>

              {/* Options Section */}
              <div
                className={`px-4 ${
                  chatHistory.length === 0 && currentOptions === "main"
                    ? "mt-4"
                    : "mt-2"
                }`}
              >
                {currentOptions === "main" ? (
                  // Main options - large buttons matching the image (removed border-b)
                  <div className="space-y-2">
                    {currentFlow.options.map((opt, idx) => {
                      const Icon = opt.icon;
                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ backgroundColor: "#f0f0f0" }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleOptionClick(opt)}
                          // Style change: using p-3 and shadow-sm instead of border-b
                          className="w-full text-left p-3 flex items-center space-x-3 bg-white hover:bg-gray-100 rounded-lg shadow-sm text-gray-800 transition duration-100"
                        >
                          {Icon && <Icon size={20} className="text-gray-500" />}
                          <span className="flex-grow">{opt.text}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  // Sub-menu options - smaller buttons
                  <div className="space-y-2 pb-4">
                    {currentFlow.options.map((opt, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ backgroundColor: "#f0f0f0" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleOptionClick(opt)}
                        className={`block w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition ${
                          opt.next === "main" ? "font-bold text-green-700" : ""
                        }`}
                      >
                        {/* Render text. If it's a React element (the back button), it renders the icon too. */}
                        {opt.text}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Input Bar (Always visible at the bottom) */}
            <div className="p-3 border-t border-gray-200 absolute bottom-0 w-full bg-white">
              <div className="flex items-center bg-gray-50 rounded-full border border-gray-300">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-grow py-2 px-4 text-gray-700 bg-transparent focus:outline-none"
                />
                <button
                  className="bg-green-600 text-white rounded-full p-2 m-1 hover:bg-green-700 transition"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
