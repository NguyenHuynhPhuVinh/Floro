import { render, screen, waitFor } from '@testing-library/react';

import { WelcomeHero } from './WelcomeHero';

describe('WelcomeHero Component', () => {
  it('renders the component after mounting', async () => {
    render(<WelcomeHero />);
    
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /floro/i });
      expect(heading).toBeInTheDocument();
    });
  });

  it('displays the main brand heading', async () => {
    render(<WelcomeHero />);
    
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /floro/i });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('text-6xl');
    });
  });

  it('shows the tagline', async () => {
    render(<WelcomeHero />);
    
    await waitFor(() => {
      const tagline = screen.getByRole('heading', { name: /visual node-based collaboration platform/i });
      expect(tagline).toBeInTheDocument();
    });
  });

  it('displays the description paragraph', async () => {
    render(<WelcomeHero />);
    
    await waitFor(() => {
      const description = screen.getByText(/create, connect, and collaborate in real-time/i);
      expect(description).toBeInTheDocument();
    });
  });

  it('renders all three feature cards', async () => {
    render(<WelcomeHero />);
    
    await waitFor(() => {
      expect(screen.getByText(/real-time collaboration/i)).toBeInTheDocument();
      expect(screen.getByText(/visual node system/i)).toBeInTheDocument();
      expect(screen.getByText(/high performance/i)).toBeInTheDocument();
    });
  });

  it('shows feature descriptions', async () => {
    render(<WelcomeHero />);
    
    await waitFor(() => {
      expect(screen.getByText(/work together seamlessly with live updates/i)).toBeInTheDocument();
      expect(screen.getByText(/intuitive drag-and-drop interface/i)).toBeInTheDocument();
      expect(screen.getByText(/optimized for smooth interactions/i)).toBeInTheDocument();
    });
  });

  it('displays system status section', async () => {
    render(<WelcomeHero />);
    
    await waitFor(() => {
      expect(screen.getByText(/system status/i)).toBeInTheDocument();
      expect(screen.getByText(/all systems operational/i)).toBeInTheDocument();
      expect(screen.getByText(/ready for collaboration/i)).toBeInTheDocument();
    });
  });

  it('shows footer information', async () => {
    render(<WelcomeHero />);
    
    await waitFor(() => {
      expect(screen.getByText(/built with next.js, typescript, tailwind css, and firebase/i)).toBeInTheDocument();
      expect(screen.getByText(/version 1.0.0/i)).toBeInTheDocument();
      expect(screen.getByText(/floro team/i)).toBeInTheDocument();
    });
  });

  it('includes current year in footer', async () => {
    render(<WelcomeHero />);
    
    const currentYear = new Date().getFullYear();
    
    await waitFor(() => {
      expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
    });
  });

  it('has proper accessibility structure', async () => {
    render(<WelcomeHero />);
    
    await waitFor(() => {
      // Check for proper heading hierarchy
      const mainHeading = screen.getByRole('heading', { name: /floro/i });
      const subHeading = screen.getByRole('heading', { name: /visual node-based collaboration platform/i });
      
      expect(mainHeading).toBeInTheDocument();
      expect(subHeading).toBeInTheDocument();
    });
  });
});
