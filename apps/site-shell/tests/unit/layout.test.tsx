import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { getNavigationLinks } from '@/lib/navigation';
import { getSiteShellLayout } from '@/lib/site-shell';

describe('Site shell layout', () => {
  it('renders every primary navigation link in the header', () => {
    const links = getNavigationLinks();
    render(<Header brandName="get2know.io" links={links} />);

    links.forEach((link) => {
      const anchor = screen.getByRole('link', { name: link.label });
      expect(anchor).toHaveAttribute('href', link.path);
    });
  });

  it('shares the same navigation data with the footer component', () => {
    const layout = getSiteShellLayout();
    render(<Footer footer={layout.footer} links={layout.navigationLinks} />);

    layout.navigationLinks.forEach((link) => {
      expect(screen.getAllByRole('link', { name: link.label })).not.toHaveLength(0);
    });
  });

  it('renders persistent header and footer with shared navigation', () => {
    const layout = getSiteShellLayout();
    const { container } = render(
      <>
        <Header brandName={layout.brandName} links={layout.navigationLinks} />
        <main role="main">
          <p>Shell content</p>
        </main>
        <Footer footer={layout.footer} links={layout.navigationLinks} />
      </>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(container.querySelector('nav')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText('Shell content')).toBeInTheDocument();
  });

  it('offers a noscript fallback navigation list', () => {
    const links = getNavigationLinks();
    render(<Navigation ariaLabel="Primary" links={links} />);

    const fallbackList = screen.getByTestId('noscript-navigation');
    expect(fallbackList.textContent).toContain('Home');
  });
});
