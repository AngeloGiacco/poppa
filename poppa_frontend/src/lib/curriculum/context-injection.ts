import {
  getCurriculum,
  getLesson,
  getMasteredContent,
} from "@/lib/curriculum/curriculum-framework";
import {
  type Lesson,
  type UserProgress,
  type GrammarPoint,
  type VocabularyItem,
} from "@/types/curriculum.types";

export function buildConversationContext(
  languageCode: string,
  lessonId: number,
  progress: UserProgress,
  nativeLanguage: string
): string | null {
  const curriculum = getCurriculum(languageCode);
  const lesson = getLesson(languageCode, lessonId);
  if (!curriculum || !lesson) {
    return null;
  }

  const { grammar, vocabulary } = getMasteredContent(languageCode, progress);

  return formatContext(lesson, grammar, vocabulary, curriculum.languageName, nativeLanguage);
}

function formatContext(
  lesson: Lesson,
  masteredGrammar: GrammarPoint[],
  masteredVocabulary: VocabularyItem[],
  targetLanguage: string,
  nativeLanguage: string
): string {
  const lines: string[] = [];

  lines.push(`TARGET LANGUAGE: ${targetLanguage}`);
  lines.push(`STUDENT'S NATIVE LANGUAGE: ${nativeLanguage}`);
  lines.push(`LESSON ${lesson.id}: ${lesson.title}`);
  lines.push(`LEVEL: ${lesson.level}`);
  lines.push(`FOCUS: ${lesson.focus}`);
  lines.push("");

  if (masteredGrammar.length > 0) {
    lines.push("STUDENT ALREADY KNOWS:");
    for (const g of masteredGrammar.slice(-10)) {
      lines.push(`- ${g.name}`);
    }
    lines.push(`- ${masteredVocabulary.length} vocabulary words`);
    lines.push("");
  }

  lines.push("THIS LESSON'S GRAMMAR:");
  for (const g of lesson.grammar) {
    lines.push(`- ${g.name}: ${g.explanation}`);
  }
  lines.push("");

  lines.push("THIS LESSON'S VOCABULARY:");
  for (const v of lesson.vocabulary) {
    lines.push(`- ${v.term} = ${v.translation}`);
  }
  lines.push("");

  lines.push("TEACHING INSTRUCTIONS:");
  lines.push(lesson.conversationPrompt);

  return lines.join("\n");
}
