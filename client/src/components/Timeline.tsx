import { type Activity, type DayGroup } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Plus } from "lucide-react";
import NodeDialog from "./NodeDialog";

interface TimelineProps {
  activities: Activity[];
  detailed?: boolean;
}

export default function Timeline({ activities, detailed = false }: TimelineProps) {
  const groupedActivities = activities.reduce<DayGroup[]>((groups, activity) => {
    const date = format(new Date(activity.timestamp), "yyyy-MM-dd");
    const group = groups.find(g => g.date === date);

    if (group) {
      group.activities.push(activity);
    } else {
      groups.push({ date, activities: [activity] });
    }

    return groups;
  }, []);

  return (
    <div className="relative">
      {!detailed && (
        <div className="sticky top-4 z-10 flex justify-end mb-8">
          <NodeDialog />
        </div>
      )}

      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/20" />

      <div className="space-y-8">
        {groupedActivities.map((group) => (
          <div key={group.date} className="relative">
            {!detailed && (
              <Link href={`/day/${group.date}`}>
                <Button
                  variant="outline"
                  className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4 z-10"
                >
                  {format(new Date(group.date), "MMM d")}
                </Button>
              </Link>
            )}

            <div className="space-y-4 mt-8">
              {group.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="relative flex items-center justify-center"
                >
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />

                  <Card className="w-[80%] ml-[60%]">
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        {format(new Date(activity.timestamp), "h:mm a")}
                      </div>
                      {activity.note && (
                        <p className="text-foreground">{activity.note}</p>
                      )}
                      {activity.photoUrl && (
                        <img
                          src={activity.photoUrl}
                          alt="Activity"
                          className="mt-2 rounded-md max-w-full h-auto"
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}