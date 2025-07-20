import { CanvasContainer } from '@/components/canvas/CanvasContainer';
import { AppLayout } from '@/components/layout/AppLayout';

export default function Home(): React.JSX.Element {
  return (
    <AppLayout>
      <CanvasContainer className="h-full" />
    </AppLayout>
  );
}
