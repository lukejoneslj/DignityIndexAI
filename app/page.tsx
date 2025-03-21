"use client";

import React, { useState } from "react";
import { analyzeDignity, DignityScore } from "@/lib/gemini";
import { DignityScale } from "@/components/dignity-scale";

// Simple UI component replacements
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button = ({ children, onClick, disabled, className = "" }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

interface TextareaProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea = ({ placeholder, className = "", value, onChange }: TextareaProps) => (
  <textarea
    placeholder={placeholder}
    className={`w-full border border-gray-300 rounded-md p-2 ${className}`}
    value={value}
    onChange={onChange}
  />
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }: CardProps) => <div className={`p-4 border-b ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }: CardProps) => <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = "" }: CardProps) => <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
const CardContent = ({ children, className = "" }: CardProps) => <div className={`p-4 ${className}`}>{children}</div>;
const CardFooter = ({ children, className = "" }: CardProps) => <div className={`p-4 border-t ${className}`}>{children}</div>;

interface ProgressProps {
  value: number;
  className?: string;
}

const Progress = ({ value, className = "" }: ProgressProps) => (
  <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
    <div
      className="bg-blue-600 h-full rounded-full"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "secondary";
  className?: string;
}

const Badge = ({ children, variant = "default", className = "" }: BadgeProps) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    secondary: "bg-purple-100 text-purple-800",
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface LoaderProps {
  className?: string;
}

const Loader2 = ({ className = "" }: LoaderProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`animate-spin ${className}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const toast = {
  error: (message: string) => {
    console.error(message);
    alert(message);
  }
};

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DignityScore | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    try {
      setIsAnalyzing(true);
      const analysis = await analyzeDignity(inputText);
      setResult(analysis);
    } catch (error) {
      console.error("Error analyzing text:", error);
      toast.error("Failed to analyze text. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getBadgeColor = (score: number) => {
    if (score <= 2) return "destructive";
    if (score <= 4) return "warning";
    if (score <= 6) return "secondary";
    return "success";
  };

  const getScoreColor = (score: number) => {
    if (score <= 2) return "text-red-500";
    if (score <= 4) return "text-orange-500";
    if (score <= 6) return "text-blue-500";
    return "text-green-500";
  };

  const getDignityDescription = (score: number) => {
    switch (score) {
      case 1: return "Level one escalates from violent words to violent actions.";
      case 2: return "Level two accuses the other side of promoting evil.";
      case 3: return "Level three attacks the other side's moral character.";
      case 4: return "Level four mocks and attacks the other side's background or beliefs.";
      case 5: return "Level five listens to other views and explains own goals.";
      case 6: return "Level six works with others to find common ground.";
      case 7: return "Level seven fully engages with the other side to discuss disagreements.";
      case 8: return "Seeing oneself in every human being, offering dignity to everyone.";
      default: return "";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Dignity Index Evaluator</h1>
          <p className="text-xl text-muted-foreground">
            Analyze your text along the 8-point Dignity Index scale from contempt to dignity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Input Your Text</CardTitle>
                <CardDescription>
                  Paste in social media posts, writings, or any text you'd like to evaluate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter text to analyze..."
                  className="min-h-32"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Text"
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {result && (
              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Analysis Results</CardTitle>
                    <Badge variant={result.category === "contempt" ? "destructive" : "success"}>
                      {result.category === "contempt" ? "Contempt" : "Dignity"}
                    </Badge>
                  </div>
                  <CardDescription>{getDignityDescription(result.score)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Contempt</span>
                      <span>Dignity</span>
                    </div>
                    <Progress value={result.score * 12.5} className="h-3" />
                    <div className="flex justify-between items-center">
                      <span>Score:</span>
                      <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}/8
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Explanation:</h3>
                    <p className="text-muted-foreground">{result.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <DignityScale />
            
            <Card>
              <CardHeader>
                <CardTitle>About The Dignity Index</CardTitle>
                <CardDescription>Preventing violence, easing divisions, solving problems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  The Dignity Index scores distinct phrases along an eight-point scale from contempt to dignity. Lower scores (1-4) reflect divisive language while higher scores (5-8) reflect language grounded in dignity.
                </p>
                <p>
                  By focusing on the speech and not the speaker, the Dignity Index is designed to draw our attention away from the biases of partisan politics and toward the power we each have to heal our country and each other.
                </p>
                <p className="font-medium">
                  This evaluation uses Google's Gemini AI to analyze text in a similar way to how trained human scorers would evaluate it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
} 