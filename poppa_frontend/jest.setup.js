// jest.setup.js

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: "/",
    route: "/",
    asPath: "/",
    query: {},
  })),
}));

// Mock Next.js navigation (for App Router)
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: "/",
    // Add other router methods if your components use them
  })),
  usePathname: jest.fn(() => "/"), // Default pathname
  useSearchParams: jest.fn(() => ({ get: jest.fn() })), // Default searchParams
}));

// Mock Supabase client (server-side)
const createMockQueryBuilder = () => {
  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  };
  return mockQueryBuilder;
};

const mockSupabaseClient = {
  from: jest.fn(() => createMockQueryBuilder()),
  rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } },
    })),
    getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
  },
};

jest.mock("@/lib/supabase", () => ({
  __esModule: true,
  default: mockSupabaseClient,
}));

jest.mock("@/lib/supabase-browser", () => ({
  __esModule: true,
  supabaseBrowserClient: mockSupabaseClient,
}));

// Mock Stripe SDK
jest.mock("stripe", () => {
  const mockStripe = {
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    billingPortal: {
      sessions: {
        create: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
    // Add other Stripe methods you might use
  };
  return jest.fn(() => mockStripe); // The default export is a function that returns the Stripe object
});

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
  useLocale: () => "en",
  useMessages: () => ({}),
  useTimeZone: () => "UTC",
  useNow: () => new Date(),
  useFormatter: () => ({
    number: jest.fn(),
    dateTime: jest.fn(),
    relativeTime: jest.fn(),
  }),
}));

// Set up mock environment variables
process.env.STRIPE_SECRET_KEY = "sk_test_mock";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_mock";
process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY = "price_hobby_mock";
process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO = "price_pro_mock";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.ELEVENLABS_WEBHOOK_SECRET = "el_whsec_test_mock";
process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID = "agent_id_mock";
// Add any other environment variables your application relies on

// You can also add any other global setup here, like:
// - Mocking `fetch` globally if needed
// - Setting up a mock date/time

// Example of mocking fetch:
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({}),
//   })
// );

// Clear all mocks before each test to ensure test isolation
// This is handled by `clearMocks: true` in jest.config.js, but shown here for awareness
// afterEach(() => {
//   jest.clearAllMocks();
// });
