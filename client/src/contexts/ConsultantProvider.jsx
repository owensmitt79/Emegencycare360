import React, { createContext, useContext, useState, useEffect } from 'react';

const ConsultantContext = createContext();

export const useConsultant = () => {
  const context = useContext(ConsultantContext);
  if (!context) {
    throw new Error('useConsultant must be used within a ConsultantProvider');
  }
  return context;
};

export const ConsultantProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'call'
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [callLogs, setCallLogs] = useState([]);

  const currentDoctor = {
    name: 'Dr. Sarah Jenkins',
    specialization: 'Emergency Medicine',
    availability: 'Online',
    rating: '4.8 ⭐ 250+ reviews',
    image: 'https://images.unsplash.com/photo-1588966915713-6d43603478e5?auto=format&fit=crop&w=150&q=80',
    callImage: 'https://images.unsplash.com/photo-1614579093335-b6ab37ddaace?auto=format&fit=crop&w=300&q=80'
  };

  useEffect(() => {
    const savedChat = localStorage.getItem('emergencycare360_chat_history');
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        setChatHistory(parsed);
        const unread = parsed.filter(msg => !msg.read && msg.sender === 'doctor').length;
        setUnreadMessages(unread);
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }

    const savedCalls = localStorage.getItem('emergencycare360_call_logs');
    if (savedCalls) {
      try {
        setCallLogs(JSON.parse(savedCalls));
      } catch (e) {
        console.error('Failed to parse call logs', e);
      }
    }
  }, []);

  const toggleConsultant = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      markMessagesAsRead();
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const markMessagesAsRead = () => {
    setUnreadMessages(0);
    const updatedHistory = chatHistory.map(msg => ({ ...msg, read: true }));
    setChatHistory(updatedHistory);
    localStorage.setItem('emergencycare360_chat_history', JSON.stringify(updatedHistory));
  };

  const addMessage = (messageObj) => {
    const newHistory = [...chatHistory, messageObj];
    setChatHistory(newHistory);
    localStorage.setItem('emergencycare360_chat_history', JSON.stringify(newHistory));
    
    if (messageObj.sender === 'doctor' && !isOpen) {
      setUnreadMessages(prev => prev + 1);
    }
  };

  const addCallLog = (logObj) => {
    const newLogs = [...callLogs, logObj];
    setCallLogs(newLogs);
    localStorage.setItem('emergencycare360_call_logs', JSON.stringify(newLogs));
  };

  return (
    <ConsultantContext.Provider
      value={{
        isOpen,
        activeTab,
        unreadMessages,
        currentDoctor,
        chatHistory,
        callLogs,
        toggleConsultant,
        switchTab,
        markMessagesAsRead,
        addMessage,
        addCallLog
      }}
    >
      {children}
    </ConsultantContext.Provider>
  );
};