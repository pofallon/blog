/**
 * Project color mapping for Gang of Four projects
 * Shared between server and client components
 */

export const projectColors: Record<string, string> = {
  remo: 'g2k-teal',
  maverick: 'g2k-brass',
  deacon: 'g2k-robot-delta',
  newcleus: 'g2k-coral',
};

export function getProjectColor(slug: string): string {
  return projectColors[slug] || 'g2k-brass';
}
