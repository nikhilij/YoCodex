"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconCode, IconHome, IconInfoCircle, IconBriefcase, IconUsers, IconServicemark } from "@tabler/icons-react";
import Link from "next/link";

export default function Header() {
   const navItems = [
      { name: "Home", href: "/", icon: IconHome },
      { name: "About", href: "/about", icon: IconInfoCircle },
      { name: "Services", href: "/services", icon: IconServicemark },
      { name: "Contact", href: "/contact", icon: IconUsers },
      { name: "Careers", href: "/careers", icon: IconBriefcase },
   ];

   return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="max-w-7xl mx-auto px-6">
            <motion.div
               className="flex h-16 items-center justify-between"
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
            >
               {/* Logo */}
               <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
               >
                  <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                     <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                        <IconCode className="h-6 w-6 text-white" />
                     </div>
                     <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        YoCodex
                     </span>
                  </Link>
               </motion.div>

               {/* Navigation */}
               <motion.nav
                  className="hidden md:flex items-center space-x-8"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
               >
                  {navItems.map((item, index) => {
                     const Icon = item.icon;
                     return (
                        <motion.div
                           key={item.name}
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                        >
                           <Link
                              href={item.href}
                              className="flex items-center space-x-1 text-sm font-medium text-black hover:text-black hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-300 group"
                           >
                              <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                              <span>{item.name}</span>
                           </Link>
                        </motion.div>
                     );
                  })}
               </motion.nav>

               {/* CTA Button */}
               <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
               >
                  <Button
                     size="sm"
                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                     Get Started
                  </Button>
               </motion.div>

               {/* Mobile Menu Button (for future implementation) */}
               <motion.div
                  className="md:hidden"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
               >
                  <Button variant="ghost" size="sm">
                     <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M4 6h16M4 12h16M4 18h16"
                        />
                     </svg>
                  </Button>
               </motion.div>
            </motion.div>
         </div>
      </header>
   );
}
