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