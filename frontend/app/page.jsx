"use client";

import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import FeaturesGrid from "@/components/FeaturesGrid";
import Footer from "@/components/Footer";

export default function Home() {
   const [activeTab, setActiveTab] = useState("trending");

   return (
      <TooltipProvider>
         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Hero Section with Animation */}
            <Hero />

            {/* Stats Section */}
            <StatsSection />

            {/* Featured Projects */}
            <FeaturedProjects />

            {/* Features Grid */}
            <FeaturesGrid />

            {/* Footer */}
            <Footer />
         </div>
      </TooltipProvider>
   );
}
