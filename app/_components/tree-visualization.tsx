"use client";

import { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Xarrow, { Xwrapper } from "react-xarrows";

interface TreeNode {
  id: number;
  language: "python" | "javascript" | "c";
  left?: number;
  right?: number;
  x: number;
  y: number;
}

export default function TreeVisualization() {
  const [array, setArray] = useState<string>("1,2,3,4,5,6,7");
  const [traversalType, setTraversalType] = useState<string>("inorder");
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [traversalSteps, setTraversalSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tree, setTree] = useState<TreeNode[]>([]);

  const generateTree = (input: string): TreeNode[] => {
    const values = input
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "")
      .map(Number);
    const n = values.length;
    if (n === 0) return [];
    const height = Math.floor(Math.log2(n)) + 1;
    const nodes = values.map((value, i) => {
      const level = Math.floor(Math.log2(i + 1));
      const posInLevel = i - (Math.pow(2, level) - 1);
      const numNodesInLevel = Math.pow(2, level);
      const x = ((posInLevel + 0.5) / numNodesInLevel) * 100;
      const y = height > 1 ? (level / (height - 1)) * 90 + 5 : 50;
      let language: "python" | "javascript" | "c" = "javascript";
      if (level === 0) language = "python";
      else if (level === height - 1) language = "c";
      let left = undefined;
      let right = undefined;
      if (2 * i + 1 < n) left = values[2 * i + 1];
      if (2 * i + 2 < n) right = values[2 * i + 2];
      return { id: value, language, left, right, x, y };
    });
    return nodes;
  };

  const getTraversalOrder = (type: string, nodes: TreeNode[]): number[] => {
    const result: number[] = [];
    const traverse = (nodeId: number) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;
      if (type === "preorder") result.push(node.id);
      if (node.left !== undefined) traverse(node.left);
      if (type === "inorder") result.push(node.id);
      if (node.right !== undefined) traverse(node.right);
      if (type === "postorder") result.push(node.id);
    };
    if (nodes.length > 0) {
      traverse(nodes[0].id);
    }
    return result;
  };

  const handleExecute = () => {
    const newTree = generateTree(array);
    setTree(newTree);
    const steps = getTraversalOrder(traversalType, newTree);
    setTraversalSteps(steps);
    setCurrentStep(-1);
    setIsAnimating(true);
    setActiveNode(null);
    setActivePath(null);
  };

  useEffect(() => {
    if (isAnimating && currentStep < traversalSteps.length - 1) {
      const timer = setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setActiveNode(traversalSteps[nextStep]);
        const currentNode = tree.find((n) => n.id === traversalSteps[nextStep]);
        if (currentNode) {
          const parentNode = tree.find(
            (n) => n.left === currentNode.id || n.right === currentNode.id
          );
          if (parentNode) {
            setActivePath(`${parentNode.id}-${currentNode.id}`);
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentStep === traversalSteps.length - 1) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentStep, traversalSteps, tree]);

  const getNodeColor = (nodeId: number) => {
    const node = tree.find((n) => n.id === nodeId);
    if (!node) return "bg-gray-200";
    const isActive = nodeId === activeNode;
    switch (node.language) {
      case "python":
        return cn(
          "transition-colors duration-500",
          isActive ? "bg-blue-500" : "bg-blue-200"
        );
      case "javascript":
        return cn(
          "transition-colors duration-500",
          isActive ? "bg-yellow-500" : "bg-yellow-200"
        );
      case "c":
        return cn(
          "transition-colors duration-500",
          isActive ? "bg-red-500" : "bg-red-200"
        );
      default:
        return "bg-gray-200";
    }
  };

  const getArrowColor = (fromId: number, toId: number) => {
    const pathId = `${fromId}-${toId}`;
    if (activePath === pathId) {
      const childNode = tree.find((n) => n.id === toId);
      if (childNode) {
        switch (childNode.language) {
          case "python":
            return "blue";
          case "javascript":
            return "yellow";
          case "c":
            return "red";
        }
      }
    }
    return "black";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Binary Tree Traversal Visualizer
        </h1>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          This interactive tool demonstrates how binary tree traversals work.
          The <span className="text-blue-500 font-bold">blue</span> node is the
          root (Python),
          <span className="text-yellow-500 font-bold"> yellow</span> nodes are
          intermediate (JavaScript), and the{" "}
          <span className="text-red-500 font-bold">red</span> nodes are leaves
          (C). Click {'"Execute Traversal"'} to see the animated traversal
          sequence.
        </p>
      </div>

      <div className="w-full max-w-md mx-auto space-y-4 mb-8">
        <input
          type="text"
          placeholder="Enter array (comma-separated numbers)"
          value={array}
          onChange={(e) => setArray(e.target.value)}
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <select
          value={traversalType}
          onChange={(e) => setTraversalType(e.target.value)}
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="inorder">Inorder</option>
          <option value="preorder">Preorder</option>
          <option value="postorder">Postorder</option>
        </select>

        <Button
          onClick={handleExecute}
          disabled={isAnimating}
          className="w-full py-2"
        >
          Execute Traversal
        </Button>
      </div>

      <div className="relative w-full max-w-4xl h-[500px] mx-auto border rounded-lg bg-white shadow-md">
        <Xwrapper>
          {tree.map((node) => (
            <Fragment key={node.id}>
              {node.left !== undefined && (
                <Xarrow
                  start={`node-${node.id}`}
                  end={`node-${node.left}`}
                  color={getArrowColor(node.id, node.left)}
                  strokeWidth={activePath === `${node.id}-${node.left}` ? 3 : 2}
                  animateDrawing={true}
                  dashness={{ animation: 5 }}
                />
              )}
              {node.right !== undefined && (
                <Xarrow
                  start={`node-${node.id}`}
                  end={`node-${node.right}`}
                  color={getArrowColor(node.id, node.right)}
                  strokeWidth={
                    activePath === `${node.id}-${node.right}` ? 3 : 2
                  }
                  animateDrawing={true}
                  dashness={{ animation: 5 }}
                />
              )}
            </Fragment>
          ))}
        </Xwrapper>

        {tree.map((node) => (
          <div
            key={node.id}
            id={`node-${node.id}`}
            title={`Node ${node.id} (${node.language})`}
            className={cn(
              "absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-300 shadow",
              getNodeColor(node.id)
            )}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              zIndex: 1,
            }}
          >
            {node.id}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        <div className="text-center text-lg font-medium text-gray-700 mb-4">
          Traversal Sequence:{" "}
          <span className="font-bold">
            {traversalSteps.slice(0, currentStep + 1).join(" → ")}
          </span>
        </div>
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Python (Root)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span>JavaScript (Middle)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>C (Leaf)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
