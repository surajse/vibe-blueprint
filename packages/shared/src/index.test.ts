import { describe, expect, it } from 'vitest';
import { slugify } from './index.js';

describe('slugify', () => {
  it('lowercases and hyphenates words', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('trims and collapses whitespace', () => {
    expect(slugify('  too   much   space  ')).toBe('too-much-space');
  });

  it('removes punctuation', () => {
    expect(slugify("It's a test!")).toBe('its-a-test');
  });

  it('collapses repeated hyphens and underscores', () => {
    expect(slugify('a--b__c')).toBe('a-b-c');
  });

  it('returns an empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });
});
