import * as React from "react"

import { cn } from "@/lib/utils"

// Define a series of gradient combinations to ensure uniqueness
const gradientOptions = [
  "from-purple-500 to-indigo-500",
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-violet-500 to-purple-500",
  "from-red-500 to-orange-500",
  "from-green-400 to-teal-500",
  "from-fuchsia-500 to-pink-500",
  "from-sky-400 to-blue-500",
  "from-yellow-400 to-amber-500",
  "from-indigo-400 to-violet-500"
];

// Map to keep track of used gradients per section
const usedGradientsMap = new Map<string, Set<string>>();

// Function to get a unique gradient for a card in a specific section
export const getUniqueGradient = (sectionId: string): string => {
  if (!usedGradientsMap.has(sectionId)) {
    usedGradientsMap.set(sectionId, new Set<string>());
  }
  
  const usedGradients = usedGradientsMap.get(sectionId)!;
  
  // Filter out already used gradients in this section
  const availableGradients = gradientOptions.filter(gradient => !usedGradients.has(gradient));
  
  // If all gradients have been used, clear the used gradients for this section
  if (availableGradients.length === 0) {
    usedGradients.clear();
    return getUniqueGradient(sectionId);
  }
  
  // Get a random gradient from the available ones
  const randomIndex = Math.floor(Math.random() * availableGradients.length);
  const selectedGradient = availableGradients[randomIndex];
  
  // Mark this gradient as used
  usedGradients.add(selectedGradient);
  
  return selectedGradient;
};

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm hover:-translate-y-1 transition-transform duration-300",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
