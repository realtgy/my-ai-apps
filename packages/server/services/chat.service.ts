import { OpenAI } from 'openai';
import {
   getLastConversation,
   setLastConversation,
} from '../repositories/conversation.repositories';
import fs from 'fs';
import path from 'path';
import chatbotPrompt from '../prompts/chatbot.txt';

const partInfo = fs.readFileSync(
   path.join(__dirname, '../prompts/Hong-Kong-Disneyland.md'),
   'utf8'
);

const chatbotPromptContent = (chatbotPrompt as string).replace(
   '{{partInfo}}',
   partInfo
);

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

         // 构建发送给 API 的消息数组：在开头添加系统提示词
         const messagesForAPI = [
            { role: 'system' as const, content: chatbotPromptContent },
            ...history,
            userMessage,
         ];

         const finalMessages = messagesForAPI.map((msg) => ({
            role: msg.role,
            content: msg.content,
         }));

         const chat = await client.chat.completions.create({
            model: 'gpt-5-mini',
            temperature: 0.2,
            max_completion_tokens: 200,
            messages: finalMessages,
         });

         const assistantContent = chat?.choices[0]?.message?.content || '';
         const assistantMessage = {
            role: 'assistant' as const,
            content: assistantContent,
         };
         // 保存对话历史（不包含系统消息，因为类型定义不支持）
         setLastConversation(conversationId, [
            ...history,
            userMessage,
            assistantMessage,
         ]);
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
