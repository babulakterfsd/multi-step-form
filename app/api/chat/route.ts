import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { name, jobTitle } = await req.json();

    const prompt = `Write a professional and personalized cover letter for someone named ${name} applying for a ${jobTitle} role. Keep it warm, confident, and relevant to a modern tech company.`;

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    console.log('[OPENAI_RESPONSE]', response);

    const coverLetter = response.choices[0]?.message?.content;

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('[OPENAI_ERROR]', error);
    return NextResponse.json(
      {
        error:
          'Something went wrong while generating cover letter. API quota exceeded',
      },
      { status: 500 }
    );
  }
}
