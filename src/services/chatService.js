export async function getLLMResponse(userMessage) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      text: `You said: "${userMessage}". I'm here to support you.`
    };
  }