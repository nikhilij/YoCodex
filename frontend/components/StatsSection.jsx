"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Users, Heart } from "lucide-react";
import { IconRocket } from "@tabler/icons-react";

// Stats data
const stats = [
   { label: "Active Developers", value: "12K+", icon: Users, color: "text-blue-600" },
   { label: "Code Snippets", value: "85K+", icon: Code2, color: "text-green-600" },
   { label: "Projects", value: "2.5K+", icon: IconRocket, color: "text-purple-600" },
   { label: "Community Support", value: "24/7", icon: Heart, color: "text-red-600" },
];

export default function StatsSection() {
   return (
      <motion.section
         className="py-16"
         initial={{ opacity: 0, y: 50 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8 }}
         viewport={{ once: true }}
      >
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {stats.map((stat, index) => (
                  <motion.div
                     key={stat.label}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.1, duration: 0.6 }}
                     viewport={{ once: true }}
                     whileHover={{ scale: 1.05 }}
                  >
                     <Card className="text-center hover:shadow-lg transition-all duration-300">
                        <CardContent className="pt-6">
                           <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                           <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                           <div className="text-sm text-gray-600">{stat.label}</div>
                        </CardContent>
                     </Card>
                  </motion.div>
               ))}
            </div>
         </div>
      </motion.section>
   );
}
