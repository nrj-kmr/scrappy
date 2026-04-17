'use client';

import Link from 'next/link';
import { motion, Variants } from 'motion/react';
import {
  Sparkles,
  Terminal,
  Share2,
  BrainCircuit,
  Rocket,
  ArrowRight,
  FileText,
  Code2,
  PenTool,
  Video,
  CheckCircle2,
} from 'lucide-react';
import { SiX, SiYoutube, SiGithub, SiHashnode } from 'react-icons/si';
import { FaLinkedinIn } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

export default function LandingPage() {
  return (
    <div className="w-full relative overflow-hidden">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-150 h-150 -z-10 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* HERO SECTION */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full mb-8 border border-border shadow-sm animate-pulse"
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            new Launch
          </span>
          <Sparkles className="w-3 h-3 text-primary" />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-bricolage font-extrabold text-5xl md:text-7xl tracking-tighter leading-[1.05] mb-2 text-foreground/90 max-w-4xl"
        >
          <span className="block text-2xl md:text-3xl text-muted-foreground font-medium tracking-tight">
            From one
            <span className="relative italic inline-block px-2 mx-2 border border-dashed border-foreground/20 bg-foreground/5 font-instrument">
              <span className="absolute -top-1.5 -left-1.5 w-1 h-1 bg-background border border-foreground/50" />
              <span className="absolute -top-1.5 -right-1.5 w-1 h-1 bg-background border border-foreground/50" />
              <span className="absolute -bottom-1.5 -left-1.5 w-1 h-1 bg-background border border-foreground/50" />
              <span className="absolute -bottom-1.5 -right-1.5 w-1 h-1 bg-background border border-foreground/50" />
              source link,
            </span>
          </span>
          <span className="italic font-instrument text-foreground tracking-normal">architect</span>{' '}
          your narrative.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-sans text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
        >
          Repurpose your own content, or extract the signal from external tutorials to
          <span className="relative italic inline-block px-2 mx-2 border border-dashed border-foreground/70 bg-foreground/10 font-bricolage tracking-tight font-semibold text-foreground">
            {/* UI Selection Handles */}
            <span className="absolute -top-1.5 -left-1.5 w-1 h-1 bg-background border border-foreground/50" />
            <span className="absolute -top-1.5 -right-1.5 w-1 h-1 bg-background border border-foreground/50" />
            <span className="absolute -bottom-1.5 -left-1.5 w-1 h-1 bg-background border border-foreground/50" />
            <span className="absolute -bottom-1.5 -right-1.5 w-1 h-1 bg-background border border-foreground/50" />
            inject your unique commentary.
          </span>
          Zero friction. Just one click to deploy your insights everywhere.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto"
        >
          <Button
            asChild
            size="lg"
            className="h-12 px-8 rounded-xl font-bold text-sm bg-foreground text-background hover:bg-foreground/90 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Link href="/login">
              Initialize Engine <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 rounded-xl font-bold text-sm bg-background text-foreground hover:bg-muted shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 border border-border"
          >
            <Link href="#solutions">
              <Terminal className="w-4 h-4 mr-2" /> View Live Demo
            </Link>
          </Button>
        </motion.div>

        {/* VISUAL ARCHITECTURE DEMO */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-5xl bg-card p-2 rounded-[2rem] border border-border shadow-2xl relative z-10 overflow-hidden"
        >
          <div className="bg-muted/30 rounded-[1.5rem] p-6 md:p-10 border border-border/50 relative overflow-hidden">
            {/* The Curvy Connecting Lines (Hidden on Mobile for cleaner stacking) */}
            <div className="absolute inset-0 pointer-events-none hidden md:block z-0">
              {/* We use preserveAspectRatio="none" to let the SVG stretch dynamically with the Flex container */}
              <svg
                className="w-full h-full text-border/80"
                viewBox="0 0 1000 400"
                preserveAspectRatio="none"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {/* Left Side Curves sweeping to Center */}
                <path d="M 250,80 C 400,80 400,200 500,200" vectorEffect="non-scaling-stroke" />
                <path d="M 250,200 C 400,200 400,200 500,200" vectorEffect="non-scaling-stroke" />
                <path d="M 250,320 C 400,320 400,200 500,200" vectorEffect="non-scaling-stroke" />
                {/* Center sweeping to Right Side Curves */}
                <path d="M 500,200 C 600,200 600,80 750,80" vectorEffect="non-scaling-stroke" />
                <path d="M 500,200 C 600,200 600,200 750,200" vectorEffect="non-scaling-stroke" />
                <path d="M 500,200 C 600,200 600,320 750,320" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative z-10">
              <div className="flex-1 w-full space-y-6">
                <div className="px-6 py-4 bg-background rounded-xl border border-border flex items-center gap-4 shadow-sm hover:border-foreground/30 transition-colors group">
                  <SiYoutube className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="font-sans text-sm font-semibold text-foreground">
                    YouTube URL
                  </span>
                </div>
                <div className="px-6 py-4 bg-background rounded-xl border border-border flex items-center gap-4 shadow-sm hover:border-foreground/30 transition-colors group">
                  <SiGithub className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="font-sans text-sm font-semibold text-foreground">
                    GitHub Repository
                  </span>
                </div>
                <div className="px-6 py-4 bg-background rounded-xl border border-border flex items-center gap-4 shadow-sm hover:border-foreground/30 transition-colors group">
                  <FileText className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="font-sans text-sm font-semibold text-foreground">
                    Markdown Script
                  </span>
                </div>
              </div>

              {/* The Brain (Center) */}
              <div className="relative shrink-0 my-8 md:my-0">
                <div className="w-40 h-40 rounded-full border-2 border-dashed border-border/80 flex items-center justify-center bg-background/50 backdrop-blur-md p-4">
                  <div className="w-full h-full bg-muted rounded-full flex flex-col items-center justify-center animate-pulse border border-border shadow-inner">
                    <BrainCircuit className="w-7 h-7 text-foreground mb-1" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-foreground">
                      Processing
                    </span>
                  </div>
                </div>
              </div>

              {/* Output Array (Right) */}
              <div className="flex-1 w-full space-y-6">
                <div className="px-6 py-4 bg-background rounded-xl border border-border flex items-center justify-between shadow-sm hover:border-foreground/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <SiHashnode className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="font-sans text-sm font-semibold text-foreground">
                      SEO Blog Post
                    </span>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center border border-border">
                    <div className="w-2 h-2 bg-foreground rounded-full scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </div>
                <div className="px-6 py-4 bg-background rounded-xl border border-border flex items-center justify-between shadow-sm hover:border-foreground/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <SiX className="w-4 h-4 ml-0.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="font-sans text-sm font-semibold text-foreground">
                      Twitter Thread
                    </span>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center border border-border">
                    <div className="w-2 h-2 bg-foreground rounded-full scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </div>
                <div className="px-6 py-4 bg-background rounded-xl border border-border flex items-center justify-between shadow-sm hover:border-foreground/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <FaLinkedinIn className="text-muted-foreground group-hover:text-foreground transition-colors font-bold font-mono text-lg ml-0.5" />
                    <span className="font-sans text-sm font-semibold text-foreground">
                      LinkedIn Newsletter
                    </span>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center border border-border">
                    <div className="w-2 h-2 bg-foreground rounded-full scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="font-headline font-bold text-4xl md:text-5xl tracking-tight text-foreground mb-4">
              Engineered for <span className="font-instrument italic tracking-wide">velocity.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl font-sans">
              Everything you need to scale your technical voice, built directly into the platforms
              where you already consume content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Feature 1 (Large) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-8 bg-card p-10 rounded-[2rem] border border-border relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    The Kernel
                  </span>
                </div>
                <h3 className="font-headline font-bold text-3xl mb-4 tracking-tight text-foreground">
                  Technical Semantics Extraction
                </h3>
                <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
                  Our AI doesn&apos;t just transcribe; it understands code contexts, repo
                  structures, and architectural patterns to write like a senior engineer.
                </p>
              </div>
              {/* Decorative graphic element */}
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
            </motion.div>

            {/* Feature 2 (Small Stacked) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-4 bg-card p-10 rounded-[2rem] border border-border flex flex-col justify-between group"
            >
              <div>
                <Share2 className="w-8 h-8 text-primary mb-6" />
                <h3 className="font-headline font-bold text-2xl mb-4 tracking-tight text-foreground">
                  Omni-Channel Sync
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Schedule threads, blogs, and updates across 12+ platforms from a single command
                  center.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 (Small Stacked) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-4 bg-card p-10 rounded-[2rem] border border-border"
            >
              <h3 className="font-headline font-bold text-2xl mb-4 tracking-tight text-foreground">
                0% Hallucination
              </h3>
              <p className="text-muted-foreground text-sm mb-8">
                Grounded output based strictly on your source link&apos;s technical data.
              </p>
              <div className="space-y-3">
                <div className="h-1 bg-muted rounded-full w-full" />
                <div className="h-1 bg-muted rounded-full w-5/6" />
                <div className="h-1 bg-muted rounded-full w-4/6" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-8 bg-foreground p-10 rounded-[2rem] text-background flex items-center justify-between overflow-hidden relative group"
            >
              <div className="relative z-10 max-w-md">
                <h3 className="font-headline font-bold text-3xl mb-6 tracking-tight">
                  Ready to dominate the dev feed?
                </h3>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-background text-foreground rounded-lg font-bold text-sm hover:scale-105 active:scale-95 transition-transform"
                >
                  Start Engineering Your Voice <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <Rocket className="absolute -right-10 -bottom-10 w-64 h-64 text-background/10 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS SECTION */}
      <section id="solutions" className="py-32 border-t border-border scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="font-headline font-bold text-4xl md:text-5xl tracking-tight text-foreground mb-4">
              Built for <span className="font-instrument italic text-[1.1em]">architects.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
              Whether you are documenting a side project or scaling a developer advocacy program,
              Scrappy adapts to your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: 'Technical YouTubers',
                desc: 'Turn your 20-minute system design tutorials into SEO-optimized Hashnode articles and massive Twitter threads instantly.',
              },
              {
                icon: Code2,
                title: 'OSS Maintainers',
                desc: 'Point Scrappy at your merged PRs or codebase structure to automatically generate release notes and update logs.',
              },
              {
                icon: PenTool,
                title: 'Dev Advocates',
                desc: "Consume content from competitors or peers, inject your company's unique commentary, and deploy to LinkedIn.",
              },
            ].map((sol, i) => (
              <div
                key={i}
                className="bg-background border border-border p-8 rounded-3xl hover:border-foreground/30 transition-colors"
              >
                <sol.icon className="w-8 h-8 text-foreground mb-6" />
                <h3 className="font-headline font-bold text-xl text-foreground mb-3">
                  {sol.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{sol.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-32 bg-muted/20 border-y border-border scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:text-center">
            <h2 className="font-headline font-bold text-4xl md:text-5xl tracking-tight text-foreground mb-2">
              Transparent <span className="font-instrument italic text-[1.1em]">pricing.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
              Start building your content library for free. Upgrade when your audience demands more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-background border border-border p-10 rounded-[2rem] flex flex-col relative overflow-hidden">
              <h3 className="font-headline font-bold text-2xl text-foreground mb-2">Hobbyist</h3>
              <p className="text-muted-foreground text-sm mb-6">
                For independent builders exploring the engine.
              </p>
              <div className="mb-8 font-bricolage">
                <span className="text-6xl text-foreground">$0</span>
                <span className="text-muted-foreground text-sm ml-2">/ month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  '10 Generations per month',
                  'Standard AI Processing',
                  'Twitter & LinkedIn export',
                  'Community Discord access',
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-foreground/50" /> {feat}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant="outline"
                className="w-full h-12 rounded-xl font-bold bg-background hover:bg-muted text-foreground"
              >
                <Link href="/login">Initialize Free</Link>
              </Button>
            </div>

            {/* Pro Tier */}
            <div className="bg-foreground border border-foreground p-10 rounded-[2rem] flex flex-col relative overflow-hidden shadow-2xl">
              <h3 className="font-headline font-bold text-2xl text-background mb-2">Architect</h3>
              <p className="text-background/70 text-sm mb-6">
                For serious creators scaling their technical voice.
              </p>
              <div className="mb-8 font-bricolage">
                <span className="text-6xl text-background">$19</span>
                <span className="text-background/70 text-sm ml-2">/ month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  'Unlimited Generations',
                  'Advanced Code Semantics parsing',
                  'All export platforms (Hashnode, Dev.to)',
                  'Priority API queuing',
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-background/90">
                    <CheckCircle2 className="w-4 h-4 text-background/50" /> {feat}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="w-full h-12 rounded-xl font-bold bg-background text-foreground hover:bg-background/90"
              >
                <Link href="/login">Upgrade to Architect</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final Bottom CTA */}
      <section className="py-32 bg-background relative overflow-hidden group">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-bricolage font-bold text-5xl md:text-6xl tracking-tight text-foreground mb-8">
            Ready to deploy your{' '}
            <span className="font-instrument italic text-[1.1em]">insights?</span>
          </h2>
          <Button
            asChild
            size="lg"
            className="h-14 px-10 rounded-xl font-bold text-base bg-foreground text-background hover:scale-105 transition-all"
          >
            <Link href="/login">
              Start Engineering Your Voice <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
        <Rocket className="absolute -right-20 -bottom-20 w-96 h-96 text-muted/30 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
      </section>
    </div>
  );
}
