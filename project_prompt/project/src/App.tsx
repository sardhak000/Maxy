import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, Target, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

const problems = [
  {
    id: "basic",
    title: "Basic Prompting",
    problem: "Write a prompt to get ChatGPT to tell you about the water cycle in simple words.",
    skill: "Clarity & Simplicity",
    icon: <BookOpen className="w-4 h-4" />,
    color: "bg-green-100 text-green-800",
    example: "Explain the water cycle like you're talking to a 10-year-old using simple words and examples."
  },
  {
    id: "intermediate",
    title: "Intermediate Prompting",
    problem: "Write a prompt that asks ChatGPT to compare two historical events and present them in tabular format.",
    skill: "Structured Output",
    icon: <Target className="w-4 h-4" />,
    color: "bg-blue-100 text-blue-800",
    example: "Compare World War I and World War II in a table format with columns for causes, duration, major participants, and outcomes."
  },
  {
    id: "advanced",
    title: "Advanced Prompting",
    problem: "Create a prompt that gets ChatGPT to generate code for a to-do list app and explain it line by line.",
    skill: "Multi-step Reasoning",
    icon: <Brain className="w-4 h-4" />,
    color: "bg-purple-100 text-purple-800",
    example: "Create a React to-do list component with add, delete, and mark complete functionality. Provide the complete code and then explain each section line by line, including the purpose of each function and how the state management works."
  }
];

const evaluatePrompt = (input: string, problemType: string) => {
  const suggestions = [];
  const warnings = [];
  
  // Basic validation
  if (input.length < 10) {
    warnings.push("Your prompt is too short. Add more detail to guide the AI better.");
    return { suggestions, warnings, score: 1 };
  }
  
  if (input.length < 30) {
    suggestions.push("Consider adding more context or specific requirements.");
  }
  
  // Problem-specific evaluation
  if (problemType === "basic") {
    if (!input.toLowerCase().includes("simple") && !input.toLowerCase().includes("easy")) {
      suggestions.push("For basic explanations, specify you want simple language.");
    }
    if (!input.toLowerCase().includes("explain") && !input.toLowerCase().includes("tell")) {
      suggestions.push("Use clear instruction words like 'explain' or 'tell me about'.");
    }
    if (input.toLowerCase().includes("like") && input.toLowerCase().includes("old")) {
      suggestions.push("Great! You're using age-appropriate language guidance.");
    }
  }
  
  if (problemType === "intermediate") {
    if (!input.toLowerCase().includes("table") && !input.toLowerCase().includes("format")) {
      warnings.push("Don't forget to specify the table format for structured output.");
    }
    if (!input.toLowerCase().includes("compare")) {
      suggestions.push("Make sure to explicitly ask for a comparison.");
    }
    if (input.toLowerCase().includes("columns")) {
      suggestions.push("Excellent! You're specifying the table structure.");
    }
  }
  
  if (problemType === "advanced") {
    if (!input.toLowerCase().includes("code") && !input.toLowerCase().includes("programming")) {
      warnings.push("Remember to ask for code generation specifically.");
    }
    if (!input.toLowerCase().includes("explain") && !input.toLowerCase().includes("comment")) {
      suggestions.push("Don't forget to ask for explanations of the code.");
    }
    if (input.toLowerCase().includes("line by line") || input.toLowerCase().includes("step by step")) {
      suggestions.push("Perfect! You're asking for detailed explanations.");
    }
  }
  
  // General quality checks
  if (input.includes("?")) {
    suggestions.push("Good use of question format!");
  }
  
  if (input.split(" ").length > 20) {
    suggestions.push("Your prompt is detailed - this usually leads to better results.");
  }
  
  // Calculate score
  let score = 3;
  if (suggestions.length > 2) score = 5;
  if (warnings.length > 0) score = Math.max(1, score - warnings.length);
  
  return { suggestions, warnings, score };
};

