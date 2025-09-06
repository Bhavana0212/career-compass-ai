
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Target } from "lucide-react";

const SKILL_CATEGORIES = ["technical", "soft", "domain", "language", "tool"];
const PROFICIENCY_LEVELS = ["beginner", "intermediate", "advanced", "expert"];
const EXPERIENCE_LEVELS = ["student", "entry_level", "1-3_years", "3-5_years", "5+_years"];

export default function SkillsInput({ 
  initialSkills, 
  currentSkills, 
  onSkillsUpdate, 
  userProfile, 
  setUserProfile,
  onNext,
  onBack 
}) {
  const [skills, setSkills] = useState(currentSkills.length > 0 ? currentSkills : initialSkills);
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "technical",
    proficiency: "intermediate"
  });

  useEffect(() => {
    if (initialSkills.length > 0 && currentSkills.length === 0) {
      setSkills(initialSkills);
      onSkillsUpdate(initialSkills);
    }
  }, [initialSkills, currentSkills.length, onSkillsUpdate]);

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const updatedSkills = [...skills, { ...newSkill }];
      setSkills(updatedSkills);
      onSkillsUpdate(updatedSkills);
      setNewSkill({ name: "", category: "technical", proficiency: "intermediate" });
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    onSkillsUpdate(updatedSkills);
  };

  const updateSkill = (index, field, value) => {
    const updatedSkills = skills.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    );
    setSkills(updatedSkills);
    onSkillsUpdate(updatedSkills);
  };

  const getCategoryColor = (category) => ({
    technical: "bg-blue-100 text-blue-800",
    soft: "bg-green-100 text-green-800", 
    domain: "bg-purple-100 text-purple-800",
    language: "bg-orange-100 text-orange-800",
    tool: "bg-indigo-100 text-indigo-800"
  }[category]);

  const getProficiencyColor = (proficiency) => ({
    beginner: "bg-gray-100 text-gray-700",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-orange-100 text-orange-800", 
    expert: "bg-red-100 text-red-800"
  }[proficiency]);

  return (
    <div className="space-y-6">
      {/* Basic Info Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <Target className="w-5 h-5 text-indigo-600" />
            Professional Background
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="current_role">Current Role</Label>
            <Input
              id="current_role"
              value={userProfile.current_role}
              onChange={(e) => setUserProfile(prev => ({ ...prev, current_role: e.target.value }))}
              placeholder="e.g., Computer Science Student"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="experience_level">Experience Level</Label>
            <Select
              value={userProfile.experience_level}
              onValueChange={(value) => setUserProfile(prev => ({ ...prev, experience_level: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map(level => (
                  <SelectItem key={level} value={level}>
                    {level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="education">Education Background</Label>
            <Input
              id="education"
              value={userProfile.education_background}
              onChange={(e) => setUserProfile(prev => ({ ...prev, education_background: e.target.value }))}
              placeholder="e.g., Bachelor's in Computer Science, XYZ University"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills Management Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Your Skills</CardTitle>
          <p className="text-slate-600">Add and categorize your skills to get better career matches</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Skill */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
            <Input
              placeholder="Enter skill name"
              value={newSkill.name}
              onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Select
              value={newSkill.category}
              onValueChange={(value) => setNewSkill(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SKILL_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={newSkill.proficiency}
              onValueChange={(value) => setNewSkill(prev => ({ ...prev, proficiency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROFICIENCY_LEVELS.map(level => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addSkill} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>

          {/* Skills List */}
          <div className="space-y-3">
            {skills.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Target className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No skills added yet. Add your first skill above!</p>
              </div>
            ) : (
              skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      className="font-medium"
                    />
                  </div>
                  <Select
                    value={skill.category}
                    onValueChange={(value) => updateSkill(index, 'category', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILL_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={skill.proficiency}
                    onValueChange={(value) => updateSkill(index, 'proficiency', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Badge className={getCategoryColor(skill.category)}>
                      {skill.category}
                    </Badge>
                    <Badge className={getProficiencyColor(skill.proficiency)}>
                      {skill.proficiency}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkill(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Previous
        </Button>
        <Button 
          onClick={onNext}
          disabled={skills.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Next: Career Interests
        </Button>
      </div>
    </div>
  );
}
