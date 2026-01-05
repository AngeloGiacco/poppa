describe("Supabase Client", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should throw error when environment variables are missing", () => {
    const originalEnv = process.env;
    process.env = { ...originalEnv };
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    expect(() => {
      require("@/lib/supabase");
    }).toThrow("EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY must be set");

    process.env = originalEnv;
  });
});
