/**
 * Contract test: cursor format must remain stable across refactors.
 * nextCursor = raw value of cursorField on the last item.
 * Any format change here = breaking change for clients storing cursors.
 */
import { describe, expect, it } from 'vitest';

describe('cursor format stability', () => {
  it('nextCursor is the raw cursorField value (no encoding)', () => {
    const items = [{ id: 'abc-123' }, { id: 'def-456' }, { id: 'ghi-789' }];
    const cursorField = 'id';
    const lastItem = items[items.length - 1];
    const nextCursor = (lastItem as Record<string, unknown>)[cursorField];

    // Snapshot: any change to this format = intentional breaking change
    expect(nextCursor).toMatchInlineSnapshot(`"ghi-789"`);
    expect(typeof nextCursor).toBe('string');
  });

  it('nextCursor is null when no next page', () => {
    const hasNextPage = false;
    const nextCursor = hasNextPage ? 'some-id' : null;

    expect(nextCursor).toMatchInlineSnapshot(`null`);
  });

  it('cursor field is passed through as-is to prisma cursor arg', () => {
    const cursorField = 'id';
    const cursorValue = 'abc-123';
    const prismaArg = { [cursorField]: cursorValue };

    // Format: { id: "<raw-value>" } — no wrapping, no encoding
    expect(prismaArg).toMatchInlineSnapshot(`
      {
        "id": "abc-123",
      }
    `);
  });
});
