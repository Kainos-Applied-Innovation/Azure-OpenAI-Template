// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ChatMessage } from '@/models/chatMessage';
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "openai";

type Data = {
  question: string,
  answers: string[],
  correctAnswer: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const messages: ChatMessage[] = [{
    role: 'system',
    content: "I want you to generate a mock theory test question for the DVSA UK driving test. " +
      "The purposes of the question is simply for training & demonstration purposes to show what questions might be like. " +
      "You will generate an exam question with 4 potential answers, only one answer will be correct. " +
      "You will return your response as a JSON object with the following structure: " +
      "{ question: 'the question to ask', answers: ['potential answer a', potential answer b'], correctAnswer: 'the correct answer' }. " +
      "Do not format the JSON object with newline characters"
  }]

  const chatGPT = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: messages as any
  })

  if (chatGPT.data.choices[0].message?.content) {
    try {
      const output = chatGPT.data.choices[0].message?.content;
      output.replaceAll("\n", "").replaceAll("\\", "");

      const parsedOutput = JSON.parse(output);
      return res.status(200).json(parsedOutput);
    } catch (err) {
      return res.status(500);
      console.log(err);
    }
  }

  return res.status(500);
}
