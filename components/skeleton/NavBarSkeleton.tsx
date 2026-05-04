import React from "react";
import { Skeleton } from "../ui/skeleton";

interface NavBarSkeletonProps {
  isAuthenticated: boolean;
}

export const DesktopNavBarSkeleton: React.FC<NavBarSkeletonProps> = ({
  isAuthenticated,
}) => {
  if (isAuthenticated) {
    return (
      <>
        <Skeleton className="h-8 w-8 rounded-full bg-neutral-400/60" />
        <div className="flex gap-2 items-center">
          <Skeleton className="h-8 w-8 rounded-full bg-neutral-400/60" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full bg-neutral-400/60" />
      </>
    );
  }

  return (
    <>
      <Skeleton className="h-8 w-8 rounded-full bg-neutral-400/60" />
      <hr className="h-8 w-0.5 bg-gray-400/60" />
      <div className="flex gap-2 items-center">
        <Skeleton className="h-8 w-8 rounded-full bg-neutral-400/60" />
      </div>
      <Skeleton className="h-10 w-24 rounded-4xl bg-neutral-400/60" />
    </>
  );
};

export const MobileNavBarSkeleton: React.FC<NavBarSkeletonProps> = ({
  isAuthenticated,
}) => {
  if (isAuthenticated) {
    return (
      <div className="flex flex-col gap-6 py-2">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full bg-neutral-400/60" />
          <Skeleton className="h-4 w-24 bg-neutral-400/60" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full bg-neutral-400/60" />
          <Skeleton className="h-4 w-24 bg-neutral-400/60" />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <Skeleton className="h-8 w-8 rounded-full bg-neutral-400/60" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-full bg-neutral-400/60" />
        <Skeleton className="h-4 w-24 bg-neutral-400/60" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full rounded-4xl bg-neutral-400/60" />
        <Skeleton className="h-10 w-full rounded-4xl bg-neutral-400/60" />
      </div>
    </div>
  );
};
