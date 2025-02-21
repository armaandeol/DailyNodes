import React from "react";
import { type Activity, type DayGroup } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Plus, Clock } from "lucide-react";
import NodeDialog from "./NodeDialog";
import EditDialog from "./EditDialog";
import { motion } from "framer-motion";

interface TimelineProps {
  activities: Activity[];
  detailed?: boolean;
}

const Timeline = ({ activities, detailed = false }: TimelineProps) => {
  if (activities.length === 0) {
    return <p>No activities found.</p>;
  }

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

      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/50 to-primary/20" />

      <div className="space-y-12">
        {groupedActivities.map((group) => (
          <motion.div
            key={group.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {!detailed && (
              <Link href={`/day/${group.date}`}>
                <Button
                  variant="outline"
                  className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4 z-10 shadow-md hover:shadow-lg transition-shadow"
                >
                  {format(new Date(group.date), "MMM d")}
                </Button>
              </Link>
            )}

            <div className="space-y-6 mt-8">
              {group.activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex items-center justify-center"
                >
                  <motion.div
                    className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full shadow-lg"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />

                  <Card className="w-[85%] ml-[60%] hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {format(new Date(activity.timestamp), "h:mm a")}
                        </div>
                        <EditDialog activity={activity} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {activity.note && (
                        <p className="text-foreground font-medium mb-3">{activity.note}</p>
                      )}
                      {activity.photoUrl && (
                        <motion.img
                          src={activity.photoUrl}
                          alt="Activity"
                          className="rounded-md max-w-full h-auto"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;