import { useQuery } from "@tanstack/react-query";
import { type Activity } from "@shared/schema";
import Timeline from "@/components/Timeline";
import { useTheme } from "@/context/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Home() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background, color: theme.text }}>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-center w-full">
            <span style={{ color: theme.primary, fontFamily: 'Lobster, serif' }}>Daily</span>
            <span style={{ color: theme.primary, fontFamily: 'Playwrite IT Moderna, serif' }}>Nodes</span>
          </h1>
          <ThemeSwitcher />
        </div>
        <Timeline activities={activities || []} />
      </div>
    </div>
  );
}