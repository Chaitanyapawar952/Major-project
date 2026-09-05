import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Define JSON Schema for structured output
const tripCostAnalysisSchema = {
  type: "object",
  properties: {
    totalEstimatedCost: {
      type: "number",
      description: "Total estimated cost for the entire trip"
    },
    dailyAverage: {
      type: "number",
      description: "Average cost per day"
    },
    costBreakdown: {
      type: "object",
      properties: {
        flights: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" },
            recommended: { type: "number" },
            notes: { type: "string" }
          },
          required: ["min", "max", "recommended", "notes"]
        },
        accommodation: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" },
            recommended: { type: "number" },
            perNight: { type: "number" },
            notes: { type: "string" }
          },
          required: ["min", "max", "recommended", "perNight", "notes"]
        },
        food: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" },
            recommended: { type: "number" },
            perDay: { type: "number" },
            breakdown: {
              type: "object",
              properties: {
                breakfast: { type: "number" },
                lunch: { type: "number" },
                dinner: { type: "number" },
                snacks: { type: "number" }
              },
              required: ["breakfast", "lunch", "dinner", "snacks"]
            },
            notes: { type: "string" }
          },
          required: ["min", "max", "recommended", "perDay", "breakdown", "notes"]
        },
        transportation: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" },
            recommended: { type: "number" },
            types: {
              type: "array",
              items: { type: "string" }
            },
            notes: { type: "string" }
          },
          required: ["min", "max", "recommended", "types", "notes"]
        },
        activities: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" },
            recommended: { type: "number" },
            suggestedActivities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  cost: { type: "number" }
                },
                required: ["name", "cost"]
              }
            },
            notes: { type: "string" }
          },
          required: ["min", "max", "recommended", "suggestedActivities", "notes"]
        },
        shopping: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" },
            recommended: { type: "number" },
            notes: { type: "string" }
          },
          required: ["min", "max", "recommended", "notes"]
        },
        miscellaneous: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" },
            recommended: { type: "number" },
            includes: {
              type: "array",
              items: { type: "string" }
            },
            notes: { type: "string" }
          },
          required: ["min", "max", "recommended", "includes", "notes"]
        }
      },
      required: ["flights", "accommodation", "food", "transportation", "activities", "shopping", "miscellaneous"]
    },
    budgetAnalysis: {
      type: "object",
      properties: {
        isFeasible: { type: "boolean" },
        budgetStatus: {
          type: "string",
          enum: ["insufficient", "tight", "comfortable", "generous"]
        },
        recommendation: { type: "string" },
        savingTips: {
          type: "array",
          items: { type: "string" }
        },
        warningMessage: {
          type: ["string", "null"]
        }
      },
      required: ["isFeasible", "budgetStatus", "recommendation", "savingTips", "warningMessage"]
    },
    seasonalConsiderations: {
      type: "object",
      properties: {
        bestMonths: {
          type: "array",
          items: { type: "string" }
        },
        peakSeason: { type: "string" },
        offSeason: { type: "string" },
        priceVariation: { type: "string" }
      },
      required: ["bestMonths", "peakSeason", "offSeason", "priceVariation"]
    },
    hiddenCosts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          item: { type: "string" },
          estimatedCost: { type: "number" },
          priority: {
            type: "string",
            enum: ["high", "medium", "low"]
          }
        },
        required: ["item", "estimatedCost", "priority"]
      }
    },
    moneySavingTips: {
      type: "array",
      items: {
        type: "object",
        properties: {
          tip: { type: "string" },
          potentialSavings: { type: "number" },
          category: { type: "string" }
        },
        required: ["tip", "potentialSavings", "category"]
      }
    },
    dailyItineraryCost: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          activities: {
            type: "array",
            items: { type: "string" }
          },
          estimatedDailyCost: { type: "number" },
          breakdown: {
            type: "object",
            properties: {
              meals: { type: "number" },
              transport: { type: "number" },
              activities: { type: "number" },
              other: { type: "number" }
            },
            required: ["meals", "transport", "activities", "other"]
          }
        },
        required: ["day", "activities", "estimatedDailyCost", "breakdown"]
      }
    }
  },
  required: [
    "totalEstimatedCost",
    "dailyAverage",
    "costBreakdown",
    "budgetAnalysis",
    "seasonalConsiderations",
    "hiddenCosts",
    "moneySavingTips",
    "dailyItineraryCost"
  ]
};

