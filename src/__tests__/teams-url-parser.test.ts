import { describe, it, expect } from 'vitest';
import { parseTeamsUrl } from '../lib/teams-url-parser.js';

describe('parseTeamsUrl', () => {
  it('passes through short /meet/ URL as-is', () => {
    const url = 'https://teams.microsoft.com/meet/29752586464443?p=abc123';
    expect(parseTeamsUrl(url)).toBe(url);
  });

  it('passes through full /meetup-join/ URL as-is', () => {
    const url =
      'https://teams.microsoft.com/l/meetup-join/19%3ameeting_abc123/0?context=%7B%22Tid%22%3A%22tid%22%7D';
    expect(parseTeamsUrl(url)).toBe(url);
  });

  it('reconstructs joinWebUrl from recap URL', () => {
    const url =
      'https://teams.microsoft.com/v2/#/meetingrecap?threadId=19%3ameeting_abc%40thread.v2&tenantId=tid-123&organizerId=oid-456';
    const result = parseTeamsUrl(url);

    expect(result).toContain('https://teams.microsoft.com/l/meetup-join/');
    expect(result).toContain('19%3ameeting_abc%40thread.v2');
    expect(result).toContain('context=');
    expect(result).toContain('tid-123');
    expect(result).toContain('oid-456');
  });

  it('throws on recap URL missing required params', () => {
    const url = 'https://teams.microsoft.com/v2/#/meetingrecap?threadId=abc';
    expect(() => parseTeamsUrl(url)).toThrow(
      'Invalid recap URL: missing threadId, tenantId, or organizerId parameter'
    );
  });

  it('returns unknown URL format as-is', () => {
    const url = 'https://example.com/something-else';
    expect(parseTeamsUrl(url)).toBe(url);
  });
});
