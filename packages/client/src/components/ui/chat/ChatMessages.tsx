import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
   role: 'user' | 'assistant';
   content: string;
};

type ChatMessageProps = {
   messages: Message[];
   lastMessageRef: React.RefObject<HTMLDivElement>;
};
export default function ChatMessages({ messages }: ChatMessageProps) {
   const lastMessageRef = useRef<HTMLDivElement>(null);

   // 自动滚动到最新消息
   useEffect(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onCopyMessage = (e: React.ClipboardEvent<HTMLDivElement>) => {
      const selection = window.getSelection()?.toString()?.trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   return (
      <div className="flex flex-col gap-2">
         {messages.map((message, index) => (
            <div
               ref={index === messages.length - 1 ? lastMessageRef : null}
               onCopy={onCopyMessage}
               key={index}
               className={`px-3 py-1 rounded-xl ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
            >
               <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
         ))}
      </div>
   );
}
