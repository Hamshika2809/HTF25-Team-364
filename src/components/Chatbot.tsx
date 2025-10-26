import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content:
        "Hi! I'm MediScan 🤖. Tell me what symptoms you have, and I’ll help you understand possible causes and simple remedies.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

    const botReply = await getBotReply(text);

    const botMessage: Message = {
      role: 'bot',
      content: botReply,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  // 🧠 Expanded Symptom Intelligence
  const getBotReply = async (userInput: string): Promise<string> => {
    const input = userInput.toLowerCase();

    if (input.includes('headache')) {
      return "Headaches can occur due to stress, dehydration, or eye strain. Rest, hydrate, and avoid bright screens. If severe or frequent, see a doctor.";
    } else if (input.includes('fever') || input.includes('temperature') || input.includes('chills')) {
      return "A fever often signals infection. Drink fluids, rest, and take paracetamol if needed. Seek medical help if above 102°F or lasting over 3 days.";
    } else if (input.includes('cold') || input.includes('cough') || input.includes('throat')) {
      return "Cold or cough can be viral. Drink warm water, rest, and inhale steam. Use honey with warm water for throat relief.";
    } else if (input.includes('stomach') || input.includes('nausea') || input.includes('vomit')) {
      return "Stomach issues can result from food infection or indigestion. Eat light meals, stay hydrated, and avoid spicy food.";
    } else if (input.includes('diarrhea') || input.includes('loose motion')) {
      return "Diarrhea causes dehydration. Drink ORS or electrolyte water and eat bland food. Visit a doctor if it continues more than 2 days.";
    } else if (input.includes('constipation')) {
      return "Constipation can be due to low fiber or water. Eat fruits, drink water, and exercise lightly.";
    } else if (input.includes('back pain') || input.includes('lower back')) {
      return "Back pain may come from sitting posture or strain. Use warm compress, maintain posture, and stretch regularly.";
    } else if (input.includes('chest pain')) {
      return "Chest pain could be due to acidity, muscle strain, or heart issues. If it’s sharp or with breathlessness, seek emergency help immediately.";
    } else if (input.includes('joint pain') || input.includes('arthritis')) {
      return "Joint pain may result from overuse or arthritis. Do gentle exercise, warm up joints, and apply mild heat.";
    } else if (input.includes('toothache')) {
      return "For toothache, rinse with warm salt water, avoid sweets, and visit a dentist if pain continues.";
    } else if (input.includes('ear pain') || input.includes('earache')) {
      return "Ear pain might be due to infection or wax. Avoid inserting objects and see a doctor if it persists.";
    } else if (input.includes('eye pain') || input.includes('itchy eyes') || input.includes('red eyes')) {
      return "Eye pain or redness can be due to allergy or strain. Rinse with clean water and avoid rubbing. See an eye doctor if not better.";
    } else if (input.includes('allergy') || input.includes('rash') || input.includes('itching') || input.includes('skin')) {
      return "Skin allergies may be caused by food, dust, or products. Apply calamine lotion and avoid scratching.";
    } else if (input.includes('burn') || input.includes('scald')) {
      return "Cool burns under running water for 10 minutes. Don’t apply toothpaste or oil. Cover lightly with a clean cloth.";
    } else if (input.includes('dizziness') || input.includes('vertigo') || input.includes('lightheaded')) {
      return "Dizziness may come from dehydration or low blood pressure. Sit or lie down, drink water, and rest.";
    } else if (input.includes('tired') || input.includes('fatigue')) {
      return "Tiredness often means your body needs rest, nutrition, or sleep. Eat balanced meals and sleep 7–8 hours daily.";
    } else if (input.includes('stress') || input.includes('anxiety') || input.includes('tension')) {
      return "Try breathing exercises, meditation, or listening to calming music. Talking to someone can help too.";
    } else if (input.includes('depression') || input.includes('sad') || input.includes('hopeless')) {
      return "I'm sorry you feel that way 💙. You're not alone. Talk to a loved one or a mental health professional. Help is available anytime.";
    } else if (input.includes('menstrual') || input.includes('period') || input.includes('cramp')) {
      return "Menstrual cramps are common. Use a hot-water bag, drink warm fluids, and rest. Consult a gynecologist if pain is severe.";
    } else if (input.includes('pregnancy') || input.includes('morning sickness')) {
      return "Morning sickness is common early in pregnancy. Eat small, frequent meals and stay hydrated. Consult your doctor for supplements.";
    } else if (input.includes('infection') || input.includes('bacteria') || input.includes('virus')) {
      return "Infections can cause fever, pain, or fatigue. Take prescribed antibiotics only after seeing a doctor.";
    } else if (input.includes('asthma') || input.includes('breath') || input.includes('shortness of breath')) {
      return "Asthma or breathing issues require calm breathing and inhaler if prescribed. Avoid smoke and dust.";
    } else if (input.includes('diabetes') || input.includes('sugar level')) {
      return "If you have diabetes, monitor sugar regularly, eat balanced meals, and exercise daily.";
    } else if (input.includes('bp') || input.includes('blood pressure') || input.includes('hypertension')) {
      return "High BP needs salt control and regular medication. Check regularly and stay calm under stress.";
    } else if (input.includes('cold sore') || input.includes('ulcer') || input.includes('mouth sore')) {
      return "Mouth ulcers can come from stress or vitamin deficiency. Use mouthwash and eat soft foods.";
    } else if (input.includes('acidity') || input.includes('heartburn') || input.includes('gas')) {
      return "Avoid spicy or fried food, eat slowly, and drink plenty of water. Antacids may help short term.";
    } else if (input.includes('covid') || input.includes('corona')) {
      return "COVID symptoms include fever, cough, and fatigue. Get tested if you suspect infection and rest in isolation.";
    } else if (input.includes('flu') || input.includes('influenza')) {
      return "Flu causes fever, sore throat, and weakness. Rest, stay hydrated, and take paracetamol if needed.";
    } else if (input.includes('help') || input.includes('hospital') || input.includes('doctor')) {
      return "If your symptoms are serious or lasting long, please visit a nearby doctor or hospital immediately.";
    } else {
      return "Thanks for sharing! I couldn't detect a specific symptom. Could you describe it more clearly — e.g., 'I have chest pain and cough since two days'?";
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:scale-110 transition-all"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col">
          <div className="bg-blue-500 text-white p-3 flex justify-between items-center rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">MediScan Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                } mb-2`}
              >
                <div
                  className={`p-2 rounded-lg max-w-[75%] ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && <p className="text-gray-400 text-sm">Typing...</p>}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-3 border-t flex gap-2"
          >
            <input
              type="text"
              className="flex-1 border rounded-full px-3 py-2"
              placeholder="Type your symptoms..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-full p-2"
              disabled={!input.trim()}
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}