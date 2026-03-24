import React, { useState, useMemo } from "react";
import { Plus, Search, Loader2 } from "lucide-react"; // Added Loader2 for button state
import { useGetActivitiesQuery } from "@/features/activity/activityApi";
import CategoryBalls from "@/components/Category/CategoryBalls.jsx";
import { ExperienceCard } from "./ExperienceCard.jsx";

export default function ActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemsToLoad, setItemsToLoad] = useState(5); // This now controls the API limit
  const [viewMode, setViewMode] = useState("grid");

  const categoryId = selectedCategory || undefined;

  // CHANGE: Passing itemsToLoad as 'limit' directly to the RTK Query
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
        ? activity.Images.map((img) => ({
            url: img.secure_url,
          }))
        : [],

        location: "Dubai",

      rating: 4.8,
    
      reviewCount: 1200,
     
      duration: {
        hours: 6,
      },

      cancellationPolicy: {
        isFreeCancellation: true,
      },

      variants: [
        {
          pricing: [
            {
              price: activity.PrivateSUV?.fee || 45,
            },
          ],
        },
      ],

      tags: activity.Experience?.highlights?.slice(0, 3) || [
        "Adventure",
        "Sightseeing",
      ],
    }));
  }, [activities]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat || "");
    setItemsToLoad(10); // Reset limit to 10 when category changes
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0047AB] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-slate-600 font-bold">
            Loading premium experiences…
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p className="text-lg text-red-600 font-bold">
          Unable to load activities
        </p>
      </div>
    );
  }

  return (
    <section className="bg-[#F8FAFC] min-h-screen font-sans" id="tours">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#0047AB] font-black tracking-widest uppercase text-[11px] mb-2 block">
              DISCOVER THE EMIRATES
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter leading-none">
              Handpicked <span className="text-[#0047AB]">Adventures</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
            Found{" "}
            <span className="text-slate-900 font-black">
              {pagination?.total || normalizedActivities.length}
            </span>{" "}
            verified results
          </div>
        </div>

        {/* Filter Bar */}
        <div className="-mx-6 md:mx-0">
          <CategoryBalls
            limit={10}
            showAllLink={false}
            setSelectedCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        {/* Grid/List of Cards */}
        {normalizedActivities.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "flex flex-col gap-4"
            }
          >
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

            <h3 className="text-xl font-black text-slate-900">
              No matching adventures found
            </h3>

            <p className="text-slate-400 mt-2">
              {selectedCategory
                ? "Try changing category or clearing filters."
                : "Try adjusting your search or filters."}
            </p>

            <button
              onClick={() => {
                setSelectedCategory("");
                setItemsToLoad(10);
              }}
              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Clear all filters
            </button>

          </div>
        )}

        {/* CHANGE: Logic for showing "Load More" based on API total count */}
        {pagination?.total > normalizedActivities.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setItemsToLoad((prev) => prev + 10)}
              disabled={isFetching}
              className="group px-12 py-4 bg-white border-2 border-slate-900 text-slate-900 font-black rounded-full hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-slate-900/5 active:scale-95 flex items-center gap-3 mx-auto uppercase text-xs tracking-widest disabled:opacity-70"
            >
              {isFetching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              )}
              {isFetching ? "Loading..." : "Load More Tours"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
