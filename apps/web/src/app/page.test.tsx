import { render, screen } from '@testing-library/react';

import Home from './page';

describe('Home Page', () => {
  it('renders the home page', () => {
    render(<Home />);
    
    // Check if the main heading is present
    const heading = screen.getByRole('heading', { name: /floro/i });
    expect(heading).toBeInTheDocument();
  });

  it('displays the correct tagline', () => {
    render(<Home />);
    
    const tagline = screen.getByText(/visual node-based collaboration platform/i);
    expect(tagline).toBeInTheDocument();
  });

  it('shows the description text', () => {
    render(<Home />);
    
    const description = screen.getByText(/create, connect, and collaborate in real-time/i);
    expect(description).toBeInTheDocument();
  });

  it('displays feature cards', () => {
    render(<Home />);
    
    // Check for feature titles
    expect(screen.getByText(/real-time collaboration/i)).toBeInTheDocument();
    expect(screen.getByText(/visual node system/i)).toBeInTheDocument();
    expect(screen.getByText(/high performance/i)).toBeInTheDocument();
  });

  it('shows system status', () => {
    render(<Home />);
    
    const statusText = screen.getByText(/all systems operational/i);
    expect(statusText).toBeInTheDocument();
  });

  it('displays version information', () => {
    render(<Home />);
    
    const versionText = screen.getByText(/version 1.0.0/i);
    expect(versionText).toBeInTheDocument();
  });

  it('shows technology stack information', () => {
    render(<Home />);
    
    const techStack = screen.getByText(/built with next.js, typescript, tailwind css, and firebase/i);
    expect(techStack).toBeInTheDocument();
  });
});
