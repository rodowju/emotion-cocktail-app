import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { diary } = await req.json();

  const r1 = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    system: '감정 분류 AI. JSON만 출력.\n{"emotions":[{"name":"감정명","percent":정수}],"dominant":"주요감정","intensity":"high|medium|low"}',
    messages: [{ role: 'user', content: diary }],
  });
  const emotions = JSON.parse((r1.content[0] as any).text.replace(/```json|```/g,'').trim());

  const r2 = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1400,
    system: '심리 분석 전문가. JSON만 출력.\n{"insight":"분석","cocktail":"칵테일명","emoji":"이모지","tagline":"태그라인","color":"색상명","colorHex":"#hex","prescription":"처방","music":[{"cover":"이모지","name":"이름","mood":"설명","tag":"태그","clr":"rgba(192,132,252,.12)","tc":"#C084FC"}],"foods":[{"e":"이모지","n":"음식명","r":"이유","tag":"태그","tc":"#hex","bc":"rgba(192,132,252,.12)"}],"recipe":{"e":"이모지","name":"이름","sub":"설명","ing":["재료"],"steps":["단계"]},"quotes":[{"tag":"태그","tc":"#hex","bc":"rgba(192,132,252,.1)","text":"명언","author":"저자"}]}',
    messages: [{ role: 'user', content: `일기: ${diary}\n감정: ${JSON.stringify(emotions)}` }],
  });
  const analysis = JSON.parse((r2.content[0] as any).text.replace(/```json|```/g,'').trim());

  const r3 = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: '감성적인 바텐더. 따뜻한 위로 3-4문장. 칵테일 이름 녹여서. 한국어. 문장만.',
    messages: [{ role: 'user', content: `일기: ${diary}\n칵테일: ${analysis.cocktail}\n감정: ${emotions.dominant}` }],
  });
  const comfort = (r3.content[0] as any).text;

  return NextResponse.json({ emotions, analysis, comfort });
}
