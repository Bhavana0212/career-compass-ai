import React, { useState, useEffect } from "react";
import { UserProfile } from "@/entities/UserProfile";
import { User } from "@/entities/User";
import { UploadFile, InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Target, Sparkles, Plus, X, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ResumeUpload from "../components/skills/ResumeUpload";
import SkillsInput from "../components/skills/SkillsInput";
import CareerInterests from "../components/skills/CareerInterests";
import AssessmentResults from "../components/skills/AssessmentResults";

const SKILL_CATEGORIES = ["technical", "soft", "domain", "language", "tool"];
const PROFICIENCY_LEVELS = ["beginner", "intermediate", "advanced", "expert"];
const EXPERIENCE_LEVELS = ["student", "entry_level", "1-3_years", "3-5_years", "5+_years"];

export default function SkillAssessment() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    current_role: "",
    experience_level: "student",
    education_background: "",
    skills: [],
    career_interests: [],
    preferred_industries: [],
    career_goals: "",
    resume_url: ""
  });
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const profiles = await UserProfile.filter({ created_by: currentUser.email });
      if (profiles.length > 0) {
        setUserProfile(profiles[0]);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleResumeUpload = async (file) => {
    setIsProcessing(true);
    try {
      const { file_url } = await UploadFile({ file });
      
      const skillExtractionPrompt = `
        Analyze this resume and extract:
        1. All technical skills, tools, and technologies mentioned
        2. Soft skills and interpersonal abilities
        3. Domain expertise and industry knowledge
        4. Languages spoken
        5. Current role/position
        6. Education background
        7. Years of experience level
        
        Categorize each skill as: technical, soft, domain, language, or tool
        Estimate proficiency level as: beginner, intermediate, advanced, or expert
        
        Return a structured analysis of the person's professional profile.
      `;

      const result = await InvokeLLM({
        prompt: skillExtractionPrompt,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            skills: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  category: { type: "string" },
                  proficiency: { type: "string" }
                }
              }
            },
            current_role: { type: "string" },
            education_background: { type: "string" },
            experience_level: { type: "string" },
            industries: { type: "array", items: { type: "string" } }
          }
        }
      });

      setExtractedSkills(result.skills || []);
      setUserProfile(prev => ({
        ...prev,
        resume_url: file_url,
        current_role: result.current_role || prev.current_role,
        education_background: result.education_background || prev.education_background,
        experience_level: result.experience_level || prev.experience_level,
        preferred_industries: result.industries || prev.preferred_industries
      }));
      
      setCurrentStep(2);
    } catch (error) {
      console.error("Error processing resume:", error);
    }
    setIsProcessing(false);
  };

  const handleSkillsUpdate = (skills) => {
    setUserProfile(prev => ({
      ...prev,
      skills: skills
    }));
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const profileData = {
        ...userProfile,
        last_assessment_date: new Date().toISOString()
      };

      if (userProfile.id) {
        await UserProfile.update(userProfile.id, profileData);
      } else {
        await UserProfile.create(profileData);
      }

      setCurrentStep(4);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    setIsLoading(false);
  };

  const getStepProgress = () => (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-8 h-8 text-indigo-600" />
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Skill Assessment
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Let's map your skills and interests to discover the perfect career paths for you
          </p>
        </div>

         {/* Navigation */}
        {currentStep < 4 && (
        <div className="flex justify-end items-center mb-4">
            <Link to={createPageUrl("Dashboard")}>
                <Button variant="outline">Back to Dashboard</Button>
            </Link>
        </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round(getStepProgress())}% Complete</span>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="space-y-8">
          {currentStep === 1 && (
            <ResumeUpload 
              onFileUpload={handleResumeUpload}
              onSkipToManual={() => setCurrentStep(2)}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === 2 && (
            <SkillsInput
              initialSkills={extractedSkills}
              currentSkills={userProfile.skills}
              onSkillsUpdate={handleSkillsUpdate}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              onNext={handleNextStep}
              onBack={handlePrevStep}
            />
          )}

          {currentStep === 3 && (
            <CareerInterests
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              onNext={handleSaveProfile}
              onBack={handlePrevStep}
              isLoading={isLoading}
            />
          )}

          {currentStep === 4 && (
            <AssessmentResults userProfile={userProfile} />
          )}
        </div>
      </div>
    </div>
  );
}