const costOptimizationSchema = {
  type: "object",
  properties: {
    overallStatus: {
      type: "string",
      enum: ["on-track", "over-budget", "under-budget"]
    },
    projectedTotal: { type: "number" },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          currentSpending: { type: "number" },
          recommendedLimit: { type: "number" },
          suggestion: { type: "string" }
        },
        required: ["category", "currentSpending", "recommendedLimit", "suggestion"]
      }
    },
    alternativeOptions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          currentOption: { type: "string" },
          alternativeOption: { type: "string" },
          potentialSavings: { type: "number" }
        },
        required: ["category", "currentOption", "alternativeOption", "potentialSavings"]
      }
    },
    urgentActions: {
      type: "array",
      items: { type: "string" }
    },
    dailyBudgetRemaining: { type: "number" }
  },
  required: ["overallStatus", "projectedTotal", "recommendations", "alternativeOptions", "urgentActions", "dailyBudgetRemaining"]
};

export const generateTripCostAnalysis = async (tripData) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: tripCostAnalysisSchema,
      },
    });

    const prompt = `
You are a professional travel budget analyst. Analyze the following trip and provide a DETAILED cost breakdown:

Trip Details:
- Destination: ${tripData.destination}
- Duration: ${tripData.duration} days
- Budget: $${tripData.budget}
- Number of Travelers: ${tripData.travelers}
- Travel Style: ${tripData.travelStyle || 'moderate'}

Important Instructions:
1. Provide realistic costs based on current ${new Date().getFullYear()} prices for ${tripData.destination}
2. Consider the travel style (budget, moderate, luxury) when estimating
3. Include local currency conversion notes where applicable
4. For flights, consider round-trip costs
5. For accommodation, calculate per night costs multiplied by duration
6. For food, break down by meal types (breakfast, lunch, dinner, snacks)
7. Suggest 5-8 specific activities with actual estimated costs
8. Include realistic hidden costs specific to the destination
9. Provide 8-10 actionable money-saving tips with estimated savings
10. Create a day-by-day itinerary with realistic daily costs
11. Analyze if the given budget is sufficient
12. Consider seasonal price variations

Be specific, detailed, and practical in your analysis.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const analysis = JSON.parse(text);
    
    // Validate and add fallbacks
    if (!analysis.totalEstimatedCost || !analysis.dailyAverage) {
      throw new Error('Invalid analysis format');
    }
    
    return analysis;
  } catch (error) {
    console.error('Error generating cost analysis:', error);
    
    // Return fallback data if API fails
    return getFallbackAnalysis(tripData);
  }
};

export const generateCostOptimizationSuggestions = async (tripData, currentExpenses) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: costOptimizationSchema,
      },
    });

    const prompt = `
Analyze the following trip expenses and provide optimization suggestions:

Trip Budget: $${tripData.budget}
Current Total Spent: $${currentExpenses.total}
Remaining Budget: $${tripData.budget - currentExpenses.total}
Days Remaining: ${tripData.daysRemaining}
Destination: ${tripData.destination}

Expense Categories:
${Object.entries(currentExpenses.byCategory).map(([cat, amount]) => `- ${cat}: $${amount}`).join('\n')}

Provide:
1. Overall budget status (on-track, over-budget, under-budget)
2. Projected total cost if current spending continues
3. Specific recommendations for each overspending category
4. Alternative cheaper options with estimated savings
5. Urgent actions if over budget
6. Remaining daily budget calculation
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating optimization suggestions:', error);
    throw error;
  }
};

