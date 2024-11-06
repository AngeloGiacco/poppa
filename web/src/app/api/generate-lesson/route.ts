import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Tables } from '@/types/database.types';
import { generateInstruction } from '@/lib/lesson-utils';


export async function POST(req: Request) {
  try {
    const { languageCode, nativeLanguage, customTopic } = await req.json();

    // Fetch lesson history
    const { data: lessonHistory, error } = await supabaseBrowserClient
      .from('lesson')
      .select('*')
      .eq('subject', languageCode)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Generate base instruction
    let instruction = generateInstruction(languageCode, nativeLanguage);

    // Add lesson history context
    if (lessonHistory && lessonHistory.length > 0) {
      const historyContext = lessonHistory
        .map((lesson: Tables<'lesson'>) => `Previous lesson: ${lesson.transcript}`)
        .join('\n');
      instruction += `\n\nLesson History:\n${historyContext}`;
    }

    // Add custom topic if provided
    if (customTopic) {
      instruction += `\n\nThe student has requested you focus on teaching about: ${customTopic}`;
    }

    //TODO: Call LLM to generate lesson transcript which will guide realtime api

    return Response.json({ instruction: instruction });
  } catch (error) {
    console.error('Error generating lesson:', error);
    return Response.json({ error: 'Failed to generate lesson' }, { status: 500 });
  }
} 

