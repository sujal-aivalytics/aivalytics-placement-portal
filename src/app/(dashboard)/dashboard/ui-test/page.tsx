'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Rocket,
  Trophy,
  Target,
  Zap
} from "lucide-react";

export default function UITestPage() {
  return (
    <div className="min-h-screen bg-[#f8fcfb] p-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="space-y-4">
          <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">UI Component Library</p>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">
            AiValytics <span className="text-primary italic">Design System</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-3xl">
            A comprehensive showcase of all premium UI components with sharp edges, bold typography, and modern aesthetics.
          </p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Button Variants</h2>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">All button styles with hover effects</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-sm font-black uppercase tracking-wide text-gray-600 mb-4">Default</h3>
              <div className="space-y-3">
                <Button className="w-full">Primary Button</Button>
                <Button className="w-full" size="sm">Small Button</Button>
                <Button className="w-full" size="lg">Large Button</Button>
                <Button className="w-full" size="xl">Extra Large</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-black uppercase tracking-wide text-gray-600 mb-4">Secondary</h3>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full">Secondary</Button>
                <Button variant="outline" className="w-full">Outline</Button>
                <Button variant="ghost" className="w-full">Ghost</Button>
                <Button variant="link" className="w-full">Link</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-black uppercase tracking-wide text-gray-600 mb-4">Status</h3>
              <div className="space-y-3">
                <Button variant="success" className="w-full">Success</Button>
                <Button variant="warning" className="w-full">Warning</Button>
                <Button variant="destructive" className="w-full">Destructive</Button>
                <Button disabled className="w-full">Disabled</Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Form Elements</h2>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Input fields and form controls</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="name@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disabled">Disabled Input</Label>
                  <Input id="disabled" disabled placeholder="Disabled field" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Type your message here..." />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="cursor-pointer">
                    Accept terms and conditions
                  </Label>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Badges</h2>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Status indicators and labels</p>
          </div>
          
          <Card className="p-6">
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </Card>
        </section>

        {/* Alerts Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Alerts</h2>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Notification and message components</p>
          </div>
          
          <div className="space-y-6">
            <Alert>
              <Info className="h-5 w-5" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is a default alert with important information for the user.
              </AlertDescription>
            </Alert>

            <Alert variant="success">
              <CheckCircle2 className="h-5 w-5" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your operation completed successfully! All changes have been saved.
              </AlertDescription>
            </Alert>

            <Alert variant="warning">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Please review your input before proceeding with this action.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                An error occurred while processing your request. Please try again.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Cards</h2>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Content containers with hover effects</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                  <Rocket className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl font-black tracking-tight">Quick Start</CardTitle>
                <CardDescription>Get started with our platform in minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 font-medium">
                  Follow our comprehensive guide to set up your account and begin your journey.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">Learn More</Button>
              </CardFooter>
            </Card>

            <Card className="group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                  <Trophy className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl font-black tracking-tight">Achievements</CardTitle>
                <CardDescription>Track your progress and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 font-medium">
                  View your accomplishments and unlock new challenges as you advance.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">View All</Button>
              </CardFooter>
            </Card>

            <Card className="group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                  <Target className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl font-black tracking-tight">Goals</CardTitle>
                <CardDescription>Set and achieve your objectives</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 font-medium">
                  Define clear goals and monitor your progress with detailed analytics.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">Set Goals</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Progress Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Progress Indicators</h2>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Visual progress tracking</p>
          </div>
          
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <Label>Profile Completion</Label>
                  <span className="text-sm font-black text-primary">75%</span>
                </div>
                <Progress value={75} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <Label>Course Progress</Label>
                  <span className="text-sm font-black text-primary">45%</span>
                </div>
                <Progress value={45} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <Label>Assessment Score</Label>
                  <span className="text-sm font-black text-primary">92%</span>
                </div>
                <Progress value={92} />
              </div>
            </div>
          </Card>
        </section>

        {/* Interactive Demo */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Interactive Demo</h2>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Complete form example</p>
          </div>
          
          <Card className="p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailDemo">Email Address</Label>
                <Input id="emailDemo" type="email" placeholder="john.doe@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea id="feedback" placeholder="Share your thoughts..." />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="newsletter" />
                <Label htmlFor="newsletter" className="cursor-pointer">
                  Subscribe to newsletter
                </Label>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button className="flex-1">Submit</Button>
                <Button variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center py-12 border-t-2 border-gray-100">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
            AiValytics Design System • Premium UI Components
          </p>
        </div>
      </div>
    </div>
  );
}
