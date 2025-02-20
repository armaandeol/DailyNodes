import { useQuery } from "@tanstack/react-query";
import { type Activity } from "@shared/schema";
import Timeline from "@/components/Timeline";

export default function Home() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Your Timeline
        </h1>
        <Timeline activities={activities || []} />
      </div>
    </div>
  );
}