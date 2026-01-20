import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Layer variants
        core: "border-transparent bg-layer-core/20 text-layer-core hover:bg-layer-core/30",
        plugin: "border-transparent bg-layer-plugin/20 text-layer-plugin hover:bg-layer-plugin/30",
        ui: "border-transparent bg-layer-ui/20 text-layer-ui hover:bg-layer-ui/30",
        tooling: "border-transparent bg-layer-tooling/20 text-layer-tooling hover:bg-layer-tooling/30",
        meta: "border-transparent bg-layer-meta/20 text-layer-meta hover:bg-layer-meta/30",
        // Knowledge variants
        mandatory: "border-layer-core/50 bg-transparent text-layer-core",
        optional: "border-muted-foreground/30 bg-transparent text-muted-foreground",
        advanced: "border-layer-tooling/50 bg-transparent text-layer-tooling",
        // Status variants
        stable: "border-transparent bg-layer-plugin/20 text-layer-plugin",
        beta: "border-transparent bg-layer-tooling/20 text-layer-tooling",
        deprecated: "border-transparent bg-layer-meta/20 text-layer-meta",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
