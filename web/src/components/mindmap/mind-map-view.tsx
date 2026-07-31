"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/idea-data";

type MindMapViewProps = {
  categories: Category[];
};

const STATUS_COLOR: Record<string, string> = {
  Idea: "var(--chart-5)",
  Validated: "var(--chart-2)",
  Blueprinted: "var(--chart-3)",
  "Ready to Build": "var(--chart-1)",
};

// --- Custom node renderers -------------------------------------------------

function RootNode() {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-primary-foreground shadow-md">
      <Sparkles className="size-4" />
      <span className="text-sm font-semibold">1000 Profitable Ideas</span>
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  );
}

type CategoryNodeData = {
  label: string;
  count: number;
  expanded: boolean;
  onToggle: () => void;
};

function CategoryNode({ data }: NodeProps<Node<CategoryNodeData>>) {
  return (
    <button
      onClick={data.onToggle}
      className="flex min-w-48 items-center justify-between gap-2 rounded-xl border bg-card px-4 py-2.5 text-left shadow-sm transition-colors hover:border-primary/50"
    >
      <Handle type="target" position={Position.Left} className="!bg-border" />
      <div>
        <p className="text-sm font-semibold">{data.label}</p>
        <p className="text-xs text-muted-foreground">{data.count} niches</p>
      </div>
      <ChevronRight
        className={cn(
          "size-4 shrink-0 text-muted-foreground transition-transform",
          data.expanded && "rotate-90",
        )}
      />
      <Handle type="source" position={Position.Right} className="!bg-border" />
    </button>
  );
}

type SubcategoryNodeData = {
  label: string;
  count: number;
  expanded: boolean;
  onToggle: () => void;
};

function SubcategoryNode({ data }: NodeProps<Node<SubcategoryNodeData>>) {
  return (
    <button
      onClick={data.onToggle}
      className="flex min-w-44 items-center justify-between gap-2 rounded-lg border border-dashed bg-muted/30 px-3.5 py-2 text-left shadow-sm transition-colors hover:border-primary/50"
    >
      <Handle type="target" position={Position.Left} className="!bg-border" />
      <div>
        <p className="text-xs font-medium">{data.label}</p>
        <p className="text-[0.65rem] text-muted-foreground">
          {data.count} ideas
        </p>
      </div>
      <ChevronRight
        className={cn(
          "size-3.5 shrink-0 text-muted-foreground transition-transform",
          data.expanded && "rotate-90",
        )}
      />
      <Handle type="source" position={Position.Right} className="!bg-border" />
    </button>
  );
}

type IdeaNodeData = {
  label: string;
  score: number;
  status: string;
  href: string;
  onNavigate: (href: string) => void;
};

function IdeaNode({ data }: NodeProps<Node<IdeaNodeData>>) {
  return (
    <button
      onClick={() => data.onNavigate(data.href)}
      className="flex min-w-52 flex-col gap-1 rounded-lg border bg-card px-3.5 py-2.5 text-left shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderLeft: `3px solid ${STATUS_COLOR[data.status] ?? "var(--border)"}` }}
    >
      <Handle type="target" position={Position.Left} className="!bg-border" />
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold leading-snug">{data.label}</p>
        <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium">
          {data.score}
        </span>
      </div>
      <span className="text-[0.65rem] text-muted-foreground">{data.status}</span>
    </button>
  );
}

const nodeTypes = {
  root: RootNode,
  category: CategoryNode,
  subcategory: SubcategoryNode,
  idea: IdeaNode,
};

// --- Layout ------------------------------------------------------------

const COLUMN_GAP = 300;
const ROW_GAP = 74;