// Fallback data if API fails
function getFallbackAnalysis(tripData) {
  const dailyBudget = tripData.budget / tripData.duration;
  
  return {
    totalEstimatedCost: tripData.budget,
    dailyAverage: dailyBudget,
    costBreakdown: {
      flights: {
        min: tripData.budget * 0.2,
        max: tripData.budget * 0.4,
        recommended: tripData.budget * 0.3,
        notes: "Estimated flight costs based on your budget"
      },
      accommodation: {
        min: dailyBudget * 0.2,
        max: dailyBudget * 0.4,
        recommended: dailyBudget * 0.3,
        perNight: dailyBudget * 0.3,
        notes: "Budget-friendly accommodation options available"
      },
      food: {
        min: dailyBudget * 0.15,
        max: dailyBudget * 0.3,
        recommended: dailyBudget * 0.25,
        perDay: dailyBudget * 0.25,
        breakdown: {
          breakfast: dailyBudget * 0.05,
          lunch: dailyBudget * 0.08,
          dinner: dailyBudget * 0.1,
          snacks: dailyBudget * 0.02
        },
        notes: "Mix of local eateries and restaurants"
      },
      transportation: {
        min: dailyBudget * 0.05,
        max: dailyBudget * 0.15,
        recommended: dailyBudget * 0.1,
        types: ["Public transport", "Taxis", "Rideshare"],
        notes: "Mix of public and private transportation"
      },
      activities: {
        min: dailyBudget * 0.1,
        max: dailyBudget * 0.25,
        recommended: dailyBudget * 0.15,
        suggestedActivities: [
          { name: "City tour", cost: 50 },
          { name: "Museum visit", cost: 25 },
          { name: "Local experience", cost: 40 }
        ],
        notes: "Popular attractions and experiences"
      },
      shopping: {
        min: dailyBudget * 0.05,
        max: dailyBudget * 0.15,
        recommended: dailyBudget * 0.1,
        notes: "Souvenirs and personal purchases"
      },
      miscellaneous: {
        min: dailyBudget * 0.05,
        max: dailyBudget * 0.1,
        recommended: dailyBudget * 0.07,
        includes: ["Tips", "Emergency funds", "Communication"],
        notes: "Buffer for unexpected expenses"
      }
    },
    budgetAnalysis: {
      isFeasible: true,
      budgetStatus: "comfortable",
      recommendation: "Your budget appears sufficient for a comfortable trip",
      savingTips: [
        "Book flights in advance for better deals",
        "Use public transportation when possible",
        "Eat at local restaurants",
        "Book accommodation with kitchen facilities"
      ],
      warningMessage: null
    },
    seasonalConsiderations: {
      bestMonths: ["May", "June", "September", "October"],
      peakSeason: "July-August",
      offSeason: "November-March",
      priceVariation: "Prices can vary by 30-50% between peak and off-season"
    },
    hiddenCosts: [
      { item: "Travel insurance", estimatedCost: 50, priority: "high" },
      { item: "Visa fees", estimatedCost: 100, priority: "high" },
      { item: "Airport transfers", estimatedCost: 40, priority: "medium" },
      { item: "Baggage fees", estimatedCost: 30, priority: "low" }
    ],
    moneySavingTips: [
      { tip: "Book flights 2-3 months in advance", potentialSavings: 200, category: "flights" },
      { tip: "Stay in hostels or budget hotels", potentialSavings: 150, category: "accommodation" },
      { tip: "Cook some meals yourself", potentialSavings: 100, category: "food" },
      { tip: "Use city tourist cards", potentialSavings: 50, category: "activities" }
    ],
    dailyItineraryCost: Array.from({ length: Math.min(tripData.duration, 7) }, (_, i) => ({
      day: i + 1,
      activities: ["Morning exploration", "Lunch at local spot", "Afternoon sightseeing", "Evening dinner"],
      estimatedDailyCost: dailyBudget,
      breakdown: {
        meals: dailyBudget * 0.25,
        transport: dailyBudget * 0.1,
        activities: dailyBudget * 0.15,
        other: dailyBudget * 0.1
      }
    }))
  };
}
