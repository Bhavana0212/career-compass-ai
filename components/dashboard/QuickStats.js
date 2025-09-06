import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Compass, BookOpen, CheckCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const data = [
  { name: 'Skills', value: 7, color: '#6366F1' },
  { name: 'Careers', value: 4, color: '#8B5CF6' },
  { name: 'Learning', value: 65, color: '#10B981' },
  { name: 'Projects', value: 1, color: '#F59E0B' },
];

export default function QuickStats({ stats }) {
  const statItems = [
    {
      title: "Skills Mapped",
      value: stats.skillsMapped,
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Careers Explored",
      value: stats.careersExplored,
      icon: Compass,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Learning Progress",
      value: `${stats.learningProgress}%`,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      showProgress: true,
      progress: stats.learningProgress
    },
    {
      title: "Projects Completed",
      value: `${stats.projectsCompleted}/${stats.totalProjects}`,
      icon: CheckCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];
  
  const chartData = [
    { name: 'Skills', value: stats.skillsMapped, color: '#6366F1' },
    { name: 'Careers', value: stats.careersExplored, color: '#8B5CF6' },
    { name: 'Learning %', value: stats.learningProgress, color: '#10B981' },
    { name: 'Projects', value: stats.projectsCompleted, color: '#F59E0B' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
                <CardTitle>Your Progress Snapshot</CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(4px)',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.75rem',
                                    color: '#0f172a'
                                }}
                                cursor={{ fill: 'rgba(238, 242, 255, 0.6)' }}
                             />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {statItems.slice(0, 4).map((stat, index) => (
                <Card key={index} className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                        <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                        {stat.showProgress && (
                            <Progress value={stat.progress} className="h-2 mt-2" />
                        )}
                    </div>
                </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}