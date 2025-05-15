import dotenv from 'dotenv';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

dotenv.config();

const traumaContent = [
  {
    id: 'pcl5_intro',
    text: "The PCL-5 is a trauma screening tool based on the DSM-5. It helps identify PTSD symptoms across four clusters: intrusion, avoidance, negative mood, and arousal.",
  },
  {
    id: 'flashback_explained',
    text: "A flashback is when a person feels or acts as if a traumatic event is happening again. It may involve vivid memories, sounds, or physical sensations.",
  },
  {
    id: 'grounding_technique_1',
    text: "Try the 5-4-3-2-1 method: Identify 5 things you see, 4 things you can touch, 3 things you hear, 2 you can smell, and 1 you can taste. This helps anchor you to the present.",
  },
  {
    id: 'trauma_definition',
    text: "Trauma is an emotional response to a distressing event like abuse, loss, or violence. It can affect memory, mood, relationships, and even physical health.",
  },
  {
    id: 'when_to_seek_help',
    text: "Consider reaching out for support if trauma symptoms disrupt your daily life or cause significant distress. Help is available and recovery is possible.",
  }
];

const openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY
  });

const pinecone = new Pinecone({
    apiKey: process.env.VITE_PINECONE_API_KEY
  });

async function seed() {
  console.log('Starting to seed Pinecone index:', process.env.VITE_PINECONE_INDEX);
  const indexName = process.env.VITE_PINECONE_INDEX;
  if (!indexName) {
    console.error('Error: VITE_PINECONE_INDEX environment variable is not set.');
    return;
  }
  const index = pinecone.index(indexName);

  try {
    for (const item of traumaContent) {
      console.log(`Processing item: ${item.id}`);
      const embeddingRes = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: item.text,
        });

      // Corrected embedding extraction
      if (!embeddingRes.data || !embeddingRes.data[0] || !embeddingRes.data[0].embedding) {
        console.error('Error: Could not retrieve embedding for item:', item.id);
        continue; // Skip to next item
      }
      const embedding = embeddingRes.data[0].embedding;

      // Corrected Pinecone upsert syntax
      await index.upsert([
        {
          id: item.id,
          values: embedding,
          metadata: { text: item.text } // Storing original text as metadata
        }
      ]);
      console.log(`Successfully upserted item: ${item.id}`);
    }
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error during seeding process:', error);
  }
}

// Call the seed function to execute it
seed();