"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileAccount } from "@/hooks/queries/useUserQueries";
import { useUserStore } from "@/store/useUserStore";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserCircleIcon } from "@hugeicons/core-free-icons";

function getInitials(name?: string) {
  if (!name) return "user";

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function ProfileAvatar() {
  const { user: userDict } = useDictionary();
  const t = userDict?.profile;
  const { data: profile, isLoading: isQueryLoading } = useProfileAccount();
  const { user } = useUserStore();

  const fullName = profile?.data?.full_name || user?.full_name;
  const email = profile?.data?.email || user?.email;
  const initials = getInitials(fullName);

  const isLoading = isQueryLoading && !fullName;

  return (
    <div>
      <div className="flex items-center justify-start gap-4">
        {/* Avatar */}
        <Avatar className="flex justify-center items-center">
          <AvatarImage
            src={profile?.data?.avatar?.original || ""}
            alt={fullName || "User"}
            className="object-cover"
          />
          <AvatarFallback className="bg-transparent">
            <HugeiconsIcon
              icon={UserCircleIcon}
              size={40}
              color="currentColor"
              strokeWidth={1.5}
              className="flex justify-center items-center text-gray-400"
            />
          </AvatarFallback>
        </Avatar>

        {/* Text */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-40  bg-gray-200" />
              <Skeleton className="h-4 w-52  bg-gray-200" />
            </>
          ) : (
            <>
              <h2 className="font-semibold text-md line-clamp-1 max-w-[220px]">
                {t?.avatar?.welcome?.replace("{name}", fullName || "User") || `Welcome, ${fullName || "User"}`}
              </h2>
              <p className="text-sm text-[#4D4D4D]">
                {email}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}