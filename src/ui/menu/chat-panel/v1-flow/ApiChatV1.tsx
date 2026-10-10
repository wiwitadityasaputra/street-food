"use client";

import {
    Background,
    BackgroundVariant,
    Handle,
    Position,
    ReactFlow,
    useEdgesState,
    useNodesState,
    type Edge,
    type Node,
    type NodeProps
} from "@xyflow/react";
import { AnimatedSVGEdge } from "./AnimatedSVGEdge";

type CustomerServiceNodeData = { label: string };
type CustomerServiceNodeType = Node<CustomerServiceNodeData, "customerService">;

function CustomerServiceNode({ data }: NodeProps<CustomerServiceNodeType>) {
    return (
        <>
            <Handle id="from-user" type="target" position={Position.Top} />
            <Handle id="to-gemini" type="source" position={Position.Left} />
            <Handle id="from-gemini" type="target" position={Position.Left} />
            <Handle id="from-deepseek" type="target" position={Position.Right} />
            <Handle id="to-deepseek" type="source" position={Position.Right} />
            <Handle id="to-cart-edit" type="source" position={Position.Bottom} />
            <Handle id="to-cart-add" type="source" position={Position.Bottom} />
            <Handle id="to-cart-delete" type="source" position={Position.Bottom} />
            <Handle id="to-cart-page-nav" type="source" position={Position.Bottom} />
            <Handle id="to-describe-task" type="source" position={Position.Bottom} />
            <Handle id="to-food-suggest" type="source" position={Position.Bottom} />
            <Handle id="to-aq" type="source" position={Position.Bottom} />
            <div className="react-flow__node-default">{data.label}</div>
        </>
    );
}

const nodeTypes = {
    customerService: CustomerServiceNode
};

const initialNodes: Node[] = [
    {
        id: "node-user",
        type: "input",
        sourcePosition: Position.Bottom,
        position: { x: 240, y: 50 },
        data: { label: "User" }
    },
    {
        id: "node-cs",
        type: "customerService",
        position: { x: 240, y: 150 },
        data: { label: "CustomerService Agent" }
    },
    {
        id: "node-gemini",
        sourcePosition: Position.Right,
        targetPosition: Position.Right,
        position: { x: 40, y: 150 },
        data: { label: "Gemini Embedding" }
    },
    {
        id: "node-llm",
        sourcePosition: Position.Left,
        targetPosition: Position.Left,
        position: { x: 440, y: 150 },
        data: { label: "LLM Deepseek" }
    },
    {
        id: "node-cart-edit",
        targetPosition: Position.Right,
        position: { x: 40, y: 250 },
        data: { label: "Cart Edit" }
    },
    {
        id: "node-cart-add",
        targetPosition: Position.Right,
        position: { x: 40, y: 350 },
        data: { label: "Cart Add" }
    },
    {
        id: "node-cart-delete",
        targetPosition: Position.Right,
        position: { x: 40, y: 450 },
        data: { label: "Cart Delete" }
    },
    {
        id: "node-page-nav",
        targetPosition: Position.Top,
        position: { x: 240, y: 550 },
        data: { label: "Page Navigation" }
    },
    {
        id: "node-describe-task",
        targetPosition: Position.Left,
        position: { x: 440, y: 450 },
        data: { label: "Describe Task" }
    },
    {
        id: "node-food-suggest",
        targetPosition: Position.Left,
        position: { x: 440, y: 350 },
        data: { label: "Food Suggest" }
    },
    {
        id: "node-aq",
        targetPosition: Position.Left,
        position: { x: 440, y: 250 },
        data: { label: "Answer Question" }
    }
];

const initialEdges: Edge[] = [
    {
        id: "user-to-cs",
        source: "node-user",
        target: "node-cs",
        targetHandle: "from-user",
        type: "smoothstep",
        animated: true,
        style: { strokeWidth: 5 }
    },
    {
        id: "cs-to-gemini",
        source: "node-cs",
        sourceHandle: "to-gemini",
        target: "node-gemini",
        type: "smoothstep",
        animated: true,
        style: { strokeWidth: 5 }
    },
    {
        id: "gemini-to-cs",
        source: "node-gemini",
        target: "node-cs",
        targetHandle: "from-gemini",
        type: "smoothstep",
        style: { strokeWidth: 0 },
        animated: true
    },
    {
        id: "cs-to-llm",
        source: "node-cs",
        sourceHandle: "to-deepseek",
        target: "node-llm",
        type: "smoothstep",
        style: { strokeWidth: 0 },
        animated: true
    },
    {
        id: "llm-to-cs",
        source: "node-llm",
        target: "node-cs",
        targetHandle: "from-deepseek",
        type: "smoothstep",
        style: { strokeWidth: 5 },
        animated: true
    },
    {
        id: "cs-to-cart-edit",
        source: "node-cs",
        sourceHandle: "to-cart-edit",
        target: "node-cart-edit",
        type: "smoothstep",
        animated: true,
        style: { strokeWidth: 5 }
    },
    {
        id: "cs-to-cart-add",
        source: "node-cs",
        sourceHandle: "to-cart-add",
        target: "node-cart-add",
        type: "smoothstep",
        animated: true,
        style: { strokeWidth: 5 }
    },
    {
        id: "cs-to-cart-delete",
        source: "node-cs",
        sourceHandle: "to-cart-delete",
        target: "node-cart-delete",
        type: "smoothstep",
        animated: true,
        style: { strokeWidth: 5 }
    },
    {
        id: "cs-to-page-nav",
        source: "node-cs",
        sourceHandle: "to-cart-page-nav",
        target: "node-page-nav",
        type: "smoothstep",
        animated: true,
        style: { strokeWidth: 5 }
    },
    {
        id: "cs-to-describe-task",
        source: "node-cs",
        sourceHandle: "to-describe-task",
        target: "node-describe-task",
        type: "smoothstep",
        animated: true,
        style: { strokeWidth: 5 }
    },
    {
        id: "cs-to-food-suggest",
        source: "node-cs",
        sourceHandle: "to-food-suggest",
        target: "node-food-suggest",
        type: "smoothstep",
        animated: true,
        style: { strokeWidth: 5 }
    },
    {
        id: "cs-to-aq",
        source: "node-cs",
        sourceHandle: "to-aq",
        target: "node-aq",
        type: "smoothstep",
        animated: true,
        style: { strokeWidth: 5 }
    }
];

const edgeTypes = {
  animatedSvg: AnimatedSVGEdge,
};

export default function ApiChatV1() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    return (
        <ReactFlow
            className="start-chat-v1-flow"
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            edgeTypes={edgeTypes}
            fitViewOptions={{ padding: 0.25 }}
        >
            <Background variant={BackgroundVariant.Dots} gap={18} size={1} />
        </ReactFlow>
    );
}
