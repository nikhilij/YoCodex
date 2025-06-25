"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
} from "@tanstack/react-table";
import {
   ChevronDown,
   ChevronUp,
   Search,
   Filter,
   Download,
   Upload,
   MoreHorizontal,
   Edit,
   Trash2,
   Eye,
   Star,
   GitBranch,
   Calendar,
   Users,
   Code,
   Activity,
   TrendingUp,
   TrendingDown,
   ExternalLink,
} from "lucide-react";
import { IconTable, IconFileExport, IconAdjustments, IconRefresh, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for projects table
const generateMockData = () => {
   const statuses = ["Active", "Completed", "On Hold", "Archived"];
   const priorities = ["Low", "Medium", "High", "Critical"];
   const languages = ["JavaScript", "Python", "TypeScript", "Java", "Go", "Rust", "C++"];
   const frameworks = ["React", "Vue", "Angular", "Django", "FastAPI", "Express", "Spring Boot"];

   const projects = [];

   for (let i = 1; i <= 50; i++) {
      projects.push({
         id: i,
         name: `Project ${i}`,
         description: `This is a comprehensive description for project ${i}. It involves building modern applications with cutting-edge technologies.`,
         status: statuses[Math.floor(Math.random() * statuses.length)],
         priority: priorities[Math.floor(Math.random() * priorities.length)],
         language: languages[Math.floor(Math.random() * languages.length)],
         framework: frameworks[Math.floor(Math.random() * frameworks.length)],
         stars: Math.floor(Math.random() * 5000) + 10,
         forks: Math.floor(Math.random() * 1000) + 5,
         commits: Math.floor(Math.random() * 500) + 20,
         contributors: Math.floor(Math.random() * 20) + 1,
         createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
         updatedAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
         owner: {
            name: `User ${i}`,
            avatar: `https://images.unsplash.com/photo-${1500000000000 + i}?w=40&h=40&fit=crop&crop=face`,
            initials: `U${i}`,
         },
         trend: Math.random() > 0.5 ? "up" : "down",
         trendValue: `${Math.floor(Math.random() * 30) + 1}%`,
      });
   }

   return projects;
};

const StatusBadge = ({ status }) => {
   const variants = {
      Active: "bg-green-100 text-green-800 border-green-200",
      Completed: "bg-blue-100 text-blue-800 border-blue-200",
      "On Hold": "bg-yellow-100 text-yellow-800 border-yellow-200",
      Archived: "bg-gray-100 text-gray-800 border-gray-200",
   };

   return <Badge className={`${variants[status]} border`}>{status}</Badge>;
};

const PriorityBadge = ({ priority }) => {
   const variants = {
      Low: "bg-gray-100 text-gray-800",
      Medium: "bg-blue-100 text-blue-800",
      High: "bg-orange-100 text-orange-800",
      Critical: "bg-red-100 text-red-800",
   };

   return <Badge className={variants[priority]}>{priority}</Badge>;
};

const TrendIndicator = ({ trend, value }) => (
   <div className="flex items-center gap-1">
      {trend === "up" ? (
         <TrendingUp className="w-4 h-4 text-green-500" />
      ) : (
         <TrendingDown className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>{value}</span>
   </div>
);

export default function DataTablePage() {
   const [sorting, setSorting] = useState([]);
   const [columnFilters, setColumnFilters] = useState([]);
   const [columnVisibility, setColumnVisibility] = useState({});
   const [rowSelection, setRowSelection] = useState({});
   const [globalFilter, setGlobalFilter] = useState("");

   const data = useMemo(() => generateMockData(), []);

   const columns = useMemo(
      () => [
         {
            id: "select",
            header: ({ table }) => (
               <input
                  type="checkbox"
                  checked={table.getIsAllRowsSelected()}
                  onChange={table.getToggleAllRowsSelectedHandler()}
                  className="rounded border-gray-300"
               />
            ),
            cell: ({ row }) => (
               <input
                  type="checkbox"
                  checked={row.getIsSelected()}
                  onChange={row.getToggleSelectedHandler()}
                  className="rounded border-gray-300"
               />
            ),
            enableSorting: false,
            enableHiding: false,
         },
         {
            accessorKey: "name",
            header: ({ column }) => (
               <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  className="p-0 font-semibold"
               >
                  Project Name
                  {column.getIsSorted() === "asc" ? (
                     <ChevronUp className="ml-2 h-4 w-4" />
                  ) : column.getIsSorted() === "desc" ? (
                     <ChevronDown className="ml-2 h-4 w-4" />
                  ) : null}
               </Button>
            ),
            cell: ({ row }) => {
               const project = row.original;
               return (
                  <div className="flex items-center gap-3">
                     <Avatar className="w-8 h-8">
                        <AvatarImage src={project.owner.avatar} />
                        <AvatarFallback className="text-xs">{project.owner.initials}</AvatarFallback>
                     </Avatar>
                     <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                           {project.description}
                        </div>
                     </div>
                  </div>
               );
            },
         },
         {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
            filterFn: (row, id, value) => {
               return value.includes(row.getValue(id));
            },
         },
         {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => <PriorityBadge priority={row.getValue("priority")} />,
         },
         {
            accessorKey: "language",
            header: "Language",
            cell: ({ row }) => (
               <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-500" />
                  <span>{row.getValue("language")}</span>
               </div>
            ),
         },
         {
            accessorKey: "framework",
            header: "Framework",
            cell: ({ row }) => <Badge variant="outline">{row.getValue("framework")}</Badge>,
         },
         {
            accessorKey: "stars",
            header: ({ column }) => (
               <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  className="p-0"
               >
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  Stars
                  {column.getIsSorted() &&
                     (column.getIsSorted() === "asc" ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                     ) : (
                        <ChevronDown className="ml-2 h-4 w-4" />
                     ))}
               </Button>
            ),
            cell: ({ row }) => (
               <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{row.getValue("stars").toLocaleString()}</span>
               </div>
            ),
         },
         {
            accessorKey: "forks",
            header: "Forks",
            cell: ({ row }) => (
               <div className="flex items-center gap-1">
                  <GitBranch className="w-4 h-4 text-blue-500" />
                  <span>{row.getValue("forks").toLocaleString()}</span>
               </div>
            ),
         },
         {
            accessorKey: "contributors",
            header: "Contributors",
            cell: ({ row }) => (
               <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-green-500" />
                  <span>{row.getValue("contributors")}</span>
               </div>
            ),
         },
         {
            accessorKey: "trend",
            header: "Trend",
            cell: ({ row }) => {
               const project = row.original;
               return <TrendIndicator trend={project.trend} value={project.trendValue} />;
            },
            enableSorting: false,
         },
         {
            accessorKey: "updatedAt",
            header: ({ column }) => (
               <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  className="p-0"
               >
                  <Calendar className="w-4 h-4 mr-1" />
                  Updated
                  {column.getIsSorted() &&
                     (column.getIsSorted() === "asc" ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                     ) : (
                        <ChevronDown className="ml-2 h-4 w-4" />
                     ))}
               </Button>
            ),
            cell: ({ row }) => {
               const date = row.getValue("updatedAt");
               return <div className="text-sm">{date.toLocaleDateString()}</div>;
            },
         },
         {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
               const project = row.original;

               return (
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                           <span className="sr-only">Open menu</span>
                           <MoreHorizontal className="h-4 w-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(project.id)}>
                           Copy project ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                           <Eye className="w-4 h-4 mr-2" />
                           View details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <Edit className="w-4 h-4 mr-2" />
                           Edit project
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <ExternalLink className="w-4 h-4 mr-2" />
                           Open repository
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                           <Trash2 className="w-4 h-4 mr-2" />
                           Delete project
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               );
            },
         },
      ],
      []
   );

   const table = useReactTable({
      data,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: "includesString",
      state: {
         sorting,
         columnFilters,
         columnVisibility,
         rowSelection,
         globalFilter,
      },
   });

   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
         <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3 }}
               className="flex items-center justify-between"
            >
               <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <IconTable className="w-8 h-8 text-blue-500" />
                     Advanced Data Table
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                     Manage and analyze your projects with powerful table features
                  </p>
               </div>

               <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                     <IconRefresh className="w-4 h-4" />
                     Refresh
                  </Button>

                  <Button variant="outline" size="sm" className="gap-2">
                     <IconFileExport className="w-4 h-4" />
                     Export
                  </Button>

                  <Button size="sm" className="gap-2">
                     <IconPlus className="w-4 h-4" />
                     Add Project
                  </Button>
               </div>
            </motion.div>

            {/* Table Card */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3, delay: 0.1 }}
            >
               <Card>
                  <CardHeader className="pb-4">
                     <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                           Projects Overview
                           <Badge variant="secondary">{data.length} total</Badge>
                        </CardTitle>

                        <div className="flex items-center gap-2">
                           {/* Global Search */}
                           <div className="relative">
                              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                              <Input
                                 placeholder="Search all columns..."
                                 value={globalFilter ?? ""}
                                 onChange={(event) => setGlobalFilter(String(event.target.value))}
                                 className="pl-8 w-[250px]"
                              />
                           </div>

                           {/* Column Visibility */}
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button variant="outline" size="sm" className="gap-2">
                                    <IconAdjustments className="w-4 h-4" />
                                    Columns
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                 {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                       return (
                                          <DropdownMenuCheckboxItem
                                             key={column.id}
                                             className="capitalize"
                                             checked={column.getIsVisible()}
                                             onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                          >
                                             {column.id}
                                          </DropdownMenuCheckboxItem>
                                       );
                                    })}
                              </DropdownMenuContent>
                           </DropdownMenu>

                           {/* Filter */}
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button variant="outline" size="sm" className="gap-2">
                                    <Filter className="w-4 h-4" />
                                    Filter
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[200px]">
                                 <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                 <DropdownMenuSeparator />
                                 {["Active", "Completed", "On Hold", "Archived"].map((status) => (
                                    <DropdownMenuCheckboxItem key={status}>{status}</DropdownMenuCheckboxItem>
                                 ))}
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                     </div>

                     {/* Selected Rows Info */}
                     {Object.keys(rowSelection).length > 0 && (
                        <motion.div
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                        >
                           <Activity className="w-5 h-5 text-blue-500" />
                           <span className="text-sm font-medium">
                              {Object.keys(rowSelection).length} row(s) selected
                           </span>
                           <div className="flex gap-2 ml-auto">
                              <Button size="sm" variant="outline">
                                 <Download className="w-4 h-4 mr-1" />
                                 Export Selected
                              </Button>
                              <Button size="sm" variant="outline">
                                 <Trash2 className="w-4 h-4 mr-1" />
                                 Delete Selected
                              </Button>
                           </div>
                        </motion.div>
                     )}
                  </CardHeader>

                  <CardContent>
                     {/* Table */}
                     <div className="rounded-md border">
                        <table className="w-full">
                           <thead>
                              {table.getHeaderGroups().map((headerGroup) => (
                                 <tr key={headerGroup.id} className="border-b bg-muted/50">
                                    {headerGroup.headers.map((header) => (
                                       <th key={header.id} className="px-4 py-3 text-left font-medium">
                                          {header.isPlaceholder
                                             ? null
                                             : flexRender(header.column.columnDef.header, header.getContext())}
                                       </th>
                                    ))}
                                 </tr>
                              ))}
                           </thead>
                           <tbody>
                              <AnimatePresence>
                                 {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row, index) => (
                                       <motion.tr
                                          key={row.id}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -20 }}
                                          transition={{ duration: 0.2, delay: index * 0.02 }}
                                          className="border-b hover:bg-muted/50 transition-colors"
                                       >
                                          {row.getVisibleCells().map((cell) => (
                                             <td key={cell.id} className="px-4 py-3">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                             </td>
                                          ))}
                                       </motion.tr>
                                    ))
                                 ) : (
                                    <tr>
                                       <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                          No results found.
                                       </td>
                                    </tr>
                                 )}
                              </AnimatePresence>
                           </tbody>
                        </table>
                     </div>

                     {/* Pagination */}
                     <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                           {table.getFilteredSelectedRowModel().rows.length} of{" "}
                           {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                        <div className="flex items-center space-x-6 lg:space-x-8">
                           <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium">Rows per page</p>
                              <select
                                 value={table.getState().pagination.pageSize}
                                 onChange={(e) => {
                                    table.setPageSize(Number(e.target.value));
                                 }}
                                 className="h-8 w-[70px] rounded border px-3 text-sm"
                              >
                                 {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                       {pageSize}
                                    </option>
                                 ))}
                              </select>
                           </div>
                           <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                           </div>
                           <div className="flex items-center space-x-2">
                              <Button
                                 variant="outline"
                                 className="hidden h-8 w-8 p-0 lg:flex"
                                 onClick={() => table.setPageIndex(0)}
                                 disabled={!table.getCanPreviousPage()}
                              >
                                 <span className="sr-only">Go to first page</span>
                                 {"<<"}
                              </Button>
                              <Button
                                 variant="outline"
                                 className="h-8 w-8 p-0"
                                 onClick={() => table.previousPage()}
                                 disabled={!table.getCanPreviousPage()}
                              >
                                 <span className="sr-only">Go to previous page</span>
                                 {"<"}
                              </Button>
                              <Button
                                 variant="outline"
                                 className="h-8 w-8 p-0"
                                 onClick={() => table.nextPage()}
                                 disabled={!table.getCanNextPage()}
                              >
                                 <span className="sr-only">Go to next page</span>
                                 {">"}
                              </Button>
                              <Button
                                 variant="outline"
                                 className="hidden h-8 w-8 p-0 lg:flex"
                                 onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                 disabled={!table.getCanNextPage()}
                              >
                                 <span className="sr-only">Go to last page</span>
                                 {">>"}
                              </Button>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>
         </div>
      </div>
   );
}
