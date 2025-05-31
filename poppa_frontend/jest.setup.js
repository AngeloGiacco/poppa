// jest.setup.js

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
  })),
}));

// Mock Next.js navigation (for App Router)
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
    // Add other router methods if your components use them
  })),
  usePathname: jest.fn(() => '/'), // Default pathname
  useSearchParams: jest.fn(() => ({ get: jest.fn() })), // Default searchParams
}));


// Mock Supabase client
jest.mock('./src/lib/supabase', () => {
  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
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
    single: jest.fn(),
    maybeSingle: jest.fn(),
    rpc: jest.fn(),
    // Mock auth functionalities if needed by your components/routes
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }), // Default to no user
    },
  };
  return { supabase: mockSupabaseClient };
});

// Mock Stripe SDK
jest.mock('stripe', () => {
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

// Mock i18next (react-i18next)
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Simple mock for t function
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
  // If you use Trans component or other exports, mock them here
}));


// Set up mock environment variables
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_mock';
process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY = 'price_hobby_mock';
process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO = 'price_pro_mock';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.ELEVENLABS_WEBHOOK_SECRET = 'el_whsec_test_mock';
process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID = 'agent_id_mock';
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
