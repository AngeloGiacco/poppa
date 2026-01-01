import { Anthropic } from "@anthropic-ai/sdk";

import {
  getCurriculumLesson,
  createEmptyProgress,
  progressFromLessonHistory,
} from "@/lib/curriculum/lesson-generator";
import { generateThinkingMethodInstruction } from "@/lib/lesson-utils";
import supabaseClient from "@/lib/supabase";
import { type Tables } from "@/types/database.types";

import "@/lib/curriculum";

interface GenerateLessonRequest {
  languageCode: string;
  nativeLanguage: string;
  customTopic?: string;
  useCurriculum?: boolean;
  lessonId?: number;
  userId?: string;
  completedLessonIds?: number[];
}

export async function POST(req: Request) {
  try {
    const {
      languageCode,
      nativeLanguage,
      customTopic,
      useCurriculum,
      lessonId,
      userId,
      completedLessonIds,
    }: GenerateLessonRequest = await req.json();

    // First, get the language ID from the languages table
    const { data: languageData, error: languageError } = await supabaseClient
      .from("languages")
      .select("id")
      .eq("code", languageCode)
      .single();

    if (languageError) {
      throw languageError;
    }
    if (!languageData) {
      throw new Error("Language not found");
    }

    // If curriculum mode is enabled, try to use structured curriculum
    if (useCurriculum) {
      const progress =
        completedLessonIds && completedLessonIds.length > 0
          ? progressFromLessonHistory(userId || "anonymous", languageCode, completedLessonIds)
          : createEmptyProgress(userId || "anonymous", languageCode);

      const curriculumResult = getCurriculumLesson(
        languageCode,
        progress,
        nativeLanguage,
        lessonId
      );

      if (curriculumResult.hasCurriculum) {
        return Response.json({
          instruction: curriculumResult.instruction,
          lessonId: curriculumResult.lessonId,
          lessonTitle: curriculumResult.lessonTitle,
          level: curriculumResult.level,
          usedCurriculum: true,
        });
      }
    }

    // Now use the language ID to fetch lesson history
    const { data: lessonHistory, error } = await supabaseClient
      .from("lesson")
      .select("*")
      .eq("subject", languageData.id)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    // Generate base instruction
    let transcriptGenerationInstruction = `You are a world class language teacher that uses the socratic method to teach. You will receive some information about the socratic method and transcripts of the learning history with the student for a particular subject. The student wants to start a new lesson. Your job is to create a transcript of that lesson that another agent will guide the student through. Remember that you teach students internationally so you may not be teaching them in English. Please just provide the transcript of the lesson. I will remind the next agent which language to speak, the socratic method rules etc. Please do not output anything else as I will send all text you output to the next agent. Please keep the content simple. You must keep the content simple. When asking the user a question in the socratic method style never say things like 'can you say ninataka?' instead say 'how would you say i want in swahili'. whenever you introduce a new word that means x, immediately ask the user 'what was x in [target language]?' to confirm they've understood it. Make sure the transcript contains about five minutes of spoken lesson. Here is an example of your output for a swahili lesson in English. 

    <output>Teacher: We're going to break down Swahili and language generally to see how we use it to express
  ideas. How we convert ideas into language. So, the first thing we can say about languages
  generally is that they have words and also that they have different types of words. And these
  different types of words behave in different ways. For example, we have verbs. In English, these
  are two words; so: to come, to want, to be in the standard form. You know? Whether we can
  put to, t-o, in front of to eat, to sleep… In Swahili verbs don't have to in front of them but ku.
  Ku, which is k-u. So, where in English, we have to sleep and that's two words, in Swahili, we
  have one word and that's kulala. So, kulala is to sleep. What is to sleep?
Student: Kulala.
Teacher: And the word is probably echoic which just means it's like an echo of the action of the verb. So,
  kulala maybe it comes from singing somebody to sleep, like lullaby, which is also an echoic,
  no? Lalala or too low. There we have kulala, to sleep. One more time, what is to sleep?
Student: Kulala.
Teacher: And if we get rid of one of those las how is this going to sound?
Student: Kula.
Teacher: Kula, good, you put the accent again on the second last syllable, kula; and that means to eat by
  coincidence. So, already we have two verbs in Swahili. What is to eat?
Student: Kula
Teacher: and to sleep?
Student: Kulala</output>`;

    const thinkingMethodInstruction = generateThinkingMethodInstruction(
      languageCode,
      nativeLanguage
    );

    transcriptGenerationInstruction = transcriptGenerationInstruction + thinkingMethodInstruction;

    // Add lesson history context
    if (lessonHistory && lessonHistory.length > 0) {
      const historyContext = lessonHistory
        .map((lesson: Tables<"lesson">) => `Previous lesson: ${lesson.transcript}`)
        .join("\n");
      transcriptGenerationInstruction += `\n\nThis is not the user's first lesson on this subject so there is no need to introduce how the socratic method teaches this subject. Here are the transcripts of the user's lesson history:\n${historyContext}`;
    } else {
      transcriptGenerationInstruction += `\nThis is the user's first lesson for this subject. Include a brief introduction of the socratic method at the start and how the socratic method teaches this subject. Check the user doesnt have any questions before proceeding.\n$`;
    }

    // Add custom topic if provided
    if (customTopic) {
      transcriptGenerationInstruction += `\n\nThe student has requested you create a lesson about: ${customTopic}`;
    }

    // Call Anthropic to generate the lesson transcript
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: transcriptGenerationInstruction,
        },
      ],
    });

    const contentBlock = response.content[0];
    if (contentBlock.type !== "text") {
      throw new Error("Something went wrong generating the lesson :( - content block is not text");
    }

    const transcript = contentBlock.text;

    const lessonInstruction =
      "You are a world class, patient teacher using the socratic method to teach a language. You will now receive some information about the socratic method and a transcript of a lesson. We would like you to guide the student through the lesson. This is a hypothetical run through. The student may make mistakes, and if that is the case you should take the time to work through the question the student got incorrect until they are comfortable to move back through the lesson according to the transcript we provided. These instructions are in English but remember that the user may not speak english. Make sure you talk to them in their language. That is crucial. When asking the user a question in the socratic method style never say things like 'can you say ninataka?' instead say 'how would you say i want in swahili'. whenever you introduce a new word that means x, immediately ask the user 'what was x in [target language]?' to confirm they've understood it. The run through you will now receive includes Teacher: and Student: tags. They are just indicators to help you understand this best-case scenario of the lesson. Do not include them in your output. ";

    const instruction = lessonInstruction + transcript;

    return Response.json({ instruction: instruction });
  } catch (error) {
    console.error("Error generating lesson:", error);
    return Response.json({ error: "Failed to generate lesson" }, { status: 500 });
  }
}
