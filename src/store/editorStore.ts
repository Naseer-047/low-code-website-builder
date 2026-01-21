import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { CanvasNode, DeviceType, ElementType } from '../types/editor';
import { v4 as uuidv4 } from 'uuid';
import { BLOCKS } from '@/lib/blocks';

interface EditorState {
  nodes: CanvasNode[];
  selectedId: string | null;
  device: DeviceType;
  isPreview: boolean;
  addNode: (type: ElementType, parentId?: string) => void;
  addBlock: (blockId: string, parentId?: string) => void;
  updateNode: (id: string, updates: Partial<CanvasNode>) => void;
  updateNodeStyle: (id: string, style: React.CSSProperties) => void;
  selectNode: (id: string | null) => void;
  setDevice: (device: DeviceType) => void;
  setPreview: (preview: boolean) => void;
  deleteNode: (id: string) => void;
  moveNode: (activeId: string, overId: string) => void;
}

const initialNodes: CanvasNode[] = [
  {
    id: "root",
    type: "container",
    name: "Body",
    props: {},
    style: {
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#ffffff",
      display: "flex",
      flexDirection: "column",
      padding: "20px"
    },
    children: []
  }
];

export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    nodes: initialNodes,
    selectedId: null,
    device: 'desktop',
    isPreview: false,

    addNode: (type, parentId = 'root') => set((state) => {
      const newNode: CanvasNode = {
        id: uuidv4(),
        type,
        name: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
        props: {
          // Content Defaults
          ...(type === 'text' && { content: 'Double click to edit' }),
          ...(type === 'h1' && { content: 'Heading 1' }),
          ...(type === 'h2' && { content: 'Heading 2' }),
          ...(type === 'h3' && { content: 'Heading 3' }),
          ...(type === 'paragraph' && { content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }),
          ...(type === 'blockquote' && { content: '“This is a quote.”' }),
          ...(type === 'link' && { content: 'Link Text', href: '#' }),
          ...(type === 'label' && { content: 'Label' }),
          ...(type === 'button' && { content: 'Button' }),
          ...(type === 'badge' && { content: 'Badge' }),
          ...(type === 'alert' && { content: 'Alert Message' }),

          // Media Defaults
          ...(type === 'image' && { src: 'https://placehold.co/600x400' }),
          ...(type === 'video' && { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }),
          ...(type === 'avatar' && { src: 'https://i.pravatar.cc/150' }),

          // Form Defaults
          ...(type === 'input' && { placeholder: 'Input...' }),
          ...(type === 'textarea' && { placeholder: 'Textarea...' }),
          ...(type === 'select' && { options: ['Option 1', 'Option 2'] }),
          ...(type === 'checkbox' && { checked: false, label: 'Checkbox' }),
          ...(type === 'radio' && { checked: false, label: 'Radio' }),
        },
        style: {
          // Base Styles
          ...(type === 'button' && {
            padding: '10px 20px',
            backgroundColor: '#000000',
            color: '#ffffff',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }),
          ...(type === 'container' && {
            padding: '20px',
            border: '1px dashed #e2e8f0',
            minHeight: '100px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }),
          ...(type === 'section' && {
            padding: '40px 20px',
            width: '100%',
            minHeight: '200px',
            backgroundColor: '#f8fafc'
          }),
          ...(type === 'card' && {
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }),
          ...(type === 'grid-row' && {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            width: '100%'
          }),
          ...(type === 'grid-col' && {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '10px',
            border: '1px dashed #cbd5e1'
          }),
          ...(type === 'h1' && { fontSize: '32px', fontWeight: 'bold', margin: '0 0 10px 0' }),
          ...(type === 'h2' && { fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }),
          ...(type === 'h3' && { fontSize: '20px', fontWeight: 'bold', margin: '0 0 10px 0' }),
          ...(type === 'paragraph' && { fontSize: '16px', lineHeight: '1.5', margin: '0 0 10px 0' }),
          ...(type === 'link' && { color: '#2563eb', textDecoration: 'underline' }),
          ...(type === 'input' && { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }),
          ...(type === 'textarea' && { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', minHeight: '100px' }),
          ...(type === 'video' && { width: '100%', height: '315px', borderRadius: '8px' }),
          ...(type === 'avatar' && { width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover' }),
          ...(type === 'badge' && { padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#e2e8f0', fontSize: '12px', fontWeight: '600', width: 'fit-content' }),
          ...(type === 'alert' && { padding: '12px 16px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#991b1b', width: '100%' }),
          ...(type === 'divider' && { width: '100%', height: '1px', backgroundColor: '#e2e8f0', margin: '16px 0' }),
        },
        children: []
      };

      const addRec = (nodes: CanvasNode[]) => {
        for (const node of nodes) {
          if (node.id === parentId) {
            node.children.push(newNode);
            return true;
          }
          if (node.children && addRec(node.children)) return true;
        }
        return false;
      };

      addRec(state.nodes);
    }),

    addBlock: (blockId, parentId = 'root') => set((state) => {
      const block = BLOCKS.find(b => b.id === blockId);
      if (!block) return;

      const cloneTree = (node: Partial<CanvasNode>): CanvasNode => {
        const id = uuidv4();
        const children = node.children ? node.children.map(cloneTree) : [];
        return {
          ...node,
          id,
          type: node.type!,
          name: node.name || node.type!.charAt(0).toUpperCase() + node.type!.slice(1),
          props: { ...node.props },
          style: { ...node.style },
          children
        } as CanvasNode;
      };

      const newRoot = cloneTree(block.elements);

      const addRec = (nodes: CanvasNode[]) => {
        for (const node of nodes) {
          if (node.id === parentId) {
            node.children.push(newRoot);
            return true;
          }
          if (node.children && addRec(node.children)) return true;
        }
        return false;
      };
      addRec(state.nodes);
    }),

    updateNode: (id, updates) => set((state) => {
      const updateRec = (nodes: CanvasNode[]) => {
        for (const node of nodes) {
          if (node.id === id) {
            // Explicitly merge to preserve proxy integrity better than Object.assign
            if (updates.type) node.type = updates.type;
            if (updates.name) node.name = updates.name;
            if (updates.props) node.props = { ...node.props, ...updates.props };
            if (updates.style) node.style = { ...node.style, ...updates.style };
            if (updates.children) node.children = updates.children;
            return true;
          }
          if (node.children && updateRec(node.children)) return true;
        }
        return false;
      };
      updateRec(state.nodes);
    }),

    updateNodeStyle: (id, style) => set((state) => {
      const updateRec = (nodes: CanvasNode[]) => {
        for (const node of nodes) {
          if (node.id === id) {
            node.style = { ...node.style, ...style };
            return true;
          }
          if (node.children && updateRec(node.children)) return true;
        }
        return false;
      };
      updateRec(state.nodes);
    }),

    selectNode: (id) => set((state) => {
      state.selectedId = id;
    }),

    setDevice: (device) => set((state) => {
      state.device = device;
    }),

    setPreview: (preview) => set((state) => {
      state.isPreview = preview;
      state.selectedId = null; // Deselect when previewing
    }),

    moveNode: (activeId, overId) => set((state) => {
      // Complex move logic to locate nodes in the tree
      // 1. Find the active node and remove it
      // 2. Find the over node (target parent or sibling) and insert it

      let movedNode: CanvasNode | undefined;

      // Recursive removal
      const removeRec = (nodes: CanvasNode[]): boolean => {
        const idx = nodes.findIndex(n => n.id === activeId);
        if (idx !== -1) {
          movedNode = nodes[idx];
          nodes.splice(idx, 1);
          return true;
        }
        for (const node of nodes) {
          if (node.children && removeRec(node.children)) return true;
        }
        return false;
      };

      // Recursive insertion
      const insertRec = (nodes: CanvasNode[]) => {
        const parentIdx = nodes.findIndex(n => n.id === overId);
        if (parentIdx !== -1) {
          if (nodes[parentIdx].type === 'container' || nodes[parentIdx].type === 'section' || nodes[parentIdx].type === 'grid-col') {
            nodes[parentIdx].children.push(movedNode!);
            return true;
          }
        }

        for (const node of nodes) {
          if (node.children && insertRec(node.children)) return true;
        }
        return false;
      };

      if (state.nodes.some(n => n.id === activeId)) return; // Don't move root

      removeRec(state.nodes);

      if (movedNode) {
        if (!insertRec(state.nodes)) {
          if (overId === 'root') {
            state.nodes[0].children.push(movedNode);
          } else {
            state.nodes[0].children.push(movedNode);
          }
        }
      }
    }),

    deleteNode: (id) => set((state) => {
      const deleteRec = (nodes: CanvasNode[]) => {
        const idx = nodes.findIndex(n => n.id === id);
        if (idx !== -1) {
          nodes.splice(idx, 1);
          return true;
        }
        for (const node of nodes) {
          if (node.children && deleteRec(node.children)) return true;
        }
        return false;
      };
      deleteRec(state.nodes);
      if (state.selectedId === id) state.selectedId = null;
    })
  }))
);
