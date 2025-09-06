import React, { useState, useEffect, useCallback } from "react";
import { InterviewPrep, UserProfile, CareerPath } from "@/entities/all";
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
import { MessageSquare, Sparkles, BrainCircuit, Users, ArrowLeft, ArrowRight, ShieldCheck, UserCheck, Languages, Hand } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import QuestionCard from "../components/interview/QuestionCard";
import PracticeSession from "../components/interview/PracticeSession";

const DEMO_CAREERS = [
  { id: "data-analyst", name: "Data Analyst" },
  { id: "software-engineer", name: "Software Engineer" },
  { id: "product-manager", name: "Product Manager" },
  { id: "ui-ux-designer", name: "UI/UX Designer" },
  { id: "business-analyst", name: "Business Analyst" }
];

const DEMO_QUESTIONS = {
  "data-analyst": {
    technical: [
      {
        question: "What is the difference between INNER JOIN and LEFT JOIN in SQL?",
        suggested_answer: "An INNER JOIN returns only the rows where the join condition is met in both tables. A LEFT JOIN returns all rows from the left table, and the matched rows from the right table. If there is no match in the right table, the result is NULL on the right side.",
        key_points: ["INNER JOIN: only matching rows", "LEFT JOIN: all from left, matches from right", "NULL values for non-matches"],
        difficulty_level: "entry"
      },
      {
        question: "How would you handle missing data in a dataset?",
        suggested_answer: "There are several approaches: 1) Remove rows with missing data if the dataset is large enough, 2) Fill missing values with mean/median/mode, 3) Use forward fill or backward fill for time series, 4) Use predictive models to estimate missing values, 5) Create a separate category for missing values if they're meaningful.",
        key_points: ["Assess the pattern of missing data", "Choose appropriate imputation method", "Consider the impact on analysis"],
        difficulty_level: "mid"
      }
    ],
    behavioral: [
      {
        question: "Tell me about a time you had to work with a messy dataset. How did you handle it?",
        suggested_answer: "In my university project, I received a customer dataset with 30% missing values, inconsistent date formats, and duplicate entries. I used Python's pandas to systematically clean the data: removed exact duplicates, standardized date formats using datetime, and filled missing numerical values with median values. This process took 2 days but resulted in a clean dataset that improved our model accuracy by 15%.",
        key_points: ["Describe the specific data quality issues", "Explain your systematic cleaning approach", "Quantify the positive outcome"],
        difficulty_level: "entry"
      }
    ]
  },
  "software-engineer": {
    technical: [
      {
        question: "Explain the difference between == and === in JavaScript.",
        suggested_answer: "== (equality operator) performs type coercion and compares values after converting them to the same type. === (strict equality operator) compares both value and type without any conversion. For example: '5' == 5 returns true, but '5' === 5 returns false.",
        key_points: ["== allows type coercion", "=== checks both value and type", "=== is generally preferred for reliability"],
        difficulty_level: "entry"
      },
      {
        question: "What are the principles of Object-Oriented Programming?",
        suggested_answer: "The four main principles are: 1) Encapsulation - bundling data and methods together and hiding internal details, 2) Inheritance - creating new classes based on existing ones, 3) Polymorphism - objects of different types responding to the same interface, 4) Abstraction - hiding complex implementation details behind simple interfaces.",
        key_points: ["Encapsulation: data hiding", "Inheritance: code reuse", "Polymorphism: same interface, different behaviors", "Abstraction: simplified interfaces"],
        difficulty_level: "mid"
      }
    ],
    behavioral: [
      {
        question: "Describe a challenging bug you encountered and how you solved it.",
        suggested_answer: "I once spent hours debugging a memory leak in a React application. The app would slow down after extended use. I used Chrome DevTools to identify that event listeners weren't being cleaned up in useEffect hooks. I systematically added cleanup functions to remove event listeners when components unmounted. This reduced memory usage by 40% and eliminated the performance issues.",
        key_points: ["Describe the problem clearly", "Explain your debugging approach", "Mention tools used", "Quantify the improvement"],
        difficulty_level: "mid"
      }
    ]
  },
  "product-manager": {
    behavioral: [
      {
        question: "How do you prioritize features when you have limited resources?",
        suggested_answer: "I use a framework combining impact and effort analysis. First, I gather data on user needs through surveys and analytics. Then I score each feature on business impact (revenue, user engagement, strategic alignment) and development effort. I create a prioritization matrix plotting impact vs effort, focusing on high-impact, low-effort features first. I also consider dependencies and technical debt.",
        key_points: ["Use data-driven approach", "Consider impact vs effort", "Involve stakeholders in decisions", "Account for technical constraints"],
        difficulty_level: "mid"
      },
      {
        question: "Tell me about a product decision you made that didn't go as expected.",
        suggested_answer: "I decided to add a complex filtering feature to our app based on power user feedback. After launch, analytics showed only 5% adoption. I learned that we had optimized for vocal minority instead of silent majority. I conducted broader user research and found most users preferred simple search. We pivoted to improve search functionality, which increased usage by 25%.",
        key_points: ["Own the mistake honestly", "Explain what you learned", "Show how you recovered", "Demonstrate data-driven thinking"],
        difficulty_level: "senior"
      }
    ],
    technical: [
      {
        question: "How would you measure the success of a new feature?",
        suggested_answer: "I'd establish both leading and lagging indicators. Leading indicators might include adoption rate, user engagement with the feature, and support ticket volume. Lagging indicators could be retention, user satisfaction scores, and business metrics like revenue or conversion rates. I'd set up A/B tests to measure impact and use cohort analysis to track long-term effects.",
        key_points: ["Define clear success metrics upfront", "Use both leading and lagging indicators", "Implement proper measurement tools", "Consider long-term vs short-term impact"],
        difficulty_level: "mid"
      }
    ]
  },
  "ui-ux-designer": {
    behavioral: [
      {
        question: "Walk me through your design process.",
        suggested_answer: "I start with user research to understand needs and pain points through interviews and surveys. Then I define the problem and create user personas and journey maps. I ideate solutions through sketching and brainstorming, create wireframes and prototypes, and conduct usability testing with real users. I iterate based on feedback and work closely with developers during implementation to ensure the vision is maintained.",
        key_points: ["Start with user research", "Define clear problem statements", "Iterate based on user feedback", "Collaborate with development team"],
        difficulty_level: "entry"
      },
      {
        question: "How do you handle disagreements about design decisions?",
        suggested_answer: "I approach disagreements by first understanding the underlying concerns and business objectives. I present user research data and usability testing results to support my design decisions. If needed, I propose A/B testing different approaches to let data guide the decision. I'm always willing to compromise while ensuring we don't sacrifice user experience for short-term gains.",
        key_points: ["Listen to understand concerns", "Use data to support decisions", "Propose testing when uncertain", "Focus on user needs"],
        difficulty_level: "mid"
      }
    ],
    technical: [
      {
        question: "How do you ensure your designs are accessible?",
        suggested_answer: "I follow WCAG guidelines and design with accessibility in mind from the start. I use sufficient color contrast (4.5:1 minimum), ensure all interactive elements are keyboard accessible, provide alt text for images, and use semantic HTML structures. I test with screen readers and involve users with disabilities in usability testing when possible.",
        key_points: ["Follow WCAG guidelines", "Design for keyboard navigation", "Use proper color contrast", "Test with assistive technologies"],
        difficulty_level: "mid"
      }
    ]
  },
  "business-analyst": {
    behavioral: [
      {
        question: "Describe a time when you had to analyze complex business requirements.",
        suggested_answer: "I was tasked with improving our customer onboarding process that had a 40% drop-off rate. I conducted stakeholder interviews, analyzed user journey data, and mapped the current process. I discovered the main pain point was a lengthy form on step 3. I proposed breaking it into smaller steps and adding progress indicators. After implementation, we reduced drop-off to 15% and increased conversions by 60%.",
        key_points: ["Describe the business problem clearly", "Explain your analytical approach", "Show how you gathered requirements", "Quantify the business impact"],
        difficulty_level: "mid"
      }
    ],
    technical: [
      {
        question: "How do you gather and validate business requirements?",
        suggested_answer: "I use multiple techniques: stakeholder interviews to understand needs and constraints, workshops to align different perspectives, process mapping to visualize current state, and prototyping to validate understanding. I document requirements clearly with acceptance criteria and get formal sign-off from key stakeholders. I also prioritize requirements based on business value and feasibility.",
        key_points: ["Use multiple requirement gathering techniques", "Validate understanding with stakeholders", "Document clearly with acceptance criteria", "Prioritize based on business value"],
        difficulty_level: "entry"
      },
      {
        question: "What's your approach to process improvement?",
        suggested_answer: "I start by mapping the current process and identifying pain points through data analysis and stakeholder feedback. I benchmark against industry standards and best practices. Then I design the future state process, considering automation opportunities and resource constraints. I create a change management plan and measure success through KPIs like efficiency gains, error reduction, and user satisfaction.",
        key_points: ["Map current state thoroughly", "Identify pain points with data", "Design future state with stakeholders", "Plan for change management"],
        difficulty_level: "mid"
      }
    ]
  }
};

