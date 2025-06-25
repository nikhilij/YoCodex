// Icon Examples for YoCodex
// This file demonstrates how to use all the installed icon libraries

"use client";

import React from "react";

// Lucide React - Most modern + free + rich
import { Code, Users, Heart, Star, Github, ArrowRight, Menu, Search, User, Settings } from "lucide-react";

// Tabler Icons - Clean and consistent
import { IconBrandReact, IconCode, IconUsers, IconHeart, IconStar, IconBrandGithub } from "@tabler/icons-react";

// React Icons - Many libraries in one (includes Font Awesome, Material Design, etc.)
import { FaReact, FaCode, FaUsers, FaHeart, FaGithub } from "react-icons/fa";
import { MdCode, MdPeople, MdFavorite } from "react-icons/md";
import { AiOutlineCode, AiOutlineTeam, AiOutlineHeart } from "react-icons/ai";

// Heroicons - Minimalist Tailwind UI
import { CodeBracketIcon, UsersIcon, HeartIcon, StarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
   CodeBracketIcon as CodeBracketSolid,
   UsersIcon as UsersSolid,
   HeartIcon as HeartSolid,
} from "@heroicons/react/24/solid";

const IconShowcase = () => {
   return (
      <div className="p-8 max-w-6xl mx-auto">
         <h1 className="text-3xl font-bold mb-8 text-center">YoCodex Icon Libraries Showcase</h1>

         {/* Lucide React */}
         <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
               <Code className="w-6 h-6" />
               Lucide React - Modern & Rich
            </h2>
            <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
               <Code className="w-6 h-6 text-blue-600" />
               <Users className="w-6 h-6 text-green-600" />
               <Heart className="w-6 h-6 text-red-600" />
               <Star className="w-6 h-6 text-yellow-600" />
               <Github className="w-6 h-6 text-gray-800" />
               <ArrowRight className="w-6 h-6 text-purple-600" />
               <Menu className="w-6 h-6 text-indigo-600" />
               <Search className="w-6 h-6 text-teal-600" />
               <User className="w-6 h-6 text-orange-600" />
               <Settings className="w-6 h-6 text-pink-600" />
            </div>
         </div>

         {/* Tabler Icons */}
         <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
               <IconBrandReact className="w-6 h-6" />
               Tabler Icons - Clean & Consistent
            </h2>
            <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
               <IconBrandReact className="w-6 h-6 text-blue-600" />
               <IconCode className="w-6 h-6 text-green-600" />
               <IconUsers className="w-6 h-6 text-red-600" />
               <IconHeart className="w-6 h-6 text-yellow-600" />
               <IconStar className="w-6 h-6 text-purple-600" />
               <IconBrandGithub className="w-6 h-6 text-gray-800" />
            </div>{" "}
         </div>

         {/* React Icons */}
         <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
               <FaReact className="w-6 h-6" />
               React Icons - Many Libraries in One
            </h2>
            <div className="space-y-4">
               <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">Font Awesome:</p>
                  <div className="flex gap-4 items-center">
                     <FaReact className="w-6 h-6 text-blue-600" />
                     <FaCode className="w-6 h-6 text-green-600" />
                     <FaUsers className="w-6 h-6 text-red-600" />
                     <FaHeart className="w-6 h-6 text-yellow-600" />
                     <FaGithub className="w-6 h-6 text-gray-800" />
                  </div>
               </div>
               <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">Material Design:</p>
                  <div className="flex gap-4 items-center">
                     <MdCode className="w-6 h-6 text-blue-600" />
                     <MdPeople className="w-6 h-6 text-green-600" />
                     <MdFavorite className="w-6 h-6 text-red-600" />
                  </div>
               </div>
               <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">Ant Design:</p>
                  <div className="flex gap-4 items-center">
                     <AiOutlineCode className="w-6 h-6 text-blue-600" />
                     <AiOutlineTeam className="w-6 h-6 text-green-600" />
                     <AiOutlineHeart className="w-6 h-6 text-red-600" />
                  </div>
               </div>
            </div>
         </div>

         {/* Heroicons */}
         <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
               <CodeBracketIcon className="w-6 h-6" />
               Heroicons - Minimalist Tailwind UI
            </h2>
            <div className="space-y-4">
               <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">Outline Style:</p>
                  <div className="flex gap-4 items-center">
                     <CodeBracketIcon className="w-6 h-6 text-blue-600" />
                     <UsersIcon className="w-6 h-6 text-green-600" />
                     <HeartIcon className="w-6 h-6 text-red-600" />
                     <StarIcon className="w-6 h-6 text-yellow-600" />
                     <MagnifyingGlassIcon className="w-6 h-6 text-purple-600" />
                  </div>
               </div>
               <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">Solid Style:</p>
                  <div className="flex gap-4 items-center">
                     <CodeBracketSolid className="w-6 h-6 text-blue-600" />
                     <UsersSolid className="w-6 h-6 text-green-600" />
                     <HeartSolid className="w-6 h-6 text-red-600" />
                  </div>
               </div>
            </div>
         </div>

         {/* Usage Examples */}
         <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Quick Usage Examples:</h3>
            <div className="space-y-2 text-sm font-mono">
               <p>
                  <span className="text-blue-600">Lucide:</span> import &#123; Code &#125; from 'lucide-react'
               </p>{" "}
               <p>
                  <span className="text-green-600">Tabler:</span> import &#123; IconCode &#125; from
                  '@tabler/icons-react'
               </p>
               <p>
                  <span className="text-yellow-600">React Icons:</span> import &#123; FaCode &#125; from
                  'react-icons/fa'
               </p>
               <p>
                  <span className="text-purple-600">Heroicons:</span> import &#123; CodeBracketIcon &#125; from
                  '@heroicons/react/24/outline'
               </p>
            </div>
         </div>
      </div>
   );
};

export default IconShowcase;
