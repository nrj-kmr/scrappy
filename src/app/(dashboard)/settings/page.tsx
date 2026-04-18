import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-muted-foreground">
      <Settings className="w-12 h-12 mb-4 opacity-20" />
      <h2 className="text-xl font-headline font-bold text-foreground">Account Settings</h2>
      <p className="text-sm mt-2">Manage your subscription and API keys here.</p>
    </div>
  );
}
