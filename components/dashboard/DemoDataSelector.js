import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Briefcase, Paintbrush } from 'lucide-react';

const demoProfiles = [
  {
    name: 'Priya',
    role: 'CS Undergrad',
    icon: User,
    description: 'Explore the profile of a Computer Science student aiming for a Data Analyst role.',
    id: 'priya'
  },
  {
    name: 'Rahul',
    role: 'Business Student',
    icon: Briefcase,
    description: 'See how a business major can pivot into a Product Management career.',
    id: 'rahul',
    disabled: true
  },
  {
    name: 'Sara',
    role: 'Design Student',
    icon: Paintbrush,
    description: 'Discover the path for a designer to become a top-tier UX/UI specialist.',
    id: 'sara',
    disabled: true
  }
];

export default function DemoDataSelector({ onSelectDemoUser }) {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader>
        <CardTitle>Hackathon Demo Profiles</CardTitle>
        <p className="text-slate-600">Select a sample profile to explore the app's features.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {demoProfiles.map(profile => (
          <div key={profile.id} className={`p-4 rounded-lg border flex items-center justify-between ${profile.disabled ? 'bg-slate-50' : 'bg-indigo-50 border-indigo-200'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${profile.disabled ? 'bg-slate-200 text-slate-500' : 'bg-indigo-100 text-indigo-600'}`}>
                <profile.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`font-semibold ${profile.disabled ? 'text-slate-400' : 'text-slate-900'}`}>{profile.name} <span className="text-sm font-normal text-slate-500">- {profile.role}</span></h4>
                <p className={`text-sm ${profile.disabled ? 'text-slate-400' : 'text-slate-600'}`}>{profile.description}</p>
              </div>
            </div>
            <Button
              onClick={() => onSelectDemoUser(profile.id)}
              disabled={profile.disabled}
              className={profile.disabled ? '' : 'bg-indigo-600 hover:bg-indigo-700'}
            >
              {profile.disabled ? 'Coming Soon' : 'Load Demo'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}