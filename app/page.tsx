import TreeVisualization from "@/app/_components/tree-visualization";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Polyglot Tree Traversal Visualization
        </h1>
        <TreeVisualization />
      </main>
    </div>
  );
}
