/**
 * Tests for Memory API Routes
 * Tests the API layer that wraps the memory library functions
 */

import { createMockLessonContext } from "../__mocks__/test-helpers";
import * as contextGenerator from "../context-generator";
import * as nlQuery from "../natural-language-query";
import * as promptBuilder from "../prompt-builder";
import * as realtimeQueries from "../realtime-queries";
import * as sessionProcessor from "../session-processor";

// Mock the context generator
jest.mock("../context-generator", () => ({
  generateLessonContext: jest.fn(),
}));

// Mock the prompt builder
jest.mock("../prompt-builder", () => ({
  buildTutorPrompt: jest.fn(),
}));

// Mock the realtime queries
jest.mock("../realtime-queries", () => ({
  checkVocabularyHistory: jest.fn(),
  getVocabularyDueForReview: jest.fn(),
  getGrammarDueForReview: jest.fn(),
  getLastSessionSummary: jest.fn(),
  getVocabularyStrugglePoints: jest.fn(),
  getGrammarStrugglePoints: jest.fn(),
  getRelatedVocabulary: jest.fn(),
}));

// Mock the natural language query
jest.mock("../natural-language-query", () => ({
  queryMemoryNaturalLanguage: jest.fn(),
}));

// Mock the session processor
jest.mock("../session-processor", () => ({
  createLessonSession: jest.fn(),
  endLessonSession: jest.fn(),
  processSessionTranscript: jest.fn(),
}));

// Mock the embeddings module
jest.mock("../embeddings", () => ({
  embedSession: jest.fn().mockResolvedValue(undefined),
}));

