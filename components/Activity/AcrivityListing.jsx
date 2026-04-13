"use client";
import React, { useState, useMemo } from "react";
import { Plus, Search, Loader2, LayoutGrid } from "lucide-react"; 
import { useGetActivitiesQuery } from "@/features/activity/activityApi";
import CategoryBalls from "@/components/Category/CategoryBalls.jsx";
import { ExperienceCard } from "./ExperienceCard.jsx";
import FilterModal from "../Category/FilterModal.jsx";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
export default function ActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Start with 10 items as per requirement
  const [itemsToLoad, setItemsToLoad] = useState(10); 
  const [viewMode, setViewMode] = useState("grid");
  
  // Requirement: State for columns per row (2 to 5)
  const [colsPerRow, setColsPerRow] = useState(5);

  const categoryId = selectedCategory || undefined;

  const { data, isLoading, isFetching, isError } = useGetActivitiesQuery({
    page: 1,
    limit: itemsToLoad,
    ...(categoryId && { categoryId }),
  });

  const activities = Array.isArray(data?.data?.data) ? data.data.data : [];
  const pagination = data?.data?.pagination;

  const normalizedActivities = useMemo(() => {
    return activities.map((activity) => ({
      _id: activity._id,
      title: activity.name,
      images: Array.isArray(activity.Images)
        ? activity.Images.map((img) => ({ url: img.secure_url }))
        : [],
      location: "Dubai",
      rating: 4.8,
      reviewCount: 1200,
      duration: { hours: 6 },
      cancellationPolicy: { isFreeCancellation: true },
      variants: [{ pricing: [{ price: activity.PrivateSUV?.fee || 45 }] }],
      tags: activity.Experience?.highlights?.slice(0, 3) || ["Adventure", "Sightseeing"],
    }));
  }, [activities]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat || "");
    setItemsToLoad(10); // Reset to 10 on category change
  };
 const { data: catResponse } = useGetCategoriesQuery({ page: 1, limit: 50 });
  const allCategoriesData = catResponse?.data || [];
  // Helper to get Tailwind grid classes based on dropdown selection
  // const getGridConfig = () => {
  //   if (viewMode !== "grid") return "flex flex-col gap-4";
    
  //   const base = "grid gap-5 grid-cols-1 sm:grid-cols-2";
  //   switch (colsPerRow) {
  //     case 2: return `${base} lg:grid-cols-2`;
  //     case 3: return `${base} lg:grid-cols-3`;
  //     case 4: return `${base} md:grid-cols-3 lg:grid-cols-4`;
  //     // case 5: default: return `${base} md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`;
  //      default: return `${base} md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`;
  //   }
  // };

  // ActivitiesPage.js ke andar is function ko update karein
const getGridConfig = () => {
  if (viewMode !== "grid") return "flex flex-col gap-4";
  const base = "grid gap-3 sm:gap-5 grid-cols-2"; 
  
  switch (colsPerRow) {
    case 2: return `${base} sm:grid-cols-2 lg:grid-cols-2`;
    case 3: return `${base} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3`;
    case 4: return `${base} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`;
    default: return `${base} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`;
  }
};

  if (isLoading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0047AB] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-slate-600 font-bold">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#F8FAFC] min-h-screen font-sans" id="tours">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#0047AB] font-black tracking-widest uppercase text-[11px] mb-2 block">
              DISCOVER THE EMIRATES
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter leading-none">
              Handpicked <span className="text-[#0047AB]">Adventures</span>
            </h1>
          </div>
                <div className="text-xs font-bold text-slate-400">
            Found <span className="text-slate-900 font-black">
              {data?.data?.pagination?.total || 0}
            </span> verified results
          </div>

          {/* <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
              <LayoutGrid className="w-4 h-4 text-slate-400" />
              <label className="text-xs font-bold text-slate-500 uppercase">View:</label>
              <select 
                value={colsPerRow}
                onChange={(e) => setColsPerRow(Number(e.target.value))}
                className="text-xs font-black text-slate-900 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value={2}>2 Per Row</option>
                <option value={3}>3 Per Row</option>
                <option value={4}>4 Per Row</option>
                <option value={5}>5 Per Row</option>
              </select>
            </div>

            <div className="text-xs font-bold text-slate-400 border-l pl-4 border-slate-200">
              Found <span className="text-slate-900 font-black">
                {pagination?.total || normalizedActivities.length}
              </span> verified results
            </div>
          </div> */}
        </div>

        {/* Filter Bar */}
        <CategoryBalls
          // limit={10}
          // setSelectedCategory={handleSelectCategory}
          // selectedCategory={selectedCategory}
          // viewMode={viewMode}
          // setViewMode={setViewMode}

             setSelectedCategory={setSelectedCategory}
  selectedCategory={selectedCategory}
  viewMode={viewMode}
  setViewMode={setViewMode}
  colsPerRow={colsPerRow}
  setColsPerRow={setColsPerRow}
  setIsFilterOpen={setIsFilterOpen}
        />

        {/* Dynamic Grid */}
        {normalizedActivities.length > 0 ? (
          <div className={getGridConfig()}>
            {normalizedActivities.map((activity) => (
              <ExperienceCard
                key={activity._id}
                activity={activity}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
            <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900">No matching adventures found</h3>
            <button
              onClick={() => handleSelectCategory("")}
              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {/* {pagination?.total > normalizedActivities.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setItemsToLoad((prev) => prev + 10)}
              disabled={isFetching}
              className="group px-12 py-4 bg-white border-2 border-slate-900 text-slate-900 font-black rounded-full hover:bg-slate-900 hover:text-white transition-all shadow-xl flex items-center gap-3 mx-auto uppercase text-xs tracking-widest disabled:opacity-70"
            >
              {isFetching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              )}
              {isFetching ? "Loading..." : "Load More Tours"}
            </button>
          </div>
        )} */}
           {/* Load More Button (+10 items) */}
        {data?.data?.pagination?.total > normalizedActivities.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setItemsToLoad((prev) => prev + 10)}
              disabled={isFetching}
              className="px-12 py-4 bg-white border-2 border-slate-900 text-slate-900 font-black rounded-full hover:bg-slate-900 hover:text-white transition-all shadow-xl flex items-center gap-3 mx-auto uppercase text-xs tracking-widest disabled:opacity-70"
            >
              {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {isFetching ? "Loading..." : "Load More Tours"}
            </button>
          </div>
        )}
      </div>
      {isFilterOpen && (
  <FilterModal 
 isOpen={isFilterOpen} 
      onClose={() => setIsFilterOpen(false)}
      categories={allCategoriesData} 
      selectedCategory={selectedCategory}
      setSelectedCategory={handleSelectCategory} 
      colsPerRow={colsPerRow}
      setColsPerRow={setColsPerRow}
  />
)}
    </section>
    
  );
}