import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Sparkles, ArrowRight } from "lucide-react";

export default function ResumeUpload({ onFileUpload, onSkipToManual, isProcessing }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files.find(f => 
      f.type === "application/pdf" || 
      f.type.startsWith("image/") ||
      f.type === "application/msword" ||
      f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    if (file) {
      onFileUpload(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl text-slate-900">
          <Upload className="w-6 h-6 text-indigo-600" />
          Upload Your Resume
        </CardTitle>
        <p className="text-slate-600 mt-2">
          Let our AI analyze your resume to automatically extract your skills and experience
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
            dragActive 
              ? "border-indigo-400 bg-indigo-50" 
              : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {isProcessing ? "Processing Resume..." : "Drop your resume here"}
            </h3>
            
            <p className="text-slate-500 mb-4">
              {isProcessing 
                ? "Our AI is analyzing your resume and extracting skills..." 
                : "or click to browse files"
              }
            </p>

            {!isProcessing && (
              <Button variant="outline" className="mb-4">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            )}

            <p className="text-xs text-slate-400">
              Supports PDF, DOC, DOCX, PNG, JPG • Max 10MB
            </p>
          </div>

          {isProcessing && (
            <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-sm font-medium text-slate-700">Analyzing resume...</p>
              </div>
            </div>
          )}
        </div>

        {/* AI Features */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 mt-1" />
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">AI-Powered Analysis</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Automatically extract technical and soft skills</li>
                <li>• Identify experience level and industry background</li>
                <li>• Suggest skill proficiency levels based on context</li>
                <li>• Parse education and work history</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center pt-4 border-t border-slate-200">
          <p className="text-slate-500 mb-3">
            Don't have a resume ready?
          </p>
          <Button 
            variant="ghost" 
            onClick={onSkipToManual}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold"
            disabled={isProcessing}
          >
            Enter skills manually
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}