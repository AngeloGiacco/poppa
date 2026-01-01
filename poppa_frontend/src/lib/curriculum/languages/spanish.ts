import { type LanguageCurriculum } from "@/types/curriculum.types";

export const spanishCurriculum: LanguageCurriculum = {
  languageCode: "spa",
  languageName: "Spanish",
  lessons: [
    // BEGINNER (1-12)
    {
      id: 1,
      title: "Greetings & Introductions",
      level: "beginner",
      focus: "Basic greetings and introducing yourself",
      grammar: [
        { name: "Subject pronouns yo/tú", explanation: "I and you (informal)" },
        { name: "Ser (soy, eres)", explanation: "To be for identity" },
      ],
      vocabulary: [
        { term: "hola", translation: "hello" },
        { term: "adiós", translation: "goodbye" },
        { term: "buenos días", translation: "good morning" },
        { term: "buenas tardes", translation: "good afternoon" },
        { term: "buenas noches", translation: "good evening" },
        { term: "me llamo", translation: "my name is" },
        { term: "mucho gusto", translation: "nice to meet you" },
        { term: "¿cómo te llamas?", translation: "what's your name?" },
      ],
      conversationPrompt:
        "Practice greetings at different times of day. Have the student introduce themselves and ask your name. Explore when to use tú vs usted through examples.",
    },
    {
      id: 2,
      title: "Numbers 1-20",
      level: "beginner",
      focus: "Counting and using numbers",
      grammar: [{ name: "Tener + años", explanation: "Using 'to have' for age" }],
      vocabulary: [
        { term: "uno", translation: "1" },
        { term: "dos", translation: "2" },
        { term: "tres", translation: "3" },
        { term: "cuatro", translation: "4" },
        { term: "cinco", translation: "5" },
        { term: "seis", translation: "6" },
        { term: "siete", translation: "7" },
        { term: "ocho", translation: "8" },
        { term: "nueve", translation: "9" },
        { term: "diez", translation: "10" },
        { term: "once", translation: "11" },
        { term: "doce", translation: "12" },
        { term: "trece", translation: "13" },
        { term: "catorce", translation: "14" },
        { term: "quince", translation: "15" },
        { term: "dieciséis", translation: "16" },
        { term: "diecisiete", translation: "17" },
        { term: "dieciocho", translation: "18" },
        { term: "diecinueve", translation: "19" },
        { term: "veinte", translation: "20" },
        { term: "¿cuántos años tienes?", translation: "how old are you?" },
      ],
      conversationPrompt:
        "Practice counting objects, asking ages. Help them notice the pattern in teens (dieci-). Use numbers in real contexts like phone digits.",
    },
    {
      id: 3,
      title: "Basic Questions",
      level: "beginner",
      focus: "Forming and answering simple questions",
      grammar: [
        { name: "Question intonation", explanation: "Rising tone for yes/no questions" },
        { name: "Question words", explanation: "Qué, quién, cómo, dónde, cuándo, por qué" },
      ],
      vocabulary: [
        { term: "qué", translation: "what" },
        { term: "quién", translation: "who" },
        { term: "cómo", translation: "how" },
        { term: "dónde", translation: "where" },
        { term: "cuándo", translation: "when" },
        { term: "por qué", translation: "why" },
        { term: "sí", translation: "yes" },
        { term: "no", translation: "no" },
        { term: "¿de dónde eres?", translation: "where are you from?" },
      ],
      conversationPrompt:
        "Practice forming questions with each question word. Have the student ask you questions about yourself. Focus on natural question rhythm.",
    },
    {
      id: 4,
      title: "The Verb Estar",
      level: "beginner",
      focus: "Location and temporary states",
      grammar: [
        { name: "Estar conjugation", explanation: "Estoy, estás, está, estamos, están" },
        { name: "Ser vs estar basics", explanation: "Ser for identity, estar for location/state" },
      ],
      vocabulary: [
        { term: "bien", translation: "well/fine" },
        { term: "mal", translation: "bad" },
        { term: "cansado/a", translation: "tired" },
        { term: "contento/a", translation: "happy" },
        { term: "triste", translation: "sad" },
        { term: "aquí", translation: "here" },
        { term: "allí", translation: "there" },
        { term: "en casa", translation: "at home" },
        { term: "¿cómo estás?", translation: "how are you?" },
      ],
      conversationPrompt:
        "Ask how they're feeling, where things are located. Guide them to discover why we say 'estoy cansado' but 'soy estudiante' through examples.",
    },
    {
      id: 5,
      title: "Family Members",
      level: "beginner",
      focus: "Talking about family",
      grammar: [
        { name: "Possessive adjectives", explanation: "Mi, tu, su (my, your, his/her)" },
        { name: "Noun gender", explanation: "Masculine -o, feminine -a patterns" },
      ],
      vocabulary: [
        { term: "madre/mamá", translation: "mother/mom" },
        { term: "padre/papá", translation: "father/dad" },
        { term: "hermano/a", translation: "brother/sister" },
        { term: "abuelo/a", translation: "grandfather/grandmother" },
        { term: "hijo/a", translation: "son/daughter" },
        { term: "tío/a", translation: "uncle/aunt" },
        { term: "primo/a", translation: "cousin" },
        { term: "familia", translation: "family" },
      ],
      conversationPrompt:
        "Ask about their family. Help them notice the -o/-a pattern. Practice 'mi hermano se llama...' structures.",
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
        { term: "rojo/a", translation: "red" },
        { term: "azul", translation: "blue" },
        { term: "verde", translation: "green" },
        { term: "amarillo/a", translation: "yellow" },
        { term: "negro/a", translation: "black" },
        { term: "blanco/a", translation: "white" },
        { term: "grande", translation: "big" },
        { term: "pequeño/a", translation: "small" },
        { term: "bonito/a", translation: "pretty" },
      ],
      conversationPrompt:
        "Describe objects using colors. Help them discover agreement: 'la casa blanca' vs 'el coche blanco'. Note colors like azul don't change.",
    },
    {
      id: 7,
      title: "Days of the Week",
      level: "beginner",
      focus: "Days and weekly schedule",
      grammar: [{ name: "Days with articles", explanation: "El lunes = on Monday" }],
      vocabulary: [
        { term: "lunes", translation: "Monday" },
        { term: "martes", translation: "Tuesday" },
        { term: "miércoles", translation: "Wednesday" },
        { term: "jueves", translation: "Thursday" },
        { term: "viernes", translation: "Friday" },
        { term: "sábado", translation: "Saturday" },
        { term: "domingo", translation: "Sunday" },
        { term: "hoy", translation: "today" },
        { term: "mañana", translation: "tomorrow" },
        { term: "ayer", translation: "yesterday" },
        { term: "la semana", translation: "week" },
      ],
      conversationPrompt:
        "Practice asking what day it is, what they do on different days. Note days aren't capitalized in Spanish.",
    },
    {
      id: 8,
      title: "Regular -AR Verbs",
      level: "beginner",
      focus: "First verb conjugation pattern",
      grammar: [
        { name: "-AR verb endings", explanation: "-o, -as, -a, -amos, -an" },
        { name: "Negation", explanation: "Put 'no' before the verb" },
      ],
      vocabulary: [
        { term: "hablar", translation: "to speak" },
        { term: "trabajar", translation: "to work" },
        { term: "estudiar", translation: "to study" },
        { term: "escuchar", translation: "to listen" },
        { term: "caminar", translation: "to walk" },
        { term: "cocinar", translation: "to cook" },
        { term: "comprar", translation: "to buy" },
        { term: "descansar", translation: "to rest" },
      ],
      conversationPrompt:
        "Practice conjugating through daily activities. 'Yo hablo español, ¿tú hablas inglés?' Help them discover the pattern themselves.",
    },
    {
      id: 9,
      title: "Regular -ER/-IR Verbs",
      level: "beginner",
      focus: "Second and third conjugation patterns",
      grammar: [
        { name: "-ER verb endings", explanation: "-o, -es, -e, -emos, -en" },
        { name: "-IR verb endings", explanation: "-o, -es, -e, -imos, -en" },
      ],
      vocabulary: [
        { term: "comer", translation: "to eat" },
        { term: "beber", translation: "to drink" },
        { term: "leer", translation: "to read" },
        { term: "aprender", translation: "to learn" },
        { term: "vivir", translation: "to live" },
        { term: "escribir", translation: "to write" },
        { term: "abrir", translation: "to open" },
        { term: "recibir", translation: "to receive" },
      ],
      conversationPrompt:
        "Build on -AR verbs. Help them see -ER and -IR are almost identical. Practice with daily routine: '¿Dónde vives? ¿Qué comes?'",
    },
    {
      id: 10,
      title: "Food & Drinks",
      level: "beginner",
      focus: "Basic food vocabulary and ordering",
      grammar: [
        { name: "Gustar introduction", explanation: "Me gusta (I like) + singular noun" },
        { name: "Querer for requests", explanation: "Quiero = I want" },
      ],
      vocabulary: [
        { term: "agua", translation: "water" },
        { term: "café", translation: "coffee" },
        { term: "pan", translation: "bread" },
        { term: "carne", translation: "meat" },
        { term: "pollo", translation: "chicken" },
        { term: "pescado", translation: "fish" },
        { term: "fruta", translation: "fruit" },
        { term: "verdura", translation: "vegetable" },
        { term: "desayuno", translation: "breakfast" },
        { term: "almuerzo", translation: "lunch" },
        { term: "cena", translation: "dinner" },
      ],
      conversationPrompt:
        "Practice food preferences with 'me gusta'. Role-play ordering at a restaurant. 'Quiero un café, por favor.'",
    },
    {
      id: 11,
      title: "Numbers 21-100",
      level: "beginner",
      focus: "Larger numbers and prices",
      grammar: [{ name: "Compound numbers", explanation: "Treinta y uno, cuarenta y dos..." }],
      vocabulary: [
        { term: "veintiuno", translation: "21" },
        { term: "treinta", translation: "30" },
        { term: "cuarenta", translation: "40" },
        { term: "cincuenta", translation: "50" },
        { term: "sesenta", translation: "60" },
        { term: "setenta", translation: "70" },
        { term: "ochenta", translation: "80" },
        { term: "noventa", translation: "90" },
        { term: "cien", translation: "100" },
        { term: "¿cuánto cuesta?", translation: "how much does it cost?" },
      ],
      conversationPrompt:
        "Practice with prices and quantities. Note 21-29 are one word (veintiuno) but 31+ use 'y' (treinta y uno).",
    },
    {
      id: 12,
      title: "Beginner Review",
      level: "beginner",
      focus: "Consolidating beginner material",
      grammar: [
        {
          name: "All beginner grammar",
          explanation: "Ser, estar, tener, -AR/-ER/-IR verbs, gustar",
        },
      ],
      vocabulary: [],
      conversationPrompt:
        "Free conversation using all learned material. Cover introductions, family, numbers, daily activities, food. Identify areas needing more practice.",
    },

    // ELEMENTARY (13-24)
    {
      id: 13,
      title: "Telling Time",
      level: "elementary",
      focus: "Clock time and schedules",
      grammar: [
        { name: "Time with ser", explanation: "Es la una / Son las dos" },
        { name: "Time prepositions", explanation: "A las (at), de la mañana/tarde" },
      ],
      vocabulary: [
        { term: "¿qué hora es?", translation: "what time is it?" },
        { term: "es la una", translation: "it's one o'clock" },
        { term: "son las dos", translation: "it's two o'clock" },
        { term: "y media", translation: "half past" },
        { term: "y cuarto", translation: "quarter past" },
        { term: "menos cuarto", translation: "quarter to" },
        { term: "mediodía", translation: "noon" },
        { term: "medianoche", translation: "midnight" },
      ],
      conversationPrompt:
        "Practice telling time and scheduling. 'Es la una' (singular) vs 'Son las dos' (plural). Discuss daily schedule with times.",
    },
    {
      id: 14,
      title: "Common Irregular Verbs",
      level: "elementary",
      focus: "Ir, hacer, tener",
      grammar: [
        { name: "Ir conjugation", explanation: "Voy, vas, va, vamos, van" },
        { name: "Hacer conjugation", explanation: "Hago, haces, hace..." },
        { name: "Ir a + infinitive", explanation: "Going to do something (near future)" },
      ],
      vocabulary: [
        { term: "ir", translation: "to go" },
        { term: "hacer", translation: "to do/make" },
        { term: "voy a", translation: "I'm going to" },
        { term: "la tarea", translation: "homework" },
        { term: "el gimnasio", translation: "gym" },
        { term: "el supermercado", translation: "supermarket" },
      ],
      conversationPrompt:
        "Practice these high-frequency verbs. '¿Adónde vas?' '¿Qué vas a hacer mañana?' Use ir a + infinitive for future plans.",
    },
    {
      id: 15,
      title: "Weather & Seasons",
      level: "elementary",
      focus: "Describing weather",
      grammar: [
        { name: "Weather with hacer", explanation: "Hace frío, hace calor, hace sol" },
        { name: "Weather verbs", explanation: "Llueve (it rains), nieva (it snows)" },
      ],
      vocabulary: [
        { term: "hace calor", translation: "it's hot" },
        { term: "hace frío", translation: "it's cold" },
        { term: "hace sol", translation: "it's sunny" },
        { term: "llueve", translation: "it rains" },
        { term: "nieva", translation: "it snows" },
        { term: "la primavera", translation: "spring" },
        { term: "el verano", translation: "summer" },
        { term: "el otoño", translation: "autumn" },
        { term: "el invierno", translation: "winter" },
      ],
      conversationPrompt:
        "Discuss today's weather and favorite seasons. Practice 'hace + noun' pattern. '¿Qué tiempo hace hoy?'",
    },
    {
      id: 16,
      title: "Describing People",
      level: "elementary",
      focus: "Physical and personality traits",
      grammar: [
        { name: "Ser for traits", explanation: "Permanent characteristics use ser" },
        { name: "Plural adjectives", explanation: "Add -s or -es for plural" },
      ],
      vocabulary: [
        { term: "alto/a", translation: "tall" },
        { term: "bajo/a", translation: "short" },
        { term: "joven", translation: "young" },
        { term: "viejo/a", translation: "old" },
        { term: "guapo/a", translation: "handsome/beautiful" },
        { term: "simpático/a", translation: "nice/friendly" },
        { term: "inteligente", translation: "intelligent" },
        { term: "divertido/a", translation: "fun/funny" },
        { term: "el pelo", translation: "hair" },
        { term: "los ojos", translation: "eyes" },
      ],
      conversationPrompt:
        "Describe people you know. Practice adjective agreement with gender and number. '¿Cómo es tu mejor amigo?'",
    },
    {
      id: 17,
      title: "Daily Routine",
      level: "elementary",
      focus: "Reflexive verbs",
      grammar: [
        { name: "Reflexive pronouns", explanation: "Me, te, se, nos, se" },
        { name: "Reflexive verb conjugation", explanation: "Me levanto, te levantas..." },
      ],
      vocabulary: [
        { term: "despertarse", translation: "to wake up" },
        { term: "levantarse", translation: "to get up" },
        { term: "ducharse", translation: "to shower" },
        { term: "vestirse", translation: "to get dressed" },
        { term: "acostarse", translation: "to go to bed" },
        { term: "dormirse", translation: "to fall asleep" },
        { term: "primero", translation: "first" },
        { term: "después", translation: "then/after" },
        { term: "luego", translation: "later" },
      ],
      conversationPrompt:
        "Walk through a typical day. Explain reflexive as 'doing to yourself'. Practice sequencing with time words.",
    },
    {
      id: 18,
      title: "Places in Town",
      level: "elementary",
      focus: "Location vocabulary and prepositions",
      grammar: [
        { name: "Prepositions of place", explanation: "Cerca de, lejos de, al lado de" },
        { name: "Estar for location", explanation: "El banco está en la calle Main" },
      ],
      vocabulary: [
        { term: "el banco", translation: "bank" },
        { term: "la farmacia", translation: "pharmacy" },
        { term: "el hospital", translation: "hospital" },
        { term: "la estación", translation: "station" },
        { term: "el museo", translation: "museum" },
        { term: "cerca de", translation: "near" },
        { term: "lejos de", translation: "far from" },
        { term: "al lado de", translation: "next to" },
        { term: "enfrente de", translation: "in front of" },
      ],
      conversationPrompt:
        "Practice asking where places are. '¿Dónde está el banco?' 'Está cerca de la farmacia.'",
    },
    {
      id: 19,
      title: "Shopping",
      level: "elementary",
      focus: "Store transactions",
      grammar: [
        { name: "Demonstratives", explanation: "Este/esta (this), ese/esa (that)" },
        { name: "Direct object pronouns intro", explanation: "Lo, la (it)" },
      ],
      vocabulary: [
        { term: "la tienda", translation: "store" },
        { term: "la ropa", translation: "clothes" },
        { term: "la camisa", translation: "shirt" },
        { term: "los pantalones", translation: "pants" },
        { term: "los zapatos", translation: "shoes" },
        { term: "la talla", translation: "size" },
        { term: "caro/a", translation: "expensive" },
        { term: "barato/a", translation: "cheap" },
        { term: "la tarjeta", translation: "card" },
      ],
      conversationPrompt:
        "Role-play shopping. Practice demonstratives: 'Quiero esta camisa.' Handle sizes, prices, payment.",
    },
    {
      id: 20,
      title: "Past Tense: Preterite -AR",
      level: "elementary",
      focus: "Completed past actions",
      grammar: [
        { name: "Preterite -AR endings", explanation: "-é, -aste, -ó, -amos, -aron" },
        { name: "Past time markers", explanation: "Ayer, la semana pasada, el año pasado" },
      ],
      vocabulary: [
        { term: "ayer", translation: "yesterday" },
        { term: "anoche", translation: "last night" },
        { term: "la semana pasada", translation: "last week" },
        { term: "el mes pasado", translation: "last month" },
        { term: "el año pasado", translation: "last year" },
        { term: "hace dos días", translation: "two days ago" },
      ],
      conversationPrompt:
        "Introduce past through 'What did you do yesterday?' Focus on completed actions. Help them discover the pattern.",
    },
    {
      id: 21,
      title: "Past Tense: Preterite -ER/-IR",
      level: "elementary",
      focus: "Completing preterite conjugation",
      grammar: [
        { name: "Preterite -ER/-IR endings", explanation: "-í, -iste, -ió, -imos, -ieron" },
      ],
      vocabulary: [
        { term: "salir", translation: "to leave/go out" },
        { term: "ver", translation: "to see" },
        { term: "conocer", translation: "to meet (first time)" },
        { term: "perder", translation: "to lose" },
        { term: "recibir", translation: "to receive" },
      ],
      conversationPrompt:
        "Build on -AR preterite. Note -ER/-IR share the same endings. Practice narrating past events.",
    },
    {
      id: 22,
      title: "Irregular Preterites",
      level: "elementary",
      focus: "Common irregular past tense verbs",
      grammar: [
        { name: "Ir/Ser preterite", explanation: "Fui, fuiste, fue, fuimos, fueron" },
        { name: "Hacer preterite", explanation: "Hice, hiciste, hizo, hicimos, hicieron" },
        { name: "Tener preterite", explanation: "Tuve, tuviste, tuvo, tuvimos, tuvieron" },
      ],
      vocabulary: [
        { term: "fui", translation: "I went/was" },
        { term: "hice", translation: "I did/made" },
        { term: "tuve", translation: "I had" },
        { term: "el viaje", translation: "trip" },
      ],
      conversationPrompt:
        "Focus on these frequent irregulars through storytelling. '¿Adónde fuiste de vacaciones?' Note ir and ser share past forms.",
    },
    {
      id: 23,
      title: "Travel Vocabulary",
      level: "elementary",
      focus: "Airports, hotels, transportation",
      grammar: [{ name: "Necessity expressions", explanation: "Necesito, tengo que, hay que" }],
      vocabulary: [
        { term: "el aeropuerto", translation: "airport" },
        { term: "el vuelo", translation: "flight" },
        { term: "la maleta", translation: "suitcase" },
        { term: "el pasaporte", translation: "passport" },
        { term: "el hotel", translation: "hotel" },
        { term: "la habitación", translation: "room" },
        { term: "el billete", translation: "ticket" },
        { term: "la reserva", translation: "reservation" },
      ],
      conversationPrompt:
        "Role-play travel situations: checking in, asking for help, booking rooms. Practice necessity phrases.",
    },
    {
      id: 24,
      title: "Elementary Review",
      level: "elementary",
      focus: "Consolidating elementary material",
      grammar: [
        { name: "All elementary grammar", explanation: "Time, irregulars, reflexives, preterite" },
      ],
      vocabulary: [],
      conversationPrompt:
        "Have the student tell a story about a trip or memorable day using preterite. Test comfort with all elementary material.",
    },

    // INTERMEDIATE (25-40)
    {
      id: 25,
      title: "Imperfect Tense Introduction",
      level: "intermediate",
      focus: "Past habits and descriptions",
      grammar: [
        { name: "Imperfect -AR endings", explanation: "-aba, -abas, -aba, -ábamos, -aban" },
        { name: "Imperfect uses", explanation: "Habitual past, descriptions, ongoing states" },
      ],
      vocabulary: [
        { term: "cuando era niño/a", translation: "when I was a child" },
        { term: "siempre", translation: "always" },
        { term: "a menudo", translation: "often" },
        { term: "todos los días", translation: "every day" },
        { term: "antes", translation: "before/in the past" },
      ],
      conversationPrompt:
        "Introduce through childhood memories. 'Cuando era niño, jugaba en el parque.' Focus on habitual/repeated actions.",
    },
    {
      id: 26,
      title: "Imperfect -ER/-IR & Irregulars",
      level: "intermediate",
      focus: "Completing imperfect conjugation",
      grammar: [
        { name: "Imperfect -ER/-IR endings", explanation: "-ía, -ías, -ía, -íamos, -ían" },
        { name: "Imperfect irregulars", explanation: "Ser (era), ir (iba), ver (veía)" },
      ],
      vocabulary: [
        { term: "era", translation: "I/he/she was (ser)" },
        { term: "iba", translation: "I/he/she used to go" },
        { term: "había", translation: "there was/were" },
      ],
      conversationPrompt:
        "Practice -ER/-IR pattern. Only three irregulars to memorize: ser, ir, ver. Continue with memories and descriptions.",
    },
    {
      id: 27,
      title: "Preterite vs Imperfect",
      level: "intermediate",
      focus: "Choosing between past tenses",
      grammar: [
        { name: "Imperfect for background", explanation: "Setting the scene, what was happening" },
        { name: "Preterite for events", explanation: "Completed actions that interrupt" },
      ],
      vocabulary: [
        { term: "mientras", translation: "while" },
        { term: "de repente", translation: "suddenly" },
        { term: "entonces", translation: "then" },
        { term: "en ese momento", translation: "at that moment" },
      ],
      conversationPrompt:
        "Practice combining tenses in stories. 'Mientras dormía, sonó el teléfono.' Imperfect = background, preterite = action.",
    },
    {
      id: 28,
      title: "Direct Object Pronouns",
      level: "intermediate",
      focus: "Replacing nouns with lo/la/los/las",
      grammar: [
        { name: "Direct object pronouns", explanation: "Lo, la, los, las replace direct objects" },
        {
          name: "Pronoun placement",
          explanation: "Before conjugated verb or attached to infinitive",
        },
      ],
      vocabulary: [
        { term: "lo", translation: "it/him (masc)" },
        { term: "la", translation: "it/her (fem)" },
        { term: "los", translation: "them (masc)" },
        { term: "las", translation: "them (fem)" },
      ],
      conversationPrompt:
        "Practice replacing nouns. '¿Tienes el libro?' 'Sí, lo tengo.' Avoid repetition in natural speech.",
    },
    {
      id: 29,
      title: "Indirect Object Pronouns",
      level: "intermediate",
      focus: "Me/te/le/nos/les",
      grammar: [
        { name: "Indirect object pronouns", explanation: "Me, te, le, nos, les (to/for whom)" },
        { name: "Double object pronouns", explanation: "Le/les become se before lo/la" },
      ],
      vocabulary: [
        { term: "me", translation: "to/for me" },
        { term: "te", translation: "to/for you" },
        { term: "le", translation: "to/for him/her/you(formal)" },
        { term: "dar", translation: "to give" },
        { term: "decir", translation: "to say/tell" },
        { term: "mostrar", translation: "to show" },
      ],
      conversationPrompt:
        "Practice with verbs of giving, telling, showing. 'Me das el libro.' 'Te digo la verdad.'",
    },
    {
      id: 30,
      title: "Gustar & Similar Verbs",
      level: "intermediate",
      focus: "Verbs that work like gustar",
      grammar: [
        { name: "Gustar structure", explanation: "A mí me gusta(n), a ti te gusta(n)..." },
        { name: "Similar verbs", explanation: "Encantar, interesar, molestar, importar" },
      ],
      vocabulary: [
        { term: "encantar", translation: "to love (things)" },
        { term: "interesar", translation: "to interest" },
        { term: "molestar", translation: "to bother" },
        { term: "importar", translation: "to matter" },
        { term: "faltar", translation: "to lack/be missing" },
        { term: "doler", translation: "to hurt" },
      ],
      conversationPrompt:
        "Expand beyond gustar. 'Me encanta la música.' 'Me duele la cabeza.' Practice with various subjects.",
    },
    {
      id: 31,
      title: "Comparisons",
      level: "intermediate",
      focus: "Comparing things and people",
      grammar: [
        { name: "Comparatives", explanation: "Más/menos... que (more/less... than)" },
        { name: "Superlatives", explanation: "El/la más... (the most)" },
        { name: "Irregular comparatives", explanation: "Mejor, peor, mayor, menor" },
      ],
      vocabulary: [
        { term: "más que", translation: "more than" },
        { term: "menos que", translation: "less than" },
        { term: "tan... como", translation: "as... as" },
        { term: "mejor", translation: "better" },
        { term: "peor", translation: "worse" },
        { term: "mayor", translation: "older/bigger" },
        { term: "menor", translation: "younger/smaller" },
      ],
      conversationPrompt:
        "Compare things, people, places. 'Madrid es más grande que Barcelona.' Practice irregulars: mejor, peor.",
    },
    {
      id: 32,
      title: "Future Tense",
      level: "intermediate",
      focus: "Simple future",
      grammar: [
        { name: "Future endings", explanation: "-é, -ás, -á, -emos, -án (same for all verbs)" },
        { name: "Future irregulars", explanation: "Tener→tendré, hacer→haré, poder→podré" },
      ],
      vocabulary: [
        { term: "mañana", translation: "tomorrow" },
        { term: "la próxima semana", translation: "next week" },
        { term: "el próximo año", translation: "next year" },
        { term: "algún día", translation: "someday" },
        { term: "pronto", translation: "soon" },
      ],
      conversationPrompt:
        "Discuss future plans and predictions. Note one set of endings for all verbs. Practice common irregulars.",
    },
    {
      id: 33,
      title: "Conditional Tense",
      level: "intermediate",
      focus: "Would/could expressions",
      grammar: [
        { name: "Conditional endings", explanation: "-ía, -ías, -ía, -íamos, -ían" },
        { name: "Conditional uses", explanation: "Hypotheticals, polite requests, probability" },
      ],
      vocabulary: [
        { term: "me gustaría", translation: "I would like" },
        { term: "podría", translation: "could/would be able" },
        { term: "debería", translation: "should" },
        { term: "sería", translation: "would be" },
        { term: "tendría", translation: "would have" },
      ],
      conversationPrompt:
        "Practice polite requests and hypotheticals. '¿Podría ayudarme?' 'Me gustaría viajar a España.'",
    },
    {
      id: 34,
      title: "Commands: Informal",
      level: "intermediate",
      focus: "Tú commands",
      grammar: [
        {
          name: "Affirmative tú commands",
          explanation: "Usually él/ella form (habla, come, escribe)",
        },
        { name: "Negative tú commands", explanation: "No + subjunctive (no hables, no comas)" },
        { name: "Irregular tú commands", explanation: "Ven, ten, pon, sal, di, haz, ve, sé" },
      ],
      vocabulary: [
        { term: "ven", translation: "come (command)" },
        { term: "pon", translation: "put (command)" },
        { term: "di", translation: "say (command)" },
        { term: "haz", translation: "do/make (command)" },
        { term: "sal", translation: "leave (command)" },
      ],
      conversationPrompt:
        "Practice giving informal commands. Note affirmative vs negative difference. Learn the 8 irregular commands.",
    },
    {
      id: 35,
      title: "Commands: Formal",
      level: "intermediate",
      focus: "Usted/ustedes commands",
      grammar: [
        { name: "Usted commands", explanation: "Use subjunctive form (hable, coma, escriba)" },
        { name: "Pronoun attachment", explanation: "Attach to affirmative, separate for negative" },
      ],
      vocabulary: [
        { term: "perdone", translation: "excuse me (formal)" },
        { term: "espere", translation: "wait (formal)" },
        { term: "siga", translation: "continue/follow (formal)" },
        { term: "tenga cuidado", translation: "be careful" },
      ],
      conversationPrompt:
        "Practice formal commands for service situations. 'Espere aquí, por favor.' Note object pronoun placement.",
    },
    {
      id: 36,
      title: "Subjunctive Introduction",
      level: "intermediate",
      focus: "Present subjunctive basics",
      grammar: [
        { name: "Subjunctive formation", explanation: "Opposite vowel: -AR→-e, -ER/-IR→-a" },
        {
          name: "WEIRDO triggers",
          explanation: "Wishes, Emotion, Impersonal, Requests, Doubt, Ojalá",
        },
      ],
      vocabulary: [
        { term: "quiero que", translation: "I want (someone) to" },
        { term: "espero que", translation: "I hope that" },
        { term: "ojalá", translation: "hopefully/I wish" },
        { term: "es importante que", translation: "it's important that" },
      ],
      conversationPrompt:
        "Introduce through wishes and hopes. 'Quiero que vengas.' 'Espero que estés bien.' Focus on the trigger + que + subjunctive pattern.",
    },
    {
      id: 37,
      title: "Subjunctive: Doubt & Denial",
      level: "intermediate",
      focus: "Subjunctive with uncertainty",
      grammar: [
        { name: "Doubt expressions", explanation: "Dudo que, no creo que, no pienso que" },
        {
          name: "Negated belief",
          explanation: "No creo que + subjunctive vs Creo que + indicative",
        },
      ],
      vocabulary: [
        { term: "dudo que", translation: "I doubt that" },
        { term: "no creo que", translation: "I don't think that" },
        { term: "es posible que", translation: "it's possible that" },
        { term: "no es verdad que", translation: "it's not true that" },
        { term: "quizás", translation: "maybe/perhaps" },
      ],
      conversationPrompt:
        "Practice expressing doubt and uncertainty. Note 'creo que' uses indicative but 'no creo que' uses subjunctive.",
    },
    {
      id: 38,
      title: "Subjunctive: Emotion",
      level: "intermediate",
      focus: "Subjunctive with feelings",
      grammar: [
        { name: "Emotion triggers", explanation: "Me alegra que, siento que, es triste que" },
      ],
      vocabulary: [
        { term: "me alegra que", translation: "I'm glad that" },
        { term: "siento que", translation: "I'm sorry that" },
        { term: "me sorprende que", translation: "it surprises me that" },
        { term: "es una lástima que", translation: "it's a shame that" },
        { term: "me molesta que", translation: "it bothers me that" },
      ],
      conversationPrompt:
        "Express emotions about situations. 'Me alegra que estés aquí.' Practice various emotion verbs.",
    },
    {
      id: 39,
      title: "Por vs Para",
      level: "intermediate",
      focus: "Distinguishing these prepositions",
      grammar: [
        { name: "Por uses", explanation: "Duration, exchange, through, by means of, because of" },
        { name: "Para uses", explanation: "Destination, purpose, deadline, recipient, comparison" },
      ],
      vocabulary: [
        { term: "por la mañana", translation: "in the morning" },
        { term: "por eso", translation: "that's why" },
        { term: "gracias por", translation: "thanks for" },
        { term: "para mí", translation: "for me" },
        { term: "para siempre", translation: "forever" },
      ],
      conversationPrompt:
        "Practice through context. Por = exchange/cause/duration. Para = purpose/destination/deadline. Use lots of examples.",
    },
    {
      id: 40,
      title: "Intermediate Review",
      level: "intermediate",
      focus: "Consolidating intermediate material",
      grammar: [
        {
          name: "All intermediate grammar",
          explanation: "Both pasts, pronouns, future, conditional, subjunctive basics",
        },
      ],
      vocabulary: [],
      conversationPrompt:
        "Extended conversation using all intermediate grammar. Tell stories with proper past tense usage, express opinions with subjunctive.",
    },

    // UPPER INTERMEDIATE (41-52)
    {
      id: 41,
      title: "Perfect Tenses: Present Perfect",
      level: "upper_intermediate",
      focus: "Have done something",
      grammar: [
        {
          name: "Present perfect",
          explanation: "Haber (he, has, ha, hemos, han) + past participle",
        },
        { name: "Past participle formation", explanation: "-AR→-ado, -ER/-IR→-ido" },
        {
          name: "Irregular participles",
          explanation: "Hecho, dicho, visto, escrito, abierto, puesto",
        },
      ],
      vocabulary: [
        { term: "he comido", translation: "I have eaten" },
        { term: "has visto", translation: "you have seen" },
        { term: "hemos hecho", translation: "we have done" },
        { term: "todavía no", translation: "not yet" },
        { term: "ya", translation: "already" },
        { term: "alguna vez", translation: "ever" },
        { term: "nunca", translation: "never" },
      ],
      conversationPrompt:
        "Discuss experiences. '¿Has visitado España alguna vez?' Practice irregular participles through conversation.",
    },
    {
      id: 42,
      title: "Perfect Tenses: Pluperfect",
      level: "upper_intermediate",
      focus: "Had done something",
      grammar: [
        { name: "Pluperfect", explanation: "Había + past participle (had done)" },
        { name: "Sequencing past events", explanation: "What happened before another past event" },
      ],
      vocabulary: [
        { term: "había terminado", translation: "I had finished" },
        { term: "antes de que", translation: "before" },
        { term: "cuando llegué", translation: "when I arrived" },
        { term: "ya había", translation: "had already" },
      ],
      conversationPrompt:
        "Practice sequencing past events. 'Cuando llegué, ya habían comido.' Narrate complex stories.",
    },
    {
      id: 43,
      title: "Subjunctive: Adjective Clauses",
      level: "upper_intermediate",
      focus: "Subjunctive for unknown/nonexistent things",
      grammar: [
        { name: "Unknown antecedent", explanation: "Busco alguien que hable español" },
        { name: "Nonexistent antecedent", explanation: "No hay nadie que pueda ayudarme" },
      ],
      vocabulary: [
        { term: "busco... que", translation: "I'm looking for... that" },
        { term: "necesito... que", translation: "I need... that" },
        { term: "no hay nadie que", translation: "there's no one who" },
        { term: "no conozco a nadie que", translation: "I don't know anyone who" },
      ],
      conversationPrompt:
        "Practice describing what you're looking for. 'Busco un apartamento que tenga balcón.' vs 'Tengo un apartamento que tiene balcón.'",
    },
    {
      id: 44,
      title: "Subjunctive: Adverbial Clauses",
      level: "upper_intermediate",
      focus: "Time and purpose clauses",
      grammar: [
        { name: "Always subjunctive", explanation: "Para que, antes de que, sin que, a menos que" },
        {
          name: "Depends on future/uncertainty",
          explanation: "Cuando, hasta que, tan pronto como",
        },
      ],
      vocabulary: [
        { term: "para que", translation: "so that" },
        { term: "antes de que", translation: "before" },
        { term: "sin que", translation: "without" },
        { term: "a menos que", translation: "unless" },
        { term: "cuando", translation: "when (future)" },
        { term: "hasta que", translation: "until" },
      ],
      conversationPrompt:
        "Practice future scenarios. 'Cuando llegues, llámame.' 'Te ayudaré para que aprendas.' Note cuando + subjunctive for future.",
    },
    {
      id: 45,
      title: "Si Clauses: Present",
      level: "upper_intermediate",
      focus: "If/then statements (real conditions)",
      grammar: [
        { name: "Real conditions", explanation: "Si + present, present/future" },
        { name: "Habitual conditions", explanation: "Si + present, present" },
      ],
      vocabulary: [
        { term: "si tengo tiempo", translation: "if I have time" },
        { term: "si llueve", translation: "if it rains" },
        { term: "si quieres", translation: "if you want" },
      ],
      conversationPrompt:
        "Practice real conditions. 'Si tengo tiempo, iré.' vs 'Si tengo tiempo, voy.' Discuss habits and future possibilities.",
    },
    {
      id: 46,
      title: "Si Clauses: Contrary to Fact",
      level: "upper_intermediate",
      focus: "Hypothetical/unreal conditions",
      grammar: [
        { name: "Imperfect subjunctive", explanation: "Si + imperfect subjunctive, conditional" },
        { name: "Imperfect subjunctive formation", explanation: "Preterite stem + -ra endings" },
      ],
      vocabulary: [
        { term: "si tuviera", translation: "if I had" },
        { term: "si pudiera", translation: "if I could" },
        { term: "si fuera", translation: "if I were" },
        { term: "haría", translation: "I would do" },
        { term: "sería", translation: "I would be" },
      ],
      conversationPrompt:
        "Discuss hypotheticals. 'Si tuviera más dinero, viajaría más.' 'Si fuera tú, estudiaría más.'",
    },
    {
      id: 47,
      title: "Passive Voice",
      level: "upper_intermediate",
      focus: "Ser + past participle and se constructions",
      grammar: [
        { name: "True passive", explanation: "Ser + past participle (+ por)" },
        { name: "Se passive", explanation: "Se + verb (more common in Spanish)" },
      ],
      vocabulary: [
        { term: "fue construido", translation: "was built" },
        { term: "se habla", translation: "is spoken" },
        { term: "se vende", translation: "is sold / for sale" },
        { term: "se dice", translation: "it is said" },
        { term: "se puede", translation: "one can / it's possible" },
      ],
      conversationPrompt:
        "Practice passive constructions. 'El libro fue escrito por Cervantes.' 'Aquí se habla español.' Note se passive is more natural.",
    },
    {
      id: 48,
      title: "Relative Pronouns",
      level: "upper_intermediate",
      focus: "Que, quien, el cual, cuyo",
      grammar: [
        { name: "Que", explanation: "Most common relative pronoun (that/which/who)" },
        { name: "Quien/es", explanation: "For people, especially after prepositions" },
        { name: "El cual/la cual", explanation: "Formal, clarifies gender/number" },
        { name: "Cuyo/a", explanation: "Whose (agrees with possessed noun)" },
      ],
      vocabulary: [
        { term: "que", translation: "that/which/who" },
        { term: "quien", translation: "who (after preposition)" },
        { term: "lo que", translation: "what/that which" },
        { term: "cuyo", translation: "whose" },
      ],
      conversationPrompt:
        "Practice connecting ideas. 'El libro que leí...' 'La persona con quien hablé...' 'Lo que necesito es...'",
    },
    {
      id: 49,
      title: "Reported Speech",
      level: "upper_intermediate",
      focus: "Indirect discourse",
      grammar: [
        { name: "Backshift in reporting", explanation: "Present→imperfect, preterite→pluperfect" },
        { name: "Reporting verbs", explanation: "Dijo que, me preguntó si, me contó que" },
      ],
      vocabulary: [
        { term: "dijo que", translation: "said that" },
        { term: "me preguntó si", translation: "asked me if" },
        { term: "me contó que", translation: "told me that" },
        { term: "según", translation: "according to" },
      ],
      conversationPrompt:
        "Practice reporting what others said. 'María dijo que vendría.' 'Me preguntó si hablaba español.'",
    },
    {
      id: 50,
      title: "Pero vs Sino",
      level: "upper_intermediate",
      focus: "Distinguishing 'but' expressions",
      grammar: [
        { name: "Pero", explanation: "But (general contrast)" },
        { name: "Sino", explanation: "But rather (after negative, correcting)" },
        { name: "Sino que", explanation: "But rather + conjugated verb" },
      ],
      vocabulary: [
        { term: "pero", translation: "but" },
        { term: "sino", translation: "but rather" },
        { term: "sino que", translation: "but rather (+ verb)" },
        { term: "no solo... sino también", translation: "not only... but also" },
      ],
      conversationPrompt:
        "Practice the distinction. 'No es caro, sino barato.' 'Tengo hambre, pero no voy a comer.' 'No solo habla español, sino que también habla francés.'",
    },
    {
      id: 51,
      title: "Conjunctions & Connectors",
      level: "upper_intermediate",
      focus: "Complex sentence connectors",
      grammar: [
        { name: "Causal", explanation: "Porque, ya que, puesto que, como" },
        { name: "Concessive", explanation: "Aunque, a pesar de que, sin embargo" },
        { name: "Consecutive", explanation: "Por lo tanto, así que, por eso" },
      ],
      vocabulary: [
        { term: "aunque", translation: "although/even if" },
        { term: "sin embargo", translation: "however" },
        { term: "por lo tanto", translation: "therefore" },
        { term: "a pesar de", translation: "despite" },
        { term: "ya que", translation: "since/because" },
        { term: "así que", translation: "so/therefore" },
      ],
      conversationPrompt:
        "Practice building complex arguments. Use connectors to express cause, concession, and consequence in extended speech.",
    },
    {
      id: 52,
      title: "Upper Intermediate Review",
      level: "upper_intermediate",
      focus: "Consolidating upper intermediate",
      grammar: [
        {
          name: "All upper intermediate grammar",
          explanation:
            "Perfect tenses, advanced subjunctive, si clauses, passive, relative pronouns",
        },
      ],
      vocabulary: [],
      conversationPrompt:
        "Engage in complex discussion. Express hypotheticals, report what others said, make sophisticated arguments. Assess readiness for advanced level.",
    },

    // ADVANCED (53-60)
    {
      id: 53,
      title: "Past Subjunctive in Depth",
      level: "advanced",
      focus: "Imperfect subjunctive nuances",
      grammar: [
        { name: "-ra vs -se forms", explanation: "Both correct: hablara/hablase, comiera/comiese" },
        {
          name: "Past subjunctive uses",
          explanation: "After past tense triggers, politeness, hypotheticals",
        },
      ],
      vocabulary: [
        { term: "quisiera", translation: "I would like (polite)" },
        { term: "pudiera", translation: "might/could" },
        { term: "como si", translation: "as if" },
      ],
      conversationPrompt:
        "Practice nuanced uses of past subjunctive. 'Actúa como si no supiera nada.' 'Quisiera pedirle un favor.'",
    },
    {
      id: 54,
      title: "Perfect Subjunctive",
      level: "advanced",
      focus: "Haya + participle",
      grammar: [
        { name: "Present perfect subjunctive", explanation: "Haya + past participle" },
        { name: "Pluperfect subjunctive", explanation: "Hubiera/hubiese + past participle" },
      ],
      vocabulary: [
        { term: "espero que haya llegado", translation: "I hope (that) he has arrived" },
        { term: "dudo que hayan terminado", translation: "I doubt they have finished" },
        { term: "si hubiera sabido", translation: "if I had known" },
        { term: "ojalá hubiera venido", translation: "I wish he had come" },
      ],
      conversationPrompt:
        "Practice perfect subjunctive in complex sentences. 'Me alegro de que hayas venido.' 'Si hubiera sabido, habría venido antes.'",
    },
    {
      id: 55,
      title: "Conditional Perfect",
      level: "advanced",
      focus: "Would have done",
      grammar: [
        { name: "Formation", explanation: "Habría + past participle" },
        {
          name: "Past hypotheticals",
          explanation: "Si + pluperfect subjunctive, conditional perfect",
        },
      ],
      vocabulary: [
        { term: "habría dicho", translation: "would have said" },
        { term: "habrían venido", translation: "they would have come" },
        { term: "de haber sabido", translation: "had I known" },
      ],
      conversationPrompt:
        "Discuss past hypotheticals. 'Si hubiera estudiado más, habría aprobado.' 'De haberlo sabido, no habría venido.'",
    },
    {
      id: 56,
      title: "Formal & Professional Spanish",
      level: "advanced",
      focus: "Business and academic register",
      grammar: [
        { name: "Formal register", explanation: "Usted/ustedes, subjunctive for politeness" },
        { name: "Professional phrases", explanation: "Business correspondence conventions" },
      ],
      vocabulary: [
        { term: "le agradecería que", translation: "I would appreciate it if you" },
        { term: "tenga la amabilidad de", translation: "please be so kind as to" },
        { term: "estimado/a", translation: "dear (formal)" },
        { term: "atentamente", translation: "sincerely" },
        { term: "le saluda atentamente", translation: "yours faithfully" },
        { term: "en relación con", translation: "regarding" },
      ],
      conversationPrompt:
        "Practice formal correspondence and professional situations. Role-play job interviews, business meetings, formal complaints.",
    },
    {
      id: 57,
      title: "Idioms & Fixed Expressions",
      level: "advanced",
      focus: "Common Spanish idioms",
      grammar: [
        {
          name: "Idiomatic structures",
          explanation: "Fixed phrases that don't translate literally",
        },
      ],
      vocabulary: [
        { term: "meter la pata", translation: "to put your foot in it" },
        { term: "estar en las nubes", translation: "to have your head in the clouds" },
        { term: "costar un ojo de la cara", translation: "to cost an arm and a leg" },
        { term: "no tener pelos en la lengua", translation: "to be outspoken" },
        { term: "tirar la casa por la ventana", translation: "to spare no expense" },
        { term: "ponerse las pilas", translation: "to get one's act together" },
        { term: "tomar el pelo", translation: "to pull someone's leg" },
        { term: "dar en el clavo", translation: "to hit the nail on the head" },
      ],
      conversationPrompt:
        "Explore idioms through context. Discuss when and how to use them naturally. Practice incorporating them into conversation.",
    },
    {
      id: 58,
      title: "Regional Variations",
      level: "advanced",
      focus: "Spanish across different countries",
      grammar: [
        { name: "Voseo", explanation: "Vos instead of tú (Argentina, Central America)" },
        {
          name: "Ustedes vs vosotros",
          explanation: "Latin America uses ustedes for all plural you",
        },
      ],
      vocabulary: [
        { term: "coche/carro/auto", translation: "car (Spain/Mexico/Argentina)" },
        { term: "ordenador/computadora", translation: "computer (Spain/Latin America)" },
        { term: "vale/órale/dale", translation: "ok (Spain/Mexico/Argentina)" },
        { term: "vos tenés", translation: "you have (voseo)" },
        { term: "vos hablás", translation: "you speak (voseo)" },
      ],
      conversationPrompt:
        "Discuss variations across Spanish-speaking world. Practice understanding different accents and vocabulary. Focus on major regional differences.",
    },
    {
      id: 59,
      title: "Nuanced Expression",
      level: "advanced",
      focus: "Precise and sophisticated language",
      grammar: [
        {
          name: "Diminutives and augmentatives",
          explanation: "-ito/ita, -ón/ona for size and affect",
        },
        { name: "Softening and hedging", explanation: "Making statements less direct" },
      ],
      vocabulary: [
        { term: "un momentito", translation: "a little moment" },
        { term: "cerquita", translation: "nice and close" },
        { term: "grandote", translation: "really big" },
        { term: "digamos que", translation: "let's say that" },
        { term: "en cierto modo", translation: "in a way" },
        { term: "me parece que", translation: "it seems to me that" },
      ],
      conversationPrompt:
        "Practice expressing nuance. Use diminutives for affection, hedging for politeness. Develop sophisticated expression.",
    },
    {
      id: 60,
      title: "Advanced Review & Mastery",
      level: "advanced",
      focus: "Full language proficiency",
      grammar: [{ name: "All Spanish grammar", explanation: "Complete grammatical mastery" }],
      vocabulary: [],
      conversationPrompt:
        "Engage in completely natural conversation on any topic. Discuss complex issues, use idioms naturally, demonstrate full proficiency. Celebrate their achievement!",
    },
  ],
};
