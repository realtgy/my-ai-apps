import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';

const ChatBot = () => {
   return (
      <div className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
         <textarea
            className="w-full border-0 focus:outline-0 resize-none"
            placeholder="ask anything..."
         />
         <Button className="w-9 h-9 rounded-full">
            <FaArrowUp />
         </Button>
      </div>
   );
};

export default ChatBot;
