// 🌩️ Tier 1 Crisis Trigger Phrases (50 strong signals)
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
  
  // 🧠 Check if a message is a crisis signal
  export function isCrisisMessage(text) {
    const msg = text.toLowerCase();
    return CRISIS_TRIGGERS.some(trigger => msg.includes(trigger));
  }


export async function getLLMResponse(userMessage) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a trauma-informed chatbot. You respond warmly, gently, and concisely. Always validate the user's emotions and keep things calm.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
      }),
    });
  
    const data = await response.json();
  
    if (!data.choices || data.error) {
      return { text: "I'm here with you, but something went wrong. Please try again later." };
    }
  
    return { text: data.choices[0].message.content.trim() };
  }