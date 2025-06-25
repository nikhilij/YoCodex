"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form handling
import { useForm } from "react-hook-form";

// Icons
import {
   Code2,
   Users,
   Heart,
   Star,
   Github,
   Search,
   Filter,
   Plus,
   MoreHorizontal,
   Eye,
   GitFork,
   Download,
   Calendar,
   Tag,
} from "lucide-react";
import {
   IconBrandReact,
   IconBrandPython,
   IconBrandVue,
   IconBrandAngular,
   IconBrandNodejs,
   IconBrandTypescript,
   IconBrandJavascript,
} from "@tabler/icons-react";
import { FaReact, FaPython, FaVuejs, FaAngular, FaNodeJs } from "react-icons/fa";

// Sample projects data
const allProjects = [
   {
      id: 1,
      title: "AI-Powered Code Assistant",
      description:
         "An intelligent code completion and suggestion tool powered by machine learning algorithms. Helps developers write better code faster.",
      author: {
         name: "Sarah Chen",
         avatar: "/api/placeholder/40/40",
         username: "@sarahchen",
      },
      language: "Python",
      languageIcon: IconBrandPython,
      category: "AI/ML",
      stars: 2847,
      forks: 342,
      views: 15240,
      createdAt: "2024-01-15",
      updatedAt: "2024-06-18",
      tags: ["AI", "Machine Learning", "Developer Tools", "Python"],
      featured: true,
      trending: true,
      license: "MIT",
      difficulty: "Advanced",
   },
   {
      id: 2,
      title: "Modern React Dashboard",
      description:
         "A beautiful, responsive admin dashboard built with React, TypeScript, and Tailwind CSS. Features dark mode, analytics, and more.",
      author: {
         name: "Mike Johnson",
         avatar: "/api/placeholder/40/40",
         username: "@mikej",
      },
      language: "React",
      languageIcon: IconBrandReact,
      category: "Frontend",
      stars: 1924,
      forks: 256,
      views: 8430,
      createdAt: "2024-02-10",
      updatedAt: "2024-06-19",
      tags: ["React", "TypeScript", "Dashboard", "UI"],
      featured: true,
      trending: false,
      license: "MIT",
      difficulty: "Intermediate",
   },
   {
      id: 3,
      title: "Vue.js E-commerce Platform",
      description:
         "Full-stack e-commerce solution with Vue.js frontend, Node.js backend, and integrated payment processing.",
      author: {
         name: "Emma Wilson",
         avatar: "/api/placeholder/40/40",
         username: "@emmaw",
      },
      language: "Vue.js",
      languageIcon: IconBrandVue,
      category: "Full Stack",
      stars: 1567,
      forks: 189,
      views: 6240,
      createdAt: "2024-03-05",
      updatedAt: "2024-06-17",
      tags: ["Vue.js", "E-commerce", "Node.js", "Full Stack"],
      featured: false,
      trending: true,
      license: "GPL-3.0",
      difficulty: "Advanced",
   },
   {
      id: 4,
      title: "Node.js Microservices Kit",
      description: "A complete microservices starter kit with Docker, Kubernetes, API Gateway, and monitoring tools.",
      author: {
         name: "Alex Rodriguez",
         avatar: "/api/placeholder/40/40",
         username: "@alexr",
      },
      language: "Node.js",
      languageIcon: IconBrandNodejs,
      category: "Backend",
      stars: 1342,
      forks: 278,
      views: 9120,
      createdAt: "2024-01-20",
      updatedAt: "2024-06-16",
      tags: ["Node.js", "Microservices", "Docker", "Kubernetes"],
      featured: false,
      trending: false,
      license: "Apache-2.0",
      difficulty: "Expert",
   },
   {
      id: 5,
      title: "Angular Progressive Web App",
      description:
         "A modern PWA built with Angular featuring offline support, push notifications, and responsive design.",
      author: {
         name: "David Kim",
         avatar: "/api/placeholder/40/40",
         username: "@davidk",
      },
      language: "Angular",
      languageIcon: IconBrandAngular,
      category: "Frontend",
      stars: 987,
      forks: 145,
      views: 4560,
      createdAt: "2024-04-12",
      updatedAt: "2024-06-15",
      tags: ["Angular", "PWA", "TypeScript", "Mobile"],
      featured: false,
      trending: true,
      license: "MIT",
      difficulty: "Intermediate",
   },
   {
      id: 6,
      title: "TypeScript Utility Library",
      description:
         "A comprehensive collection of TypeScript utilities and helper functions for common development tasks.",
      author: {
         name: "Lisa Zhang",
         avatar: "/api/placeholder/40/40",
         username: "@lisaz",
      },
      language: "TypeScript",
      languageIcon: IconBrandTypescript,
      category: "Library",
      stars: 756,
      forks: 89,
      views: 3240,
      createdAt: "2024-05-01",
      updatedAt: "2024-06-20",
      tags: ["TypeScript", "Utilities", "Library", "Developer Tools"],
      featured: false,
      trending: false,
      license: "MIT",
      difficulty: "Beginner",
   },
];

