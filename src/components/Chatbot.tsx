import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  onSymptomSubmit?: (symptoms: string) => void;
}

export default function Chatbot({ onSymptomSubmit }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Hi! I'm your MediScan assistant. Tell me about your symptoms, and I'll help you understand what might be going on.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickReplies = [
    'I have a headache',
    'Feeling feverish',
    'Stomach pain',
    'Sore throat',
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const botResponse = generateBotResponse(text);
    const botMessage: Message = {
      role: 'bot',
      content: botResponse,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('headache') || input.includes('head')) {
      return "I understand you're experiencing a headache. Can you tell me more? Is it a dull ache or sharp pain? Do you have any other symptoms like nausea or sensitivity to light?";
    } else if (input.includes('fever') || input.includes('temperature')) {
      return "A fever can indicate various conditions. Have you measured your temperature? Do you have any other symptoms like chills, body aches, or fatigue?";
    } else if (input.includes('stomach') || input.includes('nausea') || input.includes('vomit')) {
      return "Stomach issues can be uncomfortable. Is the pain constant or does it come and go? Have you noticed any changes in your diet or bowel movements?";
    } else if (input.includes('throat') || input.includes('cough')) {
      return "Throat problems are common. Is it painful to swallow? Do you have a cough or any congestion? These details help narrow down the cause.";
    } else if (input.includes('analyze') || input.includes('check') || input.includes('diagnose')) {
      return "I'll help analyze your symptoms! Based on what you've told me, I recommend using our main symptom analyzer for a comprehensive assessment. Would you like me to submit your symptoms for analysis?";
    } else {
      return "Thank you for sharing that. To better assist you, could you provide more details about: When did symptoms start? How severe are they (1-10)? Any other symptoms you're experiencing?";
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-40 group animate-bounce-slow"
        >
          <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-3xl shadow-2xl z-40 flex flex-col animate-scale-in overflow-hidden border-2 border-blue-100">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">MediScan Assistant</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-white">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 animate-slide-in ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-400'
                      : 'bg-gradient-to-br from-gray-200 to-gray-300'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-700" />
                  )}
                </div>
                <div
                  className={`flex-1 p-3 rounded-2xl max-w-[75%] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-tr-none'
                      : 'bg-white border-2 border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3 animate-slide-in">
                <div className="p-2 rounded-full bg-gradient-to-br from-gray-200 to-gray-300">
                  <Bot className="w-4 h-4 text-gray-700" />
                </div>
                <div className="p-3 rounded-2xl bg-white border-2 border-gray-100 rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-all duration-300 hover:scale-105"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t-2 border-gray-100 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="p-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300"
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
