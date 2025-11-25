import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRef } from 'react';

type FormData = {
   prompt: string;
   conversationId: string;
};

const ChatBot = () => {
   const { register, handleSubmit, reset, formState } = useForm<FormData>();
   const conversationId = useRef<string>(crypto.randomUUID());
   const onSubmit = async (formData: FormData) => {
      try {
         const response = await axios.post('/api/chat', {
            ...formData,
            conversationId: conversationId.current,
         });
         console.log('chatbox ==>', response.data);
         reset();
      } catch (error) {
         console.error(error);
      }
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
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
   );
};

export default ChatBot;
