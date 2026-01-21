import { useDraggable } from '@dnd-kit/core';
import type { ElementType } from '@/types/editor';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  type: ElementType;
  icon: LucideIcon;
  label: string;
  blockId?: string;
}

export function SidebarItem({ type, icon: Icon, label, blockId }: SidebarItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: blockId ? `block-${blockId}` : `sidebar-${type}`,
    data: {
      type,
      isSidebarItem: true,
      blockId // Pass this so App handles it
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex flex-col items-center justify-center p-3 bg-muted/30 border border-border rounded-lg cursor-grab hover:bg-muted hover:border-primary/50 transition-all",
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
    >
      <Icon className="w-5 h-5 mb-2 text-muted-foreground" />
      <span className="text-[10px] text-center font-medium leading-tight">{label}</span>
    </div>
  );
}
