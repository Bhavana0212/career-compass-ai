import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Briefcase, Target } from "lucide-react";
import { format } from "date-fns";

export default function RecentActivity({ careerPaths, learningPaths, projects }) {
  const activities = [
    ...careerPaths.map(career => ({
      type: 'career',
      title: `New career match: ${career.title}`,
      subtitle: `${career.match_score}% compatibility`,
      time: career.created_date,
      icon: Target,
      color: 'indigo'
    })),
    ...learningPaths.map(path => ({
      type: 'learning',
      title: `Learning path: ${path.title}`,
      subtitle: `${path.courses?.length || 0} courses • ${path.estimated_duration}`,
      time: path.created_date,
      icon: BookOpen,
      color: 'green'
    })),
    ...projects.map(project => ({
      type: 'project',
      title: `Project: ${project.title}`,
      subtitle: `${project.difficulty_level} • ${project.estimated_hours}h`,
      time: project.created_date,
      icon: Briefcase,
      color: 'purple'
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  const getColorClasses = (color) => ({
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700' },
    green: { bg: 'bg-green-50', text: 'text-green-600', badge: 'bg-green-100 text-green-700' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' }
  }[color]);

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Clock className="w-5 h-5 text-slate-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">No recent activity yet.</p>
            <p className="text-sm text-slate-400 mt-1">Complete your skill assessment to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const colors = getColorClasses(activity.color);
              return (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 truncate">{activity.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{activity.subtitle}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className={colors.badge}>
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {format(new Date(activity.time), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}