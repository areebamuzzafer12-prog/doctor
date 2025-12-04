import React, { useState } from "react";
import axios from "axios";
import { FaComment } from "react-icons/fa"; // Icon for the chat button

const ChatbotComponent = () => {
  const [showChat, setShowChat] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", message: "Hello! How can I assist you today?" },
  ]);
  
  // Toggle chat window
  const toggleChat = () => {
    setShowChat(!showChat);
  };

  // Handle user input and send to backend
  const handleUserInput = async () => {
    if (userInput.trim()) {
      // Update chat with user's message
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", message: userInput },
      ]);

      try {
        // Send user input to backend (you can change the URL to your backend)
        const response = await axios.post("http://localhost:4000/api/recommend-doctor", {
          symptoms: userInput,
        });

        // Handle the bot's response
        const botMessage = response.data.message || "Sorry, I couldn't find any doctor recommendations.";
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", message: botMessage },
        ]);
      } catch (error) {
        console.error("Error communicating with backend:", error);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", message: "There was an error. Please try again later." },
        ]);
      }
    }
    setUserInput(""); // Clear the input field
  };

  return (
    <div>
      {/* Chat Icon */}
      <div
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg cursor-pointer"
      >
        <FaComment size={24} />
      </div>

      {/* Chat Window */}
      {showChat && (
        <div className="fixed bottom-20 right-6 bg-white shadow-lg rounded-lg w-80 p-4">
          <div className="h-96 overflow-y-auto">
            {/* Render messages */}
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === "user" ? "text-right" : ""}`}>
                <div
                  className={`${
                    msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  } p-2 rounded-lg max-w-xs mx-auto`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-2 flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 p-2 border rounded-l-lg"
              placeholder="Type your symptoms..."
            />
            <button
              onClick={handleUserInput}
              className="bg-blue-500 text-white px-4 rounded-r-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;
