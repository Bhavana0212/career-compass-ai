import React, { useState } from "react";
import { UserProfile } from "@/entities/UserProfile";
import { User } from "@/entities/User";
import { UploadFile, InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, FileText, Upload, Wand2, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const DEMO_OPTIMIZED_TEXT = `
**✨ AI-Powered Improvement Tips:**

**1. Quantify Your Achievements**
*Original:*
- Used Python for data tasks.
*Improved:*
- Developed automation scripts in Python using Pandas and NumPy to process and clean datasets, reducing manual data entry work by over 30% and improving data accuracy.

**2. Use Action Verbs**
*Original:*
- Worked on a team project.
*Improved:*
- Collaborated in an Agile team of 4 to design, develop, and deploy a web application feature, leading to a 15% increase in user engagement.

**3. Highlight Keyword Skills**
*Original:*
- Familiar with cloud services.
*Improved:*
- Deployed and managed containerized applications on AWS using Docker and Kubernetes, resulting in a 20% improvement in deployment efficiency.
`;

export default function ResumeTools() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [optimizedText, setOptimizedText] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);
    try {
      // This is a simplified version. A full implementation would use a text extraction service.
      // For this prototype, we'll use a prompt to simulate text extraction for PDFs/DOCs.
      const { file_url } = await UploadFile({ file });
      const extractionResult = await InvokeLLM({
        prompt: `Extract all text content from the provided document. Present it as a single block of text.`,
        file_urls: [file_url],
      });
      setResumeText(extractionResult);
    } catch (error) {
      console.error("Error processing file:", error);
    }
    setIsUploading(false);
  };
  
  const handleOptimize = async () => {
    if (!resumeText || !jobDescription) return;
    setIsOptimizing(true);
    setOptimizedText("");
    
    // For hackathon demo, show static tips immediately
    setTimeout(() => {
        setOptimizedText(DEMO_OPTIMIZED_TEXT);
        setIsOptimizing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <FileText className="w-10 h-10 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Resume Optimizer</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-2">
            Tailor your resume for any job description with AI-powered suggestions.
          </p>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link to={createPageUrl("InterviewPrep")}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous: Interview
            </Button>
          </Link>
          <Link to={createPageUrl("Dashboard")}>
            <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
              Back to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Side */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Your Resume & Target Job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button asChild variant="outline">
                    <label htmlFor="resume-upload" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" /> 
                        {isUploading ? "Uploading..." : "Upload Resume"}
                    </label>
                </Button>
                <input id="resume-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
                {fileName && <p className="text-sm text-slate-500 mt-2">{fileName}</p>}
                <Textarea
                  placeholder="... or paste your resume text here."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={10}
                  className="mt-2"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Paste the target job description here."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                />
              </div>
              <Button onClick={handleOptimize} disabled={isOptimizing || !resumeText || !jobDescription} className="w-full">
                {isOptimizing ? "Optimizing..." : <><Wand2 className="w-4 h-4 mr-2" />Optimize My Resume</>}
              </Button>
            </CardContent>
          </Card>

          {/* Output Side */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              {isOptimizing && <p className="text-slate-500 animate-pulse">Generating suggestions...</p>}
              {!isOptimizing && !optimizedText && (
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle>Ready to Optimize!</AlertTitle>
                  <AlertDescription>
                    Your AI-powered suggestions will appear here once you provide your resume and a job description.
                  </AlertDescription>
                </Alert>
              )}
              {optimizedText && <Textarea value={optimizedText} readOnly rows={23} className="bg-slate-50 font-mono text-xs" />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}