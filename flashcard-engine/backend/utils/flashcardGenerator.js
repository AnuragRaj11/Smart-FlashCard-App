import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateFlashcards(text) {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are an expert teacher creating flashcards from study material.
    
Based on this text:
${text.substring(0, 8000)}

Generate 10 high-quality flashcards in this exact JSON format:
[
  {
    "front": "Question or term?",
    "back": "Answer or definition",
    "difficulty": "easy|medium|hard"
  }
]

Cover: key concepts, definitions, relationships, formulas (if any), and important examples.
Make cards that test understanding, not just memorization.
Return ONLY the JSON array, no other text.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text();
    
    // Clean up the response (remove markdown code blocks if present)
    content = content.replace(/```json\n?/g, '');
    content = content.replace(/```\n?/g, '');
    
    // Find JSON array
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const flashcards = JSON.parse(jsonMatch[0]);
      console.log(`✅ Generated ${flashcards.length} flashcards using Gemini`);
      return flashcards;
    }
    
    throw new Error('No JSON array found in response');
    
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    // Return mock flashcards as fallback
    return getMockFlashcards();
  }
}
function extractKeyConcepts(text) {
  // Find headings, bold text, bullet points
  const headings = text.match(/^#.*$|^[A-Z][^.!?]*$/gm) || [];
  const definitions = text.match(/is defined as|refers to|means that/gi) || [];
  
  return {
    headings: headings.slice(0, 5),
    definitions: definitions.length,
    complexity: text.length > 5000 ? "detailed" : "simple"
  };
}

// Fallback mock flashcards (no API needed)
function getMockFlashcards() {
  return [
    { front: "What is spaced repetition?", back: "A learning technique that increases review intervals over time", difficulty: "easy" },
    { front: "What does SM-2 stand for?", back: "SuperMemo 2 algorithm for spaced repetition", difficulty: "medium" },
    { front: "What is the forgetting curve?", back: "Shows how information is forgotten over time without review", difficulty: "medium" },
    { front: "What is active recall?", back: "Actively retrieving information from memory", difficulty: "easy" },
    { front: "What is the optimal first review interval?", back: "1 day after initial learning", difficulty: "hard" },
    { front: "What is a Leitner system?", back: "Physical box system for spaced repetition flashcards", difficulty: "medium" },
    { front: "Who created the forgetting curve?", back: "Hermann Ebbinghaus in 1885", difficulty: "hard" },
    { front: "What is the minimum information principle?", back: "Each flashcard should test only one fact", difficulty: "medium" },
    { front: "What is interleaving?", back: "Mixing different topics during study sessions", difficulty: "hard" },
    { front: "What is the testing effect?", back: "Long-term memory improves when you test yourself", difficulty: "medium" }
  ];
}
