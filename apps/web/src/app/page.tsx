import { WelcomeHero } from '@/components/common/WelcomeHero';

export default function Home(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <WelcomeHero />
    </div>
  );
}
