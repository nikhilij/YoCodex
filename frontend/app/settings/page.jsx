"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
   Settings,
   User,
   Bell,
   Shield,
   Palette,
   Globe,
   Database,
   Key,
   Smartphone,
   Mail,
   Eye,
   EyeOff,
   Moon,
   Sun,
   Monitor,
   Check,
   X,
   Save,
   RefreshCw,
   Trash2,
   Download,
   Upload,
   Link,
   Lock,
   Unlock,
   AlertTriangle,
   Info,
   HelpCircle,
} from "lucide-react";
import {
   IconSettings,
   IconUser,
   IconBell,
   IconShield,
   IconPalette,
   IconGlobe,
   IconDatabase,
   IconKey,
   IconDeviceMobile,
   IconMail,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const settingsCategories = [
   {
      id: "account",
      name: "Account",
      icon: IconUser,
      description: "Manage your account information and preferences",
   },
   {
      id: "notifications",
      name: "Notifications",
      icon: IconBell,
      description: "Configure how you receive notifications",
   },
   {
      id: "privacy",
      name: "Privacy & Security",
      icon: IconShield,
      description: "Control your privacy and security settings",
   },
   {
      id: "appearance",
      name: "Appearance",
      icon: IconPalette,
      description: "Customize the look and feel of your experience",
   },
   {
      id: "integrations",
      name: "Integrations",
      icon: IconGlobe,
      description: "Connect with external services and APIs",
   },
   {
      id: "data",
      name: "Data & Storage",
      icon: IconDatabase,
      description: "Manage your data and storage preferences",
   },
];

const notificationSettings = [
   { id: "email_updates", label: "Email Updates", description: "Receive updates about your projects", enabled: true },
   {
      id: "push_notifications",
      label: "Push Notifications",
      description: "Browser notifications for important events",
      enabled: true,
   },
   {
      id: "weekly_digest",
      label: "Weekly Digest",
      description: "Summary of your activity and trending projects",
      enabled: false,
   },
   {
      id: "security_alerts",
      label: "Security Alerts",
      description: "Notifications about security-related events",
      enabled: true,
   },
   {
      id: "collaboration",
      label: "Collaboration",
      description: "Notifications when someone interacts with your projects",
      enabled: true,
   },
   { id: "marketing", label: "Marketing", description: "Product updates and promotional content", enabled: false },
];

const integrations = [
   { name: "GitHub", icon: "github", connected: true, description: "Sync your repositories and commits" },
   { name: "GitLab", icon: "gitlab", connected: false, description: "Import projects from GitLab" },
   { name: "Bitbucket", icon: "bitbucket", connected: false, description: "Connect your Bitbucket repositories" },
   { name: "Slack", icon: "slack", connected: true, description: "Get notifications in your Slack workspace" },
   { name: "Discord", icon: "discord", connected: false, description: "Share updates with your Discord community" },
   { name: "Figma", icon: "figma", connected: true, description: "Import designs and prototypes" },
];

const SettingItem = ({ icon: Icon, title, description, children, warning = false }) => (
   <motion.div
      className={`p-4 rounded-lg border ${warning ? "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"} transition-all duration-200 hover:shadow-md`}
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
   >
      <div className="flex items-start justify-between">
         <div className="flex items-start gap-3 flex-1">
            <div
               className={`p-2 rounded-lg ${warning ? "bg-orange-100 dark:bg-orange-800/50" : "bg-gray-100 dark:bg-gray-700"}`}
            >
               <Icon className={`w-5 h-5 ${warning ? "text-orange-600" : "text-gray-600 dark:text-gray-400"}`} />
            </div>
            <div className="flex-1">
               <h4
                  className={`font-medium ${warning ? "text-orange-900 dark:text-orange-100" : "text-gray-900 dark:text-white"}`}
               >
                  {title}
               </h4>
               <p
                  className={`text-sm mt-1 ${warning ? "text-orange-700 dark:text-orange-200" : "text-gray-600 dark:text-gray-400"}`}
               >
                  {description}
               </p>
            </div>
         </div>
         <div className="ml-4">{children}</div>
      </div>
   </motion.div>
);

const NotificationToggle = ({ setting, onChange }) => {
   const [enabled, setEnabled] = useState(setting.enabled);

   const handleToggle = () => {
      setEnabled(!enabled);
      onChange(setting.id, !enabled);
   };

   return (
      <motion.button
         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-600"
         }`}
         onClick={handleToggle}
         whileTap={{ scale: 0.95 }}
      >
         <motion.span
            className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
            animate={{ x: enabled ? 24 : 4 }}
            transition={{ duration: 0.2 }}
         />
      </motion.button>
   );
};

const IntegrationCard = ({ integration }) => (
   <motion.div
      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
   >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
               <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">{integration.name[0]}</span>
            </div>
            <div>
               <h4 className="font-medium text-gray-900 dark:text-white">{integration.name}</h4>
               <p className="text-sm text-gray-600 dark:text-gray-400">{integration.description}</p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            {integration.connected ? (
               <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <Check className="w-3 h-3 mr-1" />
                  Connected
               </Badge>
            ) : (
               <Badge variant="outline">Not Connected</Badge>
            )}
            <Button variant={integration.connected ? "outline" : "default"} size="sm">
               {integration.connected ? "Disconnect" : "Connect"}
            </Button>
         </div>
      </div>
   </motion.div>
);

export default function SettingsPage() {
   const [activeCategory, setActiveCategory] = useState("account");
   const [isDarkMode, setIsDarkMode] = useState(false);
   const [showAdvanced, setShowAdvanced] = useState(false);
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      defaultValues: {
         name: "Nikhil Soni",
         email: "nikhil@yocodex.com",
         username: "nikhilsoni",
         bio: "Full-stack developer passionate about building innovative solutions.",
         website: "https://nikhilsoni.dev",
         location: "Mumbai, India",
      },
   });

   const onSubmit = (data) => {
      console.log("Settings updated:", data);
   };

   const handleNotificationChange = (settingId, enabled) => {
      console.log(`Notification ${settingId} ${enabled ? "enabled" : "disabled"}`);
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
                     <IconSettings className="w-8 h-8 text-blue-500" />
                     Settings & Preferences
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                     Customize your YoCodex experience and manage your account
                  </p>
               </div>

               <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsDarkMode(!isDarkMode)} className="gap-2">
                     {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                     {isDarkMode ? "Light" : "Dark"} Mode
                  </Button>

                  <Button size="sm" className="gap-2">
                     <Save className="w-4 h-4" />
                     Save All Changes
                  </Button>
               </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
               {/* Sidebar Navigation */}
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="lg:col-span-1"
               >
                  <Card>
                     <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Settings Categories</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-2">
                        {settingsCategories.map((category) => (
                           <motion.button
                              key={category.id}
                              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                                 activeCategory === category.id
                                    ? "bg-blue-500 text-white shadow-lg"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                              onClick={() => setActiveCategory(category.id)}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                           >
                              <div className="flex items-center gap-3">
                                 <category.icon
                                    className={`w-5 h-5 ${
                                       activeCategory === category.id ? "text-white" : "text-gray-500"
                                    }`}
                                 />
                                 <div>
                                    <div className="font-medium">{category.name}</div>
                                    <div
                                       className={`text-xs ${
                                          activeCategory === category.id ? "text-blue-100" : "text-gray-500"
                                       }`}
                                    >
                                       {category.description}
                                    </div>
                                 </div>
                              </div>
                           </motion.button>
                        ))}
                     </CardContent>
                  </Card>
               </motion.div>

               {/* Main Settings Panel */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="lg:col-span-3"
               >
                  <AnimatePresence mode="wait">
                     {/* Account Settings */}
                     {activeCategory === "account" && (
                        <motion.div
                           key="account"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.3 }}
                           className="space-y-6"
                        >
                           <Card>
                              <CardHeader>
                                 <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-500" />
                                    Profile Information
                                 </CardTitle>
                              </CardHeader>
                              <CardContent>
                                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Avatar Section */}
                                    <div className="flex items-center gap-6">
                                       <Avatar className="w-20 h-20">
                                          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
                                          <AvatarFallback className="text-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                             NS
                                          </AvatarFallback>
                                       </Avatar>
                                       <div className="space-y-2">
                                          <Button variant="outline" size="sm" className="gap-2">
                                             <Upload className="w-4 h-4" />
                                             Change Photo
                                          </Button>
                                          <Button variant="outline" size="sm" className="gap-2">
                                             <Trash2 className="w-4 h-4 text-red-500" />
                                             Remove
                                          </Button>
                                       </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <div className="space-y-2">
                                          <Label htmlFor="name">Full Name</Label>
                                          <Input
                                             id="name"
                                             {...register("name", { required: true })}
                                             className={errors.name ? "border-red-500" : ""}
                                          />
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
                                          <Label htmlFor="email">Email Address</Label>
                                          <Input
                                             id="email"
                                             type="email"
                                             {...register("email", { required: true })}
                                             className={errors.email ? "border-red-500" : ""}
                                          />
                                       </div>

                                       <div className="space-y-2">
                                          <Label htmlFor="website">Website</Label>
                                          <Input id="website" {...register("website")} />
                                       </div>

                                       <div className="space-y-2 md:col-span-2">
                                          <Label htmlFor="bio">Bio</Label>
                                          <Textarea id="bio" {...register("bio")} className="min-h-[100px]" />
                                       </div>
                                    </div>

                                    <Button type="submit" className="gap-2">
                                       <Save className="w-4 h-4" />
                                       Save Changes
                                    </Button>
                                 </form>
                              </CardContent>
                           </Card>
                        </motion.div>
                     )}

                     {/* Notification Settings */}
                     {activeCategory === "notifications" && (
                        <motion.div
                           key="notifications"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.3 }}
                           className="space-y-6"
                        >
                           <Card>
                              <CardHeader>
                                 <CardTitle className="flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-green-500" />
                                    Notification Preferences
                                 </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                 {notificationSettings.map((setting, index) => (
                                    <motion.div
                                       key={setting.id}
                                       initial={{ opacity: 0, x: -20 }}
                                       animate={{ opacity: 1, x: 0 }}
                                       transition={{ duration: 0.3, delay: index * 0.1 }}
                                       className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                    >
                                       <div>
                                          <h4 className="font-medium text-gray-900 dark:text-white">{setting.label}</h4>
                                          <p className="text-sm text-gray-600 dark:text-gray-400">
                                             {setting.description}
                                          </p>
                                       </div>
                                       <NotificationToggle setting={setting} onChange={handleNotificationChange} />
                                    </motion.div>
                                 ))}
                              </CardContent>
                           </Card>
                        </motion.div>
                     )}

                     {/* Privacy & Security */}
                     {activeCategory === "privacy" && (
                        <motion.div
                           key="privacy"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.3 }}
                           className="space-y-6"
                        >
                           <Card>
                              <CardHeader>
                                 <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-red-500" />
                                    Privacy & Security Settings
                                 </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                 <SettingItem
                                    icon={Lock}
                                    title="Two-Factor Authentication"
                                    description="Add an extra layer of security to your account"
                                 >
                                    <Badge className="bg-green-100 text-green-800">
                                       <Check className="w-3 h-3 mr-1" />
                                       Enabled
                                    </Badge>
                                 </SettingItem>

                                 <SettingItem icon={Key} title="Password" description="Change your account password">
                                    <Button variant="outline" size="sm">
                                       Change Password
                                    </Button>
                                 </SettingItem>

                                 <SettingItem
                                    icon={Eye}
                                    title="Profile Visibility"
                                    description="Control who can see your profile and projects"
                                 >
                                    <DropdownMenu>
                                       <DropdownMenuTrigger asChild>
                                          <Button variant="outline" size="sm">
                                             Public
                                          </Button>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent>
                                          <DropdownMenuItem>Public</DropdownMenuItem>
                                          <DropdownMenuItem>Private</DropdownMenuItem>
                                          <DropdownMenuItem>Friends Only</DropdownMenuItem>
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </SettingItem>

                                 <SettingItem
                                    icon={Download}
                                    title="Data Export"
                                    description="Download a copy of your data"
                                 >
                                    <Button variant="outline" size="sm" className="gap-2">
                                       <Download className="w-4 h-4" />
                                       Export Data
                                    </Button>
                                 </SettingItem>

                                 <SettingItem
                                    icon={Trash2}
                                    title="Delete Account"
                                    description="Permanently delete your account and all data"
                                    warning={true}
                                 >
                                    <AlertDialog>
                                       <AlertDialogTrigger asChild>
                                          <Button variant="destructive" size="sm" className="gap-2">
                                             <Trash2 className="w-4 h-4" />
                                             Delete Account
                                          </Button>
                                       </AlertDialogTrigger>
                                       <AlertDialogContent>
                                          <AlertDialogHeader>
                                             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                             <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                and remove your data from our servers.
                                             </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                             <AlertDialogCancel>Cancel</AlertDialogCancel>
                                             <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                                Delete Account
                                             </AlertDialogAction>
                                          </AlertDialogFooter>
                                       </AlertDialogContent>
                                    </AlertDialog>
                                 </SettingItem>
                              </CardContent>
                           </Card>
                        </motion.div>
                     )}

                     {/* Appearance Settings */}
                     {activeCategory === "appearance" && (
                        <motion.div
                           key="appearance"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.3 }}
                           className="space-y-6"
                        >
                           <Card>
                              <CardHeader>
                                 <CardTitle className="flex items-center gap-2">
                                    <Palette className="w-5 h-5 text-purple-500" />
                                    Appearance & Theme
                                 </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                 <SettingItem
                                    icon={isDarkMode ? Moon : Sun}
                                    title="Theme"
                                    description="Choose your preferred color scheme"
                                 >
                                    <div className="flex items-center gap-2">
                                       <Button
                                          variant={!isDarkMode ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => setIsDarkMode(false)}
                                          className="gap-2"
                                       >
                                          <Sun className="w-4 h-4" />
                                          Light
                                       </Button>
                                       <Button
                                          variant={isDarkMode ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => setIsDarkMode(true)}
                                          className="gap-2"
                                       >
                                          <Moon className="w-4 h-4" />
                                          Dark
                                       </Button>
                                    </div>
                                 </SettingItem>

                                 <SettingItem
                                    icon={Monitor}
                                    title="Display Density"
                                    description="Choose how much information to show"
                                 >
                                    <DropdownMenu>
                                       <DropdownMenuTrigger asChild>
                                          <Button variant="outline" size="sm">
                                             Comfortable
                                          </Button>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent>
                                          <DropdownMenuItem>Compact</DropdownMenuItem>
                                          <DropdownMenuItem>Comfortable</DropdownMenuItem>
                                          <DropdownMenuItem>Spacious</DropdownMenuItem>
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </SettingItem>
                              </CardContent>
                           </Card>
                        </motion.div>
                     )}

                     {/* Integrations */}
                     {activeCategory === "integrations" && (
                        <motion.div
                           key="integrations"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.3 }}
                           className="space-y-6"
                        >
                           <Card>
                              <CardHeader>
                                 <CardTitle className="flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-blue-500" />
                                    Connected Services
                                 </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                 {integrations.map((integration, index) => (
                                    <motion.div
                                       key={integration.name}
                                       initial={{ opacity: 0, y: 20 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                       <IntegrationCard integration={integration} />
                                    </motion.div>
                                 ))}
                              </CardContent>
                           </Card>
                        </motion.div>
                     )}

                     {/* Data & Storage */}
                     {activeCategory === "data" && (
                        <motion.div
                           key="data"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.3 }}
                           className="space-y-6"
                        >
                           <Card>
                              <CardHeader>
                                 <CardTitle className="flex items-center gap-2">
                                    <Database className="w-5 h-5 text-green-500" />
                                    Data & Storage Management
                                 </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                 <SettingItem
                                    icon={Database}
                                    title="Storage Usage"
                                    description="You're using 2.4 GB of 10 GB available"
                                 >
                                    <div className="text-right">
                                       <div className="text-sm font-medium">2.4 GB / 10 GB</div>
                                       <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                                          <div className="w-6 h-2 bg-blue-500 rounded-full"></div>
                                       </div>
                                    </div>
                                 </SettingItem>

                                 <SettingItem
                                    icon={RefreshCw}
                                    title="Auto-Backup"
                                    description="Automatically backup your projects"
                                 >
                                    <Badge className="bg-green-100 text-green-800">
                                       <Check className="w-3 h-3 mr-1" />
                                       Enabled
                                    </Badge>
                                 </SettingItem>

                                 <SettingItem
                                    icon={Download}
                                    title="Export All Data"
                                    description="Download all your projects and data"
                                 >
                                    <Button variant="outline" size="sm" className="gap-2">
                                       <Download className="w-4 h-4" />
                                       Export
                                    </Button>
                                 </SettingItem>
                              </CardContent>
                           </Card>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </motion.div>
            </div>
         </div>
      </div>
   );
}