export default function App() {
  const [tab, setTab] = useState("basic");
  const [promptInput, setPromptInput] = useState("");
  const [evaluation, setEvaluation] = useState<{ suggestions: string[], warnings: string[], score: number } | null>(null);
  const [showExample, setShowExample] = useState(false);

  const currentProblem = problems.find((p) => p.id === tab);

  const handleEvaluate = () => {
    if (!currentProblem) return;
    const result = evaluatePrompt(promptInput, currentProblem.id);
    setEvaluation(result);
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreText = (score: number) => {
    if (score >= 4) return "Excellent";
    if (score >= 3) return "Good";
    if (score >= 2) return "Needs Work";
    return "Poor";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prompting Practice Lab
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Master the art of AI prompting through interactive exercises and real-time feedback
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Practice Area */}
          <div className="lg:col-span-2">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                {problems.map((problem) => (
                  <TabsTrigger
                    key={problem.id}
                    value={problem.id}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    {problem.icon}
                    {problem.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {problems.map((problem) => (
                <TabsContent key={problem.id} value={problem.id} className="space-y-6">
                  {/* Problem Card */}
                  <Card className="border-2 border-slate-200 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-2xl font-bold text-slate-800">
                            {problem.title}
                          </CardTitle>
                          <Badge className={`${problem.color} font-medium`}>
                            {problem.skill}
                          </Badge>
                        </div>
                        <div className="p-2 bg-slate-100 rounded-lg">
                          {problem.icon}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                        <h3 className="font-semibold text-slate-800 mb-2">📝 Challenge</h3>
                        <p className="text-slate-700 leading-relaxed">{problem.problem}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Input Area */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        Your Prompt
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        value={promptInput}
                        onChange={(e) => setPromptInput(e.target.value)}
                        placeholder="Write your prompt here... Be specific and clear!"
                        rows={6}
                        className="resize-none border-2 focus:border-blue-500 transition-colors"
                      />
                      
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={handleEvaluate}
                          disabled={promptInput.length < 5}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
                        >
                          Evaluate Prompt
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => setShowExample(!showExample)}
                          className="font-medium"
                        >
                          {showExample ? "Hide" : "Show"} Example
                        </Button>
                      </div>

                      {/* Example */}
                      {showExample && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2">💡 Example Prompt</h4>
                          <p className="text-green-700 italic">"{problem.example}"</p>
                        </div>
                      )}

                      {/* Evaluation Results */}
                      {evaluation && (
                        <div className="space-y-4 mt-6">
                          <Separator />
                          
                          {/* Score */}
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-slate-700">Score:</span>
                            <span className={`text-2xl font-bold ${getScoreColor(evaluation.score)}`}>
                              {evaluation.score}/5
                            </span>
                            <Badge variant="outline" className={getScoreColor(evaluation.score)}>
                              {getScoreText(evaluation.score)}
                            </Badge>
                          </div>

                          {/* Warnings */}
                          {evaluation.warnings.length > 0 && (
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                              <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Issues to Fix
                              </h4>
                              <ul className="space-y-1">
                                {evaluation.warnings.map((warning, i) => (
                                  <li key={i} className="text-red-700 text-sm">• {warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Suggestions */}
                          {evaluation.suggestions.length > 0 && (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Suggestions
                              </h4>
                              <ul className="space-y-1">
                                {evaluation.suggestions.map((suggestion, i) => (
                                  <li key={i} className="text-blue-700 text-sm">• {suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rules Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">
                  📚 Prompting Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Be clear & specific about what you want",
                    "Tell the AI how to respond (format, tone, style)",
                    "Use examples to guide complex prompts",
                    "Break big tasks into smaller subtasks",
                    "Iterate and improve based on output",
                    "For coding, define input/output & ask for explanation"
                  ].map((rule, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-slate-700 leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">
                  💡 Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Context is key:</strong> Give the AI background information for better results.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Be specific:</strong> Instead of "write code", say "write Python code for a calculator".
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Ask for examples:</strong> Request examples when you want to understand concepts better.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}