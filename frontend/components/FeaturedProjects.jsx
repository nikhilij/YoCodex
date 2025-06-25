"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Code2, Star, TrendingUp } from "lucide-react";
import { FaCode, FaPython, FaJsSquare, FaNodeJs, FaReact } from "react-icons/fa";

// Featured projects data
const featuredProjects = [
   {
      title: "AI Code Generator",
      description: "Generate clean, efficient code using advanced AI algorithms",
      author: "Sarah Chen",
      avatar: "/api/placeholder/40/40",
      language: "Python",
      stars: 2840,
      trending: true,
      tags: ["AI", "Machine Learning", "Python"],
   },
   {
      title: "React Component Library",
      description: "Beautiful, accessible components for modern React applications",
      author: "Mike Johnson",
      avatar: "/api/placeholder/40/40",
      language: "JavaScript",
      stars: 1920,
      trending: true,
      tags: ["React", "Components", "UI"],
   },
   {
      title: "Node.js Microservices",
      description: "Scalable microservices architecture with Docker and Kubernetes",
      author: "Alex Rodriguez",
      avatar: "/api/placeholder/40/40",
      language: "Node.js",
      stars: 1560,
      trending: false,
      tags: ["Node.js", "Docker", "Microservices"],
   },
];

// Language icons mapping
const languageIcons = {
   Python: FaPython,
   JavaScript: FaJsSquare,
   "Node.js": FaNodeJs,
   React: FaReact,
};

export default function FeaturedProjects() {
   return (
      <motion.section
         className="py-20 bg-white"
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         transition={{ duration: 0.8 }}
         viewport={{ once: true }}
      >
         <div className="max-w-7xl mx-auto px-6">
            <motion.div
               className="text-center mb-16"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               viewport={{ once: true }}
            >
               <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
               <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover amazing projects built by our community
               </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
               {featuredProjects.map((project, index) => {
                  const LanguageIcon = languageIcons[project.language] || FaCode;
                  return (
                     <motion.div
                        key={project.title}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.6 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                     >
                        <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
                           <CardHeader>
                              <div className="flex items-start justify-between">
                                 <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                       <AvatarImage src={project.avatar} />
                                       <AvatarFallback>{project.author[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                       <CardTitle className="text-lg">{project.title}</CardTitle>
                                       <p className="text-sm text-gray-500">by {project.author}</p>
                                    </div>
                                 </div>
                                 {project.trending && (
                                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                                       <TrendingUp className="w-3 h-3 mr-1" />
                                       Trending
                                    </Badge>
                                 )}
                              </div>
                           </CardHeader>
                           <CardContent>
                              <CardDescription className="text-base mb-4">{project.description}</CardDescription>

                              <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-2">
                                    <LanguageIcon className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium">{project.language}</span>
                                 </div>
                                 <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <Star className="w-4 h-4" />
                                    {project.stars.toLocaleString()}
                                 </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-4">
                                 {project.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                       {tag}
                                    </Badge>
                                 ))}
                              </div>

                              <Button className="w-full" variant="outline">
                                 <Code2 className="w-4 h-4 mr-2" />
                                 View Project
                              </Button>
                           </CardContent>
                        </Card>
                     </motion.div>
                  );
               })}
            </div>
         </div>
      </motion.section>
   );
}
