"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
   User,
   Mail,
   Phone,
   MapPin,
   Calendar,
   Globe,
   Github,
   Twitter,
   Linkedin,
   Camera,
   Edit,
   Save,
   X,
   Star,
   GitBranch,
   Code,
   Users,
   Award,
   Trophy,
   Zap,
   Target,
   TrendingUp,
   Activity,
   BookOpen,
   Coffee,
   Heart,
   Settings,
   Bell,
   Shield,
   Palette,
   Moon,
   Sun,
   Eye,
   EyeOff,
} from "lucide-react";
import {
   IconBrandGithub,
   IconBrandTwitter,
   IconBrandLinkedin,
   IconUser,
   IconSettings,
   IconBell,
   IconShield,
   IconPalette,
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
   RadarChart,
   PolarGrid,
   PolarAngleAxis,
   PolarRadiusAxis,
   Radar,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock user data
const userData = {
   id: 1,
   name: "Nikhil Soni",
   username: "nikhilsoni",
   email: "nikhil@yocodex.com",
   phone: "+91 9876543210",
   location: "Mumbai, India",
   website: "https://nikhilsoni.dev",
   bio: "Full-stack developer passionate about building innovative solutions. Creator of YoCodex platform. Love working with modern technologies and contributing to open source.",
   avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
   joinDate: "2022-01-15",
   verified: true,
   premium: true,
   stats: {
      repositories: 42,
      followers: 1234,
      following: 567,
      stars: 5678,
      commits: 2345,
      contributions: 365,
   },
   skills: [
      { name: "JavaScript", level: 95 },
      { name: "React", level: 90 },
      { name: "Node.js", level: 85 },
      { name: "Python", level: 80 },
      { name: "TypeScript", level: 88 },
      { name: "MongoDB", level: 75 },
   ],
   achievements: [
      { name: "Early Adopter", description: "Joined in the first month", icon: Trophy, color: "text-yellow-500" },
      { name: "Contributor", description: "100+ contributions", icon: Award, color: "text-blue-500" },
      { name: "Star Collector", description: "1000+ stars earned", icon: Star, color: "text-purple-500" },
      { name: "Code Master", description: "500+ commits", icon: Code, color: "text-green-500" },
   ],
   activityData: [
      { name: "Jan", contributions: 45, commits: 23, stars: 12 },
      { name: "Feb", contributions: 52, commits: 34, stars: 18 },
      { name: "Mar", contributions: 38, commits: 28, stars: 15 },
      { name: "Apr", contributions: 67, commits: 45, stars: 22 },
      { name: "May", contributions: 71, commits: 52, stars: 28 },
      { name: "Jun", contributions: 58, commits: 39, stars: 19 },
   ],
};

const TabItem = ({ id, label, icon: Icon }) => (
   <TabsTrigger value={id} className="flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {label}
   </TabsTrigger>
);

const SkillBar = ({ skill }) => (
   <div className="space-y-2">
      <div className="flex justify-between">
         <span className="text-sm font-medium">{skill.name}</span>
         <span className="text-sm text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
         <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ duration: 1, delay: 0.2 }}
         />
      </div>
   </div>
);

