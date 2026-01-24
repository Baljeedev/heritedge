import OpenAI from "openai";
import { IDayPlan } from "../models/Trip";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateItineraryParams {
  siteName: string;
  siteLocation: string;
  siteDescription: string;
  numberOfDays: number;
  budget: "Budget" | "Moderate" | "Luxury";
  hotels: Array<{
    _id: string;
    name: string;
    location: string;
    pricePerNight: { min: number; max: number; currency: string };
    description: string;
  }>;
  guides: Array<{
    _id: string;
    name: string;
    specialization: string;
    pricePerDay: number;
    bio: string;
    languages: string[];
    rating: number;
  }>;
  experiences: Array<{
    _id: string;
    name: string;
    type: "music" | "workshop";
    price: number;
    description: string;
    venue?: string;
    duration?: string;
  }>;
}

interface EditItineraryParams {
  existingItinerary: IDayPlan[];
  customPrompt: string;
  siteName: string;
  siteLocation: string;
  numberOfDays: number;
  budget: "Budget" | "Moderate" | "Luxury";
}

export async function generateItinerary(params: GenerateItineraryParams): Promise<IDayPlan[]> {
  const { siteName, siteLocation, siteDescription, numberOfDays, budget, hotels, guides, experiences } = params;

  // Build hotels list for AI context
  const hotelsList = hotels
    .map(
      (h) =>
        `- ${h.name} (${h.location}): ₹${h.pricePerNight.min}-${h.pricePerNight.max}/night - ${h.description.substring(0, 100)}...`
    )
    .join("\n");

  // Build guides list for AI context
  const guidesList = guides
    .map(
      (g) =>
        `- ${g.name} (${g.specialization}): ₹${g.pricePerDay}/day, Rating: ${g.rating}/5, Languages: ${g.languages.join(", ")} - ${g.bio.substring(0, 100)}...`
    )
    .join("\n");

  // Build experiences list for AI context
  const experiencesList = experiences
    .map(
      (e) =>
        `- ${e.name} (${e.type}): ₹${e.price} - ${e.description.substring(0, 100)}...${e.venue ? ` Venue: ${e.venue}` : ""}${e.duration ? ` Duration: ${e.duration}` : ""}`
    )
    .join("\n");

  const systemPrompt = `You are an expert travel itinerary planner specializing in heritage tourism in India. 
Create detailed, day-by-day itineraries that are practical, culturally enriching, and optimized for the user's budget and preferences.
Always recommend specific hotels, guides, and experiences from the provided lists when relevant.
Structure your response as a JSON array of day plans.`;

  const userPrompt = `Create a ${numberOfDays}-day itinerary for visiting ${siteName} in ${siteLocation}.

Site Information:
${siteDescription}

Budget Level: ${budget}
- Budget: Focus on affordable options
- Moderate: Mix of mid-range and some premium experiences
- Luxury: Premium hotels, private guides, exclusive experiences

Available Hotels (MUST choose from these):
${hotelsList || "No hotels available"}

Available Guides (MUST choose from these if recommending a guide):
${guidesList || "No guides available"}

Available Experiences (MUST choose from these if recommending music shows or workshops):
${experiencesList || "No experiences available"}

Requirements:
1. Create exactly ${numberOfDays} days of activities
2. Each day should have a title and multiple activities with specific times
3. Include hotel recommendations from the provided list (specify which hotel for each night)
4. Include guide recommendations from the provided list when visiting heritage sites
5. Include music shows or workshops from the provided list for evening activities
6. Consider travel time between locations
7. Include meal suggestions (breakfast, lunch, dinner) with local cuisine recommendations
8. Make activities realistic and not overly packed
9. Include cultural context and historical significance where relevant
10. Respect the budget level specified

Return ONLY a valid JSON array in this exact format. You can wrap it in a markdown code block if needed:
[
  {
    "day": 1,
    "title": "Day 1: Arrival and Introduction",
    "activities": [
      {
        "time": "09:00",
        "activity": "Activity name",
        "location": "Location name",
        "description": "Detailed description"
      }
    ]
  }
]`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response - OpenAI might return JSON wrapped in markdown code blocks
    let parsedResponse: any;
    try {
      // Try to extract JSON from markdown code blocks first
      const jsonMatch = responseContent.match(/```(?:json)?\s*(\[[\s\S]*\]|\{[\s\S]*\})\s*```/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[1]);
      } else {
        // Try parsing the entire response as JSON
        parsedResponse = JSON.parse(responseContent);
      }
    } catch (e) {
      throw new Error(`Failed to parse OpenAI response as JSON: ${e}`);
    }

    // Extract the itinerary array - OpenAI might return { itinerary: [...] } or just [...]
    let itinerary: IDayPlan[] = [];
    if (Array.isArray(parsedResponse)) {
      itinerary = parsedResponse;
    } else if (parsedResponse.itinerary && Array.isArray(parsedResponse.itinerary)) {
      itinerary = parsedResponse.itinerary;
    } else if (parsedResponse.days && Array.isArray(parsedResponse.days)) {
      itinerary = parsedResponse.days;
    } else {
      throw new Error("Unexpected response format from OpenAI - expected an array or object with itinerary/days array");
    }

    // Validate and format the itinerary
    return itinerary.map((day: any, index: number) => ({
      day: day.day ?? index + 1,
      title: day.title || `Day ${index + 1}`,
      activities: (day.activities || []).map((activity: any) => ({
        time: activity.time || "09:00",
        activity: activity.activity || activity.name || "Activity",
        location: activity.location || siteLocation,
        description: activity.description || "",
      })),
    }));
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw new Error(`Failed to generate itinerary: ${error.message}`);
  }
}