const categories = ["All", "Frontend", "Backend", "Full Stack", "AI/ML", "Library"];
const languages = ["All", "React", "Python", "Vue.js", "Node.js", "Angular", "TypeScript"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

export default function Projects() {
   const [projects, setProjects] = useState(allProjects);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("All");
   const [selectedLanguage, setSelectedLanguage] = useState("All");
   const [selectedDifficulty, setSelectedDifficulty] = useState("All");
   const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
   const [showTrendingOnly, setShowTrendingOnly] = useState(false);
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

   // React Hook Form
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm();

   // Filter projects
   const filteredProjects = projects.filter((project) => {
      const matchesSearch =
         project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
         project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
      const matchesLanguage = selectedLanguage === "All" || project.language === selectedLanguage;
      const matchesDifficulty = selectedDifficulty === "All" || project.difficulty === selectedDifficulty;
      const matchesFeatured = !showFeaturedOnly || project.featured;
      const matchesTrending = !showTrendingOnly || project.trending;

      return (
         matchesSearch && matchesCategory && matchesLanguage && matchesDifficulty && matchesFeatured && matchesTrending
      );
   });

   const onSubmit = (data) => {
      console.log("New project:", data);
      setIsCreateModalOpen(false);
      reset();
   };

   return (
      <TooltipProvider>
         <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <motion.header
               className="bg-white shadow-sm border-b"
               initial={{ y: -50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.5 }}
            >
               <div className="max-w-7xl mx-auto px-6 py-6">
                  <div className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                        <p className="text-gray-600 mt-1">Discover amazing projects from our community</p>
                     </div>

                     <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                           <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                              <Plus className="w-4 h-4 mr-2" />
                              New Project
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                           <DialogHeader>
                              <DialogTitle>Create New Project</DialogTitle>
                              <DialogDescription>Share your amazing project with the community</DialogDescription>
                           </DialogHeader>
                           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                              <div>
                                 <Label htmlFor="title">Project Title</Label>
                                 <Input
                                    id="title"
                                    {...register("title", { required: "Title is required" })}
                                    className="mt-1"
                                 />
                                 {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                              </div>

                              <div>
                                 <Label htmlFor="description">Description</Label>
                                 <Textarea
                                    id="description"
                                    {...register("description", { required: "Description is required" })}
                                    className="mt-1"
                                    rows={3}
                                 />
                                 {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                 )}
                              </div>

                              <div>
                                 <Label htmlFor="language">Language</Label>
                                 <Input
                                    id="language"
                                    {...register("language", { required: "Language is required" })}
                                    className="mt-1"
                                    placeholder="e.g., React, Python, Node.js"
                                 />
                                 {errors.language && (
                                    <p className="text-red-500 text-sm mt-1">{errors.language.message}</p>
                                 )}
                              </div>

                              <div>
                                 <Label htmlFor="tags">Tags (comma-separated)</Label>
                                 <Input
                                    id="tags"
                                    {...register("tags")}
                                    className="mt-1"
                                    placeholder="e.g., web, mobile, api"
                                 />
                              </div>

                              <div className="flex gap-2 pt-4">
                                 <Button type="submit" className="flex-1">
                                    Create Project
                                 </Button>
                                 <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                    Cancel
                                 </Button>
                              </div>
                           </form>
                        </DialogContent>
                     </Dialog>
                  </div>
               </div>
            </motion.header>

            <div className="max-w-7xl mx-auto px-6 py-8">
               {/* Filters */}
               <motion.div
                  className="bg-white rounded-lg p-6 mb-8 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
               >
                  <div className="flex flex-col lg:flex-row gap-4">
                     {/* Search */}
                     <div className="flex-1">
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                           <Input
                              placeholder="Search projects, tags, or authors..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                           />
                        </div>
                     </div>

                     {/* Filter Tabs */}
                     <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full lg:w-auto">
                        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full lg:w-auto">
                           {categories.map((category) => (
                              <TabsTrigger key={category} value={category} className="text-xs">
                                 {category}
                              </TabsTrigger>
                           ))}
                        </TabsList>
                     </Tabs>

                     {/* Additional Filters */}
                     <div className="flex gap-2">
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                 <Filter className="w-4 h-4 mr-2" />
                                 Language
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent>
                              {languages.map((lang) => (
                                 <DropdownMenuItem
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={selectedLanguage === lang ? "bg-blue-50" : ""}
                                 >
                                    {lang}
                                 </DropdownMenuItem>
                              ))}
                           </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                 <Tag className="w-4 h-4 mr-2" />
                                 Difficulty
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent>
                              {difficulties.map((difficulty) => (
                                 <DropdownMenuItem
                                    key={difficulty}
                                    onClick={() => setSelectedDifficulty(difficulty)}
                                    className={selectedDifficulty === difficulty ? "bg-blue-50" : ""}
                                 >
                                    {difficulty}
                                 </DropdownMenuItem>
                              ))}
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  </div>

                  {/* Quick Filters */}
                  <div className="flex gap-2 mt-4">
                     <Button
                        variant={showFeaturedOnly ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                     >
                        <Star className="w-4 h-4 mr-2" />
                        Featured
                     </Button>
                     <Button
                        variant={showTrendingOnly ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowTrendingOnly(!showTrendingOnly)}
                     >
                        <IconBrandReact className="w-4 h-4 mr-2" />
                        Trending
                     </Button>
                  </div>
               </motion.div>

               {/* Results Count */}
               <motion.div
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
               >
                  <p className="text-gray-600">
                     Showing {filteredProjects.length} of {allProjects.length} projects
                  </p>
               </motion.div>

               {/* Projects Grid */}
               <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
               >
                  <AnimatePresence>
                     {filteredProjects.map((project, index) => (
                        <motion.div
                           key={project.id}
                           layout
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.5, delay: index * 0.1 }}
                           whileHover={{ scale: 1.02 }}
                        >
                           <Card className="h-full hover:shadow-lg transition-all duration-300 relative">
                              {project.featured && (
                                 <div className="absolute top-4 right-4">
                                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                                       <Star className="w-3 h-3 mr-1" />
                                       Featured
                                    </Badge>
                                 </div>
                              )}

                              <CardHeader className="pb-3">
                                 <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                       <Avatar className="w-10 h-10">
                                          <AvatarImage src={project.author.avatar} />
                                          <AvatarFallback>{project.author.name[0]}</AvatarFallback>
                                       </Avatar>
                                       <div>
                                          <p className="text-sm font-medium">{project.author.name}</p>
                                          <p className="text-xs text-gray-500">{project.author.username}</p>
                                       </div>
                                    </div>

                                    <DropdownMenu>
                                       <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                             <MoreHorizontal className="w-4 h-4" />
                                          </Button>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent>
                                          <DropdownMenuItem>
                                             <Star className="w-4 h-4 mr-2" />
                                             Star Project
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                             <GitFork className="w-4 h-4 mr-2" />
                                             Fork Project
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                             <Download className="w-4 h-4 mr-2" />
                                             Download
                                          </DropdownMenuItem>
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </div>

                                 <div className="mt-3">
                                    <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                                    <CardDescription className="text-sm leading-relaxed">
                                       {project.description}
                                    </CardDescription>
                                 </div>
                              </CardHeader>

                              <CardContent>
                                 <div className="flex items-center gap-2 mb-4">
                                    <project.languageIcon className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium">{project.language}</span>
                                    <Badge variant="secondary" className="text-xs">
                                       {project.difficulty}
                                    </Badge>
                                    {project.trending && (
                                       <Badge className="bg-green-100 text-green-700 text-xs">Trending</Badge>
                                    )}
                                 </div>

                                 <div className="flex flex-wrap gap-1 mb-4">
                                    {project.tags.slice(0, 3).map((tag) => (
                                       <Badge key={tag} variant="outline" className="text-xs">
                                          {tag}
                                       </Badge>
                                    ))}
                                    {project.tags.length > 3 && (
                                       <Badge variant="outline" className="text-xs">
                                          +{project.tags.length - 3}
                                       </Badge>
                                    )}
                                 </div>

                                 <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                    <Tooltip>
                                       <TooltipTrigger className="flex items-center gap-1">
                                          <Star className="w-4 h-4" />
                                          {project.stars.toLocaleString()}
                                       </TooltipTrigger>
                                       <TooltipContent>
                                          <p>Stars</p>
                                       </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                       <TooltipTrigger className="flex items-center gap-1">
                                          <GitFork className="w-4 h-4" />
                                          {project.forks}
                                       </TooltipTrigger>
                                       <TooltipContent>
                                          <p>Forks</p>
                                       </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                       <TooltipTrigger className="flex items-center gap-1">
                                          <Eye className="w-4 h-4" />
                                          {project.views.toLocaleString()}
                                       </TooltipTrigger>
                                       <TooltipContent>
                                          <p>Views</p>
                                       </TooltipContent>
                                    </Tooltip>

                                    <span className="text-xs">{new Date(project.updatedAt).toLocaleDateString()}</span>
                                 </div>

                                 <Button className="w-full" variant="outline">
                                    <Code2 className="w-4 h-4 mr-2" />
                                    View Project
                                 </Button>
                              </CardContent>
                           </Card>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </motion.div>

               {/* Empty State */}
               {filteredProjects.length === 0 && (
                  <motion.div
                     className="text-center py-16"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 0.5 }}
                  >
                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                     <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                     <Button
                        variant="outline"
                        onClick={() => {
                           setSearchTerm("");
                           setSelectedCategory("All");
                           setSelectedLanguage("All");
                           setSelectedDifficulty("All");
                           setShowFeaturedOnly(false);
                           setShowTrendingOnly(false);
                        }}
                     >
                        Clear Filters
                     </Button>
                  </motion.div>
               )}
            </div>
         </div>
      </TooltipProvider>
   );
}
