"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
   Play,
   Save,
   Download,
   Upload,
   Settings,
   FolderOpen,
   File,
   Terminal,
   GitBranch,
   Search,
   Replace,
   Maximize2,
   Minimize2,
   Eye,
   EyeOff,
   Code,
   Database,
   Server,
   Palette,
   Moon,
   Sun,
} from "lucide-react";
import { IconCode, IconTerminal2, IconBrandGithub, IconFileCode, IconBug, IconPackage } from "@tabler/icons-react";
import { FiMonitor, FiSmartphone, FiTablet } from "react-icons/fi";
import { HiOutlineCode, HiOutlineCog } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const codeTemplates = {
   javascript: `// Welcome to YoCodex Editor
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('Fibonacci sequence:');
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,

   python: `# Welcome to YoCodex Editor
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci sequence:")
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`,

   html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YoCodex Project</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            color: white;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to YoCodex</h1>
        <p>Building the future of code collaboration</p>
    </div>
</body>
</html>`,
};

const fileTree = [
   {
      name: "src",
      type: "folder",
      children: [
         {
            name: "components",
            type: "folder",
            children: [
               { name: "Header.jsx", type: "file" },
               { name: "Footer.jsx", type: "file" },
               { name: "Navigation.jsx", type: "file" },
            ],
         },
         {
            name: "pages",
            type: "folder",
            children: [
               { name: "Home.jsx", type: "file" },
               { name: "Dashboard.jsx", type: "file" },
            ],
         },
         {
            name: "utils",
            type: "folder",
            children: [
               { name: "helpers.js", type: "file" },
               { name: "api.js", type: "file" },
            ],
         },
         { name: "App.jsx", type: "file" },
         { name: "index.js", type: "file" },
      ],
   },
   {
      name: "public",
      type: "folder",
      children: [
         { name: "index.html", type: "file" },
         { name: "favicon.ico", type: "file" },
      ],
   },
   { name: "package.json", type: "file" },
   { name: "README.md", type: "file" },
];

