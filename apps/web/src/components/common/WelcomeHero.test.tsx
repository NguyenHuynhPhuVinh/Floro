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
      const tagline = screen.getByRole('heading', {
        name: /nền tảng cộng tác trực quan dựa trên node/i,
      });
      expect(tagline).toBeInTheDocument();
    });
  });

  it('displays the description paragraph', async () => {
    render(<WelcomeHero />);

    await waitFor(() => {
      const description = screen.getByText(
        /tạo, kết nối và cộng tác theo thời gian thực/i
      );
      expect(description).toBeInTheDocument();
    });
  });

  it('renders all three feature cards', async () => {
    render(<WelcomeHero />);

    await waitFor(() => {
      expect(screen.getByText(/cộng tác thời gian thực/i)).toBeInTheDocument();
      expect(screen.getByText(/hệ thống node trực quan/i)).toBeInTheDocument();
      expect(screen.getByText(/hiệu suất cao/i)).toBeInTheDocument();
    });
  });

  it('shows feature descriptions', async () => {
    render(<WelcomeHero />);

    await waitFor(() => {
      expect(
        screen.getByText(/làm việc cùng nhau một cách liền mạch/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/giao diện kéo-thả trực quan/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/tối ưu hóa cho tương tác mượt mà/i)
      ).toBeInTheDocument();
    });
  });

  it('displays system status section', async () => {
    render(<WelcomeHero />);

    await waitFor(() => {
      expect(screen.getByText(/trạng thái hệ thống/i)).toBeInTheDocument();
      expect(
        screen.getByText(/tất cả hệ thống hoạt động bình thường/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/sẵn sàng cho cộng tác/i)).toBeInTheDocument();
    });
  });

  it('shows footer information', async () => {
    render(<WelcomeHero />);

    await waitFor(() => {
      expect(
        screen.getByText(
          /được xây dựng với next.js, typescript, tailwind css và supabase/i
        )
      ).toBeInTheDocument();
      expect(screen.getByText(/phiên bản 1.0.0/i)).toBeInTheDocument();
      expect(screen.getByText(/đội ngũ floro/i)).toBeInTheDocument();
    });
  });

  it('includes current year in footer', async () => {
    render(<WelcomeHero />);

    const currentYear = new Date().getFullYear();

    await waitFor(() => {
      expect(
        screen.getByText(new RegExp(currentYear.toString()))
      ).toBeInTheDocument();
    });
  });

  it('has proper accessibility structure', async () => {
    render(<WelcomeHero />);

    await waitFor(() => {
      // Check for proper heading hierarchy
      const mainHeading = screen.getByRole('heading', { name: /floro/i });
      const subHeading = screen.getByRole('heading', {
        name: /nền tảng cộng tác trực quan dựa trên node/i,
      });

      expect(mainHeading).toBeInTheDocument();
      expect(subHeading).toBeInTheDocument();
    });
  });
});
