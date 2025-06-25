"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

// Chart components
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   ResponsiveContainer,
   BarChart,
   Bar,
   PieChart,
   Pie,
   Cell,
} from "recharts";

// Icons
import {
   Code2,
   Users,
   Heart,
   Star,
   Github,
   TrendingUp,
   Activity,
   Calendar,
   Settings,
   Bell,
   Download,
   Upload,
   Eye,
   MessageSquare,
} from "lucide-react";
import {
   IconBrandReact,
   IconCode,
   IconUsers,
   IconTrophy,
   IconRocket,
   IconChartBar,
   IconCalendar,
   IconBell,
} from "@tabler/icons-react";
import { FaReact, FaPython, FaJsSquare, FaNodeJs, FaVuejs, FaAngular } from "react-icons/fa";

// Sample data
const activityData = [
   { name: "Mon", commits: 24, views: 120 },
   { name: "Tue", commits: 35, views: 180 },
   { name: "Wed", commits: 18, views: 95 },
   { name: "Thu", commits: 42, views: 220 },
   { name: "Fri", commits: 55, views: 300 },
   { name: "Sat", commits: 28, views: 150 },
   { name: "Sun", commits: 15, views: 80 },
];

const languageData = [
   { name: "JavaScript", value: 35, color: "#f7df1e" },
   { name: "Python", value: 25, color: "#3776ab" },
   { name: "React", value: 20, color: "#61dafb" },
   { name: "Node.js", value: 15, color: "#68a063" },
   { name: "Other", value: 5, color: "#94a3b8" },
];

const projects = [
   {
      name: "AI Chat Bot",
      description: "Advanced AI chatbot with natural language processing",
      language: "Python",
      icon: FaPython,
      progress: 85,
      commits: 127,
      stars: 45,
      status: "active",
   },
   {
      name: "React Dashboard",
      description: "Modern admin dashboard with analytics",
      language: "React",
      icon: FaReact,
      progress: 92,
      commits: 89,
      stars: 32,
      status: "completed",
   },
   {
      name: "Node API",
      description: "RESTful API with authentication and security",
      language: "Node.js",
      icon: FaNodeJs,
      progress: 67,
      commits: 76,
      stars: 28,
      status: "active",
   },
   {
      name: "Vue E-commerce",
      description: "Full-stack e-commerce platform",
      language: "Vue.js",
      icon: FaVuejs,
      progress: 45,
      commits: 54,
      stars: 19,
      status: "planning",
   },
];

const recentActivity = [
   {
      type: "commit",
      message: "Added new authentication middleware",
      project: "Node API",
      time: "2 hours ago",
      icon: Code2,
   },
   {
      type: "star",
      message: "Your project got 5 new stars",
      project: "React Dashboard",
      time: "4 hours ago",
      icon: Star,
   },
   {
      type: "comment",
      message: "New comment on your pull request",
      project: "AI Chat Bot",
      time: "6 hours ago",
      icon: MessageSquare,
   },
   {
      type: "view",
      message: "Your profile was viewed 23 times",
      project: "Profile",
      time: "1 day ago",
      icon: Eye,
   },
];

