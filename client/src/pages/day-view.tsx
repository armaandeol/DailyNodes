import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { type Activity } from "@shared/schema";
import Timeline from "@/components/Timeline";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Plus } from "lucide-react";
import NodeDialog from "@/components/NodeDialog";
import { format } from "date-fns";

export default function DayView() {
  const { date } = useParams<{ date: string }>();
  
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities", date],
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {format(new Date(date), "MMMM d, yyyy")}
            </h1>
          </div>
          <NodeDialog />
        </div>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <Timeline activities={activities || []} detailed />
        </ScrollArea>
      </div>
    </div>
  );
}
