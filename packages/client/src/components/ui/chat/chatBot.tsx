import axios from 'axios';
import { useRef } from 'react';
import { useState } from 'react';
import TypingIndicator from './TypeingIndicator';
import ChatMessages from './ChatMessages';
import type { Message } from './ChatMessages';
import ChatInput from './ChatInput';
import type { ChatInputFormData } from './ChatInput';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

const ChatBot = () => {
   const [error, setError] = useState('');
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotThinking, setIsBotThinking] = useState(false);
   const conversationId = useRef<string>(crypto.randomUUID());

   const onSubmit = async (formData: ChatInputFormData) => {
      try {
         setError('');
         setIsBotThinking(true);
         setMessages((prev) => [
            ...prev,
            { role: 'user', content: formData.prompt },
         ]);
         popAudio.play();
         const response = await axios.post('/api/chat', {
            ...formData,
            conversationId: conversationId.current,
         });
         const newMessage = {
            role: 'assistant' as const,
            content: response.data.message as string,
         };
         notificationAudio.play();
         setMessages((prev) => [...prev, newMessage]);
         setIsBotThinking(false);
      } catch (err) {
         console.log(err);
         setError('Something went wrong. Try again later.');
      } finally {
         setIsBotThinking(false);
      }
   };

   return (
      <div className="flex flex-col  h-full">
         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
            <ChatMessages messages={messages} />
            {isBotThinking && <TypingIndicator />}
            {error && <div className="text-red-500 text-sm">{error}</div>}
         </div>

         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
