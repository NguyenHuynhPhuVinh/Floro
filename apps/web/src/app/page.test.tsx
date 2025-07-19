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

    const tagline = screen.getByText(
      /nền tảng cộng tác trực quan dựa trên node/i
    );
    expect(tagline).toBeInTheDocument();
  });

  it('shows the description text', () => {
    render(<Home />);

    const description = screen.getByText(
      /tạo, kết nối và cộng tác theo thời gian thực/i
    );
    expect(description).toBeInTheDocument();
  });

  it('displays feature cards', () => {
    render(<Home />);

    // Check for feature titles
    expect(screen.getByText(/cộng tác thời gian thực/i)).toBeInTheDocument();
    expect(screen.getByText(/hệ thống node trực quan/i)).toBeInTheDocument();
    expect(screen.getByText(/hiệu suất cao/i)).toBeInTheDocument();
  });

  it('shows system status', () => {
    render(<Home />);

    const statusText = screen.getByText(
      /tất cả hệ thống hoạt động bình thường/i
    );
    expect(statusText).toBeInTheDocument();
  });

  it('displays version information', () => {
    render(<Home />);

    const versionText = screen.getByText(/phiên bản 1.0.0/i);
    expect(versionText).toBeInTheDocument();
  });

  it('shows technology stack information', () => {
    render(<Home />);

    const techStack = screen.getByText(
      /được xây dựng với next.js, typescript, tailwind css và firebase/i
    );
    expect(techStack).toBeInTheDocument();
  });
});
