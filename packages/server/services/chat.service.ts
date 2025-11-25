import { OpenAI } from 'openai';
import {
   getLastConversation,
   setLastConversation,
} from '../repositories/conversation.repositories';

const client = new OpenAI({
   apiKey: process.env.POE_API_KEY,
   baseURL: 'https://api.poe.com/v1',
});

type ChatReponse = {
   id: string;
   message: string;
};

export const chatService = {
   /**
    * Send a message to the chat service
    * @param conversationId - The ID of the conversation
    * @param prompt - The prompt to send to the chat service
    * @returns The response from the chat service
    */
   sendMessage: async (
      conversationId: string,
      prompt: string
   ): Promise<ChatReponse> => {
      try {
         const history = getLastConversation(conversationId) || [];
         const userMessage = { role: 'user' as const, content: prompt };
         const messages = [...history, userMessage];
         const chat = await client.chat.completions.create({
            model: 'gpt-5-mini',
            temperature: 0.2,
            max_completion_tokens: 200,
            messages: messages.map((msg) => ({
               role: msg.role,
               content: msg.content,
            })),
         });

         const assistantContent = chat?.choices[0]?.message?.content || '';
         const assistantMessage = {
            role: 'assistant' as const,
            content: assistantContent,
         };
         setLastConversation(conversationId, [...messages, assistantMessage]);
         return {
            id: conversationId,
            message: assistantContent,
         };
      } catch (error) {
         console.error('Error in chat service:', error);
         throw error;
      }
   },
};
