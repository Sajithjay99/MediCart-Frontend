import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import chatbotMessages from "../components/messages";
import assistantAvatar from "../../src/assets/assistant.png";
import chatbotIcon from "../../src/assets/assistant.png";
import {
  FaTimes,
  FaPaperPlane,
  FaCapsules,
  FaHeartbeat,
  FaCommentMedical,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Chatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const divRef = useRef(null);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getResponse = async (input) => {
    const message = chatbotMessages.find(
      (msg) => msg.prompt.toLowerCase() === input.toLowerCase()
    )?.message;

    if (message) {
      return message;
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA-CJ0iu9e5yR4VZ-h0q24cj0EKYCM2wVQ`,
        {
          contents: [{ parts: [{ text: input }] }],
        }
      );
      return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm not sure how to respond to that."
      );
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Sorry, I'm having trouble responding right now.";
    }
  };

  const handleScrollToBottom = () => {
    if (divRef.current) {
      setTimeout(() => {
        divRef.current.scrollTop = divRef.current.scrollHeight;
      }, 100);
    }
  };

  const sendMessage = async (messageText) => {
    const userMessage = {
      text: messageText,
      fromUser: true,
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const botResponseText = await getResponse(messageText);
    const botMessage = {
      text: botResponseText,
      fromUser: false,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const messageToSend = input;
    setInput("");
    await sendMessage(messageToSend);
  };

  const handleQuickAction = async (text) => {
    await sendMessage(text);
  };

  useEffect(() => {
    handleScrollToBottom();
  }, [messages]);

  return (
    <>
      {!isChatbotOpen && (
        <motion.div
          onClick={() => setIsChatbotOpen(true)}
          className="fixed z-50 cursor-pointer bottom-5 right-5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={chatbotIcon}
            alt="Chat Icon"
            className="h-32 rounded-full shadow-xl w-28"
          />
        </motion.div>
      )}

      <div
        className={`fixed bottom-0 right-0 max-w-md w-full h-[600px] z-50 transition-transform duration-300 ease-in-out ${
          isChatbotOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden bg-white border border-gray-200 shadow-xl rounded-t-3xl">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 text-white bg-gradient-to-r from-blue-600 to-blue-500">
            <div className="flex items-center gap-3">
              <img
                src={assistantAvatar}
                className="w-10 h-10 rounded-full"
                alt="Bot"
              />
              <div className="text-lg font-semibold tracking-wide">
                Assistant
              </div>
            </div>
            <button
              onClick={() => setIsChatbotOpen(false)}
              className="text-white hover:opacity-80"
            >
              <FaTimes />
            </button>
          </div>

          <div
            ref={divRef}
            className="flex-1 px-4 py-3 space-y-4 overflow-y-auto bg-gray-50"
          >
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 text-sm font-medium text-center shadow-md bg-blue-100 text-blue-900 rounded-xl"
              >
                👋 Welcome to <strong>chatBot</strong> <br />
                Ask about medication, symptoms, or prescriptions.
              </motion.div>
            )}

            {messages.length === 0 && (
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => handleQuickAction("Order Prescription")}
                  className="flex items-center gap-2 px-4 py-2 text-sm transition bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-100"
                >
                  <FaCapsules /> Order Prescription
                </button>
                <button
                  onClick={() => handleQuickAction("Drug Availability")}
                  className="flex items-center gap-2 px-4 py-2 text-sm transition bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-100"
                >
                  <FaHeartbeat /> Drug Availability
                </button>
                <button
                  onClick={() => handleQuickAction("Talk to a Pharmacist")}
                  className="flex items-center gap-2 px-4 py-2 text-sm transition bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-100"
                >
                  <FaCommentMedical /> Talk to a Pharmacist
                </button>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.fromUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[75%] text-sm shadow ${
                    msg.fromUser
                      ? "bg-gray-200 text-gray-900"
                      : "bg-gradient-to-tr from-blue-600 to-blue-500 text-white"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-[10px] mt-1 text-right opacity-60">
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 text-sm text-white rounded-lg shadow bg-blue-400 animate-pulse">
                  Typing...
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 px-4 py-3 bg-white border-t">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="p-3 text-white rounded-full shadow bg-blue-600 hover:bg-blue-700"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
