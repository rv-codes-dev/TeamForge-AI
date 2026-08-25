import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';
import React from 'react';

// Mock matchMedia to prevent jsdom errors
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

describe('App', () => {
  it('renders without crashing', () => {
    // Basic render test to ensure App mounts
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
