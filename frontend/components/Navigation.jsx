"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
   Home,
   BarChart3,
   Code,
   FolderOpen,
   Table,
   User,
   Menu,
   X,
   ChevronDown,
   Zap,
   Star,
   Bell,
   Search,
   Settings,
   LogOut,
} from "lucide-react";
import { IconCode, IconDashboard, IconTable, IconUser, IconSettings, IconHome } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const navigationItems = [
   {
      name: "Home",
      href: "/",
      icon: IconHome,
      description: "Welcome to YoCodex",
   },
   {
      name: "Dashboard",
      href: "/dashboard",
      icon: IconDashboard,
      description: "Analytics & Overview",
   },
   {
      name: "Projects",
      href: "/projects",
      icon: FolderOpen,
      description: "Project Showcase",
   },
   {
      name: "Editor",
      href: "/editor",
      icon: IconCode,
      description: "Code Editor",
   },
   {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      description: "Advanced Analytics",
   },
   {
      name: "Data Table",
      href: "/data-table",
      icon: IconTable,
      description: "Advanced Data Table",
   },
   {
      name: "Profile",
      href: "/profile",
      icon: IconUser,
      description: "User Profile",
   },
   {
      name: "Settings",
      href: "/settings",
      icon: IconSettings,
      description: "Settings & Preferences",
   },
];

const NavItem = ({ item, isActive, isMobile = false, onClick }) => (
   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
         href={item.href}
         className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            isActive
               ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
               : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
         } ${isMobile ? "w-full" : ""}`}
         onClick={onClick}
      >
         <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
         <div className={`${isMobile ? "block" : "hidden lg:block"}`}>
            <div className="font-medium">{item.name}</div>
            {isMobile && (
               <div className={`text-xs ${isActive ? "text-blue-100" : "text-gray-500"}`}>{item.description}</div>
            )}
         </div>
      </Link>
   </motion.div>
);

export default function Navigation() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false);
   const pathname = usePathname();

   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 10);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
   };

   const closeMobileMenu = () => {
      setIsMobileMenuOpen(false);
   };

   return (
      <>
         <motion.header
            className={`sticky top-0 z-50 transition-all duration-300 ${
               isScrolled
                  ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm"
                  : "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
         >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex items-center justify-between h-16">
                  {/* Logo */}
                  <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                     <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                           <IconCode className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">YoCodex</span>
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">Pro</Badge>
                     </Link>
                  </motion.div>

                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center gap-1">
                     {navigationItems.map((item) => (
                        <NavItem key={item.href} item={item} isActive={pathname === item.href} />
                     ))}
                  </nav>

                  {/* Right Side - Search & User */}
                  <div className="flex items-center gap-3">
                     {/* Search */}
                     <div className="hidden sm:block relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                           placeholder="Search..."
                           className="pl-9 w-64 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900"
                        />
                     </div>

                     {/* Notifications */}
                     <motion.button
                        className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                     >
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                           <span className="text-xs text-white">3</span>
                        </span>
                     </motion.button>

                     {/* User Menu */}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <motion.button
                              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                           >
                              <Avatar className="w-8 h-8">
                                 <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
                                 <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                                    NS
                                 </AvatarFallback>
                              </Avatar>
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                           </motion.button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                           <DropdownMenuLabel>
                              <div className="flex flex-col space-y-1">
                                 <p className="text-sm font-medium">Nikhil Soni</p>
                                 <p className="text-xs text-muted-foreground">nikhil@yocodex.com</p>
                              </div>
                           </DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem asChild>
                              <Link href="/profile" className="flex items-center gap-2">
                                 <User className="w-4 h-4" />
                                 Profile
                              </Link>
                           </DropdownMenuItem>{" "}
                           <DropdownMenuItem asChild>
                              <Link href="/settings" className="flex items-center gap-2">
                                 <Settings className="w-4 h-4" />
                                 Settings
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem>
                              <Zap className="w-4 h-4 mr-2" />
                              Upgrade to Pro
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem className="text-red-600">
                              <LogOut className="w-4 h-4 mr-2" />
                              Sign out
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>

                     {/* Mobile Menu Button */}
                     <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                     </Button>
                  </div>
               </div>
            </div>
         </motion.header>

         {/* Mobile Menu Overlay */}
         <AnimatePresence>
            {isMobileMenuOpen && (
               <>
                  {/* Backdrop */}
                  <motion.div
                     className="fixed inset-0 bg-black/50 z-40 md:hidden"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={closeMobileMenu}
                  />

                  {/* Mobile Menu */}
                  <motion.div
                     className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 md:hidden"
                     initial={{ y: -20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     exit={{ y: -20, opacity: 0 }}
                     transition={{ duration: 0.2 }}
                  >
                     <div className="p-4 space-y-2">
                        {/* Mobile Search */}
                        <div className="relative mb-4">
                           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                           <Input
                              placeholder="Search..."
                              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900"
                           />
                        </div>

                        {/* Mobile Navigation Items */}
                        {navigationItems.map((item) => (
                           <NavItem
                              key={item.href}
                              item={item}
                              isActive={pathname === item.href}
                              isMobile={true}
                              onClick={closeMobileMenu}
                           />
                        ))}

                        {/* Mobile User Actions */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                           <Link
                              href="/profile"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              onClick={closeMobileMenu}
                           >
                              <User className="w-5 h-5" />
                              <span>Profile</span>
                           </Link>{" "}
                           <Link
                              href="/settings"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              onClick={closeMobileMenu}
                           >
                              <Settings className="w-5 h-5" />
                              <span>Settings</span>
                           </Link>
                           <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full">
                              <LogOut className="w-5 h-5" />
                              <span>Sign out</span>
                           </button>
                        </div>
                     </div>
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </>
   );
}
