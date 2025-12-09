export {
  registerCurriculum,
  getCurriculum,
  getLesson,
  getNextLesson,
  getMasteredContent,
} from "@/lib/curriculum/curriculum-framework";

export { buildConversationContext } from "@/lib/curriculum/context-injection";

export type {
  ProficiencyLevel,
  VocabularyItem,
  GrammarPoint,
  Lesson,
  LanguageCurriculum,
  UserProgress,
} from "@/types/curriculum.types";

import { registerCurriculum } from "@/lib/curriculum/curriculum-framework";
import { spanishCurriculum } from "@/lib/curriculum/languages/spanish";
import { frenchCurriculum } from "@/lib/curriculum/languages/french";
import { germanCurriculum } from "@/lib/curriculum/languages/german";
import { italianCurriculum } from "@/lib/curriculum/languages/italian";

registerCurriculum(spanishCurriculum);
registerCurriculum(frenchCurriculum);
registerCurriculum(germanCurriculum);
registerCurriculum(italianCurriculum);
