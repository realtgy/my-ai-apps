import { Button } from '../button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

export type ChatInputFormData = {
   prompt: string;
   conversationId: string;
};

type ChatInputProps = {
   onSubmit: (data: ChatInputFormData) => void;
};

const ChatInput = ({ onSubmit }: ChatInputProps) => {
   const { register, handleSubmit, reset, formState } =
      useForm<ChatInputFormData>();

   const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
         reset({ prompt: '' });
      }
   };
   const handleFormSubmit = handleSubmit((data) => {
      reset({ prompt: '' });
      onSubmit(data);
   });
   return (
      <form
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         onSubmit={handleFormSubmit}
         onKeyDown={handleKeyDown}
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

export default ChatInput;
