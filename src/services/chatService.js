// Tier 1 Crisis Trigger Phrases (50 strong signals)
export const CRISIS_TRIGGERS = [
    "kill myself",
    "want to die",
    "end my life",
    "suicide",
    "hurt myself",
    "can't go on",
    "ending it all",
    "self-harm",
    "i'm done",
    "wish i was dead",
    "no reason to live",
    "take my life",
    "overdose",
    "cut myself",
    "jump off",
    "swallow pills",
    "slit my wrists",
    "ready to die",
    "no one cares",
    "life is meaningless",
    "everyone would be better off without me",
    "i hate myself",
    "i want it to be over",
    "i'm broken",
    "i give up",
    "i want to disappear",
    "can't take it anymore",
    "i'm losing it",
    "there's no way out",
    "nothing matters",
    "i just want peace",
    "i feel hopeless",
    "why go on",
    "i can't keep this up",
    "i just want it to end",
    "i hate living",
    "done trying",
    "i want out",
    "never-ending pain",
    "want to vanish",
    "erase me",
    "kill this pain",
    "can't cope",
    "no future",
    "dark thoughts",
    "breaking point",
    "losing control",
    "i'm exhausted",
    "i'm overwhelmed",
    "i'm worthless"
  ];
  
  // Check if a message is a crisis signal
  export function isCrisisMessage(text) {
    const msg = text.toLowerCase();
    return CRISIS_TRIGGERS.some(trigger => msg.includes(trigger));
  }

import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const pineconeApiKey = import.meta.env.VITE_PINECONE_API_KEY;
const pineconeIndexName = import.meta.env.VITE_PINECONE_INDEX;

let openai;
let pinecone;
let index;

if (openaiApiKey) {
  openai = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true // Required for browser usage, acknowledge security risks
  });
} else {
  console.error("VITE_OPENAI_API_KEY is not set. OpenAI client not initialized.");
}

if (pineconeApiKey && pineconeIndexName) {
  pinecone = new Pinecone({
    apiKey: pineconeApiKey
  });
  index = pinecone.index(pineconeIndexName);
} else {
  console.error("VITE_PINECONE_API_KEY or VITE_PINECONE_INDEX is not set. Pinecone client not initialized.");
}

// RAG-enhanced LLM response
export async function getLLMResponse(userMessage) {
  if (!openai || !index) {
    console.error("OpenAI or Pinecone client not initialized. Returning fallback message.");
    return { text: "I'm here to support you, but there's a configuration issue. Please contact support." };
  }

  try {
    // 1. Embed user query
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-ada-002", // Corrected model for 1536 dimensions
      input: userMessage,
    });

    // Ensure data structure is as expected before destructuring
    const embedding = embeddingRes?.data?.[0]?.embedding;
    if (!embedding) {
      console.error('Failed to create embedding for the user message.');
      return { text: "I'm having a little trouble understanding right now. Could you try rephrasing?" };
    }

    // 2. Query Pinecone
    const queryResult = await index.query({
      vector: embedding,
      topK: 3,
      includeMetadata: true,
    });
    console.log("Pinecone matches:", queryResult.matches);

    const retrievedChunks = queryResult.matches?.map(
      (match) => match.metadata?.text // Added optional chaining for metadata
    ).filter(text => text) || []; // Filter out undefined/null texts

    // 3. Prepare context
    const ragContext = retrievedChunks.length
      ? `Here is some helpful background to assist the user:\n\n${retrievedChunks.join("\n\n")}\n\n`
      : '';

    // 4. Generate LLM response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
          You are a trauma-informed assistant. Please answer the user's question using the following retrieved knowledge if it is relevant.
          
          Retrieved context:
          ${ragContext}
          
          Respond in a gentle, validating, and emotionally safe tone. Keep answers under 120 words unless clarity requires more.
          `   },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.7,
    });

    return { text: completion.choices[0].message.content.trim() };

  } catch (error) {
    console.error("Error in getLLMResponse (RAG):", error);
    // Provide a generic error message to the user
    if (error.response && error.response.data && error.response.data.error) {
        // If the error is from OpenAI API itself
        return { text: `I'm having a little trouble connecting: ${error.response.data.error.message}` };
    }
    return { text: "I'm here with you, but something unexpected went wrong. Please try again in a moment." };
  }
}