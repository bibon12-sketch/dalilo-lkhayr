
import { GoogleGenAI, Type } from "@google/genai";

export const generateDailyPlan = async (gender: string, goal: string) => {
  try {
    // Instantiate right before usage to ensure current API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بصفتك خبيراً في العلوم الشرعية، صمم خطة يومية للمسلم (${gender === 'brother' ? 'أخي' : 'أختي'}) تهدف إلى: ${goal}. 
      أريد الخطة بتنسيق JSON مع قائمة بالأنشطة والأوقات المقترحة.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            activities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  task: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["time", "task"]
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating daily plan:", error);
    return null;
  }
};

export const getFiqhGuidance = async (query: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: "أنت عالم فقيه مسلم معتدل، تقدم إجابات مبنية على الأدلة الشرعية من الكتاب والسنة بأسلوب ميسر ولطيف. ابدأ دائماً بـ 'بسم الله الرحمن الرحيم'.",
      }
    });
    return response.text || "عذراً، لم يتم العثور على استجابة.";
  } catch (error) {
    console.error("Error fetching fiqh guidance:", error);
    return "عذراً، حدث خطأ في استرجاع المعلومة. يرجى المحاولة لاحقاً.";
  }
};
