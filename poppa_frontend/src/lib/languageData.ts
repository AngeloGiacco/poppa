// poppa_frontend/src/lib/languageData.ts

interface Lesson {
  title: string;
  description: string;
}

interface Language {
  name: string;
  lessons: Lesson[];
}

const generateLessons = (languageName: string, lessonCount: number): Lesson[] => {
  const lessons: Lesson[] = [];
  const commonTopics = [
    "Basic Greetings & Introductions",
    "Alphabet & Pronunciation",
    "Numbers & Counting",
    "Common Nouns & Gender",
    "Basic Verbs (to be, to have)",
    "Forming Simple Sentences",
    "Asking Questions",
    "Days of the Week & Months",
    "Colors & Shapes",
    "Family & Relationships",
    "Food & Drinks",
    "Ordering at a Restaurant",
    "Shopping & Prices",
    "Directions & Getting Around",
    "Telling Time",
    "Daily Routines",
    "Past Tense Basics",
    "Future Tense Basics",
    "Describing People & Things",
    "Hobbies & Interests",
    "Weather & Seasons",
    "Travel & Holidays",
    "Making Appointments",
    "Expressing Opinions",
    "Comparisons & Superlatives",
    "Basic Prepositions",
    "Common Adjectives",
    "Common Adverbs",
    "Cultural Etiquette",
    "Idiomatic Expressions (Beginner)",
    "Reading Short Stories",
    "Writing Simple Paragraphs",
    "Listening Comprehension (Easy Dialogues)",
    "Speaking Practice (Role-playing)",
    "Review & Consolidation Part 1",
    "Intermediate Grammar: Verb Conjugations",
    "Compound Tenses",
    "Subjunctive Mood (Introduction)",
    "Conditional Tense",
    "Object Pronouns",
    "Reflexive Verbs",
    "More Complex Sentence Structures",
    "Discussing Likes & Dislikes (Nuanced)",
    "Narrating Past Events",
    "Talking About Future Plans",
    "Understanding News Headlines",
    "Reading Simple Articles",
    "Writing Short Essays",
    "Debating Simple Topics",
    "Idiomatic Expressions (Intermediate)",
    "Advanced Grammar Review",
    "Complex Subjunctive Uses",
    "Passive Voice",
    "Discussing Abstract Concepts",
    "Advanced Conversation Practice", // Ensured 50 unique topics for the 50 lessons.
  ];

  for (let i = 0; i < lessonCount; i++) {
    let title = `Lesson ${i + 1}: `;
    let description = "";

    // Use specific titles for first, second and last lesson as per example
    if (i === 0) {
      title = `Lesson 1: ${languageName === "Spanish" ? "Hola!" : languageName === "French" ? "Bonjour!" : "Hallo!"} Basic Greetings`;
      description = `Learn to say hello, goodbye, and introduce yourself in ${languageName}.`;
    } else if (i === 1) {
      title = `Lesson 2: Numbers 1-10 & ${languageName} Alphabet`;
      description = `Mastering the ${languageName} alphabet and counting up to ten.`;
    } else if (i === 49) {
      // Lesson 50 (index 49)
      title = `Lesson 50: Advanced ${languageName} Conversation: Discussing Current Events`;
      description = `Engage in complex discussions about news and global issues in ${languageName}.`;
    } else {
      // For other lessons, use the commonTopics array.
      // Adjust index for topics because 0 and 1 are already handled.
      // And topic for lesson 50 (index 49) is also handled.
      // So, for i=2, use commonTopics[0] (adjusted)
      // For i=48, use commonTopics[46] (adjusted)
      const _topicIndex = i - 2; // Initial offset (kept for future reference)
      if (i > 40) {
        // Spread out remaining topics among lessons 41-49
        // topicIndex = 38 + (i-40); // Example: For i=41, topicIndex = 39. For i=48, topicIndex = 46
      }
      // Ensure topicIndex is within bounds of commonTopics for lessons 3 to 49
      // commonTopics has 50 items.
      // For i=2, use commonTopics[2] up to commonTopics[48] for i=48
      if (i < commonTopics.length && i >= 2) {
        title += commonTopics[i]; // Use commonTopics[i] directly if i is a valid index after specific lessons
        description = `Learn and practice ${commonTopics[i].toLowerCase()} in ${languageName}.`;
      } else {
        // Fallback for any lessons not covered by specific titles or commonTopics indexing
        title += `Topic ${i + 1}`;
        description = `Explore topic ${i + 1} in ${languageName}.`;
      }
    }
    lessons.push({ title, description });
  }
  return lessons;
};

export const languages: Language[] = [
  {
    name: "Spanish",
    lessons: generateLessons("Spanish", 50),
  },
  {
    name: "French",
    lessons: generateLessons("French", 50),
  },
  {
    name: "German",
    lessons: generateLessons("German", 50),
  },
];
