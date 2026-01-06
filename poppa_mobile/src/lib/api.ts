const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://trypoppa.com";

interface LessonParams {
  targetLanguage: string;
  nativeLanguage: string;
  userId: string;
  lessonHistory?: string[];
}

interface GenerateLessonResponse {
  instruction: string;
  error?: string;
}

export async function generateLesson(params: LessonParams): Promise<GenerateLessonResponse> {
  const response = await fetch(`${API_BASE_URL}/api/generate-lesson`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate lesson: ${response.statusText}`);
  }

  return response.json() as Promise<GenerateLessonResponse>;
}

interface AddLanguageParams {
  userId: string;
  languageCode: string;
}

export async function addLanguage(params: AddLanguageParams): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/language/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to add language: ${response.statusText}`);
  }
}
