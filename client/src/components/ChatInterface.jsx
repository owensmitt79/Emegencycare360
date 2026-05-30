import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConsultant } from '@/contexts/ConsultantProvider.jsx';

const ChatInterface = () => {
  const { currentDoctor, chatHistory, addMessage } = useConsultant();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      message: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    addMessage(userMsg);
    setInputValue('');
    setIsTyping(true);

    // Mock doctor response
    setTimeout(() => {
      const docMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'doctor',
        message: "I'm reviewing your request now. Are you currently in a safe location?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      };
      addMessage(docMsg);
      setIsTyping(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-3">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
              <img 
                src={currentDoctor.image} 
                alt={currentDoctor.name} 
                className="w-full h-full object-cover rounded-full opacity-50 grayscale"
              />
            </div>
            <p className="text-sm">Start a conversation with {currentDoctor.name}</p>
            <p className="text-xs opacity-70">Responses are typically within 1 minute</p>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              <div 
                className={`px-4 py-2 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-[#1E3A8A] text-white rounded-br-sm' 
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}
              >
                {msg.message}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm mr-auto">
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border bg-card">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-[#3B82F6]"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shrink-0"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;