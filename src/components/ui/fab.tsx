import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const fabVariants = cva(
	"fixed z-40 inline-flex cursor-pointer items-center justify-center rounded-full shadow-lg transition-all hover:shadow-xl disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
			},
			size: {
				default: "size-14",
				sm: "size-12",
				lg: "size-16",
			},
			position: {
				"bottom-right": "bottom-24 right-6 md:bottom-6",
				"bottom-left": "bottom-24 left-6 md:bottom-6",
				"bottom-center": "bottom-24 left-1/2 -translate-x-1/2 md:bottom-6",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			position: "bottom-right",
		},
	},
);

function FAB({
	className,
	variant,
	size,
	position,
	...props
}: React.ComponentProps<"button"> & VariantProps<typeof fabVariants>) {
	return (
		<button
			type="button"
			data-slot="fab"
			className={cn(fabVariants({ variant, size, position, className }))}
			{...props}
		/>
	);
}

export { FAB, fabVariants };
