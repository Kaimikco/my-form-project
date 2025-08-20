import React, { useState, useEffect, ReactNode, createContext, useContext, useId } from 'react';
import {
  closestCenter,
  DndContext, 
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DraggableAttributes,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  horizontalListSortingStrategy,
  SortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { tv } from 'tailwind-variants';

interface DragProps {
  listeners: SyntheticListenerMap | undefined; 
  attributes: DraggableAttributes;
}

interface RenderItemProps<T> {
  data: T;
  dragProps?: DragProps;
  isDragging?: boolean;
}

export const enum DragSortableListType {
  Vertical,
  Horizontal
}

// Context for sortable configuration including render function
interface SortableConfig<T> {
  usesDragHandle: boolean;
  renderItem: (props: RenderItemProps<T>) => ReactNode;
}

// Context for drag handle (only available when usesDragHandle is true)
interface DragHandleContextValue {
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
}

const SortableConfigContext = createContext<SortableConfig<any> | null>(null);
const DragHandleContext = createContext<DragHandleContextValue | null>(null);

function useSortableConfig<T>(): SortableConfig<T> {
  const context = useContext(SortableConfigContext);
  if (!context) {
    throw new Error('DragSortableItem must be used within a DragSortableList');
  }
  return context;
}

// Hook to access drag handle props (only works when usesDragHandle is true)
function useDragHandle() {
  const context = useContext(DragHandleContext);
  const sortableConfig = useContext(SortableConfigContext);
  
  if (!sortableConfig) {
    throw new Error('useDragHandle must be used within a DragSortableList');
  }
  
  if (!sortableConfig.usesDragHandle) {
    throw new Error('useDragHandle can only be used when usesDragHandle=true on DragSortableList');
  }
  
  if (!context) {
    throw new Error('useDragHandle must be used within a DragSortableItem with usesDragHandle=true');
  }
  
  return context;
}

interface SortableItemProps<T> {
  stableItem: StableItem<T>;
}

export const dragSortableItemStyles = tv({
  variants: {
    usesDragHandle: {
      false: "cursor-grabbing"
    },
    isDragging: {
      true: "opacity-50"
    }
  }
})

export function DragSortableItem<T>({ stableItem }: SortableItemProps<T>) {
  const { usesDragHandle, renderItem } = useSortableConfig<T>();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stableItem.id });
  
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const dragProps = usesDragHandle ? { listeners, attributes } : undefined;
  const dragHandleContextValue = usesDragHandle ? { listeners, attributes } : null;
  
  return (
    <div 
      className={dragSortableItemStyles({ usesDragHandle, isDragging })}
      ref={setNodeRef} 
      style={style} 
      {...(usesDragHandle ? {} : { ...attributes, ...listeners })}
    >
      {dragHandleContextValue ? (
        <DragHandleContext.Provider value={dragHandleContextValue}>
          {renderItem({ data: stableItem.data, dragProps, isDragging })}
        </DragHandleContext.Provider>
      ) : (
        renderItem({ data: stableItem.data, dragProps, isDragging })
      )}
    </div>
  );
}

interface StableItem<T> {
  id: string;
  data: T;
}

interface SortableListProps<T> {
  items: T[];
  onReorder?: (items: T[]) => void;
  children: (stableItems: StableItem<T>[]) => ReactNode;
  renderItem: (props: RenderItemProps<T>) => ReactNode;
  usesDragHandle?: boolean;
  listType?: DragSortableListType;
}

export function DragSortableList<T>({ 
  items, 
  onReorder, 
  children, 
  renderItem,
  usesDragHandle = false,
  listType = DragSortableListType.Vertical
}: SortableListProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [stableItems, setStableItems] = useState<StableItem<T>[]>([]);
  const id = useId();
  
  const sortingStrategy: SortingStrategy = 
    listType === DragSortableListType.Vertical ? verticalListSortingStrategy : horizontalListSortingStrategy;
  
  // Generate stable IDs when items prop changes
  useEffect(() => {
    const newStableItems = items.map((data, index): StableItem<T> => ({
      id: `${id}-item-${index}`,
      data
    }));
    setStableItems(newStableItems);
  }, [items, id]);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id.toString());
  }
  
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = stableItems.findIndex(stableItem => stableItem.id === active.id);
      const newIndex = stableItems.findIndex(stableItem => stableItem.id === over.id);
      
      const reorderedStableItems = arrayMove(stableItems, oldIndex, newIndex);
      const reorderedItems = reorderedStableItems.map(stableItem => stableItem.data);
      
      setStableItems(reorderedStableItems);
      onReorder?.(reorderedItems);
    }
    
    setActiveId(null);
  }

  const itemIds = stableItems.map(stableItem => stableItem.id);
  const activeItem = activeId ? stableItems.find(stableItem => stableItem.id === activeId)?.data : null;

  const contextValue: SortableConfig<T> = {
    usesDragHandle,
    renderItem
  };

  return (
    <SortableConfigContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={itemIds}
          strategy={sortingStrategy}
        >
          {children(stableItems)}
        </SortableContext>
        
        <DragOverlay>
          {activeItem ? (
            <div style={{ 
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              pointerEvents: 'none'
            }}>
              {renderItem({ data: activeItem, isDragging: true })}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </SortableConfigContext.Provider>
  );
}

// Pre-built drag handle button component
interface DragHandleProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export function DragHandle({ children = '⋮⋮', className, style, disabled }: DragHandleProps) {
  const { listeners, attributes } = useDragHandle();
  
  return (
    <button
      type="button"
      disabled={disabled}
      {...(!disabled ? listeners : {})}
      {...attributes}
      className={className}
      style={{
        cursor: disabled ? 'default' : 'grab',
        border: 'none',
        background: 'transparent',
        padding: '4px 8px',
        opacity: disabled ? 0.5 : 1,
        ...style
      }}
    >
      {children}
    </button>
  );
}