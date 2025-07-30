import * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";
import { cn } from "@/lib/utils";

const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelGroup>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelGroup>
>(({ className, ...props }, ref) => (
  <ResizablePrimitive.PanelGroup
    ref={ref}
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
));

ResizablePanelGroup.displayName = ResizablePrimitive.PanelGroup.displayName;

const ResizablePanel = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Panel>
>(({ className, ...props }, ref) => (
  <ResizablePrimitive.Panel
    ref={ref}
    className={cn("grow", className)}
    {...props}
  />
));

ResizablePanel.displayName = ResizablePrimitive.Panel.displayName;

const ResizableHandle = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelResizeHandle>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelResizeHandle>
>(({ className, ...props }, ref) => (
  <ResizablePrimitive.PanelResizeHandle
    ref={ref}
    className={cn(
      "focus-visible:ring-ring relative flex w-2 items-center justify-center bg-transparent after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90 hover:after:bg-border",
      className
    )}
    {...props}
  />
));

ResizableHandle.displayName = ResizablePrimitive.PanelResizeHandle.displayName;

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };