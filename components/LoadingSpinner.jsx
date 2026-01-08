"use client";

export default function LoadingSpinner({
  size = 64,
  color = "border-blue-600",
  className = "",
}) {
  return (
    <div className={`flex items-center justify-center py-32 ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-4 border-b-4 ${color}`}
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
}
