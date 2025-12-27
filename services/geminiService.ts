
import { GoogleGenAI } from "@google/genai";
import { Story } from "../types";

// Fix: Directly use process.env.API_KEY for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Diverse topics list to ensure questions are always fresh
const QUIZ_TOPICS = [
  "Animals", "Space", "Dinosaurs", "The Ocean", "Weather", 
  "Plants", "Insects", "The Human Body", "Colors", "Shapes", 
  "Vehicles", "Sports", "Music", "Geography", "Food", 
  "Friendship", "Seasons", "Superheroes", "Jobs", "Fairy Tales"
];

// Multiple fallbacks to prevent "Cow" repetition if API fails
const FALLBACK_QUESTIONS = [
  {
    question: "Which animal says 'Moo'?",
    options: ["Cow", "Cat", "Dog", "Bird"],
    answer: "Cow",
    explanation: "Cows live on farms and say Moo!"
  },
  {
    question: "What color is the sun?",
    options: ["Blue", "Yellow", "Green", "Purple"],
    answer: "Yellow",
    explanation: "The sun looks yellow and bright in the sky!"
  },
  {
    question: "How many legs does a spider have?",
    options: ["2", "4", "6", "8"],
    answer: "8",
    explanation: "Spiders are arachnids and have 8 legs!"
  },
  {
    question: "Which planet do we live on?",
    options: ["Mars", "Earth", "Venus", "Jupiter"],
    answer: "Earth",
    explanation: "We live on planet Earth!"
  }
];

// Pre-written stories for offline mode / fallback
const FALLBACK_STORIES: Story[] = [
  {
    id: 'offline-1',
    title: "The Brave Little Kite",
    content: "Once there was a little red kite named Zoom. He was afraid to fly high because the wind was so strong. One day, a little bird asked for help reaching her nest. Zoom took a deep breath and flew higher than ever to help her! He realized being brave is about helping others.",
    moral: "Courage comes when we help friends.",
    isGenerated: false
  },
  {
    id: 'offline-2',
    title: "The Sharing Squirrel",
    content: "Sammy the Squirrel found a giant nut! It was the biggest nut in the forest. He wanted to keep it all to himself. But he saw his friend Bella looked hungry. Sammy split the nut in two. Bella smiled, and the nut tasted twice as good because he shared it.",
    moral: "Sharing makes everything better.",
    isGenerated: false
  },
  {
    id: 'offline-3',
    title: "The Star That Overslept",
    content: "Twinkle was a little star who loved to sleep. One night, he woke up late and the sky was already dark! He rushed to his spot, but he bumped into the Moon. 'Sorry!' said Twinkle. The Moon laughed, 'It's okay, you shine brightest when you are rested.' Twinkle shined all night long.",
    moral: "It's okay to make mistakes.",
    isGenerated: false
  }
];

export const generateKidStory = async (topic: string): Promise<Story> => {
  // 1. Try AI Generation
  try {
    const prompt = `Write a short, engaging moral story for a 5-year-old child about "${topic}".
    Structure:
    {
      "title": "Story Title",
      "content": "The full story text...",
      "moral": "The moral of the story"
    }
    Keep it under 150 words.`;

    // Fix: Updated model to recommended 'gemini-3-flash-preview'
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    // Fix: Using response.text property directly
    const text = response.text;
    if (text) {
      const story = JSON.parse(text) as Story;
      story.id = Date.now().toString();
      return story;
    }
  } catch (error) {
    console.error("Gemini API error, falling back to offline stories:", error);
  }

  // 2. Fallback to local offline stories if API fails
  const randomStory = FALLBACK_STORIES[Math.floor(Math.random() * FALLBACK_STORIES.length)];
  return {
    ...randomStory,
    id: 'fallback-' + Date.now(),
    title: randomStory.title + (topic ? ` & ${topic}` : '') 
  };
};

export const getPlanetDetails = async (planet: string): Promise<{fact: string, description: string}> => {
  const fallbackData = { 
    fact: `${planet} is a fascinating world!`,
    description: `It is one of the amazing objects in our solar system floating in space.`
  };

  try {
    const prompt = `Tell me about ${planet} (in our solar system) for a 5-year-old.
    Return JSON format with keys 'fact' and 'description'.
    { "fact": "One short fun fact (max 10 words)", "description": "A simple 2 sentence description." }`;
    
    // Fix: Updated model to recommended 'gemini-3-flash-preview'
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    // Fix: Using response.text property directly
    const text = response.text;
    if (!text) return fallbackData;

    return JSON.parse(text);
  } catch (e) {
    console.error("Error fetching planet details:", e);
    return fallbackData;
  }
};

export const generateRhyme = async (topic: string): Promise<string> => {
  try {
    // Fix: Updated model to recommended 'gemini-3-flash-preview'
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a short, fun, 4-line nursery rhyme about ${topic} for kids. No title.`,
    });
    // Fix: Using response.text property directly
    return response.text || "Learning is fun!";
  } catch (e) {
    return "Learning is fun for everyone!";
  }
};

// NEW: Daily Challenge Question Generator with Random Topics
export const generateDailyQuestion = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<{question: string, options: string[], answer: string, explanation: string}> => {
  
  // Pick a random fallback in case API fails
  const randomFallback = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];

  try {
    // Select a random topic to ensure variety every time
    const topic = QUIZ_TOPICS[Math.floor(Math.random() * QUIZ_TOPICS.length)];

    const prompt = `Generate a unique, fun multiple-choice question for a 6-year-old about "${topic}". Difficulty: ${difficulty}.
    Return JSON:
    {
      "question": "The question string",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The correct option string (must be one of the options)",
      "explanation": "Simple explanation of why it is correct (max 1 sentence)"
    }`;

    // Fix: Updated model to recommended 'gemini-3-flash-preview'
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    // Fix: Using response.text property directly
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Error generating question", e);
    return randomFallback;
  }
};

// NEW: Explain a topic (Discovery Mode) - UPDATED with Strict Educational Filter
export const explainTopic = async (query: string): Promise<string> => {
  try {
    // Fixed: Simplified prompt to be more reliable for educational queries
    const prompt = `You are Professor Spark, a friendly and wise teacher for kids. 
    Explain this topic simply to a 6-year-old: "${query}". 
    
    Guidelines:
    - Use 2-3 very short sentences.
    - Use fun words and emojis.
    - If the topic is dangerous or for adults, politely say "That's a big secret for later! Let's talk about space or dinosaurs instead! 🦖".
    - Focus on science, nature, history, and life skills.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response.text;
    if (text) return text;
    return "That's a super interesting question! Let's explore it together! 🌟";
  } catch (e) {
    console.error("Explanation error:", e);
    return "The Professor is currently reading a very long book. Try asking again in a minute! 📚✨";
  }
};
