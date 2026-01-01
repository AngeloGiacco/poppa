import type { LanguageCurriculum } from "@/types/curriculum.types";

export const frenchCurriculum: LanguageCurriculum = {
  languageCode: "fra",
  languageName: "French",
  lessons: [
    // BEGINNER (1-12)
    {
      id: 1,
      title: "Greetings & Introductions",
      level: "beginner",
      focus: "Basic greetings and introducing yourself",
      grammar: [
        { name: "Subject pronouns je/tu", explanation: "I and you (informal)" },
        { name: "Être (je suis, tu es)", explanation: "To be for identity" },
      ],
      vocabulary: [
        { term: "bonjour", translation: "hello/good day" },
        { term: "salut", translation: "hi (informal)" },
        { term: "au revoir", translation: "goodbye" },
        { term: "bonsoir", translation: "good evening" },
        { term: "bonne nuit", translation: "good night" },
        { term: "je m'appelle", translation: "my name is" },
        { term: "enchanté(e)", translation: "nice to meet you" },
        { term: "comment tu t'appelles?", translation: "what's your name?" },
      ],
      conversationPrompt:
        "Practice greetings at different times of day. Have the student introduce themselves. Explore tu vs vous through examples.",
    },
    {
      id: 2,
      title: "Numbers 1-20",
      level: "beginner",
      focus: "Counting and using numbers",
      grammar: [{ name: "Avoir + ans", explanation: "Using 'to have' for age" }],
      vocabulary: [
        { term: "un", translation: "1" },
        { term: "deux", translation: "2" },
        { term: "trois", translation: "3" },
        { term: "quatre", translation: "4" },
        { term: "cinq", translation: "5" },
        { term: "six", translation: "6" },
        { term: "sept", translation: "7" },
        { term: "huit", translation: "8" },
        { term: "neuf", translation: "9" },
        { term: "dix", translation: "10" },
        { term: "onze", translation: "11" },
        { term: "douze", translation: "12" },
        { term: "treize", translation: "13" },
        { term: "quatorze", translation: "14" },
        { term: "quinze", translation: "15" },
        { term: "seize", translation: "16" },
        { term: "dix-sept", translation: "17" },
        { term: "dix-huit", translation: "18" },
        { term: "dix-neuf", translation: "19" },
        { term: "vingt", translation: "20" },
        { term: "quel âge as-tu?", translation: "how old are you?" },
      ],
      conversationPrompt:
        "Practice counting, asking ages. Help them notice 17-19 are compound (dix-sept). Use numbers in real contexts.",
    },
    {
      id: 3,
      title: "Basic Questions",
      level: "beginner",
      focus: "Forming and answering simple questions",
      grammar: [
        { name: "Question intonation", explanation: "Rising tone or est-ce que for questions" },
        { name: "Question words", explanation: "Qui, que/quoi, comment, où, quand, pourquoi" },
      ],
      vocabulary: [
        { term: "qui", translation: "who" },
        { term: "que/quoi", translation: "what" },
        { term: "comment", translation: "how" },
        { term: "où", translation: "where" },
        { term: "quand", translation: "when" },
        { term: "pourquoi", translation: "why" },
        { term: "oui", translation: "yes" },
        { term: "non", translation: "no" },
        { term: "d'où viens-tu?", translation: "where are you from?" },
      ],
      conversationPrompt:
        "Practice forming questions with est-ce que and inversion. Have the student ask questions about yourself.",
    },
    {
      id: 4,
      title: "Articles & Gender",
      level: "beginner",
      focus: "Definite and indefinite articles",
      grammar: [
        { name: "Definite articles", explanation: "Le (masc), la (fem), l' (vowel), les (plural)" },
        { name: "Indefinite articles", explanation: "Un (masc), une (fem), des (plural)" },
      ],
      vocabulary: [
        { term: "le livre", translation: "the book" },
        { term: "la table", translation: "the table" },
        { term: "l'eau", translation: "the water" },
        { term: "les enfants", translation: "the children" },
        { term: "un homme", translation: "a man" },
        { term: "une femme", translation: "a woman" },
        { term: "des livres", translation: "some books" },
      ],
      conversationPrompt:
        "Practice identifying gender through articles. All nouns have gender - help them develop intuition through common patterns.",
    },
    {
      id: 5,
      title: "Family Members",
      level: "beginner",
      focus: "Talking about family",
      grammar: [
        { name: "Possessive adjectives", explanation: "Mon/ma/mes, ton/ta/tes, son/sa/ses" },
        { name: "Noun gender patterns", explanation: "Common masculine/feminine patterns" },
      ],
      vocabulary: [
        { term: "la mère/maman", translation: "mother/mom" },
        { term: "le père/papa", translation: "father/dad" },
        { term: "le frère", translation: "brother" },
        { term: "la sœur", translation: "sister" },
        { term: "le grand-père", translation: "grandfather" },
        { term: "la grand-mère", translation: "grandmother" },
        { term: "le fils", translation: "son" },
        { term: "la fille", translation: "daughter" },
        { term: "la famille", translation: "family" },
      ],
      conversationPrompt:
        "Ask about their family. Practice possessives: mon frère, ma sœur. Note possessives agree with the noun, not the speaker.",
    },
    {
      id: 6,
      title: "Colors & Descriptions",
      level: "beginner",
      focus: "Basic adjectives and colors",
      grammar: [
        { name: "Adjective agreement", explanation: "Adjectives match noun gender/number" },
        { name: "Adjective placement", explanation: "Most adjectives follow the noun" },
      ],
      vocabulary: [
        { term: "rouge", translation: "red" },
        { term: "bleu(e)", translation: "blue" },
        { term: "vert(e)", translation: "green" },
        { term: "jaune", translation: "yellow" },
        { term: "noir(e)", translation: "black" },
        { term: "blanc/blanche", translation: "white" },
        { term: "grand(e)", translation: "big/tall" },
        { term: "petit(e)", translation: "small" },
        { term: "joli(e)", translation: "pretty" },
      ],
      conversationPrompt:
        "Describe objects using colors. Help them discover agreement: 'la voiture bleue' vs 'le ciel bleu'.",
    },
    {
      id: 7,
      title: "Days & Months",
      level: "beginner",
      focus: "Days, months, and dates",
      grammar: [
        { name: "Days without articles", explanation: "Lundi, mardi... (no article for general)" },
        { name: "Dates", explanation: "Le + number + month (le 5 janvier)" },
      ],
      vocabulary: [
        { term: "lundi", translation: "Monday" },
        { term: "mardi", translation: "Tuesday" },
        { term: "mercredi", translation: "Wednesday" },
        { term: "jeudi", translation: "Thursday" },
        { term: "vendredi", translation: "Friday" },
        { term: "samedi", translation: "Saturday" },
        { term: "dimanche", translation: "Sunday" },
        { term: "aujourd'hui", translation: "today" },
        { term: "demain", translation: "tomorrow" },
        { term: "hier", translation: "yesterday" },
      ],
      conversationPrompt:
        "Practice asking what day it is, discussing schedules. Days aren't capitalized in French.",
    },
    {
      id: 8,
      title: "Regular -ER Verbs",
      level: "beginner",
      focus: "First verb conjugation pattern",
      grammar: [
        { name: "-ER verb endings", explanation: "-e, -es, -e, -ons, -ez, -ent" },
        { name: "Negation", explanation: "Ne...pas around the verb" },
      ],
      vocabulary: [
        { term: "parler", translation: "to speak" },
        { term: "travailler", translation: "to work" },
        { term: "étudier", translation: "to study" },
        { term: "écouter", translation: "to listen" },
        { term: "regarder", translation: "to watch/look" },
        { term: "manger", translation: "to eat" },
        { term: "aimer", translation: "to like/love" },
        { term: "habiter", translation: "to live" },
      ],
      conversationPrompt:
        "Practice conjugating through daily activities. 'Je parle français, tu parles anglais?' Help them discover the pattern.",
    },
    {
      id: 9,
      title: "Common Irregular Verbs",
      level: "beginner",
      focus: "Être, avoir, aller, faire",
      grammar: [
        { name: "Être conjugation", explanation: "Suis, es, est, sommes, êtes, sont" },
        { name: "Avoir conjugation", explanation: "Ai, as, a, avons, avez, ont" },
        { name: "Aller conjugation", explanation: "Vais, vas, va, allons, allez, vont" },
      ],
      vocabulary: [
        { term: "être", translation: "to be" },
        { term: "avoir", translation: "to have" },
        { term: "aller", translation: "to go" },
        { term: "faire", translation: "to do/make" },
        { term: "je suis fatigué(e)", translation: "I am tired" },
        { term: "j'ai faim", translation: "I am hungry" },
        { term: "je vais bien", translation: "I am doing well" },
      ],
      conversationPrompt:
        "These four verbs are essential. Practice in context: 'Comment vas-tu?' 'Qu'est-ce que tu fais?'",
    },
    {
      id: 10,
      title: "Food & Drinks",
      level: "beginner",
      focus: "Basic food vocabulary and ordering",
      grammar: [
        { name: "Partitive articles", explanation: "Du, de la, de l', des (some)" },
        { name: "Vouloir for requests", explanation: "Je voudrais = I would like" },
      ],
      vocabulary: [
        { term: "l'eau", translation: "water" },
        { term: "le café", translation: "coffee" },
        { term: "le pain", translation: "bread" },
        { term: "la viande", translation: "meat" },
        { term: "le poulet", translation: "chicken" },
        { term: "le poisson", translation: "fish" },
        { term: "les fruits", translation: "fruit" },
        { term: "les légumes", translation: "vegetables" },
        { term: "le petit déjeuner", translation: "breakfast" },
        { term: "le déjeuner", translation: "lunch" },
        { term: "le dîner", translation: "dinner" },
      ],
      conversationPrompt:
        "Practice ordering food. 'Je voudrais du pain, s'il vous plaît.' Explain partitive: 'some bread' = du pain.",
    },
    {
      id: 11,
      title: "Numbers 21-100",
      level: "beginner",
      focus: "Larger numbers",
      grammar: [
        {
          name: "French number patterns",
          explanation: "70=soixante-dix, 80=quatre-vingts, 90=quatre-vingt-dix",
        },
      ],
      vocabulary: [
        { term: "vingt et un", translation: "21" },
        { term: "trente", translation: "30" },
        { term: "quarante", translation: "40" },
        { term: "cinquante", translation: "50" },
        { term: "soixante", translation: "60" },
        { term: "soixante-dix", translation: "70" },
        { term: "quatre-vingts", translation: "80" },
        { term: "quatre-vingt-dix", translation: "90" },
        { term: "cent", translation: "100" },
        { term: "combien ça coûte?", translation: "how much does it cost?" },
      ],
      conversationPrompt:
        "French numbers 70-99 are unique! 70 is 'sixty-ten', 80 is 'four-twenties'. Practice with prices.",
    },
    {
      id: 12,
      title: "Beginner Review",
      level: "beginner",
      focus: "Consolidating beginner material",
      grammar: [
        { name: "All beginner grammar", explanation: "Articles, être/avoir, -ER verbs, negation" },
      ],
      vocabulary: [],
      conversationPrompt:
        "Free conversation covering introductions, family, numbers, food. Identify areas needing more practice.",
    },

    // ELEMENTARY (13-24)
    {
      id: 13,
      title: "Telling Time",
      level: "elementary",
      focus: "Clock time and schedules",
      grammar: [
        { name: "Time with être", explanation: "Il est + hour (Il est trois heures)" },
        { name: "Time expressions", explanation: "Et quart, et demie, moins le quart" },
      ],
      vocabulary: [
        { term: "quelle heure est-il?", translation: "what time is it?" },
        { term: "il est une heure", translation: "it's one o'clock" },
        { term: "il est deux heures", translation: "it's two o'clock" },
        { term: "et demie", translation: "half past" },
        { term: "et quart", translation: "quarter past" },
        { term: "moins le quart", translation: "quarter to" },
        { term: "midi", translation: "noon" },
        { term: "minuit", translation: "midnight" },
      ],
      conversationPrompt:
        "Practice telling time. 'Il est une heure' (singular) but 'Il est deux heures' (plural). Discuss daily schedule.",
    },
    {
      id: 14,
      title: "-IR and -RE Verbs",
      level: "elementary",
      focus: "Second and third conjugation patterns",
      grammar: [
        { name: "-IR verb endings", explanation: "-is, -is, -it, -issons, -issez, -issent" },
        { name: "-RE verb endings", explanation: "-s, -s, -, -ons, -ez, -ent" },
      ],
      vocabulary: [
        { term: "finir", translation: "to finish" },
        { term: "choisir", translation: "to choose" },
        { term: "réussir", translation: "to succeed" },
        { term: "attendre", translation: "to wait" },
        { term: "vendre", translation: "to sell" },
        { term: "entendre", translation: "to hear" },
        { term: "répondre", translation: "to answer" },
      ],
      conversationPrompt:
        "Build on -ER verbs with -IR and -RE patterns. Practice through daily activities.",
    },
    {
      id: 15,
      title: "Weather & Seasons",
      level: "elementary",
      focus: "Describing weather",
      grammar: [
        { name: "Weather with faire", explanation: "Il fait + adjective (Il fait froid)" },
        { name: "Weather verbs", explanation: "Il pleut (it rains), il neige (it snows)" },
      ],
      vocabulary: [
        { term: "il fait chaud", translation: "it's hot" },
        { term: "il fait froid", translation: "it's cold" },
        { term: "il fait beau", translation: "it's nice weather" },
        { term: "il pleut", translation: "it's raining" },
        { term: "il neige", translation: "it's snowing" },
        { term: "le printemps", translation: "spring" },
        { term: "l'été", translation: "summer" },
        { term: "l'automne", translation: "autumn" },
        { term: "l'hiver", translation: "winter" },
      ],
      conversationPrompt:
        "Discuss weather and seasons. 'Quel temps fait-il?' Practice 'il fait + adjective' pattern.",
    },
    {
      id: 16,
      title: "Describing People",
      level: "elementary",
      focus: "Physical and personality traits",
      grammar: [
        { name: "Être for traits", explanation: "Il est grand, elle est intelligente" },
        {
          name: "Avoir for features",
          explanation: "Il a les yeux bleus, elle a les cheveux longs",
        },
      ],
      vocabulary: [
        { term: "grand(e)", translation: "tall" },
        { term: "petit(e)", translation: "short" },
        { term: "jeune", translation: "young" },
        { term: "vieux/vieille", translation: "old" },
        { term: "beau/belle", translation: "beautiful/handsome" },
        { term: "gentil(le)", translation: "nice/kind" },
        { term: "intelligent(e)", translation: "intelligent" },
        { term: "les cheveux", translation: "hair" },
        { term: "les yeux", translation: "eyes" },
      ],
      conversationPrompt:
        "Describe people. Note 'avoir' for physical features: 'Il a les yeux bleus' not 'ses yeux sont bleus'.",
    },
    {
      id: 17,
      title: "Reflexive Verbs",
      level: "elementary",
      focus: "Daily routine",
      grammar: [
        { name: "Reflexive pronouns", explanation: "Me, te, se, nous, vous, se" },
        { name: "Reflexive conjugation", explanation: "Je me lève, tu te lèves..." },
      ],
      vocabulary: [
        { term: "se réveiller", translation: "to wake up" },
        { term: "se lever", translation: "to get up" },
        { term: "se doucher", translation: "to shower" },
        { term: "s'habiller", translation: "to get dressed" },
        { term: "se coucher", translation: "to go to bed" },
        { term: "s'endormir", translation: "to fall asleep" },
        { term: "d'abord", translation: "first" },
        { term: "ensuite/puis", translation: "then/next" },
      ],
      conversationPrompt:
        "Walk through a typical day. Explain reflexive as action done to oneself. Practice sequencing.",
    },
    {
      id: 18,
      title: "Places in Town",
      level: "elementary",
      focus: "Location vocabulary and prepositions",
      grammar: [
        { name: "Prepositions with places", explanation: "À, au, à la, aux (to/at)" },
        { name: "Prepositions of place", explanation: "Près de, loin de, à côté de" },
      ],
      vocabulary: [
        { term: "la banque", translation: "bank" },
        { term: "la pharmacie", translation: "pharmacy" },
        { term: "l'hôpital", translation: "hospital" },
        { term: "la gare", translation: "train station" },
        { term: "le musée", translation: "museum" },
        { term: "près de", translation: "near" },
        { term: "loin de", translation: "far from" },
        { term: "à côté de", translation: "next to" },
        { term: "en face de", translation: "across from" },
      ],
      conversationPrompt:
        "Practice asking where places are. 'Où est la banque?' 'C'est près de la gare.'",
    },
    {
      id: 19,
      title: "Shopping",
      level: "elementary",
      focus: "Store transactions",
      grammar: [
        { name: "Demonstratives", explanation: "Ce, cette, ces (this, these)" },
        { name: "Direct object pronouns", explanation: "Le, la, les (it, them)" },
      ],
      vocabulary: [
        { term: "le magasin", translation: "store" },
        { term: "les vêtements", translation: "clothes" },
        { term: "la chemise", translation: "shirt" },
        { term: "le pantalon", translation: "pants" },
        { term: "les chaussures", translation: "shoes" },
        { term: "la taille", translation: "size" },
        { term: "cher/chère", translation: "expensive" },
        { term: "bon marché", translation: "cheap" },
        { term: "la carte", translation: "card" },
      ],
      conversationPrompt:
        "Role-play shopping. Practice demonstratives: 'Je voudrais cette chemise.' Handle sizes, prices, payment.",
    },
    {
      id: 20,
      title: "Passé Composé with Avoir",
      level: "elementary",
      focus: "Past tense basics",
      grammar: [
        { name: "Passé composé structure", explanation: "Avoir + past participle" },
        { name: "Past participle formation", explanation: "-ER→-é, -IR→-i, -RE→-u" },
      ],
      vocabulary: [
        { term: "hier", translation: "yesterday" },
        { term: "la semaine dernière", translation: "last week" },
        { term: "le mois dernier", translation: "last month" },
        { term: "l'année dernière", translation: "last year" },
        { term: "j'ai mangé", translation: "I ate" },
        { term: "j'ai fini", translation: "I finished" },
        { term: "j'ai vendu", translation: "I sold" },
      ],
      conversationPrompt:
        "Introduce past through 'What did you do yesterday?' Most verbs use avoir. Help them discover the pattern.",
    },
    {
      id: 21,
      title: "Passé Composé with Être",
      level: "elementary",
      focus: "Verbs of movement/state change",
      grammar: [
        { name: "Être verbs", explanation: "DR MRS VANDERTRAMP verbs use être" },
        { name: "Past participle agreement", explanation: "Agrees with subject when using être" },
      ],
      vocabulary: [
        { term: "je suis allé(e)", translation: "I went" },
        { term: "je suis venu(e)", translation: "I came" },
        { term: "je suis parti(e)", translation: "I left" },
        { term: "je suis arrivé(e)", translation: "I arrived" },
        { term: "je suis né(e)", translation: "I was born" },
        { term: "je suis resté(e)", translation: "I stayed" },
      ],
      conversationPrompt:
        "About 17 verbs use être. Practice: 'Je suis allé au cinéma.' Note agreement with subject gender.",
    },
    {
      id: 22,
      title: "Irregular Past Participles",
      level: "elementary",
      focus: "Common irregular forms",
      grammar: [
        {
          name: "Irregular participles",
          explanation: "Avoir→eu, être→été, faire→fait, prendre→pris",
        },
      ],
      vocabulary: [
        { term: "j'ai eu", translation: "I had" },
        { term: "j'ai été", translation: "I was" },
        { term: "j'ai fait", translation: "I did/made" },
        { term: "j'ai pris", translation: "I took" },
        { term: "j'ai vu", translation: "I saw" },
        { term: "j'ai dit", translation: "I said" },
        { term: "j'ai écrit", translation: "I wrote" },
      ],
      conversationPrompt:
        "Focus on common irregulars through storytelling. 'Qu'est-ce que tu as fait hier?'",
    },
    {
      id: 23,
      title: "Travel Vocabulary",
      level: "elementary",
      focus: "Airports, hotels, transportation",
      grammar: [
        { name: "Aller + infinitive", explanation: "Near future: Je vais voyager" },
        { name: "Devoir/pouvoir", explanation: "Must/can: Je dois partir, je peux aider" },
      ],
      vocabulary: [
        { term: "l'aéroport", translation: "airport" },
        { term: "le vol", translation: "flight" },
        { term: "la valise", translation: "suitcase" },
        { term: "le passeport", translation: "passport" },
        { term: "l'hôtel", translation: "hotel" },
        { term: "la chambre", translation: "room" },
        { term: "le billet", translation: "ticket" },
        { term: "la réservation", translation: "reservation" },
      ],
      conversationPrompt:
        "Role-play travel situations. Practice 'aller + infinitive' for future: 'Je vais prendre l'avion demain.'",
    },
    {
      id: 24,
      title: "Elementary Review",
      level: "elementary",
      focus: "Consolidating elementary material",
      grammar: [
        { name: "All elementary grammar", explanation: "Passé composé, reflexives, pronouns" },
      ],
      vocabulary: [],
      conversationPrompt:
        "Have the student tell a story about a trip using passé composé. Test comfort with all elementary material.",
    },

    // INTERMEDIATE (25-40)
    {
      id: 25,
      title: "Imparfait Introduction",
      level: "intermediate",
      focus: "Past habits and descriptions",
      grammar: [
        {
          name: "Imparfait formation",
          explanation: "Nous stem + -ais, -ais, -ait, -ions, -iez, -aient",
        },
        { name: "Imparfait uses", explanation: "Habitual past, descriptions, ongoing states" },
      ],
      vocabulary: [
        { term: "quand j'étais jeune", translation: "when I was young" },
        { term: "tous les jours", translation: "every day" },
        { term: "souvent", translation: "often" },
        { term: "toujours", translation: "always" },
        { term: "avant", translation: "before/in the past" },
      ],
      conversationPrompt:
        "Introduce through childhood memories. 'Quand j'étais enfant, j'habitais...' Focus on repeated/ongoing actions.",
    },
    {
      id: 26,
      title: "Passé Composé vs Imparfait",
      level: "intermediate",
      focus: "Choosing between past tenses",
      grammar: [
        { name: "Imparfait for background", explanation: "Setting, ongoing actions, states" },
        { name: "Passé composé for events", explanation: "Completed actions, specific moments" },
      ],
      vocabulary: [
        { term: "pendant que", translation: "while" },
        { term: "soudain", translation: "suddenly" },
        { term: "alors", translation: "then" },
        { term: "à ce moment-là", translation: "at that moment" },
      ],
      conversationPrompt:
        "Practice combining tenses. 'Il pleuvait quand je suis sorti.' Imparfait = background, passé composé = action.",
    },
    {
      id: 27,
      title: "Object Pronouns",
      level: "intermediate",
      focus: "Direct and indirect object pronouns",
      grammar: [
        { name: "Direct object pronouns", explanation: "Me, te, le/la, nous, vous, les" },
        { name: "Indirect object pronouns", explanation: "Me, te, lui, nous, vous, leur" },
        {
          name: "Pronoun placement",
          explanation: "Before the verb (or auxiliary in passé composé)",
        },
      ],
      vocabulary: [
        { term: "le/la", translation: "it/him/her (direct)" },
        { term: "lui", translation: "to him/her (indirect)" },
        { term: "leur", translation: "to them (indirect)" },
      ],
      conversationPrompt:
        "Practice replacing nouns. 'Tu vois Marie?' 'Oui, je la vois.' 'Tu parles à Pierre?' 'Oui, je lui parle.'",
    },
    {
      id: 28,
      title: "Y and En",
      level: "intermediate",
      focus: "Pronouns for places and quantities",
      grammar: [
        { name: "Y", explanation: "Replaces à + place/thing: J'y vais (I go there)" },
        { name: "En", explanation: "Replaces de + thing or quantity: J'en veux (I want some)" },
      ],
      vocabulary: [
        { term: "y", translation: "there/to it" },
        { term: "en", translation: "some/of it" },
        { term: "j'y vais", translation: "I'm going there" },
        { term: "j'en veux", translation: "I want some" },
        { term: "il y en a", translation: "there are some" },
      ],
      conversationPrompt:
        "Y and en are uniquely French. Practice: 'Tu vas à Paris?' 'Oui, j'y vais.' 'Tu veux du café?' 'Oui, j'en veux.'",
    },
    {
      id: 29,
      title: "Comparisons",
      level: "intermediate",
      focus: "Comparing things and people",
      grammar: [
        { name: "Comparatives", explanation: "Plus/moins/aussi... que" },
        { name: "Superlatives", explanation: "Le/la plus... (the most)" },
        { name: "Irregular comparatives", explanation: "Meilleur (better), pire (worse)" },
      ],
      vocabulary: [
        { term: "plus que", translation: "more than" },
        { term: "moins que", translation: "less than" },
        { term: "aussi... que", translation: "as... as" },
        { term: "meilleur(e)", translation: "better" },
        { term: "pire", translation: "worse" },
        { term: "mieux", translation: "better (adverb)" },
      ],
      conversationPrompt: "Compare things, people, places. Note: 'bon→meilleur' but 'bien→mieux'.",
    },
    {
      id: 30,
      title: "Future Simple",
      level: "intermediate",
      focus: "Simple future tense",
      grammar: [
        { name: "Future endings", explanation: "-ai, -as, -a, -ons, -ez, -ont (on infinitive)" },
        { name: "Irregular stems", explanation: "Être→ser-, avoir→aur-, aller→ir-, faire→fer-" },
      ],
      vocabulary: [
        { term: "demain", translation: "tomorrow" },
        { term: "la semaine prochaine", translation: "next week" },
        { term: "l'année prochaine", translation: "next year" },
        { term: "un jour", translation: "one day/someday" },
        { term: "bientôt", translation: "soon" },
      ],
      conversationPrompt:
        "Discuss future plans. Add endings to infinitive (or irregular stem). 'Qu'est-ce que tu feras demain?'",
    },
    {
      id: 31,
      title: "Conditional",
      level: "intermediate",
      focus: "Would/could expressions",
      grammar: [
        {
          name: "Conditional formation",
          explanation: "Future stem + imparfait endings (-ais, -ais, -ait...)",
        },
        { name: "Conditional uses", explanation: "Politeness, wishes, hypotheticals" },
      ],
      vocabulary: [
        { term: "je voudrais", translation: "I would like" },
        { term: "je pourrais", translation: "I could" },
        { term: "je devrais", translation: "I should" },
        { term: "ce serait", translation: "it would be" },
        { term: "j'aurais", translation: "I would have" },
      ],
      conversationPrompt:
        "Practice polite requests and hypotheticals. 'Je voudrais un café.' 'Qu'est-ce que tu ferais?'",
    },
    {
      id: 32,
      title: "Relative Pronouns",
      level: "intermediate",
      focus: "Qui, que, dont, où",
      grammar: [
        { name: "Qui", explanation: "Subject of relative clause (who/which)" },
        { name: "Que", explanation: "Object of relative clause (whom/which)" },
        { name: "Dont", explanation: "Of which/whose (replaces de)" },
        { name: "Où", explanation: "Where/when" },
      ],
      vocabulary: [
        { term: "qui", translation: "who/which (subject)" },
        { term: "que", translation: "whom/which (object)" },
        { term: "dont", translation: "of which/whose" },
        { term: "où", translation: "where/when" },
      ],
      conversationPrompt:
        "Connect ideas: 'Le livre que j'ai lu...' 'La personne dont je parle...' Practice each pronoun.",
    },
    {
      id: 33,
      title: "Subjonctif Introduction",
      level: "intermediate",
      focus: "Present subjunctive basics",
      grammar: [
        { name: "Subjunctive formation", explanation: "Ils stem + -e, -es, -e, -ions, -iez, -ent" },
        { name: "Subjunctive triggers", explanation: "Volonté, émotion, doute, nécessité" },
      ],
      vocabulary: [
        { term: "je veux que", translation: "I want (someone) to" },
        { term: "il faut que", translation: "it's necessary that" },
        { term: "je suis content(e) que", translation: "I'm happy that" },
        { term: "je doute que", translation: "I doubt that" },
      ],
      conversationPrompt:
        "Introduce through wishes and necessity. 'Il faut que tu viennes.' 'Je veux que tu saches.' Focus on triggers.",
    },
    {
      id: 34,
      title: "Subjonctif: More Triggers",
      level: "intermediate",
      focus: "Expanding subjunctive use",
      grammar: [
        { name: "Emotion triggers", explanation: "Je suis triste que, j'ai peur que" },
        { name: "Doubt triggers", explanation: "Je ne crois pas que, il est possible que" },
      ],
      vocabulary: [
        { term: "j'ai peur que", translation: "I'm afraid that" },
        { term: "je suis surpris(e) que", translation: "I'm surprised that" },
        { term: "il est possible que", translation: "it's possible that" },
        { term: "bien que", translation: "although" },
        { term: "pour que", translation: "so that" },
      ],
      conversationPrompt:
        "Practice more triggers. Note 'je crois que' uses indicative but 'je ne crois pas que' uses subjunctive.",
    },
    {
      id: 35,
      title: "Commands",
      level: "intermediate",
      focus: "Imperative mood",
      grammar: [
        { name: "Tu/nous/vous forms", explanation: "Use present tense without subject" },
        { name: "-ER verb tu form", explanation: "Drop -s: parle! (not parles)" },
        { name: "Pronoun placement", explanation: "After in affirmative, before in negative" },
      ],
      vocabulary: [
        { term: "parle!", translation: "speak! (tu)" },
        { term: "parlons!", translation: "let's speak!" },
        { term: "parlez!", translation: "speak! (vous)" },
        { term: "va!", translation: "go! (tu)" },
        { term: "allons-y!", translation: "let's go!" },
      ],
      conversationPrompt:
        "Practice giving commands. Note -ER verbs drop -s in tu form. 'Regarde!' not 'Regardes!'",
    },
    {
      id: 36,
      title: "Negation Patterns",
      level: "intermediate",
      focus: "Beyond ne...pas",
      grammar: [
        { name: "Ne...plus", explanation: "No longer/not anymore" },
        { name: "Ne...jamais", explanation: "Never" },
        { name: "Ne...rien", explanation: "Nothing" },
        { name: "Ne...personne", explanation: "Nobody" },
      ],
      vocabulary: [
        { term: "ne...plus", translation: "no longer" },
        { term: "ne...jamais", translation: "never" },
        { term: "ne...rien", translation: "nothing" },
        { term: "ne...personne", translation: "nobody" },
        { term: "ne...que", translation: "only" },
      ],
      conversationPrompt:
        "Practice various negations. 'Je ne fume plus.' 'Je ne vois personne.' 'Je n'ai rien fait.'",
    },
    {
      id: 37,
      title: "Depuis, Pendant, Il y a",
      level: "intermediate",
      focus: "Time expressions",
      grammar: [
        { name: "Depuis + present", explanation: "For/since (action still ongoing)" },
        { name: "Pendant", explanation: "For/during (completed duration)" },
        { name: "Il y a", explanation: "Ago" },
      ],
      vocabulary: [
        { term: "depuis", translation: "for/since (ongoing)" },
        { term: "pendant", translation: "for/during" },
        { term: "il y a", translation: "ago" },
        { term: "depuis combien de temps?", translation: "for how long?" },
      ],
      conversationPrompt:
        "Key distinction: 'J'habite ici depuis 5 ans' (still living) vs 'J'ai habité là pendant 5 ans' (completed).",
    },
    {
      id: 38,
      title: "Faire Causatif",
      level: "intermediate",
      focus: "Having something done",
      grammar: [
        { name: "Faire + infinitive", explanation: "To have something done / make someone do" },
      ],
      vocabulary: [
        { term: "faire faire", translation: "to have (something) done" },
        { term: "faire réparer", translation: "to have (something) repaired" },
        { term: "faire construire", translation: "to have (something) built" },
        { term: "se faire couper les cheveux", translation: "to get a haircut" },
      ],
      conversationPrompt:
        "Practice causative: 'Je fais réparer ma voiture.' 'Je me suis fait couper les cheveux.'",
    },
    {
      id: 39,
      title: "Pronoun Order",
      level: "intermediate",
      focus: "Multiple pronouns",
      grammar: [
        { name: "Pronoun order", explanation: "Me/te/nous/vous → le/la/les → lui/leur → y → en" },
      ],
      vocabulary: [
        { term: "je le lui donne", translation: "I give it to him/her" },
        { term: "il m'en parle", translation: "he talks to me about it" },
        { term: "je t'y emmène", translation: "I take you there" },
      ],
      conversationPrompt:
        "Practice combining pronouns. 'Tu donnes le livre à Marie?' 'Oui, je le lui donne.'",
    },
    {
      id: 40,
      title: "Intermediate Review",
      level: "intermediate",
      focus: "Consolidating intermediate material",
      grammar: [
        {
          name: "All intermediate grammar",
          explanation: "Both pasts, pronouns, subjunctive, conditionals",
        },
      ],
      vocabulary: [],
      conversationPrompt:
        "Extended conversation using all intermediate grammar. Tell stories, express opinions, discuss hypotheticals.",
    },

    // UPPER INTERMEDIATE (41-52)
    {
      id: 41,
      title: "Plus-que-parfait",
      level: "upper_intermediate",
      focus: "Had done something",
      grammar: [
        { name: "Formation", explanation: "Imparfait of avoir/être + past participle" },
        { name: "Sequencing", explanation: "Action before another past action" },
      ],
      vocabulary: [
        { term: "j'avais mangé", translation: "I had eaten" },
        { term: "j'étais parti(e)", translation: "I had left" },
        { term: "avant que", translation: "before" },
        { term: "après que", translation: "after" },
      ],
      conversationPrompt:
        "Practice sequencing: 'Quand je suis arrivé, il était déjà parti.' Narrate complex stories.",
    },
    {
      id: 42,
      title: "Futur Antérieur",
      level: "upper_intermediate",
      focus: "Will have done",
      grammar: [
        { name: "Formation", explanation: "Future of avoir/être + past participle" },
        { name: "Uses", explanation: "Future completion, conjecture about past" },
      ],
      vocabulary: [
        { term: "j'aurai fini", translation: "I will have finished" },
        { term: "il sera parti", translation: "he will have left" },
        { term: "quand tu arriveras", translation: "when you arrive" },
        { term: "dès que", translation: "as soon as" },
      ],
      conversationPrompt:
        "Practice future perfect: 'Quand tu arriveras, j'aurai déjà mangé.' Note future in time clauses.",
    },
    {
      id: 43,
      title: "Conditionnel Passé",
      level: "upper_intermediate",
      focus: "Would have done",
      grammar: [
        { name: "Formation", explanation: "Conditional of avoir/être + past participle" },
        { name: "Si clauses", explanation: "Si + plus-que-parfait, conditionnel passé" },
      ],
      vocabulary: [
        { term: "j'aurais dit", translation: "I would have said" },
        { term: "je serais venu(e)", translation: "I would have come" },
        { term: "si j'avais su", translation: "if I had known" },
      ],
      conversationPrompt:
        "Discuss past hypotheticals: 'Si j'avais su, je serais venu.' Express regrets and missed opportunities.",
    },
    {
      id: 44,
      title: "Si Clauses Summary",
      level: "upper_intermediate",
      focus: "All conditional sentence types",
      grammar: [
        { name: "Real condition", explanation: "Si + present, future/present" },
        { name: "Hypothetical", explanation: "Si + imparfait, conditionnel" },
        { name: "Past unreal", explanation: "Si + plus-que-parfait, conditionnel passé" },
      ],
      vocabulary: [
        { term: "si je peux", translation: "if I can (real)" },
        { term: "si je pouvais", translation: "if I could (hypothetical)" },
        { term: "si j'avais pu", translation: "if I had been able (unreal)" },
      ],
      conversationPrompt:
        "Practice all three types. 'Si j'ai le temps, je viendrai.' 'Si j'avais le temps, je viendrais.' 'Si j'avais eu le temps, je serais venu.'",
    },
    {
      id: 45,
      title: "Passive Voice",
      level: "upper_intermediate",
      focus: "Être + past participle",
      grammar: [
        { name: "Passive formation", explanation: "Être + past participle (+ par)" },
        { name: "Alternatives", explanation: "On + active, se faire + infinitive" },
      ],
      vocabulary: [
        { term: "être construit", translation: "to be built" },
        { term: "être fait", translation: "to be made" },
        { term: "par", translation: "by" },
        { term: "on dit que", translation: "it is said that" },
      ],
      conversationPrompt:
        "Practice passive: 'Ce livre a été écrit par Camus.' Note French often prefers 'on' to passive.",
    },
    {
      id: 46,
      title: "Subjonctif Passé",
      level: "upper_intermediate",
      focus: "Past subjunctive",
      grammar: [
        { name: "Formation", explanation: "Subjunctive of avoir/être + past participle" },
        { name: "Uses", explanation: "Past action in subjunctive context" },
      ],
      vocabulary: [
        { term: "je suis content qu'il soit venu", translation: "I'm happy he came" },
        { term: "je doute qu'il ait compris", translation: "I doubt he understood" },
        { term: "bien qu'il ait essayé", translation: "although he tried" },
      ],
      conversationPrompt:
        "Practice expressing feelings about past events: 'Je suis désolé que tu aies été malade.'",
    },
    {
      id: 47,
      title: "Discours Indirect",
      level: "upper_intermediate",
      focus: "Reported speech",
      grammar: [
        { name: "Tense shifts", explanation: "Present→imparfait, passé composé→plus-que-parfait" },
        { name: "Reporting verbs", explanation: "Dire que, demander si, répondre que" },
      ],
      vocabulary: [
        { term: "il a dit que", translation: "he said that" },
        { term: "elle m'a demandé si", translation: "she asked me if" },
        { term: "il a répondu que", translation: "he answered that" },
        { term: "selon", translation: "according to" },
      ],
      conversationPrompt:
        "Practice reporting: 'Il a dit: Je viendrai' → 'Il a dit qu'il viendrait.'",
    },
    {
      id: 48,
      title: "Participe Présent & Gérondif",
      level: "upper_intermediate",
      focus: "Present participle and gerund",
      grammar: [
        { name: "Participe présent", explanation: "Nous stem + -ant (parlant, finissant)" },
        { name: "Gérondif", explanation: "En + participe présent (while doing)" },
      ],
      vocabulary: [
        { term: "en parlant", translation: "while speaking" },
        { term: "en arrivant", translation: "upon arriving" },
        { term: "tout en", translation: "while (at the same time)" },
        { term: "ayant", translation: "having" },
        { term: "étant", translation: "being" },
      ],
      conversationPrompt:
        "Practice gérondif: 'En travaillant dur, il a réussi.' 'J'écoute de la musique en cuisinant.'",
    },
    {
      id: 49,
      title: "Ce qui, Ce que, Ce dont",
      level: "upper_intermediate",
      focus: "What/that which constructions",
      grammar: [
        { name: "Ce qui", explanation: "What (subject): Ce qui m'intéresse..." },
        { name: "Ce que", explanation: "What (object): Ce que je veux..." },
        { name: "Ce dont", explanation: "What (with de): Ce dont j'ai besoin..." },
      ],
      vocabulary: [
        { term: "ce qui", translation: "what (subject)" },
        { term: "ce que", translation: "what (object)" },
        { term: "ce dont", translation: "what (with de)" },
        { term: "ce à quoi", translation: "what (with à)" },
      ],
      conversationPrompt:
        "Practice: 'Ce qui m'intéresse, c'est...' 'Ce que je veux, c'est...' 'Ce dont j'ai besoin, c'est...'",
    },
    {
      id: 50,
      title: "Formal Written French",
      level: "upper_intermediate",
      focus: "Literary tenses and formal style",
      grammar: [
        { name: "Passé simple", explanation: "Literary past tense (recognition)" },
        { name: "Ne littéraire", explanation: "Ne alone without pas in formal writing" },
      ],
      vocabulary: [
        { term: "il fut", translation: "he was (passé simple)" },
        { term: "il alla", translation: "he went (passé simple)" },
        { term: "je ne saurais dire", translation: "I couldn't say (formal)" },
        { term: "avant qu'il ne parte", translation: "before he leaves (formal)" },
      ],
      conversationPrompt:
        "Recognize passé simple in literature. Practice formal expressions for writing.",
    },
    {
      id: 51,
      title: "Nuanced Connectors",
      level: "upper_intermediate",
      focus: "Advanced linking words",
      grammar: [
        { name: "Cause", explanation: "Puisque, étant donné que, vu que" },
        { name: "Concession", explanation: "Bien que, quoique, même si" },
        { name: "Consequence", explanation: "Par conséquent, de ce fait, ainsi" },
      ],
      vocabulary: [
        { term: "bien que", translation: "although (+ subjunctive)" },
        { term: "étant donné que", translation: "given that" },
        { term: "par conséquent", translation: "consequently" },
        { term: "néanmoins", translation: "nevertheless" },
        { term: "d'ailleurs", translation: "moreover/besides" },
      ],
      conversationPrompt:
        "Build sophisticated arguments using advanced connectors. Note 'bien que' requires subjunctive.",
    },
    {
      id: 52,
      title: "Upper Intermediate Review",
      level: "upper_intermediate",
      focus: "Consolidating upper intermediate",
      grammar: [
        {
          name: "All compound tenses",
          explanation: "Plus-que-parfait, futur antérieur, conditionnel passé",
        },
      ],
      vocabulary: [],
      conversationPrompt:
        "Engage in complex discussion using all tenses. Express hypotheticals, report speech, build arguments.",
    },

    // ADVANCED (53-60)
    {
      id: 53,
      title: "Subjonctif Imparfait",
      level: "advanced",
      focus: "Literary subjunctive",
      grammar: [
        { name: "Formation", explanation: "Based on passé simple stem" },
        { name: "Usage", explanation: "Formal writing, literary texts" },
      ],
      vocabulary: [
        { term: "qu'il fût", translation: "that he were (literary)" },
        { term: "qu'il eût", translation: "that he had (literary)" },
        { term: "avant qu'il ne parlât", translation: "before he spoke (literary)" },
      ],
      conversationPrompt:
        "Recognize in literature. 'Il fallait qu'il partît' = formal 'Il fallait qu'il parte'.",
    },
    {
      id: 54,
      title: "Subjonctif Plus-que-parfait",
      level: "advanced",
      focus: "Literary past subjunctive",
      grammar: [
        { name: "Formation", explanation: "Imparfait subjunctive of avoir/être + past participle" },
        { name: "Usage", explanation: "Past hypotheticals in formal style" },
      ],
      vocabulary: [
        { term: "qu'il eût fait", translation: "that he had done (literary)" },
        { term: "si j'eusse su", translation: "if I had known (literary)" },
      ],
      conversationPrompt:
        "Recognize in classical literature. Modern equivalent uses conditionnel passé.",
    },
    {
      id: 55,
      title: "Idioms & Expressions",
      level: "advanced",
      focus: "Common French idioms",
      grammar: [
        {
          name: "Idiomatic structures",
          explanation: "Fixed phrases that don't translate literally",
        },
      ],
      vocabulary: [
        { term: "avoir le cafard", translation: "to feel down/blue" },
        { term: "poser un lapin", translation: "to stand someone up" },
        { term: "coûter les yeux de la tête", translation: "to cost an arm and a leg" },
        { term: "tomber dans les pommes", translation: "to faint" },
        { term: "avoir du pain sur la planche", translation: "to have a lot on one's plate" },
        { term: "mettre son grain de sel", translation: "to put in one's two cents" },
        { term: "c'est pas tes oignons", translation: "mind your own business" },
      ],
      conversationPrompt:
        "Explore idioms through context. Practice using them naturally in conversation.",
    },
    {
      id: 56,
      title: "Regional & Francophone Variations",
      level: "advanced",
      focus: "French across different regions",
      grammar: [
        {
          name: "Belgian/Swiss numbers",
          explanation: "Septante (70), huitante/octante (80), nonante (90)",
        },
        { name: "Québécois features", explanation: "Tu-tu questions, vocabulary differences" },
      ],
      vocabulary: [
        { term: "septante", translation: "70 (Belgian/Swiss)" },
        { term: "nonante", translation: "90 (Belgian/Swiss)" },
        { term: "char", translation: "car (Québécois)" },
        { term: "blonde", translation: "girlfriend (Québécois)" },
        { term: "magasiner", translation: "to shop (Québécois)" },
      ],
      conversationPrompt:
        "Explore francophone diversity. Compare France, Belgium, Switzerland, Québec, Africa.",
    },
    {
      id: 57,
      title: "Formal & Professional French",
      level: "advanced",
      focus: "Business and academic register",
      grammar: [
        {
          name: "Formal register",
          explanation: "Vous, conditional for politeness, formal vocabulary",
        },
      ],
      vocabulary: [
        { term: "veuillez", translation: "please (formal)" },
        { term: "je vous prie de", translation: "I ask you to (formal)" },
        { term: "je vous saurais gré de", translation: "I would be grateful if" },
        { term: "cordialement", translation: "sincerely" },
        { term: "en vous remerciant", translation: "thanking you" },
      ],
      conversationPrompt:
        "Practice formal correspondence. Role-play professional situations, interviews, formal complaints.",
    },
    {
      id: 58,
      title: "Nuanced Expression",
      level: "advanced",
      focus: "Subtle meaning and register",
      grammar: [
        { name: "Litotes", explanation: "Understatement: 'pas mal' = quite good" },
        { name: "Register shifts", explanation: "Familier, courant, soutenu" },
      ],
      vocabulary: [
        { term: "pas mal", translation: "not bad (= quite good)" },
        { term: "il n'est pas sans savoir", translation: "he's well aware" },
        { term: "ce n'est pas pour rien que", translation: "it's not for nothing that" },
        { term: "bouquin (familier)", translation: "book (informal)" },
        { term: "ouvrage (soutenu)", translation: "book (formal)" },
      ],
      conversationPrompt:
        "Practice register awareness. Same meaning, different levels: bagnole/voiture/automobile.",
    },
    {
      id: 59,
      title: "Cultural References",
      level: "advanced",
      focus: "French cultural knowledge",
      grammar: [
        { name: "Historical references", explanation: "Common allusions in French discourse" },
      ],
      vocabulary: [
        { term: "c'est Waterloo", translation: "it's a disaster" },
        { term: "un coup d'état", translation: "a sudden takeover" },
        { term: "noblesse oblige", translation: "privilege entails responsibility" },
        { term: "la Francophonie", translation: "French-speaking world" },
      ],
      conversationPrompt:
        "Explore cultural references. Discuss French history, literature, current events.",
    },
    {
      id: 60,
      title: "Advanced Review & Mastery",
      level: "advanced",
      focus: "Full language proficiency",
      grammar: [{ name: "All French grammar", explanation: "Complete grammatical mastery" }],
      vocabulary: [],
      conversationPrompt:
        "Engage in sophisticated conversation on any topic. Demonstrate nuance, idioms, register awareness. Celebrate their achievement!",
    },
  ],
};
