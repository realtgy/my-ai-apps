import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRef, useEffect } from 'react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

type FormData = {
   prompt: string;
   conversationId: string;
};

type Message = {
   role: 'user' | 'assistant';
   content: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotThinking, setIsBotThinking] = useState(false);
   const formRef = useRef<HTMLFormElement>(null);
   const { register, handleSubmit, reset, formState } = useForm<FormData>();
   const conversationId = useRef<string>(crypto.randomUUID());

   // 自动滚动到最新消息
   useEffect(() => {
      formRef?.current?.scrollIntoView({ behavior: 'smooth' });
   });

   const onSubmit = async (formData: FormData) => {
      setIsBotThinking(true);
      setMessages((prev) => [
         ...prev,
         { role: 'user', content: formData.prompt },
      ]);
      const response = await axios.post('/api/chat', {
         ...formData,
         conversationId: conversationId.current,
      });
      const newMessage = {
         role: 'assistant' as const,
         content: response.data.message as string,
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsBotThinking(false);
      reset();
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   const onCopyMessage = (e: React.ClipboardEvent<HTMLDivElement>) => {
      const selection = window.getSelection()?.toString()?.trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-3 mb-10">
            {messages.map((message, index) => (
               <div
                  onCopy={onCopyMessage}
                  key={index}
                  className={`px-3 py-1 rounded-xl ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
               >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </div>
            ))}
            {isBotThinking && (
               <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-xl">
                  <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse [animation-delay:0.4s]" />
               </div>
            )}
         </div>

         <form
            ref={formRef}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (value) => value.trim().length > 0,
               })}
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="ask anything..."
            />
            <Button
               className="w-9 h-9 rounded-full"
               disabled={!formState.isValid || formState.isSubmitting}
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
