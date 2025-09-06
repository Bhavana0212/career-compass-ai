import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Compass, 
  LayoutDashboard, 
  Target, 
  BookOpen, 
  Briefcase, 
  MessageSquare, 
  FileText,
  User,
  Settings
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Skill Assessment",
    url: createPageUrl("SkillAssessment"),
    icon: Target,
  },
  {
    title: "Career Explorer",
    url: createPageUrl("CareerExplorer"),
    icon: Compass,
  },
  {
    title: "Learning Hub",
    url: createPageUrl("LearningHub"),
    icon: BookOpen,
  },
  {
    title: "Project Lab",
    url: createPageUrl("ProjectLab"),
    icon: Briefcase,
  },
  {
    title: "Interview Prep",
    url: createPageUrl("InterviewPrep"),
    icon: MessageSquare,
  },
  {
    title: "Resume Tools",
    url: createPageUrl("ResumeTools"),
    icon: FileText,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <style>
          {`
            :root {
              --primary: 224 71% 4%;
              --primary-foreground: 210 20% 98%;
              --secondary: 220 14% 96%;
              --secondary-foreground: 220 9% 46%;
              --accent: 220 14% 96%;
              --accent-foreground: 220 9% 46%;
              --destructive: 0 84% 60%;
              --destructive-foreground: 210 20% 98%;
              --muted: 220 14% 96%;
              --muted-foreground: 220 9% 46%;
              --card: 0 0% 100%;
              --card-foreground: 224 71% 4%;
              --popover: 0 0% 100%;
              --popover-foreground: 224 71% 4%;
              --border: 220 13% 91%;
              --input: 220 13% 91%;
              --ring: 262 65% 60%;
            }
          `}
        </style>
        
        <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Career Compass</h2>
                <p className="text-xs text-slate-500 font-medium">AI Career Advisor</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Career Tools
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 rounded-lg ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-r-2 border-indigo-500' 
                            : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Progress Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Skills Mapped</span>
                    <span className="font-semibold text-slate-900">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Careers Explored</span>
                    <span className="font-semibold text-slate-900">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Projects Completed</span>
                    <span className="font-semibold text-green-600">0</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">Student</p>
                <p className="text-xs text-slate-500 truncate">Building your career path</p>
              </div>
              <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Compass className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-bold text-slate-900">Career Compass</h1>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}