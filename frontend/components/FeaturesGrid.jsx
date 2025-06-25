"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { BoltIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const features = [
   {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee",
      color: "bg-green-100 text-green-600",
   },
   {
      icon: BoltIcon,
      title: "Lightning Fast",
      description: "Optimized performance with global CDN and edge computing",
      color: "bg-yellow-100 text-yellow-600",
   },
   {
      icon: ChartBarIcon,
      title: "Analytics & Insights",
      description: "Track your project performance with detailed analytics",
      color: "bg-purple-100 text-purple-600",
   },
];

export default function FeaturesGrid() {
   return (
      <motion.section
         className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
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
               <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose YoCodex?</h2>
               <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Everything you need to build, share, and grow as a developer
               </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
               {features.map((feature, index) => (
                  <motion.div
                     key={feature.title}
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.2, duration: 0.6 }}
                     viewport={{ once: true }}
                     whileHover={{ scale: 1.05 }}
                  >
                     <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                        <CardContent className="pt-8">
                           <div
                              className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${feature.color}`}
                           >
                              <feature.icon className="w-8 h-8" />
                           </div>
                           <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                           <p className="text-gray-600">{feature.description}</p>
                        </CardContent>
                     </Card>
                  </motion.div>
               ))}
            </div>
         </div>
      </motion.section>
   );
}
