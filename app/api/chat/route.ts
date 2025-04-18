import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  const { name, jobTitle } = await request.json();

  if (!name || !jobTitle) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const prompt = `Write a professional cover letter for someone named ${name}, applying for the position of ${jobTitle} role. Make it concise and enthusiastic.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    return NextResponse.json({ coverLetter: response?.text }, { status: 200 });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
