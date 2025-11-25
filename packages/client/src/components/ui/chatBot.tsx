import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRef } from 'react';
import { useState } from 'react';

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

   const { register, handleSubmit, reset, formState } = useForm<FormData>();
   const conversationId = useRef<string>(crypto.randomUUID());
   const onSubmit = async (formData: FormData) => {
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
      reset();
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-3 mb-10">
            {messages.map((message, index) => (
               <p
                  key={index}
                  className={`px-3 py-1 rounded-xl ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
               >
                  {message.content}
               </p>
            ))}
         </div>
         <form
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
