// src/app/page.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code2,
  Zap,
  Share2,
  Search,
  Github,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const Page = () => {

  const openInVSCode = () => {
    const start = Date.now();

    window.location.href = "vscode://srinivas-batthula.codesnippets/intro";

    setTimeout(() => {
      const elapsed = Date.now() - start;
      if (elapsed < 600) {
        window.location.href = "vscode:extension/srinivas-batthula.codesnippets";
      }
    }, 500);

    setTimeout(() => {
      const elapsed = Date.now() - start;
      if (elapsed < 1200) {
        window.location.href =
          "https://marketplace.visualstudio.com/items?itemName=srinivas-batthula.codesnippets";
      }
    }, 1000);
  };

  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Code Management",
      description: "Organize and manage your code snippets across multiple languages.",
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Search",
      description: "Find snippets instantly with powerful search and filtering.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Access",
      description: "Access your snippets directly from VSCode with one click.",
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Share & Collaborate",
      description: "Share snippets with your team and collaborate effortlessly.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                  Your Code Snippets, <br className="hidden md:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                    Everywhere
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Save, organize, and access your code snippets seamlessly across the web and your
                  favorite IDE. Supercharge your development workflow.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={openInVSCode}
                  className="group px-8 h-12 text-base font-semibold cursor-pointer"
                >
                  <Code2 className="w-5 h-5" />
                  Open VSCode Extension
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => (window.location.href = "/search")}
                  className="px-8 h-12 text-base font-semibold cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                  Browse Snippets
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">10k+</p>
                  <p className="text-sm text-muted-foreground">Code Snippets</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">5k+</p>
                  <p className="text-sm text-muted-foreground">Snapshots</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">20+</p>
                  <p className="text-sm text-muted-foreground">Languages</p>
                </div>
              </div>
            </div>

            {/* Right Visual - use a real screenshot or illustration */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-[480px] max-w-full">
                {/* soft glow background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/0 rounded-3xl blur-3xl" />
                {/* screenshot container */}
                <div className="relative bg-white dark:bg-slate-800 border border-border rounded-3xl shadow-xl overflow-hidden">
                  <img
                    src="https://source.unsplash.com/600x400/?code,editor" /* replace with project screenshot */
                    alt="App screenshot"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to manage and share your code snippets efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Save Snippets",
                description: "Save code snippets from VSCode or the web platform",
              },
              {
                step: "2",
                title: "Organize",
                description: "Tag and categorize snippets for easy retrieval",
              },
              {
                step: "3",
                title: "Access Anywhere",
                description: "Access your snippets anytime, anywhere you need them",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-primary/30">
                    <ArrowRight className="w-full h-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-primary/5 border-t border-b">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-muted-foreground text-lg">
              Open the extension in VSCode or create an account to start saving snippets today
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={openInVSCode}
              className="px-8 h-12 text-base font-semibold group cursor-pointer"
            >
              <Code2 className="w-5 h-5" />
              Open VSCode Extension
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => (window.location.href = "/profile")}
              className="px-8 h-12 text-base font-semibold cursor-pointer"
            >
              <Github className="w-5 h-5" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Code Snippets</h3>
              <p className="text-sm text-muted-foreground">
                Your personal code snippet manager for all devices
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Security"],
              },
              {
                title: "Resources",
                links: ["Documentation", "Blog", "Support"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "License"],
              },
            ].map((section, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-semibold">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Code Snippets Platform. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/srinivas-batthula/code-snippets-platform" target="_blank" className="text-muted-foreground hover:text-foreground transition">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;