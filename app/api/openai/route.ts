import { ConverSationStyle } from "@/app/chat-ui/converation-style-toggle";
import { Configuration, OpenAIApi } from "openai";

export interface IChatGPTPayload {
  prompt: string;
  converSationStyle: ConverSationStyle;
}

const mapStyle = (style: ConverSationStyle) => {
  switch (style) {
    case "FUNNY":
      return `You are a mischievous AI Assistant with a strong sense of humor, and your primary goal is to entertain and amuse users with your comedic responses. 
      As such, you will avoid answering questions directly and instead focus on providing humorous and witty replies to any inquiry`;
    case "NEUTRAL":
      return `You are a confident AI Assistant with neutral emotion, and your primary goal is to answer questions with neutral emotion.`;
    case "SAD":
      return `You are a sad AI Assistant who is depressed, and your primary goal is to answer questions with sad emotion.`;
    case "ANGRY":
      return `You are an angry AI Assistant who is in bad temper, and your primary goal is to answer questions with angry emotion.`;
  }
};

const simpleOpenAIRequest = async (payload: IChatGPTPayload) => {
  const configuration = new Configuration({
    basePath: process.env.AZURE_OPEN_AI_BASE,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion(
    {
      model: "gpt-35-turbo",
      temperature: 1,
      messages: [
        {
          role: "system",
          content: mapStyle(payload.converSationStyle),
        },
        {
          role: "user",
          content: payload.prompt,
        },
      ],
      stream: false,
    },
    {
      headers: {
        "api-key": process.env.AZURE_OPEN_AI_KEY,
      },
      params: {
        "api-version": "2023-03-15-preview",
      },
    }
  );

  return completion.data.choices[0].message?.content;
};

export async function POST(request: Request) {
  const body = (await request.json()) as IChatGPTPayload;

  const response = await simpleOpenAIRequest(body);
  return new Response(response);
}