const BestPractices = () => (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="w-6 h-6 text-green-600" />
                Interview Best Practices
            </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-slate-800">Professional Appearance</h4>
                    <p className="text-sm text-slate-600">Dress one level above the company's dress code. Ensure a clean, neutral background for virtual interviews.</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <Hand className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-slate-800">Body Language</h4>
                    <p className="text-sm text-slate-600">Sit up straight, maintain eye contact, and use subtle hand gestures. A confident posture signals engagement.</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <Languages className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-slate-800">Communication Skills</h4>
                    <p className="text-sm text-slate-600">Speak clearly and concisely. Use the STAR method (Situation, Task, Action, Result) for behavioral questions.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-slate-800">Etiquette</h4>
                    <p className="text-sm text-slate-600">Send a thank-you note within 24 hours. Research your interviewers on LinkedIn beforehand.</p>
                </div>
            </div>
        </CardContent>
    </Card>
);


export default function InterviewPrepPage() {
  const [questions, setQuestions] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [selectedCareerId, setSelectedCareerId] = useState("");
  const [questionType, setQuestionType] = useState("behavioral");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [practiceQuestion, setPracticeQuestion] = useState(null);

  const loadDemoQuestions = useCallback(() => {
    const careerQuestions = DEMO_QUESTIONS[selectedCareerId];
    if (careerQuestions && careerQuestions[questionType]) {
      const demoQuestions = careerQuestions[questionType].map((q, index) => ({
        id: `demo-${selectedCareerId}-${questionType}-${index}`,
        career_focus: DEMO_CAREERS.find(c => c.id === selectedCareerId)?.name || "Data Analyst",
        question_type: questionType,
        ...q
      }));
      setQuestions(demoQuestions);
    } else {
      setQuestions([]);
    }
  }, [selectedCareerId, questionType]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCareerId && questionType) {
        loadDemoQuestions();
    }
  }, [selectedCareerId, questionType, loadDemoQuestions]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const [profiles, careers, prepQuestions] = await Promise.all([
        UserProfile.filter({ created_by: user.email }),
        CareerPath.filter({ recommended_for_user: user.id }),
        InterviewPrep.filter({ generated_for_user: user.id }),
      ]);
      setUserProfile(profiles[0]);
      setCareerPaths(careers);
      
      if (prepQuestions.length > 0) {
        setQuestions(prepQuestions);
      }
      
      if (careers.length > 0) {
        setSelectedCareerId(careers[0].title.toLowerCase().replace(/\s+/g, '-'));
      } else {
        setSelectedCareerId("data-analyst");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      // Use demo data as fallback
      setSelectedCareerId("data-analyst");
    }
    setIsLoading(false);
  };

  const generateNewQuestions = async () => {
    if (!userProfile || !selectedCareerId || !questionType) return;
    setIsGenerating(true);
    // For demo purposes, just reload the demo questions
    setTimeout(() => {
      loadDemoQuestions();
      setIsGenerating(false);
    }, 1500);
  };
  
  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-slate-200 rounded-3xl"></div>
          <div className="h-20 bg-slate-200 rounded-2xl"></div>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (practiceQuestion) {
    return <PracticeSession question={practiceQuestion} onBack={() => setPracticeQuestion(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <MessageSquare className="w-10 h-10 mx-auto text-orange-600 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Interview Prep</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-2">
            Practice AI-generated questions tailored to your target career and boost your confidence.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link to={createPageUrl("ProjectLab")}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous: Projects
            </Button>
          </Link>
          <Link to={createPageUrl("ResumeTools")}>
            <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
              Next: Resume Tools
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Controls */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Select Career</label>
                  <Select value={selectedCareerId} onValueChange={setSelectedCareerId}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select Career" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEMO_CAREERS.map(career => (
                        <SelectItem key={career.id} value={career.id}>{career.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Question Type</label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Question Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="behavioral">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Behavioral
                        </div>
                      </SelectItem>
                      <SelectItem value="technical">
                        <div className="flex items-center gap-2">
                          <BrainCircuit className="w-4 h-4" />
                          Technical
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={generateNewQuestions} disabled={isGenerating || !selectedCareerId}>
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Questions
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Best Practices */}
        <BestPractices />

        {/* Questions List */}
        <div className="space-y-4">
          {questions.length === 0 ? (
            <Card className="p-12 text-center text-slate-500">
              <MessageSquare className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Questions Available</h3>
              <p>Select a career and question type, then generate questions to begin your practice.</p>
            </Card>
          ) : (
            questions.map(q => (
              <QuestionCard key={q.id} question={q} onPractice={setPracticeQuestion} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}