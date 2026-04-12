import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { autoCorrectProblemJSON, quickFixJSON, safeJSONParse } from '@/lib/ai-json-corrector';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      title, 
      description, 
      constraints,
      examples, 
      starterTemplate, 
      driverCode, 
      testCases,
      useAI = true 
    } = body;

    // Try AI correction first if enabled
    if (useAI) {
      const aiResult = await autoCorrectProblemJSON({
        title,
        description,
        constraints,
        examples,
        starterTemplate,
        driverCode,
        testCases
      });

      if (aiResult) {
        return NextResponse.json({
          success: true,
          method: 'ai',
          corrections: aiResult.corrections,
          data: {
            examples: aiResult.examples,
            starterTemplate: aiResult.starterTemplate,
            driverCode: aiResult.driverCode,
            testCases: aiResult.testCases
          }
        });
      }
    }

    // Fallback to quick fix
    const corrected = {
      examples: safeJSONParse(examples || '[]', []),
      starterTemplate: safeJSONParse(starterTemplate || '{}', {}),
      driverCode: safeJSONParse(driverCode || '{}', {}),
      testCases: safeJSONParse(testCases || '[]', [])
    };

    return NextResponse.json({
      success: true,
      method: 'quick-fix',
      corrections: ['Applied basic JSON syntax corrections'],
      data: corrected
    });

  } catch (error: any) {
    console.error('JSON Correction Error:', error);
    return NextResponse.json(
      { error: 'Failed to correct JSON', details: error.message },
      { status: 500 }
    );
  }
}
