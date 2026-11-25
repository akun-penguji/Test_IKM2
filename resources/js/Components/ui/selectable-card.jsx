import { cn } from "@/lib/utils";
import { FormLabel } from "@/Components/ui/form";

export function SelectableCard({ label, options, value, onChange, error }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <FormLabel className="text-base">{label}</FormLabel>}
            <div className="flex gap-4 flex-wrap">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all min-w-[100px]",
                            value === option.value
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                        )}
                    >
                        {option.icon}
                        <span>{option.label}</span>
                    </button>
                ))}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}