export default function Dashboard() {
   const [activeTab, setActiveTab] = useState("overview");

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
               <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                     <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">Y</span>
                     </div>
                     <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-500">Welcome back, Nikhil!</p>
                     </div>
                  </div>

                  <div className="flex items-center space-x-4">
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="outline" size="sm">
                              <Bell className="w-4 h-4" />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>Notifications</p>
                        </TooltipContent>
                     </Tooltip>

                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4" />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>Settings</p>
                        </TooltipContent>
                     </Tooltip>

                     <Avatar>
                        <AvatarImage src="/api/placeholder/40/40" />
                        <AvatarFallback>NS</AvatarFallback>
                     </Avatar>
                  </div>
               </div>
            </motion.header>

            <div className="max-w-7xl mx-auto px-6 py-8">
               {/* Stats Overview */}
               <motion.div
                  className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
               >
                  {[
                     { title: "Total Projects", value: "24", change: "+12%", icon: IconRocket, color: "text-blue-600" },
                     { title: "Total Commits", value: "1,247", change: "+8%", icon: Code2, color: "text-green-600" },
                     { title: "Profile Views", value: "5,678", change: "+23%", icon: Eye, color: "text-purple-600" },
                     { title: "Total Stars", value: "342", change: "+15%", icon: Star, color: "text-yellow-600" },
                  ].map((stat, index) => (
                     <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                     >
                        <Card>
                           <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                 <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                                 </div>
                                 <stat.icon className={`w-8 h-8 ${stat.color}`} />
                              </div>
                           </CardContent>
                        </Card>
                     </motion.div>
                  ))}
               </motion.div>

               {/* Main Content */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                     {/* Activity Chart */}
                     <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                     >
                        <Card>
                           <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                 <Activity className="w-5 h-5" />
                                 Weekly Activity
                              </CardTitle>
                              <CardDescription>Your coding activity over the past week</CardDescription>
                           </CardHeader>
                           <CardContent>
                              <ResponsiveContainer width="100%" height={300}>
                                 <LineChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Line
                                       type="monotone"
                                       dataKey="commits"
                                       stroke="#3b82f6"
                                       strokeWidth={2}
                                       dot={{ fill: "#3b82f6" }}
                                    />
                                    <Line
                                       type="monotone"
                                       dataKey="views"
                                       stroke="#8b5cf6"
                                       strokeWidth={2}
                                       dot={{ fill: "#8b5cf6" }}
                                    />
                                 </LineChart>
                              </ResponsiveContainer>
                           </CardContent>
                        </Card>
                     </motion.div>

                     {/* Projects */}
                     <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                     >
                        <Card>
                           <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                 <IconRocket className="w-5 h-5" />
                                 Your Projects
                              </CardTitle>
                              <CardDescription>Track progress on your active projects</CardDescription>
                           </CardHeader>
                           <CardContent>
                              <div className="space-y-6">
                                 {projects.map((project, index) => (
                                    <motion.div
                                       key={project.name}
                                       initial={{ opacity: 0, y: 20 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       transition={{ duration: 0.4, delay: 0.1 * index }}
                                       className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                       <div className="flex items-start justify-between mb-3">
                                          <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <project.icon className="w-5 h-5 text-blue-600" />
                                             </div>
                                             <div>
                                                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                                                <p className="text-sm text-gray-500">{project.description}</p>
                                             </div>
                                          </div>
                                          <Badge
                                             variant={
                                                project.status === "completed"
                                                   ? "default"
                                                   : project.status === "active"
                                                     ? "secondary"
                                                     : "outline"
                                             }
                                          >
                                             {project.status}
                                          </Badge>
                                       </div>

                                       <div className="mb-3">
                                          <div className="flex justify-between text-sm mb-1">
                                             <span>Progress</span>
                                             <span>{project.progress}%</span>
                                          </div>
                                          <Progress value={project.progress} className="h-2" />
                                       </div>

                                       <div className="flex items-center gap-4 text-sm text-gray-600">
                                          <span className="flex items-center gap-1">
                                             <Code2 className="w-4 h-4" />
                                             {project.commits} commits
                                          </span>
                                          <span className="flex items-center gap-1">
                                             <Star className="w-4 h-4" />
                                             {project.stars} stars
                                          </span>
                                          <span className="flex items-center gap-1">{project.language}</span>
                                       </div>
                                    </motion.div>
                                 ))}
                              </div>
                           </CardContent>
                        </Card>
                     </motion.div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                     {/* Language Distribution */}
                     <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                     >
                        <Card>
                           <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                 <IconChartBar className="w-5 h-5" />
                                 Languages
                              </CardTitle>
                              <CardDescription>Your coding language distribution</CardDescription>
                           </CardHeader>
                           <CardContent>
                              <ResponsiveContainer width="100%" height={200}>
                                 <PieChart>
                                    <Pie data={languageData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                                       {languageData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                       ))}
                                    </Pie>
                                 </PieChart>
                              </ResponsiveContainer>
                              <div className="space-y-2 mt-4">
                                 {languageData.map((lang) => (
                                    <div key={lang.name} className="flex items-center justify-between">
                                       <div className="flex items-center gap-2">
                                          <div
                                             className="w-3 h-3 rounded-full"
                                             style={{ backgroundColor: lang.color }}
                                          />
                                          <span className="text-sm">{lang.name}</span>
                                       </div>
                                       <span className="text-sm font-medium">{lang.value}%</span>
                                    </div>
                                 ))}
                              </div>
                           </CardContent>
                        </Card>
                     </motion.div>

                     {/* Recent Activity */}
                     <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                     >
                        <Card>
                           <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                 <IconBell className="w-5 h-5" />
                                 Recent Activity
                              </CardTitle>
                              <CardDescription>Your latest updates and notifications</CardDescription>
                           </CardHeader>
                           <CardContent>
                              <ScrollArea className="h-[300px]">
                                 <div className="space-y-4">
                                    {recentActivity.map((activity, index) => (
                                       <motion.div
                                          key={index}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.3, delay: 0.1 * index }}
                                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                       >
                                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                             <activity.icon className="w-4 h-4 text-blue-600" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                             <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                                             <p className="text-xs text-gray-500">
                                                {activity.project} • {activity.time}
                                             </p>
                                          </div>
                                       </motion.div>
                                    ))}
                                 </div>
                              </ScrollArea>
                           </CardContent>
                        </Card>
                     </motion.div>
                  </div>
               </div>
            </div>
         </div>
      </TooltipProvider>
   );
}
