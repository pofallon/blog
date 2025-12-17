/**
 * Project Analytics Event Tracking
 * @see /specs/010-projects-section/contracts/routes.md
 */

export interface ProjectLinkClickEvent {
  event: 'project_link_click';
  projectSlug: string;
  linkLabel: string;
  linkUrl: string;
  linkType: 'primary' | 'secondary';
}

/**
 * Track project link click events
 * Uses structured logging approach consistent with existing codebase
 * @param projectSlug - The project slug
 * @param linkLabel - Display label of the clicked link
 * @param linkUrl - URL of the clicked link
 * @param linkType - Type of link (primary or secondary)
 */
export function trackProjectLinkClick(
  projectSlug: string,
  linkLabel: string,
  linkUrl: string,
  linkType: 'primary' | 'secondary' = 'secondary'
): void {
  const event: ProjectLinkClickEvent = {
    event: 'project_link_click',
    projectSlug,
    linkLabel,
    linkUrl,
    linkType,
  };

  // Log to console in development, could be extended to external analytics
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Analytics]', JSON.stringify(event));
  }

  // In production, this could be extended to send to an analytics service
  // For now, we use the same structured logging approach as the MDX registry
}
