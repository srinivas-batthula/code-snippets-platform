"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code2,
  Zap,
  Share2,
  Search,
  Github,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const typingContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.6,
    },
  },
};

const typingLine = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

const Page = () => {
  const openInVSCode = () => {
    const start = Date.now();

    window.location.href = "vscode://srinivas-batthula.snipzen/intro";

    setTimeout(() => {
      const elapsed = Date.now() - start;
      if (elapsed < 600) {
        window.location.href =
          "vscode:extension/srinivas-batthula.snipzen";
      }
    }, 500);

    setTimeout(() => {
      const elapsed = Date.now() - start;
      if (elapsed < 1200) {
        window.location.href =
          "https://marketplace.visualstudio.com/items?itemName=srinivas-batthula.snipzen";
      }
    }, 1000);
  };

  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Snippet Versioning",
      description:
        "Track changes, update snippets, and maintain version history like a real dev workflow.",
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Instant Search Engine",
      description:
        "Lightning-fast filtering powered by structured metadata and tagging.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Environment Snapshots",
      description:
        "Export and import your VSCode setup including extensions and configuration.",
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Team Collaboration",
      description:
        "Share snippet collections securely with teammates and collaborate efficiently.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* LEFT SIDE — UNCHANGED */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              <motion.div variants={fadeUp} className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                  Your Code Snippets, <br className="hidden md:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                    Everywhere
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">
                  A production-ready developer platform to sync, version, and
                  manage your <strong>Code-Snippets</strong> &{" "}
                  <strong>Environment-Snapshots</strong> across devices.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={openInVSCode} className="group px-8 h-12 text-base font-semibold cursor-pointer">
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
              </motion.div>
            </motion.div>

            {/* RIGHT SIDE — MODIFIED ONLY HERE */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:flex justify-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative w-[520px] max-w-full"
              >
                <div className="absolute -inset-10 bg-gradient-to-tr from-primary/30 via-primary/10 to-transparent rounded-full blur-3xl opacity-40" />

                <div className="relative bg-[#1e1e1e] border border-border rounded-3xl shadow-2xl overflow-hidden">

                  <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/40">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                    <span className="ml-4 text-xs text-muted-foreground">
                      SnipZen - VSCode Extension
                    </span>
                  </div>

                  {/* Typing Code Area */}
                  <motion.div
                    variants={typingContainer}
                    initial="hidden"
                    animate="show"
                    className="p-6 space-y-4 font-mono text-sm leading-relaxed select-none pointer-events-none"
                  >

                    <motion.div variants={typingLine}>
                      <span className="text-blue-400">const</span>{" "}
                      <span className="text-yellow-300">connectDB</span>{" "}
                      <span className="text-white">=</span>{" "}
                      <span className="text-blue-400">async</span>{" "}
                      <span className="text-white">() =&gt;</span>{" "}
                      <span className="text-white">{"{"}</span>
                    </motion.div>

                    <motion.div variants={typingLine} className="pl-6">
                      <span className="text-blue-400">await</span>{" "}
                      <span className="text-green-400">mongoose</span>
                      <span className="text-white">.</span>
                      <span className="text-yellow-300">connect</span>
                      <span className="text-white">(</span>
                      <span className="text-purple-400">process</span>
                      <span className="text-white">.</span>
                      <span className="text-purple-400">env</span>
                      <span className="text-white">.</span>
                      <span className="text-orange-400">MONGO_URI</span>
                      <span className="text-white">);</span>
                    </motion.div>

                    <motion.div variants={typingLine}>
                      <span className="text-white">{"}"}</span>
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="ml-1 text-white"
                      >
                        |
                      </motion.span>
                    </motion.div>

                    <motion.div variants={typingLine} className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-2">
                        Synced Snapshot
                      </p>
                      <p className="text-sm font-semibold">
                        ✔ Backend Setup Environment
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Node • MongoDB • JWT • Express
                      </p>
                    </motion.div>

                    <motion.div variants={typingLine} className="flex items-center gap-2 text-green-500 text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      Synced across 2 devices
                    </motion.div>

                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features</h2>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeUp}>
              <Card className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
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