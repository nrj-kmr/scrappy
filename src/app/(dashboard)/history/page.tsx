import { History } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-muted-foreground">
      <History className="w-12 h-12 mb-4 opacity-20" />
      <h2 className="text-xl font-headline font-bold text-foreground">Generation History</h2>
      <p className="text-sm mt-2">Your past generations will appear here.</p>
    </div>
  );
}
