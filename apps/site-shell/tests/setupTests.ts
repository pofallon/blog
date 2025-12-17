import '@testing-library/jest-dom';

process.env.NEXT_PUBLIC_BASE_URL ??= 'http://localhost:3000';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));
