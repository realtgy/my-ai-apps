const conversations: Map<
   string,
   { role: 'user' | 'assistant'; content: string }[]
> = new Map();

/**
 * Get the last conversation for a given conversation ID
 * @param conversationId - The ID of the conversation
 * @returns The last conversation
 */
export function getLastConversation(conversationId: string) {
   return conversations.get(conversationId);
}

/**
 * Set the last conversation for a given conversation ID
 * @param conversationId - The ID of the conversation
 * @param conversation - The conversation to set
 */
export function setLastConversation(
   conversationId: string,
   conversation: { role: 'user' | 'assistant'; content: string }[]
) {
   conversations.set(conversationId, conversation);
}
