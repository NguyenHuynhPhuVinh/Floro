// Mock Supabase client for testing
export const supabase = {
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
      remove: jest.fn(),
      list: jest.fn(),
    })),
  },
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
        order: jest.fn(),
        gte: jest.fn(),
        lte: jest.fn(),
      })),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(),
    })),
  })),
  channel: jest.fn(() => ({
    on: jest.fn(() => ({
      on: jest.fn(() => ({
        on: jest.fn(() => ({
          subscribe: jest.fn(),
        })),
      })),
    })),
  })),
  removeChannel: jest.fn(),
};
