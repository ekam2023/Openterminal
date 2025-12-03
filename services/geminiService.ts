import { GoogleGenAI, Type } from "@google/genai";
import { StockData, NewsItem } from "../types";

// Initialize client safely (will fail gracefully if no key, handled in UI)
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

export const generateMarketAnalysis = async (
  stock: StockData,
  query: string
): Promise<string> => {
  if (!ai) return "API Key missing. Please check your configuration.";

  try {
    const prompt = `
      You are a senior financial analyst at a top-tier investment bank.
      Analyze the following market data for ${stock.name} (${stock.symbol}).
      
      Current Price: ${stock.price.toFixed(2)}
      Daily Change: ${stock.changePercent.toFixed(2)}%
      Volume: ${stock.volume.toLocaleString()}
      Sector: ${stock.sector}
      
      User Query: ${query}
      
      Provide a concise, professional, and actionable response using financial terminology. 
      Focus on technical indicators implied by the trend (simulated) and fundamental context for this sector.
      Do not explicitly mention that the data is simulated if it looks realistic. Treat it as real-time data context.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a Bloomberg Terminal AI assistant. Be terse, data-driven, and professional.",
      }
    });

    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to generate analysis at this time.";
  }
};

export const generateHeadlines = async (stocks: StockData[]): Promise<NewsItem[]> => {
  if (!ai) return [];

  try {
    const symbols = stocks.map(s => s.symbol).join(", ");
    const prompt = `Generate 3 breaking financial news headlines for the following tickers: ${symbols}. 
    Make them sound like real Bloomberg/Reuters headlines. 
    Include a sentiment impact (POSITIVE, NEGATIVE, NEUTRAL).
    Return strictly JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              source: { type: Type.STRING },
              summary: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'] }
            }
          }
        }
      }
    });

    const rawNews = JSON.parse(response.text || "[]");
    return rawNews.map((n: any, i: number) => ({
      id: `gen-news-${Date.now()}-${i}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...n
    }));

  } catch (error) {
    console.error("Gemini News Error:", error);
    return [];
  }
};

export const getDeepThinkingAnalysis = async (stock: StockData): Promise<string> => {
    if (!ai) return "API Key missing.";

    try {
        const prompt = `Conduct a deep fundamental and technical dive into ${stock.name} (${stock.symbol}) based on the current price of ${stock.price}. Assume a volatile market environment. Predict the next support and resistance levels.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Using flash for speed in this demo, usually Pro for reasoning
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 1024 } // Demonstrate thinking budget
            }
        });
        return response.text || "Deep analysis failed.";
    } catch (error) {
        console.error("Deep Thinking Error:", error);
        return "Deep analysis unavailable.";
    }
}