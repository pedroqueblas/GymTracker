"use client";

import { cn } from "@/lib/utils";
import { AVATARS } from "@/data/avatars";
import Image from "next/image";

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatarUrl: string) => void;
}

export function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {AVATARS.map((avatar) => (
        <div
          key={avatar.id}
          className={cn(
            "relative aspect-square cursor-pointer rounded-full overflow-hidden border-2 transition-all hover:scale-105",
            selectedAvatar === avatar.url
              ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
              : "border-transparent hover:border-white/20"
          )}
          onClick={() => onSelect(avatar.url)}
        >
          <Image
            src={avatar.url}
            alt="Avatar option"
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
