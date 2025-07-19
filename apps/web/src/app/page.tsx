import { CanvasContainer } from '@/components/canvas/CanvasContainer';

export default function Home(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <CanvasContainer className="h-screen" />
    </div>
  );
}
