import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const travelTool = createTool({
  id: 'get-travel-info',
  description: 'Get travel recommendations and information for a destination',
  inputSchema: z.object({
    destination: z.string().describe('Destination city or country'),
    interests: z
      .array(z.string())
      .optional()
      .describe('Travel interests (e.g., culture, food, nature, adventure)'),
  }),
  outputSchema: z.object({
    destination: z.string(),
    highlights: z.array(z.string()),
    bestTimeToVisit: z.string(),
    estimatedBudget: z.string(),
    topAttractions: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        category: z.string(),
      })
    ),
    localTips: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    return await getTravelInfo(context.destination, context.interests);
  },
});

const getTravelInfo = async (
  destination: string,
  _interests?: string[]
): Promise<{
  destination: string;
  highlights: string[];
  bestTimeToVisit: string;
  estimatedBudget: string;
  topAttractions: {
    name: string;
    description: string;
    category: string;
  }[];
  localTips: string[];
}> => {
  // Mock data for demonstration - in production, this would call a real travel API
  // Use Promise.resolve to satisfy eslint require-await rule
  return await Promise.resolve().then(() => {
    const travelData: Record<
      string,
      {
        highlights: string[];
        bestTimeToVisit: string;
        estimatedBudget: string;
        topAttractions: {
          name: string;
          description: string;
          category: string;
        }[];
        localTips: string[];
      }
    > = {
      tokyo: {
        highlights: [
          'Ancient temples and modern skyscrapers',
          'World-class cuisine',
          'Cherry blossoms in spring',
          'Efficient public transportation',
        ],
        bestTimeToVisit: 'March-May (spring) or September-November (autumn)',
        estimatedBudget: '$100-200 per day',
        topAttractions: [
          {
            name: 'Senso-ji Temple',
            description:
              "Tokyo's oldest temple in historic Asakusa district with traditional shopping street",
            category: 'Culture',
          },
          {
            name: 'Shibuya Crossing',
            description:
              "World's busiest pedestrian crossing and iconic Tokyo landmark",
            category: 'Urban',
          },
          {
            name: 'Tsukiji Outer Market',
            description: 'Fresh seafood and authentic Japanese street food',
            category: 'Food',
          },
          {
            name: 'Meiji Shrine',
            description:
              'Peaceful Shinto shrine surrounded by forest in the heart of the city',
            category: 'Nature',
          },
        ],
        localTips: [
          'Get a Suica or Pasmo card for convenient train travel',
          'Learn basic phrases: Arigatou (thank you), Sumimasen (excuse me)',
          'Many restaurants are cash-only, carry yen',
          'Shoes off when entering traditional establishments',
        ],
      },
      paris: {
        highlights: [
          'Iconic landmarks and architecture',
          'World-renowned museums',
          'Exquisite French cuisine',
          'Romantic atmosphere',
        ],
        bestTimeToVisit: 'April-June or September-October',
        estimatedBudget: '$150-300 per day',
        topAttractions: [
          {
            name: 'Eiffel Tower',
            description:
              'Iconic iron lattice tower with stunning city views, especially at sunset',
            category: 'Landmark',
          },
          {
            name: 'Louvre Museum',
            description:
              "World's largest art museum, home to Mona Lisa and Venus de Milo",
            category: 'Culture',
          },
          {
            name: 'Notre-Dame Cathedral',
            description:
              'Medieval Catholic cathedral with Gothic architecture (currently under restoration)',
            category: 'Architecture',
          },
          {
            name: 'Montmartre',
            description:
              'Charming hilltop neighborhood with artists, cafes, and Sacré-Cœur basilica',
            category: 'Culture',
          },
        ],
        localTips: [
          'Museum Pass saves money if visiting multiple museums',
          "Learn basic French: Bonjour, Merci, S'il vous plaît",
          'Validate metro tickets before boarding',
          'Book popular restaurants in advance',
        ],
      },
      newyork: {
        highlights: [
          'Diverse cultural experiences',
          'World-class entertainment',
          'Iconic skyline and landmarks',
          'International cuisine',
        ],
        bestTimeToVisit: 'April-June or September-early November',
        estimatedBudget: '$200-400 per day',
        topAttractions: [
          {
            name: 'Central Park',
            description:
              '843-acre urban park with lakes, theaters, ice rinks, and playgrounds',
            category: 'Nature',
          },
          {
            name: 'Statue of Liberty',
            description:
              'Iconic symbol of freedom on Liberty Island, requires advance tickets',
            category: 'Landmark',
          },
          {
            name: 'Times Square',
            description:
              'Bright lights, Broadway theaters, and bustling energy',
            category: 'Entertainment',
          },
          {
            name: 'Metropolitan Museum of Art',
            description:
              "One of the world's largest and finest art museums with 5,000 years of art",
            category: 'Culture',
          },
        ],
        localTips: [
          'MetroCard for unlimited subway rides is cost-effective',
          'Walk and explore different neighborhoods',
          'TKTS booth for discounted Broadway tickets',
          'Tipping is customary (15-20% at restaurants)',
        ],
      },
    };

    const destinationKey = destination.toLowerCase().replace(/\s+/g, '');
    const data = travelData[destinationKey] ?? travelData.tokyo; // Default to Tokyo if destination not found

    return {
      destination: destination,
      highlights: data.highlights,
      bestTimeToVisit: data.bestTimeToVisit,
      estimatedBudget: data.estimatedBudget,
      topAttractions: data.topAttractions,
      localTips: data.localTips,
    };
  });
};
