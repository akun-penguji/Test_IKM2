// @ts-nocheck
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface RatingProps {
    count?: number;
    value?: number;
    onValueChange?: (value: number) => void;
    className?: string;
    variant?: "star" | "number";
}

export function Rating({
    count = 4,
    value = 0,
    onValueChange,
    className,
    variant = "star",
}: RatingProps) {
    const [hoverValue, setHoverValue] = useState(0);

    const handleSelect = (index: number) => {
        if (onValueChange) {
            onValueChange(index.toString());
        }
    };

    return (
        <div className={cn("flex gap-1", className)}>
            {Array.from({ length: count }).map((_, index) => {
                const ratingValue = index + 1;
                const isActive = hoverValue > 0 ? hoverValue >= ratingValue : value >= ratingValue;
                return variant === "star" ? (
                    <button
                        key={index}
                        type="button"
                        className={cn(
                            "rounded-md p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            "transition-colors hover:text-yellow-500",
                            isActive
                                ? "text-yellow-500"
                                : "text-muted-foreground"
                        )}
                        onClick={() => handleSelect(ratingValue)}
                        onMouseEnter={() => setHoverValue(ratingValue)}
                        onMouseLeave={() => setHoverValue(0)}
                        aria-label={`Rate ${ratingValue} out of ${count}`}
                    >
                        <Star className="h-6 w-6 fill-current" />
                    </button>
                ) : (
                    <button
                        key={index}
                        type="button"
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium",
                            "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            hoverValue > 0
                                ? hoverValue >= ratingValue
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                : value === ratingValue
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => handleSelect(ratingValue)}
                        onMouseEnter={() => setHoverValue(ratingValue)}
                        onMouseLeave={() => setHoverValue(0)}
                        aria-label={`Rate ${ratingValue} out of ${count}`}
                    >
                        {ratingValue}
                    </button>
                );
            })}
        </div>
    );
}
