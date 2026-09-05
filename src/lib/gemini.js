import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// Get AI suggestions
export const getDestinationSuggestions = async (tripDetails) => {
  try {
    const { destination, budget, duration, interests } = tripDetails;

    const prompt = `Suggest 5 best destinations near ${destination} with budget $${budget} for ${duration} days. Interested in: ${interests.join(", ")}. Return as JSON array with: name, country, description, estimatedBudget, highlights (array), bestTime.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error("Error getting suggestions:", error);
    throw error;
  }
};

// Get itinerary
export const getItinerarySuggestions = async (tripDetails) => {
  try {
    const { destination, duration, interests } = tripDetails;

    const prompt = `Create a ${duration}-day itinerary for ${destination}. Interested in: ${interests.join(", ")}. Format as Day 1: activity, activity\nDay 2: activity, activity etc.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting itinerary:", error);
    throw error;
  }
};