const FileTreeItem = ({ item, level = 0 }) => {
   const [isOpen, setIsOpen] = useState(level === 0);

   return (
      <div>
         <motion.div
            className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-700 rounded text-sm ${
               level === 0 ? "font-medium" : ""
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.5)" }}
            onClick={() => item.type === "folder" && setIsOpen(!isOpen)}
         >
            {item.type === "folder" ? (
               <FolderOpen className="w-4 h-4 mr-2 text-blue-400" />
            ) : (
               <File className="w-4 h-4 mr-2 text-gray-400" />
            )}
            <span className="text-gray-200">{item.name}</span>
         </motion.div>
         <AnimatePresence>
            {isOpen && item.children && (
               <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
               >
                  {item.children.map((child, index) => (
                     <FileTreeItem key={index} item={child} level={level + 1} />
                  ))}
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default function CodeEditorPage() {
   const [activeLanguage, setActiveLanguage] = useState("javascript");
   const [code, setCode] = useState(codeTemplates.javascript);
   const [isPreviewMode, setIsPreviewMode] = useState(false);
   const [isFullscreen, setIsFullscreen] = useState(false);
   const [isDarkMode, setIsDarkMode] = useState(true);
   const [isTerminalOpen, setIsTerminalOpen] = useState(false);
   const [terminalOutput, setTerminalOutput] = useState([
      "$ npm install",
      "✓ Dependencies installed successfully",
      "$ npm run dev",
      "🚀 Server running on http://localhost:3000",
      "",
   ]);
   const textareaRef = useRef(null);

   const languages = [
      { id: "javascript", name: "JavaScript", icon: IconCode, color: "text-yellow-500" },
      { id: "python", name: "Python", icon: IconFileCode, color: "text-blue-500" },
      { id: "html", name: "HTML", icon: Code, color: "text-orange-500" },
   ];

   const handleLanguageChange = (langId) => {
      setActiveLanguage(langId);
      setCode(codeTemplates[langId]);
   };

   const handleRunCode = () => {
      const newOutput = [...terminalOutput, `$ Running ${activeLanguage} code...`, "✓ Code executed successfully", ""];
      setTerminalOutput(newOutput);
      setIsTerminalOpen(true);
   };

   return (
      <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors duration-300`}>
         {/* Header */}
         <motion.header
            className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b px-6 py-4`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
         >
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                     <HiOutlineCode className="w-8 h-8 text-blue-500" />
                     <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        YoCodex Editor
                     </h1>
                  </motion.div>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                     Pro
                  </Badge>
               </div>

               <div className="flex items-center gap-2">
                  {/* Language Selector */}
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                           {languages.find((l) => l.id === activeLanguage)?.icon &&
                              React.createElement(languages.find((l) => l.id === activeLanguage).icon, {
                                 className: `w-4 h-4 ${languages.find((l) => l.id === activeLanguage).color}`,
                              })}
                           {languages.find((l) => l.id === activeLanguage)?.name}
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent>
                        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {languages.map((lang) => (
                           <DropdownMenuItem key={lang.id} onClick={() => handleLanguageChange(lang.id)}>
                              <lang.icon className={`w-4 h-4 mr-2 ${lang.color}`} />
                              {lang.name}
                           </DropdownMenuItem>
                        ))}
                     </DropdownMenuContent>
                  </DropdownMenu>

                  <TooltipProvider>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="outline" size="sm" onClick={handleRunCode}>
                              <Play className="w-4 h-4" />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>Run Code</p>
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>

                  <Button variant="outline" size="sm">
                     <Save className="w-4 h-4" />
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => setIsDarkMode(!isDarkMode)}>
                     {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                     {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
               </div>
            </div>
         </motion.header>

         <div className="flex h-[calc(100vh-80px)]">
            {/* Sidebar */}
            <motion.aside
               className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"} w-64 border-r overflow-y-auto`}
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.3, delay: 0.1 }}
            >
               <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                     <FolderOpen className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                     <h3 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                        Project Explorer
                     </h3>
                  </div>

                  <div className="space-y-1">
                     {fileTree.map((item, index) => (
                        <FileTreeItem key={index} item={item} />
                     ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Quick Actions */}
                  <div className="space-y-2">
                     <h4 className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Quick Actions
                     </h4>
                     <Button variant="ghost" size="sm" className="w-full justify-start">
                        <Search className="w-4 h-4 mr-2" />
                        Search Files
                     </Button>
                     <Button variant="ghost" size="sm" className="w-full justify-start">
                        <Replace className="w-4 h-4 mr-2" />
                        Find & Replace
                     </Button>
                     <Button variant="ghost" size="sm" className="w-full justify-start">
                        <GitBranch className="w-4 h-4 mr-2" />
                        Source Control
                     </Button>
                  </div>
               </div>
            </motion.aside>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col">
               {/* Editor Tabs */}
               <motion.div
                  className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"} border-b px-4 py-2 flex items-center gap-2`}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
               >
                  <div
                     className={`px-3 py-1 rounded-t-lg ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} border-t border-l border-r`}
                  >
                     <div className="flex items-center gap-2">
                        <File className="w-4 h-4" />
                        <span className="text-sm">
                           main.{activeLanguage === "javascript" ? "js" : activeLanguage === "python" ? "py" : "html"}
                        </span>{" "}
                        <motion.button
                           className="ml-2 text-gray-400 hover:text-gray-600"
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                        >
                           ×
                        </motion.button>
                     </div>
                  </div>
               </motion.div>

               {/* Code Editor */}
               <motion.div
                  className="flex-1 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
               >
                  <Card className={`h-full ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white"}`}>
                     <CardContent className="p-0 h-full">
                        <Textarea
                           ref={textareaRef}
                           value={code}
                           onChange={(e) => setCode(e.target.value)}
                           className={`h-full resize-none border-0 font-mono text-sm leading-relaxed ${
                              isDarkMode
                                 ? "bg-gray-900 text-gray-100 placeholder-gray-500"
                                 : "bg-white text-gray-900 placeholder-gray-400"
                           }`}
                           placeholder="Start coding..."
                        />
                     </CardContent>
                  </Card>
               </motion.div>
            </div>

            {/* Right Panel */}
            <motion.aside
               className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"} w-80 border-l`}
               initial={{ x: 20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.3, delay: 0.4 }}
            >
               <div className="p-4 space-y-4">
                  {/* Preview Controls */}
                  <Card className={isDarkMode ? "bg-gray-900 border-gray-700" : ""}>
                     <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm">
                           <Eye className="w-4 h-4" />
                           Preview
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        <div className="flex gap-2">
                           <Button variant="outline" size="sm" className="flex-1">
                              <FiMonitor className="w-4 h-4 mr-1" />
                              Desktop
                           </Button>
                           <Button variant="outline" size="sm" className="flex-1">
                              <FiTablet className="w-4 h-4 mr-1" />
                              Tablet
                           </Button>
                           <Button variant="outline" size="sm" className="flex-1">
                              <FiSmartphone className="w-4 h-4 mr-1" />
                              Mobile
                           </Button>
                        </div>
                        <Button className="w-full" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                           {isPreviewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                           {isPreviewMode ? "Hide Preview" : "Show Preview"}
                        </Button>
                     </CardContent>
                  </Card>

                  {/* Code Stats */}
                  <Card className={isDarkMode ? "bg-gray-900 border-gray-700" : ""}>
                     <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm">
                           <Database className="w-4 h-4" />
                           Code Statistics
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                           <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Lines:</span>
                           <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
                              {code.split("\n").length}
                           </span>
                        </div>
                        <div className="flex justify-between">
                           <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Characters:</span>
                           <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>{code.length}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Words:</span>
                           <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
                              {code.split(/\s+/).filter((word) => word.length > 0).length}
                           </span>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Recent Files */}
                  <Card className={isDarkMode ? "bg-gray-900 border-gray-700" : ""}>
                     <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm">
                           <IconFileCode className="w-4 h-4" />
                           Recent Files
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-2">
                        {["components/Header.jsx", "utils/api.js", "pages/Dashboard.jsx"].map((file, index) => (
                           <motion.button
                              key={file}
                              className={`w-full text-left p-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                 isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                           >
                              <div className="flex items-center gap-2">
                                 <File className="w-3 h-3" />
                                 {file}
                              </div>
                           </motion.button>
                        ))}
                     </CardContent>
                  </Card>
               </div>
            </motion.aside>
         </div>

         {/* Terminal */}
         <AnimatePresence>
            {isTerminalOpen && (
               <motion.div
                  className={`${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-800 border-gray-300"} border-t`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 200, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
               >
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                     <div className="flex items-center gap-2">
                        <IconTerminal2 className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-white">Terminal</span>
                     </div>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsTerminalOpen(false)}
                        className="text-gray-400 hover:text-white"
                     >
                        ×
                     </Button>
                  </div>
                  <div className="p-4 font-mono text-sm text-green-400 bg-gray-900 h-full overflow-y-auto">
                     {terminalOutput.map((line, index) => (
                        <div key={index} className="mb-1">
                           {line}
                        </div>
                     ))}
                     <div className="flex items-center">
                        <span className="text-blue-400">$</span>
                        <span className="ml-2 border-r border-green-400 animate-pulse"> </span>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Bottom Action Bar */}
         <motion.div
            className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"} border-t px-4 py-2 flex items-center justify-between text-sm`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
         >
            <div className="flex items-center gap-4">
               <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Ln {code.split("\n").length}, Col 1
               </span>
               <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{activeLanguage.toUpperCase()}</span>
               <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>UTF-8</span>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm" onClick={() => setIsTerminalOpen(!isTerminalOpen)} className="gap-1">
                  <Terminal className="w-3 h-3" />
                  Terminal
               </Button>
               <span className="text-green-500">● Connected</span>
            </div>
         </motion.div>
      </div>
   );
}
