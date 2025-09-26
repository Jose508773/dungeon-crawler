import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Stub CSS imports if any (suppress jsdom errors in tests)
vi.mock('./src/App.css', () => ({}));

