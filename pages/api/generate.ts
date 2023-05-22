// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ChatMessage } from '@/models/chatMessage';
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "azure-openai";

type Data = {
  question: string,
  answers: string[],
  correctAnswer: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {


  const { method } = req;

  if (method !== "POST") {
    return res.status(400);
  }

  const configuration = new Configuration({
    azure: {
      apiKey: process.env.NEXT_PUBLIC_AZURE_API_KEY,
      endpoint: process.env.NEXT_PUBLIC_AZURE_ENDPOINT,
    }
  });

  const openai = new OpenAIApi(configuration);

  const messages: ChatMessage[] = [{
    role: 'system',
    content: "I want you to generate a question for a trivia quiz " +
      "You will generate a question with 4 potential answers, only one answer will be correct. " +
      "You will return your response as a JSON object with the following structure: " +
      "{ question: 'the question to ask', answers: ['potential answer a', potential answer b'], correctAnswer: 'the correct answer' }. " +
      "Do not format the JSON object with newline characters"
  }]

  const chatGPT = await openai.createChatCompletion({
    model: 'gpt',
    messages: messages as any
  })

  if (chatGPT.data.choices[0].message?.content) {
    try {
      const output = chatGPT.data.choices[0].message?.content;
      output.replaceAll("\n", "").replaceAll("\\", "");

      const parsedOutput = JSON.parse(output);
      return res.status(200).json(parsedOutput);
    } catch (err) {
      console.log(err);
      return res.status(500);
    }
  }

  return res.status(500);
}

