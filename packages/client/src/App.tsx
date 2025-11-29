import ChatBot from '@/components/ui/chat/chatBot';
import ReviewList from '@/components/reviews/ReviewList';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
function App() {
   const [isChatBotVisible, setIsChatBotVisible] = useState(true);

   return (
      <div className="h-screen w-full p-10">
         <div className="flex justify-end gap-4">
            <Button onClick={() => setIsChatBotVisible(!isChatBotVisible)}>
               {isChatBotVisible ? 'Show Review List' : 'Show Chat Bot'}
            </Button>
         </div>
         {isChatBotVisible ? (
            <ChatBot />
         ) : (
            <ReviewList productId="550e8400-e29b-41d4-a716-446655440003" />
         )}
      </div>
   );
}

export default App;
