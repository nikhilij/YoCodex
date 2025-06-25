"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { IconRocket } from "@tabler/icons-react";

export default function Hero() {
   return (
      <section className="relative overflow-hidden py-20">
         <div className="max-w-7xl mx-auto px-6">
            <motion.div
               className="text-center"
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
            >
               <motion.h1
                  className="text-6xl md:text-7xl font-bold mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
               >
                  Where{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                     Code
                  </span>{" "}
                  Meets
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                     Innovation
                  </span>
               </motion.h1>

               <motion.p
                  className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
               >
                  Join the next generation of developers building extraordinary software. Share code, collaborate on
                  projects, and shape the future of technology together.
               </motion.p>

               <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
               >
                  <Button
                     size="lg"
                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
                  >
                     <IconRocket className="w-5 h-5 mr-2" />
                     Start Building
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                     <Globe className="w-5 h-5 mr-2" />
                     Explore Projects
                  </Button>
               </motion.div>
            </motion.div>
         </div>

         {/* Floating Elements */}
         <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-60"
            animate={{
               y: [0, -20, 0],
               x: [0, 10, 0],
            }}
            transition={{
               duration: 6,
               repeat: Infinity,
               ease: "easeInOut",
            }}
         />
         <motion.div
            className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-40"
            animate={{
               y: [0, 20, 0],
               x: [0, -15, 0],
            }}
            transition={{
               duration: 8,
               repeat: Infinity,
               ease: "easeInOut",
            }}
         />
      </section>
   );
}