function MindMapInner({ categories }: MindMapViewProps) {
  const router = useRouter();
  const [expandedCategories, setExpandedCategories] = React.useState<
    Set<string>
  >(new Set(categories.slice(0, 1).map((c) => c.slug)));
  const [expandedSubcategories, setExpandedSubcategories] = React.useState<
    Set<string>
  >(new Set());

  const toggleCategory = React.useCallback((slug: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const toggleSubcategory = React.useCallback((slug: string) => {
    setExpandedSubcategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const navigate = React.useCallback(
    (href: string) => router.push(href),
    [router],
  );

  const { nodes, edges } = React.useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let cursorY = 0;

    nodes.push({
      id: "root",
      type: "root",
      position: { x: 0, y: 0 },
      data: {},
      draggable: false,
    });

    categories.forEach((category) => {
      const categoryStartY = cursorY;
      const categoryExpanded = expandedCategories.has(category.slug);
      const categoryNodeId = `cat-${category.slug}`;

      if (categoryExpanded) {
        category.subcategories.forEach((subcategory) => {
          const subStartY = cursorY;
          const subExpanded = expandedSubcategories.has(subcategory.slug);
          const subNodeId = `sub-${subcategory.slug}`;

          if (subExpanded) {
            subcategory.projects.forEach((project) => {
              const ideaNodeId = `idea-${category.slug}-${subcategory.slug}-${project.slug}`;
              nodes.push({
                id: ideaNodeId,
                type: "idea",
                position: { x: COLUMN_GAP * 3, y: cursorY },
                data: {
                  label: project.name,
                  score: project.validationScore,
                  status: project.status,
                  href: `/ideas/${category.slug}/${subcategory.slug}/${project.slug}`,
                  onNavigate: navigate,
                } satisfies IdeaNodeData,
                draggable: false,
              });
              edges.push({
                id: `e-${subNodeId}-${ideaNodeId}`,
                source: subNodeId,
                target: ideaNodeId,
                type: "smoothstep",
              });
              cursorY += ROW_GAP;
            });
            if (subcategory.projects.length === 0) cursorY += ROW_GAP;
          }

          const subEndY = subExpanded ? cursorY - ROW_GAP : cursorY;
          const subY = subExpanded ? (subStartY + subEndY) / 2 : subStartY;
          if (!subExpanded) cursorY += ROW_GAP;

          nodes.push({
            id: subNodeId,
            type: "subcategory",
            position: { x: COLUMN_GAP * 2, y: subY },
            data: {
              label: subcategory.name,
              count: subcategory.projects.length,
              expanded: subExpanded,
              onToggle: () => toggleSubcategory(subcategory.slug),
            } satisfies SubcategoryNodeData,
            draggable: false,
          });
          edges.push({
            id: `e-${categoryNodeId}-${subNodeId}`,
            source: categoryNodeId,
            target: subNodeId,
            type: "smoothstep",
          });
        });
        if (category.subcategories.length === 0) cursorY += ROW_GAP;
      } else {
        cursorY += ROW_GAP;
      }

      const categoryEndY = cursorY - ROW_GAP;
      const categoryY = categoryExpanded
        ? (categoryStartY + categoryEndY) / 2
        : categoryStartY;

      nodes.push({
        id: categoryNodeId,
        type: "category",
        position: { x: COLUMN_GAP, y: categoryY },
        data: {
          label: category.name,
          count: category.subcategories.length,
          expanded: categoryExpanded,
          onToggle: () => toggleCategory(category.slug),
        } satisfies CategoryNodeData,
        draggable: false,
      });
      edges.push({
        id: `e-root-${categoryNodeId}`,
        source: "root",
        target: categoryNodeId,
        type: "smoothstep",
      });
    });

    // Center root vertically relative to the full extent drawn.
    const rootNode = nodes.find((n) => n.id === "root")!;
    rootNode.position.y = Math.max(cursorY / 2 - ROW_GAP / 2, 0);

    return { nodes, edges };
  }, [categories, expandedCategories, expandedSubcategories, navigate, toggleCategory, toggleSubcategory]);

  return (
    <div className="h-[70vh] w-full overflow-hidden rounded-2xl border bg-background/40">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
        defaultEdgeOptions={{ style: { stroke: "var(--border)", strokeWidth: 1.5 } }}
      >
        <Background gap={20} size={1} color="var(--border)" />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeColor={() => "var(--primary)"}
          maskColor="color-mix(in oklch, var(--background), transparent 40%)"
        />
      </ReactFlow>
    </div>
  );
}

export function MindMapView(props: MindMapViewProps) {
  return (
    <ReactFlowProvider>
      <MindMapInner {...props} />
    </ReactFlowProvider>
  );
}
