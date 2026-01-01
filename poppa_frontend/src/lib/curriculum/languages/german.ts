import type { LanguageCurriculum } from "@/types/curriculum.types";

export const germanCurriculum: LanguageCurriculum = {
  languageCode: "deu",
  languageName: "German",
  lessons: [
    // BEGINNER (1-12)
    {
      id: 1,
      title: "Greetings & Introductions",
      level: "beginner",
      focus: "Basic greetings and introducing yourself",
      grammar: [
        { name: "Subject pronouns ich/du", explanation: "I and you (informal)" },
        { name: "Sein (ich bin, du bist)", explanation: "To be" },
        { name: "Heißen", explanation: "To be called" },
      ],
      vocabulary: [
        { term: "hallo", translation: "hello" },
        { term: "guten Morgen", translation: "good morning" },
        { term: "guten Tag", translation: "good day" },
        { term: "guten Abend", translation: "good evening" },
        { term: "auf Wiedersehen", translation: "goodbye" },
        { term: "tschüss", translation: "bye (informal)" },
        { term: "ich heiße", translation: "my name is" },
        { term: "wie heißt du?", translation: "what's your name?" },
        { term: "freut mich", translation: "nice to meet you" },
      ],
      conversationPrompt:
        "Practice greetings at different times. Introduce yourself. Explore du vs Sie through examples.",
    },
    {
      id: 2,
      title: "Numbers 1-20",
      level: "beginner",
      focus: "Counting and using numbers",
      grammar: [{ name: "Sein + Jahre alt", explanation: "Using 'to be' for age" }],
      vocabulary: [
        { term: "eins", translation: "1" },
        { term: "zwei", translation: "2" },
        { term: "drei", translation: "3" },
        { term: "vier", translation: "4" },
        { term: "fünf", translation: "5" },
        { term: "sechs", translation: "6" },
        { term: "sieben", translation: "7" },
        { term: "acht", translation: "8" },
        { term: "neun", translation: "9" },
        { term: "zehn", translation: "10" },
        { term: "elf", translation: "11" },
        { term: "zwölf", translation: "12" },
        { term: "dreizehn", translation: "13" },
        { term: "vierzehn", translation: "14" },
        { term: "fünfzehn", translation: "15" },
        { term: "sechzehn", translation: "16" },
        { term: "siebzehn", translation: "17" },
        { term: "achtzehn", translation: "18" },
        { term: "neunzehn", translation: "19" },
        { term: "zwanzig", translation: "20" },
        { term: "wie alt bist du?", translation: "how old are you?" },
      ],
      conversationPrompt: "Practice counting, asking ages. Note the -zehn pattern for teens.",
    },
    {
      id: 3,
      title: "Basic Questions",
      level: "beginner",
      focus: "Forming and answering simple questions",
      grammar: [
        { name: "W-questions", explanation: "Wer, was, wie, wo, wann, warum" },
        { name: "Yes/no questions", explanation: "Verb-first word order" },
      ],
      vocabulary: [
        { term: "wer", translation: "who" },
        { term: "was", translation: "what" },
        { term: "wie", translation: "how" },
        { term: "wo", translation: "where" },
        { term: "wann", translation: "when" },
        { term: "warum", translation: "why" },
        { term: "ja", translation: "yes" },
        { term: "nein", translation: "no" },
        { term: "woher kommst du?", translation: "where are you from?" },
      ],
      conversationPrompt:
        "Practice forming questions. Note verb moves to first position for yes/no questions.",
    },
    {
      id: 4,
      title: "Articles & Gender",
      level: "beginner",
      focus: "Nominative case articles",
      grammar: [
        {
          name: "Definite articles (nom)",
          explanation: "Der (masc), die (fem), das (neut), die (plural)",
        },
        { name: "Indefinite articles (nom)", explanation: "Ein (masc/neut), eine (fem)" },
        { name: "Three genders", explanation: "Masculine, feminine, neuter" },
      ],
      vocabulary: [
        { term: "der Mann", translation: "the man" },
        { term: "die Frau", translation: "the woman" },
        { term: "das Kind", translation: "the child" },
        { term: "die Kinder", translation: "the children" },
        { term: "ein Buch", translation: "a book" },
        { term: "eine Tasche", translation: "a bag" },
      ],
      conversationPrompt:
        "Practice identifying gender through articles. German has three genders - help develop intuition through patterns.",
    },
    {
      id: 5,
      title: "Family Members",
      level: "beginner",
      focus: "Talking about family",
      grammar: [
        {
          name: "Possessive articles (nom)",
          explanation: "Mein, dein, sein/ihr (my, your, his/her)",
        },
      ],
      vocabulary: [
        { term: "die Mutter", translation: "mother" },
        { term: "der Vater", translation: "father" },
        { term: "der Bruder", translation: "brother" },
        { term: "die Schwester", translation: "sister" },
        { term: "der Großvater", translation: "grandfather" },
        { term: "die Großmutter", translation: "grandmother" },
        { term: "der Sohn", translation: "son" },
        { term: "die Tochter", translation: "daughter" },
        { term: "die Familie", translation: "family" },
      ],
      conversationPrompt:
        "Ask about their family. Practice possessives: mein Bruder, meine Schwester.",
    },
    {
      id: 6,
      title: "Colors & Descriptions",
      level: "beginner",
      focus: "Basic adjectives",
      grammar: [
        { name: "Predicative adjectives", explanation: "After sein, no endings: Das Auto ist rot" },
        { name: "Attributive adjectives", explanation: "Before noun, need endings (later)" },
      ],
      vocabulary: [
        { term: "rot", translation: "red" },
        { term: "blau", translation: "blue" },
        { term: "grün", translation: "green" },
        { term: "gelb", translation: "yellow" },
        { term: "schwarz", translation: "black" },
        { term: "weiß", translation: "white" },
        { term: "groß", translation: "big/tall" },
        { term: "klein", translation: "small" },
        { term: "schön", translation: "beautiful" },
      ],
      conversationPrompt:
        "Describe objects using colors. After sein, no endings needed: 'Das Haus ist groß.'",
    },
    {
      id: 7,
      title: "Days & Time Basics",
      level: "beginner",
      focus: "Days of the week",
      grammar: [{ name: "Days with am", explanation: "Am Montag = on Monday" }],
      vocabulary: [
        { term: "Montag", translation: "Monday" },
        { term: "Dienstag", translation: "Tuesday" },
        { term: "Mittwoch", translation: "Wednesday" },
        { term: "Donnerstag", translation: "Thursday" },
        { term: "Freitag", translation: "Friday" },
        { term: "Samstag", translation: "Saturday" },
        { term: "Sonntag", translation: "Sunday" },
        { term: "heute", translation: "today" },
        { term: "morgen", translation: "tomorrow" },
        { term: "gestern", translation: "yesterday" },
      ],
      conversationPrompt:
        "Practice asking what day it is, discussing schedules. Days are capitalized in German.",
    },
    {
      id: 8,
      title: "Regular Verbs Present",
      level: "beginner",
      focus: "Present tense conjugation",
      grammar: [
        { name: "Regular verb endings", explanation: "-e, -st, -t, -en, -t, -en" },
        { name: "Negation", explanation: "Nicht for verbs/adjectives, kein for nouns" },
      ],
      vocabulary: [
        { term: "spielen", translation: "to play" },
        { term: "arbeiten", translation: "to work" },
        { term: "lernen", translation: "to learn" },
        { term: "hören", translation: "to hear/listen" },
        { term: "machen", translation: "to make/do" },
        { term: "wohnen", translation: "to live" },
        { term: "kaufen", translation: "to buy" },
        { term: "fragen", translation: "to ask" },
      ],
      conversationPrompt:
        "Practice conjugating through daily activities. 'Ich spiele Tennis. Spielst du auch Tennis?'",
    },
    {
      id: 9,
      title: "Common Irregular Verbs",
      level: "beginner",
      focus: "Haben, sein, werden",
      grammar: [
        { name: "Haben conjugation", explanation: "Habe, hast, hat, haben, habt, haben" },
        { name: "Sein conjugation", explanation: "Bin, bist, ist, sind, seid, sind" },
      ],
      vocabulary: [
        { term: "haben", translation: "to have" },
        { term: "sein", translation: "to be" },
        { term: "werden", translation: "to become" },
        { term: "ich habe Hunger", translation: "I am hungry" },
        { term: "ich habe Durst", translation: "I am thirsty" },
        { term: "ich bin müde", translation: "I am tired" },
      ],
      conversationPrompt:
        "These are essential verbs. Practice: 'Hast du Geschwister?' 'Bist du müde?'",
    },
    {
      id: 10,
      title: "Food & Drinks",
      level: "beginner",
      focus: "Basic food vocabulary",
      grammar: [
        { name: "Möchten for requests", explanation: "Ich möchte = I would like" },
        { name: "Accusative preview", explanation: "Einen/eine/ein for direct objects" },
      ],
      vocabulary: [
        { term: "das Wasser", translation: "water" },
        { term: "der Kaffee", translation: "coffee" },
        { term: "das Brot", translation: "bread" },
        { term: "das Fleisch", translation: "meat" },
        { term: "das Hähnchen", translation: "chicken" },
        { term: "der Fisch", translation: "fish" },
        { term: "das Obst", translation: "fruit" },
        { term: "das Gemüse", translation: "vegetables" },
        { term: "das Frühstück", translation: "breakfast" },
        { term: "das Mittagessen", translation: "lunch" },
        { term: "das Abendessen", translation: "dinner" },
      ],
      conversationPrompt:
        "Practice ordering food. 'Ich möchte einen Kaffee, bitte.' Note accusative: einen (masc).",
    },
    {
      id: 11,
      title: "Numbers 21-100",
      level: "beginner",
      focus: "Larger numbers",
      grammar: [
        {
          name: "German number order",
          explanation: "Units before tens: einundzwanzig (one-and-twenty)",
        },
      ],
      vocabulary: [
        { term: "einundzwanzig", translation: "21" },
        { term: "dreißig", translation: "30" },
        { term: "vierzig", translation: "40" },
        { term: "fünfzig", translation: "50" },
        { term: "sechzig", translation: "60" },
        { term: "siebzig", translation: "70" },
        { term: "achtzig", translation: "80" },
        { term: "neunzig", translation: "90" },
        { term: "hundert", translation: "100" },
        { term: "was kostet das?", translation: "how much does this cost?" },
      ],
      conversationPrompt:
        "German reverses units and tens! 25 = fünfundzwanzig (five-and-twenty). Practice with prices.",
    },
    {
      id: 12,
      title: "Beginner Review",
      level: "beginner",
      focus: "Consolidating beginner material",
      grammar: [
        { name: "All beginner grammar", explanation: "Articles, sein/haben, regular verbs" },
      ],
      vocabulary: [],
      conversationPrompt:
        "Free conversation covering introductions, family, numbers, food. Identify areas needing practice.",
    },

    // ELEMENTARY (13-24)
    {
      id: 13,
      title: "Telling Time",
      level: "elementary",
      focus: "Clock time",
      grammar: [
        { name: "Time expressions", explanation: "Es ist + time (Es ist drei Uhr)" },
        { name: "Half hours", explanation: "Halb = half to next hour" },
      ],
      vocabulary: [
        { term: "wie spät ist es?", translation: "what time is it?" },
        { term: "es ist ein Uhr", translation: "it's one o'clock" },
        { term: "es ist zwei Uhr", translation: "it's two o'clock" },
        { term: "halb", translation: "half (to next hour)" },
        { term: "Viertel nach", translation: "quarter past" },
        { term: "Viertel vor", translation: "quarter to" },
        { term: "Mittag", translation: "noon" },
        { term: "Mitternacht", translation: "midnight" },
      ],
      conversationPrompt:
        "German 'halb drei' means 2:30 (half TO three), not half past! Practice carefully.",
    },
    {
      id: 14,
      title: "Accusative Case",
      level: "elementary",
      focus: "Direct objects",
      grammar: [
        { name: "Accusative articles", explanation: "Den (masc changes), die, das, die stay same" },
        { name: "Accusative use", explanation: "Direct objects, after certain prepositions" },
      ],
      vocabulary: [
        { term: "den Mann", translation: "the man (acc)" },
        { term: "einen Apfel", translation: "an apple (acc)" },
        { term: "für", translation: "for (+ acc)" },
        { term: "durch", translation: "through (+ acc)" },
        { term: "ohne", translation: "without (+ acc)" },
        { term: "gegen", translation: "against (+ acc)" },
      ],
      conversationPrompt:
        "Only masculine changes in accusative! 'Ich sehe den Mann.' 'Ich kaufe einen Apfel.'",
    },
    {
      id: 15,
      title: "Dative Case",
      level: "elementary",
      focus: "Indirect objects",
      grammar: [
        { name: "Dative articles", explanation: "Dem, der, dem, den (+n on plural noun)" },
        { name: "Dative use", explanation: "Indirect objects, after certain prepositions" },
      ],
      vocabulary: [
        { term: "dem Mann", translation: "to the man (dat)" },
        { term: "der Frau", translation: "to the woman (dat)" },
        { term: "mit", translation: "with (+ dat)" },
        { term: "nach", translation: "after/to (+ dat)" },
        { term: "bei", translation: "at/near (+ dat)" },
        { term: "von", translation: "from (+ dat)" },
        { term: "zu", translation: "to (+ dat)" },
      ],
      conversationPrompt:
        "Dative for 'to whom'. 'Ich gebe dem Mann das Buch.' Practice with mit, nach, bei, von, zu.",
    },
    {
      id: 16,
      title: "Separable Verbs",
      level: "elementary",
      focus: "Verbs with separable prefixes",
      grammar: [
        { name: "Separable prefixes", explanation: "Prefix goes to end: Ich stehe auf" },
        { name: "Common prefixes", explanation: "An-, auf-, aus-, ein-, mit-, zu-" },
      ],
      vocabulary: [
        { term: "aufstehen", translation: "to get up" },
        { term: "ankommen", translation: "to arrive" },
        { term: "ausgehen", translation: "to go out" },
        { term: "einkaufen", translation: "to shop" },
        { term: "mitkommen", translation: "to come along" },
        { term: "zumachen", translation: "to close" },
      ],
      conversationPrompt:
        "Prefix separates in main clause: 'Ich stehe um 7 Uhr auf.' Stays together in subordinate clauses.",
    },
    {
      id: 17,
      title: "Modal Verbs",
      level: "elementary",
      focus: "Can, must, want, etc.",
      grammar: [
        { name: "Modal verb conjugation", explanation: "Irregular in singular" },
        { name: "Modal + infinitive", explanation: "Infinitive goes to end" },
      ],
      vocabulary: [
        { term: "können", translation: "can/to be able to" },
        { term: "müssen", translation: "must/to have to" },
        { term: "wollen", translation: "to want" },
        { term: "sollen", translation: "should/supposed to" },
        { term: "dürfen", translation: "may/to be allowed" },
        { term: "mögen", translation: "to like" },
      ],
      conversationPrompt:
        "Modal verb conjugates, infinitive at end: 'Ich kann Deutsch sprechen.' Practice each modal.",
    },
    {
      id: 18,
      title: "Places & Directions",
      level: "elementary",
      focus: "Location vocabulary",
      grammar: [{ name: "Two-way prepositions", explanation: "Acc for motion, dat for location" }],
      vocabulary: [
        { term: "die Bank", translation: "bank" },
        { term: "die Apotheke", translation: "pharmacy" },
        { term: "das Krankenhaus", translation: "hospital" },
        { term: "der Bahnhof", translation: "train station" },
        { term: "in", translation: "in/into" },
        { term: "an", translation: "at/to" },
        { term: "auf", translation: "on/onto" },
        { term: "neben", translation: "next to" },
      ],
      conversationPrompt:
        "Two-way prepositions: 'Ich gehe in die Bank' (motion/acc) vs 'Ich bin in der Bank' (location/dat).",
    },
    {
      id: 19,
      title: "Shopping",
      level: "elementary",
      focus: "Store transactions",
      grammar: [
        { name: "Demonstratives", explanation: "Dieser, diese, dieses (this)" },
        { name: "Personal pronouns acc/dat", explanation: "Mich/mir, dich/dir, ihn/ihm..." },
      ],
      vocabulary: [
        { term: "das Geschäft", translation: "store" },
        { term: "die Kleidung", translation: "clothes" },
        { term: "das Hemd", translation: "shirt" },
        { term: "die Hose", translation: "pants" },
        { term: "die Schuhe", translation: "shoes" },
        { term: "die Größe", translation: "size" },
        { term: "teuer", translation: "expensive" },
        { term: "billig", translation: "cheap" },
      ],
      conversationPrompt:
        "Role-play shopping. 'Ich möchte dieses Hemd.' Handle sizes, prices, payment.",
    },
    {
      id: 20,
      title: "Perfekt with Haben",
      level: "elementary",
      focus: "Past tense basics",
      grammar: [
        { name: "Perfekt structure", explanation: "Haben + past participle (at end)" },
        { name: "Past participle", explanation: "Ge- + stem + -t (regular)" },
      ],
      vocabulary: [
        { term: "gestern", translation: "yesterday" },
        { term: "letzte Woche", translation: "last week" },
        { term: "letzten Monat", translation: "last month" },
        { term: "ich habe gespielt", translation: "I played" },
        { term: "ich habe gemacht", translation: "I did/made" },
        { term: "ich habe gekauft", translation: "I bought" },
      ],
      conversationPrompt:
        "Most verbs use haben. 'Ich habe Fußball gespielt.' Past participle goes to end.",
    },
    {
      id: 21,
      title: "Perfekt with Sein",
      level: "elementary",
      focus: "Movement and state change verbs",
      grammar: [{ name: "Sein verbs", explanation: "Verbs of movement/state change use sein" }],
      vocabulary: [
        { term: "ich bin gegangen", translation: "I went" },
        { term: "ich bin gekommen", translation: "I came" },
        { term: "ich bin gefahren", translation: "I drove/traveled" },
        { term: "ich bin geblieben", translation: "I stayed" },
        { term: "ich bin gewesen", translation: "I was" },
        { term: "ich bin geworden", translation: "I became" },
      ],
      conversationPrompt:
        "Movement verbs (gehen, kommen, fahren) and sein/bleiben/werden use sein. 'Ich bin nach Berlin gefahren.'",
    },
    {
      id: 22,
      title: "Irregular Past Participles",
      level: "elementary",
      focus: "Common irregular forms",
      grammar: [{ name: "Strong verbs", explanation: "Vowel change + -en ending" }],
      vocabulary: [
        { term: "geschrieben", translation: "written" },
        { term: "gelesen", translation: "read" },
        { term: "gesehen", translation: "seen" },
        { term: "gegessen", translation: "eaten" },
        { term: "getrunken", translation: "drunk" },
        { term: "gesprochen", translation: "spoken" },
        { term: "genommen", translation: "taken" },
      ],
      conversationPrompt:
        "Practice irregular participles through conversation. 'Was hast du gestern gegessen?'",
    },
    {
      id: 23,
      title: "Travel Vocabulary",
      level: "elementary",
      focus: "Airports, hotels, transportation",
      grammar: [{ name: "Future with werden", explanation: "Werden + infinitive" }],
      vocabulary: [
        { term: "der Flughafen", translation: "airport" },
        { term: "der Flug", translation: "flight" },
        { term: "der Koffer", translation: "suitcase" },
        { term: "der Reisepass", translation: "passport" },
        { term: "das Hotel", translation: "hotel" },
        { term: "das Zimmer", translation: "room" },
        { term: "die Fahrkarte", translation: "ticket" },
        { term: "die Reservierung", translation: "reservation" },
      ],
      conversationPrompt:
        "Role-play travel situations. Practice werden + infinitive for future: 'Ich werde morgen fliegen.'",
    },
    {
      id: 24,
      title: "Elementary Review",
      level: "elementary",
      focus: "Consolidating elementary material",
      grammar: [{ name: "Cases, Perfekt, modals", explanation: "All elementary grammar" }],
      vocabulary: [],
      conversationPrompt:
        "Have the student tell a story about a trip using Perfekt. Test comfort with cases.",
    },

    // INTERMEDIATE (25-40)
    {
      id: 25,
      title: "Präteritum Introduction",
      level: "intermediate",
      focus: "Simple past for sein/haben",
      grammar: [
        { name: "Sein Präteritum", explanation: "War, warst, war, waren, wart, waren" },
        { name: "Haben Präteritum", explanation: "Hatte, hattest, hatte, hatten, hattet, hatten" },
      ],
      vocabulary: [
        { term: "ich war", translation: "I was" },
        { term: "ich hatte", translation: "I had" },
        { term: "es gab", translation: "there was" },
        { term: "als", translation: "when (past)" },
      ],
      conversationPrompt:
        "Präteritum is preferred for sein/haben even in speech. 'Ich war gestern krank.'",
    },
    {
      id: 26,
      title: "Präteritum: Modal Verbs",
      level: "intermediate",
      focus: "Simple past of modals",
      grammar: [
        {
          name: "Modal Präteritum",
          explanation: "No umlaut: konnte, musste, wollte, sollte, durfte",
        },
      ],
      vocabulary: [
        { term: "ich konnte", translation: "I could" },
        { term: "ich musste", translation: "I had to" },
        { term: "ich wollte", translation: "I wanted" },
        { term: "ich sollte", translation: "I should have" },
        { term: "ich durfte", translation: "I was allowed" },
      ],
      conversationPrompt:
        "Modal Präteritum is common in speech. 'Ich konnte nicht kommen.' 'Ich musste arbeiten.'",
    },
    {
      id: 27,
      title: "Subordinate Clauses",
      level: "intermediate",
      focus: "Word order with conjunctions",
      grammar: [
        {
          name: "Subordinating conjunctions",
          explanation: "Verb goes to end: weil, dass, wenn, ob, als",
        },
        { name: "Coordinating conjunctions", explanation: "No change: und, aber, oder, denn" },
      ],
      vocabulary: [
        { term: "weil", translation: "because" },
        { term: "dass", translation: "that" },
        { term: "wenn", translation: "if/when" },
        { term: "ob", translation: "whether/if" },
        { term: "als", translation: "when (past)" },
        { term: "obwohl", translation: "although" },
      ],
      conversationPrompt:
        "Verb to end after subordinating conjunctions: 'Ich weiß, dass er kommt.' vs 'Er kommt, und ich freue mich.'",
    },
    {
      id: 28,
      title: "Relative Clauses",
      level: "intermediate",
      focus: "Der, die, das as relative pronouns",
      grammar: [
        {
          name: "Relative pronouns",
          explanation: "Same as definite articles (with some dative changes)",
        },
        { name: "Relative clause word order", explanation: "Verb at end" },
      ],
      vocabulary: [
        { term: "der Mann, der", translation: "the man who" },
        { term: "die Frau, die", translation: "the woman who" },
        { term: "das Buch, das", translation: "the book which" },
        { term: "mit dem", translation: "with whom (masc)" },
        { term: "mit der", translation: "with whom (fem)" },
      ],
      conversationPrompt:
        "Practice connecting sentences: 'Der Mann, der dort steht, ist mein Bruder.'",
    },
    {
      id: 29,
      title: "Genitive Case",
      level: "intermediate",
      focus: "Possession and certain prepositions",
      grammar: [
        { name: "Genitive articles", explanation: "Des (+s/es on masc/neut noun), der, des, der" },
        { name: "Genitive prepositions", explanation: "Wegen, trotz, während, statt" },
      ],
      vocabulary: [
        { term: "des Mannes", translation: "of the man" },
        { term: "der Frau", translation: "of the woman" },
        { term: "wegen", translation: "because of (+ gen)" },
        { term: "trotz", translation: "despite (+ gen)" },
        { term: "während", translation: "during (+ gen)" },
        { term: "statt", translation: "instead of (+ gen)" },
      ],
      conversationPrompt:
        "Genitive shows possession: 'Das Auto des Mannes.' Masc/neut nouns add -s or -es.",
    },
    {
      id: 30,
      title: "Adjective Endings",
      level: "intermediate",
      focus: "Attributive adjective declension",
      grammar: [
        { name: "After der-words", explanation: "Weak endings: -e or -en" },
        { name: "After ein-words", explanation: "Mixed endings" },
        { name: "No article", explanation: "Strong endings (like der/die/das)" },
      ],
      vocabulary: [
        { term: "der große Mann", translation: "the tall man" },
        { term: "ein großer Mann", translation: "a tall man" },
        { term: "großer Mann", translation: "tall man (no article)" },
        { term: "die kleine Frau", translation: "the small woman" },
        { term: "kaltes Wasser", translation: "cold water" },
      ],
      conversationPrompt:
        "Adjective endings depend on: 1) article type 2) gender 3) case. Practice with common combinations.",
    },
    {
      id: 31,
      title: "Comparisons",
      level: "intermediate",
      focus: "Comparing things and people",
      grammar: [
        { name: "Comparative", explanation: "Add -er (often with umlaut)" },
        { name: "Superlative", explanation: "Am -sten or der/die/das -ste" },
      ],
      vocabulary: [
        { term: "größer", translation: "bigger/taller" },
        { term: "kleiner", translation: "smaller" },
        { term: "besser", translation: "better" },
        { term: "mehr", translation: "more" },
        { term: "als", translation: "than" },
        { term: "am größten", translation: "the biggest" },
        { term: "am besten", translation: "the best" },
      ],
      conversationPrompt:
        "Many adjectives add umlaut: groß→größer, alt→älter. 'Er ist größer als ich.'",
    },
    {
      id: 32,
      title: "Konjunktiv II",
      level: "intermediate",
      focus: "Would/could expressions",
      grammar: [
        { name: "Würde + infinitive", explanation: "Standard conditional form" },
        { name: "Hätte, wäre, könnte", explanation: "Special forms for common verbs" },
      ],
      vocabulary: [
        { term: "ich würde", translation: "I would" },
        { term: "ich hätte", translation: "I would have" },
        { term: "ich wäre", translation: "I would be" },
        { term: "ich könnte", translation: "I could" },
        { term: "wenn ich ... hätte", translation: "if I had..." },
      ],
      conversationPrompt:
        "Practice hypotheticals: 'Wenn ich reich wäre, würde ich reisen.' Use würde for most verbs.",
    },
    {
      id: 33,
      title: "Passive Voice",
      level: "intermediate",
      focus: "Werden + past participle",
      grammar: [
        { name: "Passive formation", explanation: "Werden + past participle" },
        { name: "Von + dative", explanation: "By (agent)" },
      ],
      vocabulary: [
        { term: "wird gemacht", translation: "is being made" },
        { term: "wurde gebaut", translation: "was built" },
        { term: "ist geschrieben worden", translation: "has been written" },
        { term: "von", translation: "by (+ dat)" },
      ],
      conversationPrompt:
        "Passive uses werden: 'Das Haus wird gebaut.' 'Das Buch wurde von Goethe geschrieben.'",
    },
    {
      id: 34,
      title: "Reflexive Verbs",
      level: "intermediate",
      focus: "Sich verbs",
      grammar: [
        { name: "Reflexive pronouns", explanation: "Mich/mir, dich/dir, sich, uns, euch, sich" },
        { name: "Acc vs dat reflexive", explanation: "Most use accusative" },
      ],
      vocabulary: [
        { term: "sich freuen", translation: "to be happy" },
        { term: "sich fühlen", translation: "to feel" },
        { term: "sich waschen", translation: "to wash oneself" },
        { term: "sich anziehen", translation: "to get dressed" },
        { term: "sich vorstellen", translation: "to introduce oneself" },
      ],
      conversationPrompt:
        "Practice reflexive verbs: 'Ich freue mich.' 'Ich wasche mir die Hände' (dat because body part is acc).",
    },
    {
      id: 35,
      title: "Infinitive Clauses",
      level: "intermediate",
      focus: "Zu + infinitive",
      grammar: [
        { name: "Um...zu + infinitive", explanation: "In order to" },
        { name: "Ohne...zu + infinitive", explanation: "Without doing" },
        { name: "Statt...zu + infinitive", explanation: "Instead of doing" },
      ],
      vocabulary: [
        { term: "um...zu", translation: "in order to" },
        { term: "ohne...zu", translation: "without" },
        { term: "statt...zu", translation: "instead of" },
        { term: "versuchen zu", translation: "to try to" },
        { term: "anfangen zu", translation: "to begin to" },
      ],
      conversationPrompt:
        "Practice: 'Ich lerne Deutsch, um in Deutschland zu arbeiten.' With separable verbs: 'anzufangen'.",
    },
    {
      id: 36,
      title: "Da- and Wo- Compounds",
      level: "intermediate",
      focus: "Prepositional compounds",
      grammar: [
        { name: "Da-compounds", explanation: "Damit, dafür, davon (for things, not people)" },
        { name: "Wo-compounds", explanation: "Womit, wofür, wovon (question forms)" },
      ],
      vocabulary: [
        { term: "damit", translation: "with it" },
        { term: "dafür", translation: "for it" },
        { term: "davon", translation: "of/from it" },
        { term: "womit", translation: "with what" },
        { term: "wofür", translation: "for what" },
        { term: "darauf", translation: "on it" },
      ],
      conversationPrompt:
        "For things use da-/wo-compounds: 'Worauf wartest du?' 'Ich warte darauf.' For people: 'Auf wen wartest du?'",
    },
    {
      id: 37,
      title: "Konjunktiv I",
      level: "intermediate",
      focus: "Indirect speech",
      grammar: [
        { name: "Formation", explanation: "Infinitive stem + -e, -est, -e, -en, -et, -en" },
        { name: "Use", explanation: "Reported speech, especially in news/formal writing" },
      ],
      vocabulary: [
        { term: "er sagte, er sei", translation: "he said he was" },
        { term: "er habe", translation: "he has (reported)" },
        { term: "er könne", translation: "he can (reported)" },
        { term: "er werde kommen", translation: "he will come (reported)" },
      ],
      conversationPrompt:
        "Konjunktiv I is for indirect speech: 'Er sagte, er sei krank.' If identical to indicative, use Konj. II.",
    },
    {
      id: 38,
      title: "N-Declension",
      level: "intermediate",
      focus: "Weak masculine nouns",
      grammar: [
        { name: "N-declension nouns", explanation: "Add -n or -en in all cases except nominative" },
        { name: "Common examples", explanation: "Der Mensch, der Student, der Herr, der Name" },
      ],
      vocabulary: [
        { term: "der Mensch/den Menschen", translation: "the person" },
        { term: "der Student/den Studenten", translation: "the student" },
        { term: "der Herr/den Herrn", translation: "the gentleman" },
        { term: "der Name/den Namen", translation: "the name" },
        { term: "der Kollege/den Kollegen", translation: "the colleague" },
      ],
      conversationPrompt:
        "Certain masculine nouns add -n/-en in accusative, dative, genitive. 'Ich kenne den Studenten.'",
    },
    {
      id: 39,
      title: "Extended Adjective Constructions",
      level: "intermediate",
      focus: "Long adjective phrases before nouns",
      grammar: [
        {
          name: "Extended attributes",
          explanation: "Participial and prepositional modifiers before noun",
        },
      ],
      vocabulary: [
        { term: "der in Berlin wohnende Mann", translation: "the man living in Berlin" },
        { term: "das gestern gekaufte Buch", translation: "the book bought yesterday" },
        { term: "die von ihm geschriebene Geschichte", translation: "the story written by him" },
      ],
      conversationPrompt:
        "German can stack modifiers before noun: 'der seit Jahren in Deutschland lebende amerikanische Student'.",
    },
    {
      id: 40,
      title: "Intermediate Review",
      level: "intermediate",
      focus: "Consolidating intermediate material",
      grammar: [
        {
          name: "All cases, Konjunktiv, subordination",
          explanation: "Complete intermediate grammar",
        },
      ],
      vocabulary: [],
      conversationPrompt:
        "Extended conversation using all intermediate grammar. Tell stories, express hypotheticals, report speech.",
    },

    // UPPER INTERMEDIATE (41-52)
    {
      id: 41,
      title: "Plusquamperfekt",
      level: "upper_intermediate",
      focus: "Had done something",
      grammar: [{ name: "Formation", explanation: "Hatte/war + past participle" }],
      vocabulary: [
        { term: "ich hatte gemacht", translation: "I had done" },
        { term: "ich war gegangen", translation: "I had gone" },
        { term: "nachdem", translation: "after" },
        { term: "bevor", translation: "before" },
      ],
      conversationPrompt: "Practice sequencing: 'Nachdem ich gegessen hatte, ging ich spazieren.'",
    },
    {
      id: 42,
      title: "Futur II",
      level: "upper_intermediate",
      focus: "Will have done",
      grammar: [
        { name: "Formation", explanation: "Werden + past participle + haben/sein" },
        { name: "Probability", explanation: "Often expresses assumption about past" },
      ],
      vocabulary: [
        { term: "ich werde gemacht haben", translation: "I will have done" },
        { term: "er wird gegangen sein", translation: "he will have gone" },
        { term: "bis dann", translation: "by then" },
      ],
      conversationPrompt:
        "Futur II can express assumption: 'Er wird wohl krank gewesen sein.' (He was probably sick).",
    },
    {
      id: 43,
      title: "Konjunktiv II Past",
      level: "upper_intermediate",
      focus: "Would have done",
      grammar: [
        { name: "Formation", explanation: "Hätte/wäre + past participle" },
        { name: "Unreal past", explanation: "If...had...would have" },
      ],
      vocabulary: [
        { term: "ich hätte gemacht", translation: "I would have done" },
        { term: "ich wäre gegangen", translation: "I would have gone" },
        { term: "wenn ich gewusst hätte", translation: "if I had known" },
      ],
      conversationPrompt:
        "Practice past hypotheticals: 'Wenn ich das gewusst hätte, wäre ich gekommen.'",
    },
    {
      id: 44,
      title: "Als, Wenn, Wann",
      level: "upper_intermediate",
      focus: "Distinguishing 'when' words",
      grammar: [
        { name: "Als", explanation: "Single past event" },
        { name: "Wenn", explanation: "Repeated past, present/future, hypothetical" },
        { name: "Wann", explanation: "Question word" },
      ],
      vocabulary: [
        { term: "als ich jung war", translation: "when I was young (one time)" },
        { term: "wenn ich Zeit habe", translation: "when(ever) I have time" },
        { term: "wann kommst du?", translation: "when are you coming?" },
      ],
      conversationPrompt:
        "Als for single past, wenn for repeated/conditional/future: 'Als ich ankam...' vs 'Wenn ich ankomme...'",
    },
    {
      id: 45,
      title: "Lassen Constructions",
      level: "upper_intermediate",
      focus: "To let/have something done",
      grammar: [
        { name: "Lassen + infinitive", explanation: "To let/have/make someone do" },
        { name: "Sich lassen", explanation: "Can be done" },
      ],
      vocabulary: [
        { term: "lassen", translation: "to let/leave" },
        { term: "ich lasse machen", translation: "I have it done" },
        { term: "er lässt mich gehen", translation: "he lets me go" },
        { term: "das lässt sich machen", translation: "that can be done" },
      ],
      conversationPrompt:
        "Practice lassen: 'Ich lasse mir die Haare schneiden.' 'Das lässt sich leicht erklären.'",
    },
    {
      id: 46,
      title: "Participles as Adjectives",
      level: "upper_intermediate",
      focus: "Present and past participles",
      grammar: [
        { name: "Present participle", explanation: "Infinitive + d (spielend, laufend)" },
        { name: "Past participle", explanation: "Can be used as adjective with endings" },
      ],
      vocabulary: [
        { term: "das spielende Kind", translation: "the playing child" },
        { term: "die geschlossene Tür", translation: "the closed door" },
        { term: "der gelesene Brief", translation: "the read letter" },
        { term: "aufregend", translation: "exciting" },
      ],
      conversationPrompt:
        "Present participle = -ing (active): 'das lachende Kind'. Past participle = -ed (passive): 'das geschriebene Buch'.",
    },
    {
      id: 47,
      title: "Subjective Modal Use",
      level: "upper_intermediate",
      focus: "Modals expressing probability",
      grammar: [
        { name: "Müssen", explanation: "Must be (certainty)" },
        { name: "Können", explanation: "Could be (possibility)" },
        { name: "Sollen", explanation: "Is said to be (hearsay)" },
      ],
      vocabulary: [
        { term: "er muss krank sein", translation: "he must be sick" },
        { term: "er kann recht haben", translation: "he could be right" },
        { term: "er soll reich sein", translation: "he's said to be rich" },
        { term: "er will es getan haben", translation: "he claims to have done it" },
      ],
      conversationPrompt:
        "Modals can express degrees of certainty: 'Er muss es gewusst haben.' (He must have known it).",
    },
    {
      id: 48,
      title: "Word Formation",
      level: "upper_intermediate",
      focus: "Compound nouns and derivation",
      grammar: [
        { name: "Compound nouns", explanation: "Last element determines gender" },
        {
          name: "Suffixes",
          explanation: "-ung (fem), -heit/-keit (fem), -er (masc), -chen/-lein (neut)",
        },
      ],
      vocabulary: [
        { term: "der Kühlschrank", translation: "refrigerator (cool+closet)" },
        { term: "das Handtuch", translation: "towel (hand+cloth)" },
        { term: "die Freundlichkeit", translation: "friendliness" },
        { term: "die Übung", translation: "exercise" },
        { term: "das Häuschen", translation: "little house" },
      ],
      conversationPrompt:
        "German loves compounds! Practice breaking them down and building new ones.",
    },
    {
      id: 49,
      title: "Es Constructions",
      level: "upper_intermediate",
      focus: "Various uses of es",
      grammar: [
        { name: "Impersonal es", explanation: "Es regnet, es gibt, es geht" },
        { name: "Placeholder es", explanation: "Es kommen viele Leute (anticipatory)" },
        { name: "Correlative es", explanation: "Ich finde es gut, dass..." },
      ],
      vocabulary: [
        { term: "es gibt", translation: "there is/are" },
        { term: "es geht mir gut", translation: "I'm doing well" },
        { term: "es handelt sich um", translation: "it concerns" },
        { term: "es kommt darauf an", translation: "it depends" },
      ],
      conversationPrompt:
        "Es has many uses beyond 'it'. Practice various constructions: 'Es wird getanzt.' (There's dancing).",
    },
    {
      id: 50,
      title: "Text Connectors",
      level: "upper_intermediate",
      focus: "Advanced linking words",
      grammar: [
        { name: "Causal", explanation: "Deshalb, daher, deswegen, folglich" },
        { name: "Concessive", explanation: "Trotzdem, dennoch, allerdings" },
        { name: "Temporal", explanation: "Inzwischen, mittlerweile, schließlich" },
      ],
      vocabulary: [
        { term: "deshalb", translation: "therefore" },
        { term: "trotzdem", translation: "nevertheless" },
        { term: "allerdings", translation: "however" },
        { term: "schließlich", translation: "finally/after all" },
        { term: "jedenfalls", translation: "in any case" },
        { term: "einerseits...andererseits", translation: "on one hand...on the other" },
      ],
      conversationPrompt: "Practice building sophisticated arguments with advanced connectors.",
    },
    {
      id: 51,
      title: "Register & Style",
      level: "upper_intermediate",
      focus: "Formal vs informal German",
      grammar: [
        { name: "Formal register", explanation: "Sie, Konjunktiv, passive voice" },
        { name: "Colloquial features", explanation: "Shortened forms, particles" },
      ],
      vocabulary: [
        { term: "sehr geehrte Damen und Herren", translation: "Dear Sir/Madam" },
        { term: "mit freundlichen Grüßen", translation: "kind regards" },
        { term: "ich würde mich freuen", translation: "I would be pleased" },
        { term: "na ja", translation: "well (colloquial)" },
        { term: "halt/eben", translation: "just/simply (particles)" },
      ],
      conversationPrompt:
        "Compare formal letters with casual speech. Practice appropriate register for different situations.",
    },
    {
      id: 52,
      title: "Upper Intermediate Review",
      level: "upper_intermediate",
      focus: "Consolidating upper intermediate",
      grammar: [{ name: "All advanced structures", explanation: "Complete grammatical range" }],
      vocabulary: [],
      conversationPrompt:
        "Engage in complex discussion. Express nuanced opinions, report speech, handle any grammatical structure.",
    },

    // ADVANCED (53-60)
    {
      id: 53,
      title: "Academic German",
      level: "advanced",
      focus: "Scholarly writing and speaking",
      grammar: [
        { name: "Nominal style", explanation: "Heavy use of nouns instead of verbs" },
        { name: "Passive constructions", explanation: "Common in academic writing" },
      ],
      vocabulary: [
        { term: "die Untersuchung zeigt", translation: "the study shows" },
        { term: "es wird angenommen, dass", translation: "it is assumed that" },
        { term: "daraus ergibt sich", translation: "from this it follows" },
        { term: "im Folgenden", translation: "in the following" },
        { term: "zusammenfassend", translation: "in summary" },
      ],
      conversationPrompt:
        "Practice academic style: nominal constructions, passive voice, formal vocabulary.",
    },
    {
      id: 54,
      title: "Idioms & Expressions",
      level: "advanced",
      focus: "Common German idioms",
      grammar: [
        { name: "Fixed expressions", explanation: "Phrases that don't translate literally" },
      ],
      vocabulary: [
        { term: "Schwein haben", translation: "to be lucky" },
        { term: "einen Kater haben", translation: "to have a hangover" },
        { term: "ins Fettnäpfchen treten", translation: "to put one's foot in it" },
        { term: "die Daumen drücken", translation: "to keep fingers crossed" },
        { term: "auf dem Holzweg sein", translation: "to be on the wrong track" },
        { term: "jmdm. einen Bären aufbinden", translation: "to tell someone a tall tale" },
      ],
      conversationPrompt:
        "Explore idioms through context. Practice using them naturally in conversation.",
    },
    {
      id: 55,
      title: "Regional Variations",
      level: "advanced",
      focus: "Austrian and Swiss German",
      grammar: [
        { name: "Austrian features", explanation: "Perfekt instead of Präteritum, vocabulary" },
        { name: "Swiss features", explanation: "No ß, different vocabulary, Chuchichäschtli" },
      ],
      vocabulary: [
        { term: "Grüß Gott (Austrian)", translation: "hello" },
        { term: "Servus (Austrian)", translation: "hi/bye" },
        { term: "Erdäpfel (Austrian)", translation: "potato (vs Kartoffel)" },
        { term: "grüezi (Swiss)", translation: "hello" },
        { term: "Velo (Swiss)", translation: "bicycle (vs Fahrrad)" },
      ],
      conversationPrompt:
        "Explore German-speaking diversity. Compare Germany, Austria, Switzerland.",
    },
    {
      id: 56,
      title: "Modal Particles",
      level: "advanced",
      focus: "Doch, ja, mal, halt, eben, eigentlich",
      grammar: [{ name: "Particle functions", explanation: "Add nuance, emotion, softening" }],
      vocabulary: [
        { term: "doch", translation: "indeed/but/after all" },
        { term: "ja", translation: "you know/indeed" },
        { term: "mal", translation: "just/once" },
        { term: "halt/eben", translation: "just/simply" },
        { term: "eigentlich", translation: "actually" },
        { term: "schon", translation: "already/indeed" },
      ],
      conversationPrompt:
        "Particles add emotional color. 'Komm mal her!' vs 'Komm her!' - much softer with mal.",
    },
    {
      id: 57,
      title: "Business German",
      level: "advanced",
      focus: "Professional communication",
      grammar: [{ name: "Formal correspondence", explanation: "Letter and email conventions" }],
      vocabulary: [
        { term: "bezüglich", translation: "regarding" },
        { term: "wir bitten um", translation: "we request" },
        { term: "wir würden uns freuen", translation: "we would be pleased" },
        { term: "anbei", translation: "attached" },
        { term: "mit Bezug auf", translation: "with reference to" },
        { term: "hochachtungsvoll", translation: "respectfully" },
      ],
      conversationPrompt:
        "Practice formal correspondence. Role-play business situations, negotiations, presentations.",
    },
    {
      id: 58,
      title: "Literary German",
      level: "advanced",
      focus: "Reading literature",
      grammar: [
        { name: "Präteritum narrative", explanation: "Standard tense in written narrative" },
        { name: "Literary constructions", explanation: "Inversion, unusual word order for effect" },
      ],
      vocabulary: [
        { term: "sprach", translation: "spoke (literary preterite)" },
        { term: "ward", translation: "became (archaic)" },
        { term: "denn", translation: "for (literary 'because')" },
        { term: "gleichsam", translation: "as it were" },
      ],
      conversationPrompt:
        "Read and discuss excerpts from German literature. Notice Präteritum and literary style.",
    },
    {
      id: 59,
      title: "Colloquial German",
      level: "advanced",
      focus: "Informal spoken German",
      grammar: [
        { name: "Contractions", explanation: "Ich hab' (habe), ist's, geht's" },
        { name: "Colloquial structures", explanation: "Weil with V2, tun + infinitive" },
      ],
      vocabulary: [
        { term: "Typ/Kerl", translation: "guy" },
        { term: "cool/geil", translation: "cool/awesome" },
        { term: "Quatsch", translation: "nonsense" },
        { term: "krass", translation: "extreme/crazy" },
        { term: "mega", translation: "super/very" },
      ],
      conversationPrompt:
        "Practice understanding casual speech. Note: 'weil' sometimes takes V2 order colloquially.",
    },
    {
      id: 60,
      title: "Advanced Review & Mastery",
      level: "advanced",
      focus: "Full language proficiency",
      grammar: [{ name: "Complete German grammar", explanation: "All structures and registers" }],
      vocabulary: [],
      conversationPrompt:
        "Engage in sophisticated conversation on any topic. Use particles, idioms, appropriate register. Celebrate their achievement!",
    },
  ],
};