const AchievementCard = ({ achievement }) => (
   <motion.div
      className="flex items-center gap-3 p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border hover:shadow-md transition-all duration-300"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
   >
      <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-600 ${achievement.color}`}>
         <achievement.icon className="w-5 h-5" />
      </div>
      <div>
         <h4 className="font-medium">{achievement.name}</h4>
         <p className="text-sm text-muted-foreground">{achievement.description}</p>
      </div>
   </motion.div>
);

const StatCard = ({ label, value, icon: Icon, color }) => (
   <motion.div
      className="text-center p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border hover:shadow-lg transition-all duration-300"
      whileHover={{ scale: 1.05, y: -2 }}
   >
      <div className={`inline-flex p-3 rounded-full bg-gray-100 dark:bg-gray-600 ${color} mb-2`}>
         <Icon className="w-6 h-6" />
      </div>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
   </motion.div>
);

export default function ProfilePage() {
   const [isEditing, setIsEditing] = useState(false);
   const [activeTab, setActiveTab] = useState("profile");
   const [isDarkMode, setIsDarkMode] = useState(false);
   const [showEmail, setShowEmail] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      defaultValues: userData,
   });

   const onSubmit = (data) => {
      console.log("Profile updated:", data);
      setIsEditing(false);
   };

   return (
      <div
         className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"} transition-colors duration-300`}
      >
         <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3 }}
               className="flex items-center justify-between"
            >
               <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <IconUser className="w-8 h-8 text-blue-500" />
                     User Profile
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your profile information and settings</p>
               </div>

               <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsDarkMode(!isDarkMode)}>
                     {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>

                  <Button
                     variant={isEditing ? "destructive" : "default"}
                     onClick={() => setIsEditing(!isEditing)}
                     className="gap-2"
                  >
                     {isEditing ? (
                        <>
                           <X className="w-4 h-4" />
                           Cancel
                        </>
                     ) : (
                        <>
                           <Edit className="w-4 h-4" />
                           Edit Profile
                        </>
                     )}
                  </Button>
               </div>
            </motion.div>

            {/* Profile Header Card */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3, delay: 0.1 }}
            >
               <Card className="relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-10" />

                  <CardContent className="relative p-8">
                     <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Avatar Section */}
                        <div className="relative">
                           <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                              <AvatarImage src={userData.avatar} />
                              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                 {userData.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                              </AvatarFallback>
                           </Avatar>

                           {isEditing && (
                              <motion.button
                                 className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                                 whileHover={{ scale: 1.1 }}
                                 whileTap={{ scale: 0.9 }}
                              >
                                 <Camera className="w-4 h-4" />
                              </motion.button>
                           )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 space-y-4">
                           <div className="flex items-center gap-3">
                              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{userData.name}</h2>
                              {userData.verified && (
                                 <Badge className="bg-blue-500 text-white">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Verified
                                 </Badge>
                              )}
                              {userData.premium && (
                                 <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Premium
                                 </Badge>
                              )}
                           </div>

                           <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                 <User className="w-4 h-4" />@{userData.username}
                              </span>
                              <span className="flex items-center gap-1">
                                 <MapPin className="w-4 h-4" />
                                 {userData.location}
                              </span>
                              <span className="flex items-center gap-1">
                                 <Calendar className="w-4 h-4" />
                                 Joined {new Date(userData.joinDate).toLocaleDateString()}
                              </span>
                           </div>

                           <p className="text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">{userData.bio}</p>

                           {/* Social Links */}
                           <div className="flex items-center gap-3">
                              <motion.a
                                 href="#"
                                 className="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                                 whileHover={{ scale: 1.1 }}
                                 whileTap={{ scale: 0.9 }}
                              >
                                 <IconBrandGithub className="w-4 h-4" />
                              </motion.a>
                              <motion.a
                                 href="#"
                                 className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                 whileHover={{ scale: 1.1 }}
                                 whileTap={{ scale: 0.9 }}
                              >
                                 <IconBrandTwitter className="w-4 h-4" />
                              </motion.a>
                              <motion.a
                                 href="#"
                                 className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                                 whileHover={{ scale: 1.1 }}
                                 whileTap={{ scale: 0.9 }}
                              >
                                 <IconBrandLinkedin className="w-4 h-4" />
                              </motion.a>
                              <motion.a
                                 href={userData.website}
                                 className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                 whileHover={{ scale: 1.1 }}
                                 whileTap={{ scale: 0.9 }}
                              >
                                 <Globe className="w-4 h-4" />
                              </motion.a>
                           </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 min-w-[300px]">
                           <StatCard
                              label="Repositories"
                              value={userData.stats.repositories}
                              icon={Code}
                              color="text-blue-500"
                           />
                           <StatCard
                              label="Followers"
                              value={userData.stats.followers}
                              icon={Users}
                              color="text-green-500"
                           />
                           <StatCard
                              label="Following"
                              value={userData.stats.following}
                              icon={Heart}
                              color="text-red-500"
                           />
                           <StatCard label="Stars" value={userData.stats.stars} icon={Star} color="text-yellow-500" />
                           <StatCard
                              label="Commits"
                              value={userData.stats.commits}
                              icon={GitBranch}
                              color="text-purple-500"
                           />
                           <StatCard
                              label="Contributions"
                              value={userData.stats.contributions}
                              icon={Activity}
                              color="text-orange-500"
                           />
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>

            {/* Main Content Tabs */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3, delay: 0.2 }}
            >
               <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
                     <TabItem id="overview" label="Overview" icon={User} />
                     <TabItem id="activity" label="Activity" icon={Activity} />
                     <TabItem id="skills" label="Skills" icon={Target} />
                     <TabItem id="settings" label="Settings" icon={Settings} />
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Activity Chart */}
                        <Card>
                           <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                 <TrendingUp className="w-5 h-5 text-blue-500" />
                                 Activity Overview
                              </CardTitle>
                           </CardHeader>
                           <CardContent>
                              <ResponsiveContainer width="100%" height={250}>
                                 <AreaChart data={userData.activityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                       type="monotone"
                                       dataKey="contributions"
                                       stroke="#3B82F6"
                                       fill="url(#colorContributions)"
                                    />
                                    <defs>
                                       <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                                       </linearGradient>
                                    </defs>
                                 </AreaChart>
                              </ResponsiveContainer>
                           </CardContent>
                        </Card>

                        {/* Achievements */}
                        <Card>
                           <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                 <Trophy className="w-5 h-5 text-yellow-500" />
                                 Achievements
                              </CardTitle>
                           </CardHeader>
                           <CardContent className="space-y-3">
                              {userData.achievements.map((achievement, index) => (
                                 <AchievementCard key={index} achievement={achievement} />
                              ))}
                           </CardContent>
                        </Card>
                     </div>
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="space-y-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                           <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                 <BarChart3 className="w-5 h-5 text-green-500" />
                                 Monthly Activity
                              </CardTitle>
                           </CardHeader>
                           <CardContent>
                              <ResponsiveContainer width="100%" height={300}>
                                 <BarChart data={userData.activityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="commits" fill="#10B981" radius={[4, 4, 0, 0]} />
                                 </BarChart>
                              </ResponsiveContainer>
                           </CardContent>
                        </Card>

                        <Card>
                           <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                 <Coffee className="w-5 h-5 text-brown-500" />
                                 Recent Activity
                              </CardTitle>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              {[
                                 "Pushed 3 commits to YoCodex/frontend",
                                 "Starred microsoft/vscode",
                                 "Created new repository: awesome-project",
                                 "Opened pull request #42",
                                 "Commented on issue #123",
                              ].map((activity, index) => (
                                 <motion.div
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                 >
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <span className="text-sm">{activity}</span>
                                    <span className="text-xs text-muted-foreground ml-auto">{index + 1}h ago</span>
                                 </motion.div>
                              ))}
                           </CardContent>
                        </Card>
                     </div>
                  </TabsContent>

                  {/* Skills Tab */}
                  <TabsContent value="skills" className="space-y-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                           <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                 <Code className="w-5 h-5 text-purple-500" />
                                 Technical Skills
                              </CardTitle>
                           </CardHeader>
                           <CardContent className="space-y-6">
                              {userData.skills.map((skill, index) => (
                                 <motion.div
                                    key={skill.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                 >
                                    <SkillBar skill={skill} />
                                 </motion.div>
                              ))}
                           </CardContent>
                        </Card>

                        <Card>
                           <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                 <Target className="w-5 h-5 text-red-500" />
                                 Skill Radar
                              </CardTitle>
                           </CardHeader>
                           <CardContent>
                              <ResponsiveContainer width="100%" height={300}>
                                 <RadarChart data={userData.skills}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="name" />
                                    <PolarRadiusAxis domain={[0, 100]} />
                                    <Radar
                                       name="Skills"
                                       dataKey="level"
                                       stroke="#8884d8"
                                       fill="#8884d8"
                                       fillOpacity={0.6}
                                    />
                                 </RadarChart>
                              </ResponsiveContainer>
                           </CardContent>
                        </Card>
                     </div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-6">
                     <AnimatePresence>
                        {isEditing ? (
                           <motion.form
                              onSubmit={handleSubmit(onSubmit)}
                              className="space-y-6"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                           >
                              <Card>
                                 <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                       <Edit className="w-5 h-5 text-blue-500" />
                                       Edit Profile Information
                                    </CardTitle>
                                 </CardHeader>
                                 <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <div className="space-y-2">
                                          <Label htmlFor="name">Full Name</Label>
                                          <Input
                                             id="name"
                                             {...register("name", { required: true })}
                                             className={errors.name ? "border-red-500" : ""}
                                          />
                                          {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
                                       </div>

                                       <div className="space-y-2">
                                          <Label htmlFor="username">Username</Label>
                                          <Input
                                             id="username"
                                             {...register("username", { required: true })}
                                             className={errors.username ? "border-red-500" : ""}
                                          />
                                       </div>

                                       <div className="space-y-2">
                                          <Label htmlFor="email">Email</Label>
                                          <Input
                                             id="email"
                                             type="email"
                                             {...register("email", { required: true })}
                                             className={errors.email ? "border-red-500" : ""}
                                          />
                                       </div>

                                       <div className="space-y-2">
                                          <Label htmlFor="phone">Phone</Label>
                                          <Input id="phone" {...register("phone")} />
                                       </div>

                                       <div className="space-y-2">
                                          <Label htmlFor="location">Location</Label>
                                          <Input id="location" {...register("location")} />
                                       </div>

                                       <div className="space-y-2">
                                          <Label htmlFor="website">Website</Label>
                                          <Input id="website" {...register("website")} />
                                       </div>
                                    </div>

                                    <div className="space-y-2">
                                       <Label htmlFor="bio">Bio</Label>
                                       <Textarea id="bio" {...register("bio")} className="min-h-[100px]" />
                                    </div>

                                    <div className="flex items-center gap-4">
                                       <Button type="submit" className="gap-2">
                                          <Save className="w-4 h-4" />
                                          Save Changes
                                       </Button>
                                       <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => setIsEditing(false)}
                                          className="gap-2"
                                       >
                                          <X className="w-4 h-4" />
                                          Cancel
                                       </Button>
                                    </div>
                                 </CardContent>
                              </Card>
                           </motion.form>
                        ) : (
                           <motion.div
                              className="space-y-6"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                           >
                              {/* Profile Settings */}
                              <Card>
                                 <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                       <IconSettings className="w-5 h-5 text-gray-500" />
                                       Profile Settings
                                    </CardTitle>
                                 </CardHeader>
                                 <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                       <div className="flex items-center gap-2">
                                          <Eye className="w-4 h-4" />
                                          <span>Show email publicly</span>
                                       </div>
                                       <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setShowEmail(!showEmail)}
                                          className="gap-2"
                                       >
                                          {showEmail ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                          {showEmail ? "Hide" : "Show"}
                                       </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                       <div className="flex items-center gap-2">
                                          <Bell className="w-4 h-4" />
                                          <span>Email notifications</span>
                                       </div>
                                       <Button variant="outline" size="sm">
                                          Configure
                                       </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                       <div className="flex items-center gap-2">
                                          <Shield className="w-4 h-4" />
                                          <span>Two-factor authentication</span>
                                       </div>
                                       <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                                    </div>
                                 </CardContent>
                              </Card>

                              {/* Appearance Settings */}
                              <Card>
                                 <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                       <Palette className="w-5 h-5 text-purple-500" />
                                       Appearance
                                    </CardTitle>
                                 </CardHeader>
                                 <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                       <div className="flex items-center gap-2">
                                          {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                          <span>Theme</span>
                                       </div>
                                       <Button variant="outline" size="sm" onClick={() => setIsDarkMode(!isDarkMode)}>
                                          {isDarkMode ? "Dark" : "Light"}
                                       </Button>
                                    </div>
                                 </CardContent>
                              </Card>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </TabsContent>
               </Tabs>
            </motion.div>
         </div>
      </div>
   );
}
