"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
   TrendingUp,
   TrendingDown,
   Users,
   Code,
   GitBranch,
   Star,
   Eye,
   Calendar,
   Clock,
   Activity,
   BarChart3,
   PieChart,
   Filter,
   Download,
   Share2,
   RefreshCw,
} from "lucide-react";
import {
   IconChartBar,
   IconChartPie,
   IconChartLine,
   IconCalendarStats,
   IconDeviceAnalytics,
   IconUsers,
   IconCode,
   IconGitBranch,
} from "@tabler/icons-react";
import {
   AreaChart,
   Area,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   BarChart,
   Bar,
   PieChart as RechartsPieChart,
   Cell,
   LineChart,
   Line,
   RadialBarChart,
   RadialBar,
   Legend,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const analyticsData = [
   { name: "Jan", users: 4000, projects: 240, commits: 1200, stars: 180 },
   { name: "Feb", users: 3000, projects: 198, commits: 1500, stars: 220 },
   { name: "Mar", users: 2000, projects: 280, commits: 1100, stars: 160 },
   { name: "Apr", users: 2780, projects: 208, commits: 1800, stars: 290 },
   { name: "May", users: 1890, projects: 318, commits: 1400, stars: 210 },
   { name: "Jun", users: 2390, projects: 250, commits: 1600, stars: 340 },
   { name: "Jul", users: 3490, projects: 410, commits: 2200, stars: 450 },
];

const languageData = [
   { name: "JavaScript", value: 35, color: "#F7DF1E" },
   { name: "Python", value: 25, color: "#3776AB" },
   { name: "TypeScript", value: 20, color: "#3178C6" },
   { name: "Java", value: 10, color: "#ED8B00" },
   { name: "Go", value: 6, color: "#00ADD8" },
   { name: "Rust", value: 4, color: "#CE422B" },
];

const projectStats = [
   { name: "Active", value: 68, color: "#10B981" },
   { name: "Completed", value: 24, color: "#3B82F6" },
   { name: "On Hold", value: 8, color: "#F59E0B" },
];

const recentActivity = [
   { id: 1, user: "Alice Johnson", action: "created", target: "new repository", time: "2 hours ago", avatar: "AJ" },
   { id: 2, user: "Bob Smith", action: "pushed", target: "5 commits", time: "4 hours ago", avatar: "BS" },
   { id: 3, user: "Carol Davis", action: "opened", target: "pull request", time: "6 hours ago", avatar: "CD" },
   { id: 4, user: "David Wilson", action: "starred", target: "your project", time: "8 hours ago", avatar: "DW" },
   { id: 5, user: "Eve Brown", action: "forked", target: "YoCodex", time: "12 hours ago", avatar: "EB" },
];

const topProjects = [
   { name: "YoCodex Platform", stars: 1234, forks: 567, language: "JavaScript", trend: "up" },
   { name: "API Gateway", stars: 892, forks: 234, language: "Python", trend: "up" },
   { name: "Mobile App", stars: 654, forks: 123, language: "TypeScript", trend: "down" },
   { name: "ML Pipeline", stars: 543, forks: 89, language: "Python", trend: "up" },
   { name: "Web Components", stars: 432, forks: 67, language: "JavaScript", trend: "up" },
];

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
         <CardContent className="p-6">
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-sm font-medium text-muted-foreground">{title}</p>
                  <p className="text-2xl font-bold">{value.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                     {trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                     ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                     )}
                     <span className={`text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>{change}</span>
                  </div>
               </div>
               <div className="p-3 bg-blue-500/10 rounded-full">
                  <Icon className="w-6 h-6 text-blue-500" />
               </div>
            </div>
         </CardContent>
      </Card>
   </motion.div>
);

export default function AnalyticsPage() {
   const [timeRange, setTimeRange] = useState("7d");
   const [selectedMetric, setSelectedMetric] = useState("users");

   const stats = [
      { title: "Total Users", value: 24567, change: "+12.5%", icon: Users, trend: "up" },
      { title: "Active Projects", value: 1847, change: "+8.2%", icon: Code, trend: "up" },
      { title: "Commits Today", value: 342, change: "+23.1%", icon: GitBranch, trend: "up" },
      { title: "Stars Earned", value: 5634, change: "+15.3%", icon: Star, trend: "up" },
   ];

   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
         <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3 }}
               className="flex items-center justify-between"
            >
               <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <IconDeviceAnalytics className="w-8 h-8 text-blue-500" />
                     Analytics Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                     Monitor your platform's performance and user engagement
                  </p>
               </div>

               <div className="flex items-center gap-2">
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                           <Calendar className="w-4 h-4" />
                           Last {timeRange === "7d" ? "7 days" : timeRange === "30d" ? "30 days" : "90 days"}
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent>
                        <DropdownMenuLabel>Time Range</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setTimeRange("7d")}>Last 7 days</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTimeRange("30d")}>Last 30 days</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTimeRange("90d")}>Last 90 days</DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="outline" size="sm">
                     <RefreshCw className="w-4 h-4" />
                  </Button>

                  <Button variant="outline" size="sm">
                     <Download className="w-4 h-4" />
                  </Button>

                  <Button size="sm" className="gap-2">
                     <Share2 className="w-4 h-4" />
                     Share Report
                  </Button>
               </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
               ))}
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* User Growth Chart */}
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
               >
                  <Card className="h-[400px]">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <IconChartLine className="w-5 h-5 text-blue-500" />
                           User Growth Trend
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                           <AreaChart data={analyticsData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Area type="monotone" dataKey="users" stroke="#3B82F6" fill="url(#colorUsers)" />
                              <defs>
                                 <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                                 </linearGradient>
                              </defs>
                           </AreaChart>
                        </ResponsiveContainer>
                     </CardContent>
                  </Card>
               </motion.div>

               {/* Project Activities */}
               <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
               >
                  <Card className="h-[400px]">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <IconChartBar className="w-5 h-5 text-green-500" />
                           Project Activities
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                           <BarChart data={analyticsData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="commits" fill="#10B981" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="projects" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </CardContent>
                  </Card>
               </motion.div>
            </div>

            {/* Language & Project Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Language Distribution */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
               >
                  <Card className="h-[350px]">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <IconChartPie className="w-5 h-5 text-purple-500" />
                           Language Distribution
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                           <RechartsPieChart>
                              <Pie
                                 data={languageData}
                                 cx="50%"
                                 cy="50%"
                                 outerRadius={80}
                                 dataKey="value"
                                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                 {languageData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                 ))}
                              </Pie>
                              <Tooltip />
                           </RechartsPieChart>
                        </ResponsiveContainer>
                     </CardContent>
                  </Card>
               </motion.div>

               {/* Project Status */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
               >
                  <Card className="h-[350px]">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Activity className="w-5 h-5 text-orange-500" />
                           Project Status
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                           <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={projectStats}>
                              <RadialBar
                                 dataKey="value"
                                 cornerRadius={10}
                                 label={{ position: "insideStart", fill: "#fff" }}
                              />
                              <Legend />
                              <Tooltip />
                           </RadialBarChart>
                        </ResponsiveContainer>
                     </CardContent>
                  </Card>
               </motion.div>

               {/* Recent Activity */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
               >
                  <Card className="h-[350px]">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Clock className="w-5 h-5 text-red-500" />
                           Recent Activity
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        <div className="max-h-[250px] overflow-y-auto space-y-3">
                           {recentActivity.map((activity) => (
                              <motion.div
                                 key={activity.id}
                                 className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                 whileHover={{ scale: 1.02, x: 4 }}
                              >
                                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                    {activity.avatar}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm">
                                       <span className="font-medium">{activity.user}</span>{" "}
                                       <span className="text-muted-foreground">{activity.action}</span>{" "}
                                       <span className="font-medium">{activity.target}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                 </div>
                              </motion.div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               </motion.div>
            </div>

            {/* Top Projects Table */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3, delay: 0.7 }}
            >
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Top Performing Projects
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="overflow-x-auto">
                        <table className="w-full">
                           <thead>
                              <tr className="border-b">
                                 <th className="text-left py-3 px-2">Project</th>
                                 <th className="text-left py-3 px-2">Language</th>
                                 <th className="text-left py-3 px-2">Stars</th>
                                 <th className="text-left py-3 px-2">Forks</th>
                                 <th className="text-left py-3 px-2">Trend</th>
                              </tr>
                           </thead>
                           <tbody>
                              {topProjects.map((project, index) => (
                                 <motion.tr
                                    key={project.name}
                                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                                 >
                                    <td className="py-3 px-2 font-medium">{project.name}</td>
                                    <td className="py-3 px-2">
                                       <Badge variant="secondary">{project.language}</Badge>
                                    </td>
                                    <td className="py-3 px-2 flex items-center gap-1">
                                       <Star className="w-4 h-4 text-yellow-500" />
                                       {project.stars.toLocaleString()}
                                    </td>
                                    <td className="py-3 px-2">
                                       <GitBranch className="w-4 h-4 inline mr-1" />
                                       {project.forks.toLocaleString()}
                                    </td>
                                    <td className="py-3 px-2">
                                       {project.trend === "up" ? (
                                          <TrendingUp className="w-4 h-4 text-green-500" />
                                       ) : (
                                          <TrendingDown className="w-4 h-4 text-red-500" />
                                       )}
                                    </td>
                                 </motion.tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>
         </div>
      </div>
   );
}
