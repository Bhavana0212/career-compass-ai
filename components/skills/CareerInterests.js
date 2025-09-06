import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Heart, Target } from "lucide-react";

const COMMON_INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Education", "Marketing",
  "Consulting", "Manufacturing", "Media", "Government", "Non-profit",
  "Retail", "Automotive", "Energy", "Real Estate", "Entertainment"
];

const COMMON_INTERESTS = [
  "Artificial Intelligence", "Web Development", "Data Science", "Cybersecurity",
  "Product Management", "Digital Marketing", "UX/UI Design", "Project Management",
  "Business Analysis", "Software Engineering", "Cloud Computing", "Mobile Development"
];

export default function CareerInterests({ 
  userProfile, 
  setUserProfile, 
  onNext, 
  onBack, 
  isLoading 
}) {
  const [newInterest, setNewInterest] = useState("");
  const [newIndustry, setNewIndustry] = useState("");

  const addInterest = () => {
    if (newInterest.trim() && !userProfile.career_interests.includes(newInterest.trim())) {
      setUserProfile(prev => ({
        ...prev,
        career_interests: [...prev.career_interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest) => {
    setUserProfile(prev => ({
      ...prev,
      career_interests: prev.career_interests.filter(i => i !== interest)
    }));
  };

  const addIndustry = () => {
    if (newIndustry.trim() && !userProfile.preferred_industries.includes(newIndustry.trim())) {
      setUserProfile(prev => ({
        ...prev,
        preferred_industries: [...prev.preferred_industries, newIndustry.trim()]
      }));
      setNewIndustry("");
    }
  };

  const removeIndustry = (industry) => {
    setUserProfile(prev => ({
      ...prev,
      preferred_industries: prev.preferred_industries.filter(i => i !== industry)
    }));
  };

  const addQuickInterest = (interest) => {
    if (!userProfile.career_interests.includes(interest)) {
      setUserProfile(prev => ({
        ...prev,
        career_interests: [...prev.career_interests, interest]
      }));
    }
  };

  const addQuickIndustry = (industry) => {
    if (!userProfile.preferred_industries.includes(industry)) {
      setUserProfile(prev => ({
        ...prev,
        preferred_industries: [...prev.preferred_industries, industry]
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Career Interests Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <Heart className="w-5 h-5 text-pink-600" />
            Career Interests
          </CardTitle>
          <p className="text-slate-600">
            What career areas excite you the most? This helps us recommend the best matches.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Custom Interest */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter a career interest..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addInterest()}
              className="flex-1"
            />
            <Button onClick={addInterest} disabled={!newInterest.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Quick Add Buttons */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-3 block">
              Popular career interests (click to add):
            </Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_INTERESTS.filter(interest => 
                !userProfile.career_interests.includes(interest)
              ).map((interest) => (
                <Button
                  key={interest}
                  variant="outline"
                  size="sm"
                  onClick={() => addQuickInterest(interest)}
                  className="text-sm hover:bg-pink-50 hover:text-pink-700 hover:border-pink-300"
                >
                  {interest}
                </Button>
              ))}
            </div>
          </div>

          {/* Selected Interests */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-3 block">
              Your selected interests:
            </Label>
            <div className="flex flex-wrap gap-2">
              {userProfile.career_interests.length === 0 ? (
                <p className="text-slate-500 italic">No interests selected yet</p>
              ) : (
                userProfile.career_interests.map((interest) => (
                  <Badge 
                    key={interest} 
                    className="bg-pink-100 text-pink-800 hover:bg-pink-200 cursor-pointer flex items-center gap-1"
                    onClick={() => removeInterest(interest)}
                  >
                    {interest}
                    <X className="w-3 h-3" />
                  </Badge>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferred Industries Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <Target className="w-5 h-5 text-indigo-600" />
            Preferred Industries
          </CardTitle>
          <p className="text-slate-600">
            Which industries would you like to work in? Select all that interest you.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Custom Industry */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter an industry..."
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addIndustry()}
              className="flex-1"
            />
            <Button onClick={addIndustry} disabled={!newIndustry.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Quick Add Buttons */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-3 block">
              Common industries (click to add):
            </Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_INDUSTRIES.filter(industry => 
                !userProfile.preferred_industries.includes(industry)
              ).map((industry) => (
                <Button
                  key={industry}
                  variant="outline"
                  size="sm"
                  onClick={() => addQuickIndustry(industry)}
                  className="text-sm hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
                >
                  {industry}
                </Button>
              ))}
            </div>
          </div>

          {/* Selected Industries */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-3 block">
              Your preferred industries:
            </Label>
            <div className="flex flex-wrap gap-2">
              {userProfile.preferred_industries.length === 0 ? (
                <p className="text-slate-500 italic">No industries selected yet</p>
              ) : (
                userProfile.preferred_industries.map((industry) => (
                  <Badge 
                    key={industry} 
                    className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer flex items-center gap-1"
                    onClick={() => removeIndustry(industry)}
                  >
                    {industry}
                    <X className="w-3 h-3" />
                  </Badge>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Goals Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Career Goals</CardTitle>
          <p className="text-slate-600">
            Tell us about your short and long-term career aspirations
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe your career goals, aspirations, and what you hope to achieve in the next 2-5 years..."
            value={userProfile.career_goals}
            onChange={(e) => setUserProfile(prev => ({ ...prev, career_goals: e.target.value }))}
            rows={4}
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          Previous
        </Button>
        <Button 
          onClick={onNext}
          disabled={isLoading || userProfile.career_interests.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isLoading ? "Saving..." : "Complete Assessment"}
        </Button>
      </div>
    </div>
  );
}