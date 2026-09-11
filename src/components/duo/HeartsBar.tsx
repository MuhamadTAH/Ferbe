import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeartsBar({
  hearts,
  className,
}: {
  hearts: number;
  className?: string;
}) {
  const empty = hearts <= 0;
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 font-extrabold text-lg",
        empty ? "text-[#AFAFAF]" : "text-[#FF4B4B]",
        className
      )}
      aria-label={`${hearts} hearts remaining`}
    >
      <Heart
        className={cn(
          "h-6 w-6",
          empty ? "fill-[#AFAFAF] text-[#AFAFAF]" : "fill-[#FF4B4B] text-[#FF4B4B]"
        )}
      />
      <span>{hearts}</span>
    </div>
  );
}
