import Image from "next/image";
import IconShowcase from "@/components/IconShowcase";

export default function Home() {
   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
         {/* Navigation */}
         <nav className="w-full px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
               <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Y</span>
               </div>
               <span className="text-2xl font-bold text-gray-800">YoCodex</span>
            </div>
            <div className="hidden md:flex space-x-6">
               <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
               </a>
               <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Explore
               </a>
               <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Community
               </a>
               <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  About
               </a>
            </div>
            <div className="flex space-x-3">
               <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Sign In
               </button>
               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Get Started
               </button>
            </div>
         </nav>

         {/* Hero Section */}
         <main className="max-w-7xl mx-auto px-6 pt-20 pb-16">
            <div className="text-center mb-16">
               <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Where{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                     Code
                  </span>{" "}
                  Meets
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                     Community
                  </span>
               </h1>
               <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Join thousands of developers sharing code, collaborating on projects, and building the future
                  together. YoCodex is your platform for creative coding and meaningful connections.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                     Start Coding
                  </button>
                  <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                     Explore Projects
                  </button>
               </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
               <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                     <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                     </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Share Your Code</h3>
                  <p className="text-gray-600">
                     Upload, showcase, and get feedback on your code snippets and projects from a supportive community.
                  </p>
               </div>

               <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                     <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                     </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborate</h3>
                  <p className="text-gray-600">
                     Work together on projects, contribute to open source, and learn from experienced developers.
                  </p>
               </div>

               <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                     <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                     </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Learn & Grow</h3>
                  <p className="text-gray-600">
                     Discover new technologies, get mentorship, and advance your coding skills with our learning
                     resources.
                  </p>
               </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
               <div className="grid md:grid-cols-4 gap-8 text-center">
                  <div>
                     <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                     <div className="text-gray-600">Active Developers</div>
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
                     <div className="text-gray-600">Code Snippets</div>
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-green-600 mb-2">1K+</div>
                     <div className="text-gray-600">Projects</div>
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-pink-600 mb-2">24/7</div>
                     <div className="text-gray-600">Community Support</div>
                  </div>
               </div>
            </div>
         </main>

         {/* Icon Showcase Section */}
         <IconShowcase />

         {/* Footer */}
         <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-6">
               <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center space-x-2 mb-4 md:mb-0">
                     <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Y</span>
                     </div>
                     <span className="text-2xl font-bold">YoCodex</span>
                  </div>
                  <div className="flex space-x-6">
                     <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        Privacy
                     </a>
                     <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        Terms
                     </a>
                     <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        Contact
                     </a>
                  </div>
               </div>
               <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                  <p>&copy; 2025 YoCodex. Owned by Nikhil Soni & Co. Built with ❤️ for the developer community.</p>
               </div>
            </div>
         </footer>
      </div>
   );
}