export async function editItinerary(params: EditItineraryParams): Promise<IDayPlan[]> {
  const { existingItinerary, customPrompt, siteName, siteLocation, numberOfDays, budget } = params;

  const systemPrompt = `You are an expert travel itinerary planner specializing in heritage tourism in India.
You are editing an existing itinerary based on user feedback. Maintain the structure and quality while incorporating the user's specific requests.`;

  const userPrompt = `Edit the following ${numberOfDays}-day itinerary for ${siteName} in ${siteLocation} based on this request: "${customPrompt}"

Current Itinerary (JSON):
${JSON.stringify(existingItinerary, null, 2)}

Budget Level: ${budget}

Requirements:
1. Keep the same number of days (${numberOfDays})
2. Maintain the day-by-day structure
3. Incorporate the user's specific request: "${customPrompt}"
4. Ensure activities are realistic and well-timed
5. Return the complete updated itinerary

Return ONLY a valid JSON array in this exact format. You can wrap it in a markdown code block if needed:
[
  {
    "day": 1,
    "title": "Day 1: Title",
    "activities": [
      {
        "time": "09:00",
        "activity": "Activity name",
        "location": "Location name",
        "description": "Detailed description"
      }
    ]
  }
]`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response - OpenAI might return JSON wrapped in markdown code blocks
    let parsedResponse: any;
    try {
      // Try to extract JSON from markdown code blocks first
      const jsonMatch = responseContent.match(/```(?:json)?\s*(\[[\s\S]*\]|\{[\s\S]*\})\s*```/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[1]);
      } else {
        // Try parsing the entire response as JSON
        parsedResponse = JSON.parse(responseContent);
      }
    } catch (e) {
      throw new Error(`Failed to parse OpenAI response as JSON: ${e}`);
    }

    // Extract the itinerary array - OpenAI might return { itinerary: [...] } or just [...]
    let itinerary: IDayPlan[] = [];
    if (Array.isArray(parsedResponse)) {
      itinerary = parsedResponse;
    } else if (parsedResponse.itinerary && Array.isArray(parsedResponse.itinerary)) {
      itinerary = parsedResponse.itinerary;
    } else if (parsedResponse.days && Array.isArray(parsedResponse.days)) {
      itinerary = parsedResponse.days;
    } else {
      throw new Error("Unexpected response format from OpenAI - expected an array or object with itinerary/days array");
    }

    // Validate and format the itinerary
    return itinerary.map((day: any, index: number) => ({
      day: day.day ?? index + 1,
      title: day.title || `Day ${index + 1}`,
      activities: (day.activities || []).map((activity: any) => ({
        time: activity.time || "09:00",
        activity: activity.activity || activity.name || "Activity",
        location: activity.location || siteLocation,
        description: activity.description || "",
      })),
    }));
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw new Error(`Failed to edit itinerary: ${error.message}`);
  }
}
