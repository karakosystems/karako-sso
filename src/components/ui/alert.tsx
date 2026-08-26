import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
    "group/alert relative grid w-full gap-0.5 overflow-hidden rounded-2xl border bg-gradient-to-br px-4 py-3 text-left text-sm shadow-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default: "border-border from-primary/8 to-card text-card-foreground",
                destructive:
                    "border-destructive/25 from-destructive/10 to-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
                error: "border-destructive/25 from-destructive/10 to-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
                success:
                    "border-emerald-500/25 from-emerald-500/10 to-card text-emerald-700 dark:text-emerald-400 *:data-[slot=alert-description]:text-emerald-700/90 dark:*:data-[slot=alert-description]:text-emerald-400/90 *:[svg]:text-current",
                warning:
                    "border-amber-500/25 from-amber-500/10 to-card text-amber-700 dark:text-amber-400 *:data-[slot=alert-description]:text-amber-700/90 dark:*:data-[slot=alert-description]:text-amber-400/90 *:[svg]:text-current",
                info: "border-sky-500/25 from-sky-500/10 to-card text-sky-700 dark:text-sky-400 *:data-[slot=alert-description]:text-sky-700/90 dark:*:data-[slot=alert-description]:text-sky-400/90 *:[svg]:text-current"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
);

function Alert({
    className,
    variant,
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-title"
            className={cn(
                "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
                className
            )}
            {...props}
        />
    );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-description"
            className={cn(
                "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
                className
            )}
            {...props}
        />
    );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-action"
            className={cn("absolute top-2.5 right-3", className)}
            {...props}
        />
    );
}

export { Alert, AlertTitle, AlertDescription, AlertAction };
