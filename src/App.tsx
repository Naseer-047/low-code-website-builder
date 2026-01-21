import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Canvas } from '@/components/editor/Canvas';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { useEditorStore } from '@/store/editorStore';
import type { ElementType } from '@/types/editor';
import { createPortal } from 'react-dom';

export default function App() {
  const { addNode, addBlock, moveNode, isPreview } = useEditorStore();
  const [activeType, setActiveType] = useState<ElementType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.isSidebarItem) {
      setActiveType(event.active.data.current.type);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveType(null);

    if (!over) return;

    if (active.data.current?.isSidebarItem) {
      const parentId = over.id === 'main-canvas' ? 'root' : over.id as string;

      if (active.data.current.blockId) {
        addBlock(active.data.current.blockId, parentId);
      } else {
        const type = active.data.current.type as ElementType;
        addNode(type, parentId);
      }
    } else {
      if (active.id !== over.id) {
        moveNode(active.id as string, over.id as string);
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden font-sans">
        <TopBar />
        <div className="flex-1 flex overflow-hidden">
          {!isPreview && <LeftSidebar />}
          <main className="flex-1 bg-muted/30 relative flex flex-col overflow-hidden">
            <Canvas />
          </main>
          {!isPreview && <RightSidebar />}
        </div>
      </div>
      {createPortal(
        <DragOverlay>
          {activeType ? (
            <div className="bg-background border border-border p-2 rounded shadow-lg opacity-80">
              Dragging {activeType}
            </div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  )
}
