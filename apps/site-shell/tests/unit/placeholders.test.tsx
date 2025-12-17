import { getAllPlaceholders, getPlaceholderBySlug } from '@/lib/placeholders';

describe('Placeholder registry', () => {
  it('returns placeholder definitions for every route slug', () => {
    expect(getAllPlaceholders()).toHaveLength(4);
    expect(getPlaceholderBySlug('home').title).toContain('Home');
    expect(getPlaceholderBySlug('blog').slug).toBe('blog');
    expect(getPlaceholderBySlug('projects').layoutSlots.length).toBeGreaterThan(0);
    expect(getPlaceholderBySlug('merch').cta?.href).toContain('merch');
  });

  it('enforces unique layout slots per placeholder', () => {
    const placeholders = getAllPlaceholders();
    placeholders.forEach((page) => {
      const slotIds = page.layoutSlots.map((slot) => slot.id);
      const uniqueSlotIds = new Set(slotIds);
      expect(uniqueSlotIds.size).toBe(slotIds.length);
    });
  });
});
