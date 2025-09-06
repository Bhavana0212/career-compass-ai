import React, { useState, useEffect } from "react";
import { Project, UserProfile, CareerPath } from "@/entities/all";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Sparkles, Code, CheckCircle, Target, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ProjectCard from "../components/projects/ProjectCard";
import ProjectDetails from "../components/projects/ProjectDetails";

export default function ProjectLab() {
  const [projects, setProjects] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCareerId, setSelectedCareerId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const [profiles, careers, userProjects] = await Promise.all([
        UserProfile.filter({ created_by: user.email }),
        CareerPath.filter({ recommended_for_user: user.id }),
        Project.filter({ assigned_to_user: user.id }),
      ]);

      setUserProfile(profiles[0] || null);
      setCareerPaths(careers);
      setProjects(userProjects);

      if (careers.length > 0) {
        setSelectedCareerId(careers[0].id);
      }
      if (userProjects.length > 0) {
          setSelectedProject(userProjects[0]);
      }
    } catch (error) {
      console.error("Error loading project lab data:", error);
    }
    setIsLoading(false);
  };

  const generateNewProjects = async () => {
    if (!userProfile || !selectedCareerId) return;

    setIsGenerating(true);
    try {
      const targetCareer = careerPaths.find(c => c.id === selectedCareerId);
      const skillsList = userProfile.skills?.map(s => s.name).join(", ") || "";

      const prompt = `
        Based on this student's profile aiming for a "${targetCareer.title}" role:
        - Skills: ${skillsList}
        - Experience Level: ${userProfile.experience_level}
        
        Generate 3 distinct, real-world project briefs that would be impressive in a portfolio for this career.
        For each project, provide:
        1. A clear project title.
        2. A detailed description of the project goal and features.
        3. A list of specific skills that will be practiced.
        4. A difficulty level (beginner, intermediate, advanced).
        5. Estimated hours to complete.
        6. A list of technical requirements or prerequisites.
        7. A list of key deliverables (e.g., "Live demo", "GitHub repository with README").
        8. A list of 2-3 helpful resources (documentation, tutorials, tools, datasets) with URLs.
      `;
      
      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            projects: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  career_relevance: { type: "string" },
                  skills_practiced: { type: "array", items: { type: "string" } },
                  difficulty_level: { type: "string" },
                  estimated_hours: { type: "number" },
                  requirements: { type: "array", items: { type: "string" } },
                  deliverables: { type: "array", items: { type: "string" } },
                  resources: { 
                    type: "array", 
                    items: { 
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        url: { type: "string" },
                        type: { type: "string" }
                      }
                    } 
                  }
                }
              }
            }
          }
        }
      });
      
      const user = await User.me();
      const newProjectsData = (result.projects || []).map(p => ({
        ...p,
        career_relevance: targetCareer.title,
        assigned_to_user: user.id
      }));

      if (newProjectsData.length > 0) {
        const createdProjects = await Project.bulkCreate(newProjectsData);
        setProjects(prev => [...createdProjects, ...prev]);
      }
    } catch (error) {
      console.error("Error generating projects:", error);
    }
    setIsGenerating(false);
  };
  
  const updateProjectStatus = async (projectId, status) => {
    await Project.update(projectId, { completion_status: status });
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, completion_status: status } : p))
    );
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === "all") return true;
    return project.completion_status === activeTab;
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <Briefcase className="w-10 h-10 mx-auto text-purple-600 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Project Lab</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-2">
            Build hands-on projects to showcase your skills and strengthen your portfolio.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link to={createPageUrl("LearningHub")}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous: Learning
            </Button>
          </Link>
          <Link to={createPageUrl("InterviewPrep")}>
            <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
              Next: Interview Prep
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
          <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">Generate New Project Ideas</h3>
              <p className="text-slate-600">Select a career goal to get tailored project briefs from our AI.</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedCareerId} onValueChange={setSelectedCareerId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Career Goal" />
                </SelectTrigger>
                <SelectContent>
                  {careerPaths.map(career => (
                    <SelectItem key={career.id} value={career.id}>
                      {career.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={generateNewProjects} disabled={isGenerating || !selectedCareerId}>
                {isGenerating ? "Generating..." : <><Sparkles className="w-4 h-4 mr-2" /> Generate</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="not_started">Not Started</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            <div className="grid lg:grid-cols-3 gap-8 mt-6">
              <div className="lg:col-span-2 space-y-6">
                {filteredProjects.length === 0 ? (
                  <Card className="text-center p-12">
                    <Code className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">No Projects Yet</h3>
                    <p className="text-slate-500">Generate your first project to get started!</p>
                  </Card>
                ) : (
                  filteredProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project}
                      onSelect={setSelectedProject}
                      isSelected={selectedProject?.id === project.id}
                      onUpdateStatus={updateProjectStatus}
                    />
                  ))
                )}
              </div>
              <div className="space-y-6">
                {selectedProject ? (
                  <ProjectDetails project={selectedProject} />
                ) : (
                   <Card className="p-6 text-center text-slate-500 sticky top-8">
                    <Target className="w-10 h-10 mx-auto mb-3" />
                    Select a project to see full details, requirements, and helpful resources.
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}