// Mock supabase
jest.mock("@/lib/supabase", () => ({
  __esModule: true,
  default: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

// We need to import the route handlers - these would be in actual API routes
// For testing purposes, we'll mock the Request and Response objects

describe("Memory API Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/memory/context", () => {
    const createContextRequest = (body: object) =>
      new Request("http://localhost/api/memory/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    it("should return 400 when userId is missing", async () => {
      // Import the route handler
      const { POST } = await import("@/app/api/memory/context/route");

      const req = createContextRequest({ languageCode: "spa" });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });

    it("should return 400 when languageCode is missing", async () => {
      const { POST } = await import("@/app/api/memory/context/route");

      const req = createContextRequest({ userId: "user-1" });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });

    it("should generate context and tutor prompt", async () => {
      const { POST } = await import("@/app/api/memory/context/route");

      const mockContext = createMockLessonContext();
      const mockPrompt = "You are tutoring Maria in Spanish...";

      (contextGenerator.generateLessonContext as jest.Mock).mockResolvedValue(mockContext);
      (promptBuilder.buildTutorPrompt as jest.Mock).mockReturnValue(mockPrompt);

      const req = createContextRequest({
        userId: "user-1",
        languageCode: "spa",
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.context).toBeDefined();
      expect(data.tutorPrompt).toBe(mockPrompt);
      expect(contextGenerator.generateLessonContext).toHaveBeenCalledWith(
        "user-1",
        "spa",
        expect.any(Object)
      );
    });

    it("should pass options to context generator", async () => {
      const { POST } = await import("@/app/api/memory/context/route");

      (contextGenerator.generateLessonContext as jest.Mock).mockResolvedValue(
        createMockLessonContext()
      );
      (promptBuilder.buildTutorPrompt as jest.Mock).mockReturnValue("");

      const req = createContextRequest({
        userId: "user-1",
        languageCode: "spa",
        options: {
          useCurriculum: true,
          customTopic: "Food vocabulary",
          sessionType: "lesson",
          lessonId: 5,
        },
      });
      await POST(req);

      expect(contextGenerator.generateLessonContext).toHaveBeenCalledWith(
        "user-1",
        "spa",
        expect.objectContaining({
          useCurriculum: true,
          customTopic: "Food vocabulary",
          sessionType: "lesson",
          lessonId: 5,
        })
      );
    });

    it("should return 500 on internal error", async () => {
      const { POST } = await import("@/app/api/memory/context/route");

      (contextGenerator.generateLessonContext as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const req = createContextRequest({
        userId: "user-1",
        languageCode: "spa",
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Failed");
    });
  });

  describe("POST /api/memory/query", () => {
    const createQueryRequest = (body: object) =>
      new Request("http://localhost/api/memory/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    it("should return 400 when required fields are missing", async () => {
      const { POST } = await import("@/app/api/memory/query/route");

      const req = createQueryRequest({ userId: "user-1" });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });

    it("should handle check_vocabulary query", async () => {
      const { POST } = await import("@/app/api/memory/query/route");

      (realtimeQueries.checkVocabularyHistory as jest.Mock).mockResolvedValue({
        seen: true,
        mastery: 0.75,
        lastSeen: new Date().toISOString(),
        errorPatterns: [],
      });

      const req = createQueryRequest({
        userId: "user-1",
        languageCode: "spa",
        queryType: "check_vocabulary",
        params: { term: "hola" },
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.result.seen).toBe(true);
      expect(data.result.mastery).toBe(0.75);
    });

    it("should return 400 when term is missing for check_vocabulary", async () => {
      const { POST } = await import("@/app/api/memory/query/route");

      const req = createQueryRequest({
        userId: "user-1",
        languageCode: "spa",
        queryType: "check_vocabulary",
        params: {},
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("term");
    });

    it("should handle get_review_items query", async () => {
      const { POST } = await import("@/app/api/memory/query/route");

      (realtimeQueries.getVocabularyDueForReview as jest.Mock).mockResolvedValue([
        { term: "revisar" },
      ]);
      (realtimeQueries.getGrammarDueForReview as jest.Mock).mockResolvedValue([
        { concept_name: "past_tense" },
      ]);

      const req = createQueryRequest({
        userId: "user-1",
        languageCode: "spa",
        queryType: "get_review_items",
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.result.vocabulary.length).toBe(1);
      expect(data.result.grammar.length).toBe(1);
    });

    it("should handle get_last_session query", async () => {
      const { POST } = await import("@/app/api/memory/query/route");

      (realtimeQueries.getLastSessionSummary as jest.Mock).mockResolvedValue({
        summary: "Practiced greetings",
        vocabularyCovered: ["hola"],
        grammarCovered: [],
      });

      const req = createQueryRequest({
        userId: "user-1",
        languageCode: "spa",
        queryType: "get_last_session",
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.result.summary).toBe("Practiced greetings");
    });

    it("should handle get_struggling_areas query", async () => {
      const { POST } = await import("@/app/api/memory/query/route");

      (realtimeQueries.getVocabularyStrugglePoints as jest.Mock).mockResolvedValue([
        { term: "difícil" },
      ]);
      (realtimeQueries.getGrammarStrugglePoints as jest.Mock).mockResolvedValue([
        { concept_name: "subjunctive" },
      ]);

      const req = createQueryRequest({
        userId: "user-1",
        languageCode: "spa",
        queryType: "get_struggling_areas",
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.result.vocabulary.length).toBe(1);
      expect(data.result.grammar.length).toBe(1);
    });

    it("should handle get_related_vocabulary query", async () => {
      const { POST } = await import("@/app/api/memory/query/route");

      (realtimeQueries.getRelatedVocabulary as jest.Mock).mockResolvedValue([
        { term: "perro", category: "animals" },
        { term: "gato", category: "animals" },
      ]);

      const req = createQueryRequest({
        userId: "user-1",
        languageCode: "spa",
        queryType: "get_related_vocabulary",
        params: { category: "animals" },
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.result.length).toBe(2);
    });

    it("should return 400 when category is missing for get_related_vocabulary", async () => {
      const { POST } = await import("@/app/api/memory/query/route");

      const req = createQueryRequest({
        userId: "user-1",
        languageCode: "spa",
        queryType: "get_related_vocabulary",
        params: {},
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("category");
    });

    it("should handle natural_language query", async () => {
      const { POST } = await import("@/app/api/memory/query/route");

      (nlQuery.queryMemoryNaturalLanguage as jest.Mock).mockResolvedValue({
        answer: "The student has been practicing for 2 weeks.",
        confidence: 0.85,
      });

      const req = createQueryRequest({
        userId: "user-1",
        languageCode: "spa",
        queryType: "natural_language",
        params: { query: "How long has the student been practicing?" },
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.result.answer).toContain("2 weeks");
    });

    it("should return 400 when query is missing for natural_language", async () => {
      const { POST } = await import("@/app/api/memory/query/route");

      const req = createQueryRequest({
        userId: "user-1",
        languageCode: "spa",
        queryType: "natural_language",
        params: {},
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("query");
    });

    it("should return 400 for unknown query type", async () => {
      const { POST } = await import("@/app/api/memory/query/route");

      const req = createQueryRequest({
        userId: "user-1",
        languageCode: "spa",
        queryType: "unknown_type",
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Unknown query type");
    });

    it("should return 500 on internal error", async () => {
      const { POST } = await import("@/app/api/memory/query/route");

      (realtimeQueries.checkVocabularyHistory as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const req = createQueryRequest({
        userId: "user-1",
        languageCode: "spa",
        queryType: "check_vocabulary",
        params: { term: "hola" },
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Failed");
    });
  });

  describe("POST /api/memory/session", () => {
    const createSessionRequest = (body: object) =>
      new Request("http://localhost/api/memory/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    it("should create a new session", async () => {
      const { POST } = await import("@/app/api/memory/session/route");

      (sessionProcessor.createLessonSession as jest.Mock).mockResolvedValue({
        id: "session-123",
        user_id: "user-1",
        language_code: "spa",
      });

      const req = createSessionRequest({
        action: "create",
        userId: "user-1",
        languageCode: "spa",
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.session.id).toBe("session-123");
      expect(sessionProcessor.createLessonSession).toHaveBeenCalledWith({
        userId: "user-1",
        languageCode: "spa",
      });
    });

    it("should end a session", async () => {
      const { POST } = await import("@/app/api/memory/session/route");

      (sessionProcessor.endLessonSession as jest.Mock).mockResolvedValue(undefined);

      const req = createSessionRequest({
        action: "end",
        sessionId: "session-123",
        durationSeconds: 300,
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(sessionProcessor.endLessonSession).toHaveBeenCalledWith("session-123", 300);
    });

    it("should return 400 for missing action", async () => {
      const { POST } = await import("@/app/api/memory/session/route");

      const req = createSessionRequest({
        userId: "user-1",
        languageCode: "spa",
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("action");
    });

    it("should return 400 for unknown action", async () => {
      const { POST } = await import("@/app/api/memory/session/route");

      const req = createSessionRequest({
        action: "unknown",
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Unknown action");
    });
  });

  describe("POST /api/memory/event", () => {
    const createEventRequest = (body: object) =>
      new Request("http://localhost/api/memory/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    it("should record a concept event", async () => {
      const { POST } = await import("@/app/api/memory/event/route");

      // Mock the supabase chain
      const supabaseClient = (await import("@/lib/supabase")).default;
      const mockChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: "event-1", event_type: "correct" },
          error: null,
        }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const req = createEventRequest({
        userId: "user-1",
        sessionId: "session-1",
        languageCode: "spa",
        eventType: "correct",
        conceptType: "vocabulary",
        conceptIdentifier: "hola",
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.event).toBeDefined();
      expect(data.qualityScore).toBeDefined();
    });

    it("should return 400 for missing required fields", async () => {
      const { POST } = await import("@/app/api/memory/event/route");

      const req = createEventRequest({
        userId: "user-1",
        // Missing other required fields
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });
  });

  describe("GET /api/memory/progress", () => {
    const createProgressGetRequest = (userId: string, languageCode?: string) => {
      const url = languageCode
        ? `http://localhost/api/memory/progress?userId=${userId}&languageCode=${languageCode}`
        : `http://localhost/api/memory/progress?userId=${userId}`;
      return new Request(url, { method: "GET" });
    };

    it("should return progress for user and language", async () => {
      const { GET } = await import("@/app/api/memory/progress/route");

      // Mock the supabase chain for getting specific language progress
      const supabaseClient = (await import("@/lib/supabase")).default;
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { language_code: "spa", proficiency_level: "beginner" },
          error: null,
        }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const req = createProgressGetRequest("user-1", "spa");
      const response = await GET(req);

      expect(response.status).toBe(200);
    });

    it("should return all progress when languageCode is omitted", async () => {
      const { GET } = await import("@/app/api/memory/progress/route");

      // Mock the supabase chain for getting all progress
      const supabaseClient = (await import("@/lib/supabase")).default;
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [{ language_code: "spa" }, { language_code: "fra" }],
          error: null,
        }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const req = createProgressGetRequest("user-1");
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.progress).toBeDefined();
    });

    it("should return 400 for missing userId", async () => {
      const { GET } = await import("@/app/api/memory/progress/route");

      const req = new Request("http://localhost/api/memory/progress", {
        method: "GET",
      });
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required");
    });
  });

  describe("POST /api/memory/process-session", () => {
    const createProcessRequest = (body: object) =>
      new Request("http://localhost/api/memory/process-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    it("should process a session transcript", async () => {
      const { POST } = await import("@/app/api/memory/process-session/route");

      (sessionProcessor.processSessionTranscript as jest.Mock).mockResolvedValue({
        vocabularyEvents: [],
        grammarEvents: [],
        summary: "Good session",
        highlights: [],
        recommendations: {},
      });

      const req = createProcessRequest({
        sessionId: "session-1",
        userId: "user-1",
        languageCode: "spa",
        conversationId: "conv-1",
        transcript: [
          { role: "agent", message: "Hello", time_in_call_secs: 0 },
          { role: "user", message: "Hola", time_in_call_secs: 2 },
        ],
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should return 400 for missing required fields", async () => {
      const { POST } = await import("@/app/api/memory/process-session/route");

      const req = createProcessRequest({
        sessionId: "session-1",
        // Missing other fields
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });

    it("should return 500 on processing error", async () => {
      const { POST } = await import("@/app/api/memory/process-session/route");

      (sessionProcessor.processSessionTranscript as jest.Mock).mockRejectedValue(
        new Error("Processing failed")
      );

      const req = createProcessRequest({
        sessionId: "session-1",
        userId: "user-1",
        languageCode: "spa",
        conversationId: "conv-1",
        transcript: [],
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Failed");
    });
  });
});
