import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { type Activity } from "@shared/schema";
import Timeline from "@/components/Timeline";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Plus } from "lucide-react";
import NodeDialog from "@/components/NodeDialog";
import { format } from "date-fns";
import { useTheme } from "@/context/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useEffect } from "react";

export default function DayView() {
  const { date } = useParams<{ date: string }>();
  
  const { data: activities, isLoading, refetch } = useQuery<Activity[]>({
    queryKey: ["/api/activities", date],
    queryFn: async () => {
      const response = await fetch(`/api/activities/${date}`);
      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }
      return response.json();
    },
  });

  useEffect(() => {
    refetch();
  }, [date, refetch]);

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
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" style={{ color: theme.primary }} />
              </Button>
            </Link>
            <Link href="/">
              <h1 className="text-4xl font-bold text-center w-full cursor-pointer">
              <span style={{ color: theme.primary, fontFamily: 'Lobster, serif' }}>Daily</span>
              <span style={{ color: theme.primary, fontFamily: 'Playwrite IT Moderna, serif' }}>Nodes</span>
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <NodeDialog />
            <ThemeSwitcher />
          </div>
        </div>
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: theme.primary }}>
            {format(new Date(date), "MMMM d, yyyy")}
          </h1>
        </div>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <Timeline activities={activities || []} detailed />
        </ScrollArea>
      </div>
    </div>
  );
}
