"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";
import { IconBrandReact } from "@tabler/icons-react";
import { FaPython, FaJsSquare } from "react-icons/fa";

export default function Footer() {
   return (
      <footer className="bg-gray-900 text-white py-16">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
               <div>
                  <div className="flex items-center space-x-3 mb-6">
                     <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">Y</span>
                     </div>
                     <span className="text-2xl font-bold">YoCodex</span>
                  </div>
                  <p className="text-gray-400 mb-4">
                     Building the future of collaborative development, one line of code at a time.
                  </p>
                  <div className="flex space-x-4">
                     {[Github, IconBrandReact, FaPython, FaJsSquare].map((Icon, index) => (
                        <motion.div
                           key={index}
                           whileHover={{ scale: 1.2 }}
                           className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                           <Icon className="w-5 h-5" />
                        </motion.div>
                     ))}
                  </div>
               </div>

               {[
                  {
                     title: "Product",
                     links: ["Features", "Pricing", "API", "Documentation"],
                  },
                  {
                     title: "Community",
                     links: ["Discord", "Forums", "Events", "Blog"],
                  },
                  {
                     title: "Company",
                     links: ["About", "Careers", "Press", "Contact"],
                  },
               ].map((section) => (
                  <div key={section.title}>
                     <h3 className="font-semibold mb-4">{section.title}</h3>
                     <ul className="space-y-2">
                        {section.links.map((link) => (
                           <li key={link}>
                              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                 {link}
                              </a>
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>

            <Separator className="my-8 bg-gray-800" />

            <div className="flex flex-col md:flex-row justify-between items-center">
               <p className="text-gray-400 mb-4 md:mb-0">
                  © 2025 YoCodex. Owned by Nikhil Soni & Co. Built with ❤️ for the developer community.
               </p>
               <div className="flex space-x-6 text-sm">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                     Privacy
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                     Terms
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                     Security
                  </a>
               </div>
            </div>
         </div>
      </footer>
   );
}
