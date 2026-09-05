import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Get AI suggestions for destinations
export const getDestinationSuggestions = async (tripDetails) => {
  try {
    const { destination, budget, duration, interests } = tripDetails;

    const prompt = `
You are a travel expert. Based on the following trip details, suggest 5 best destinations nearby.

Trip Details:
- Base Destination: ${destination}
- Budget: $${budget}
- Duration: ${duration} days
- Interests: ${interests.join(", ")}

Please provide suggestions in JSON format:
[
  {
    "name": "Destination Name",
    "country": "Country",
    "description": "Brief description",
    "estimatedBudget": "$X per person",
    "highlights": ["highlight1", "highlight2"],
    "bestTime": "Best season to visit"
  }
]

Only return valid JSON array, no other text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
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

// Get itinerary suggestions from Gemini
export const getItinerarySuggestions = async (tripDetails) => {
  try {
    const { destination, duration, interests } = tripDetails;

    const prompt = `
Create a ${duration}-day itinerary for ${destination} for someone interested in: ${interests.join(", ")}

Format response as a simple day-by-day list like:
Day 1: Activity 1, Activity 2, Activity 3
Day 2: Activity 1, Activity 2, Activity 3
...

Keep it concise and practical.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting itinerary:", error);
    throw error;
  }
};
