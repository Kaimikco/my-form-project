import React, { useState, useEffect, ReactNode, createContext, useContext } from 'react';
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
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { tv } from 'tailwind-variants';

interface DragProps {
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
}

interface RenderItemProps<T> {
  item: T;
  dragProps?: DragProps;
  isDragging?: boolean;
}

// Context for sortable configuration including render function
interface SortableConfig<T> {
  usesDragHandle: boolean;
  renderItem: (props: RenderItemProps<T>) => ReactNode;
}

const SortableConfigContext = createContext<SortableConfig<any> | null>(null);

function useSortableConfig<T>(): SortableConfig<T> {
  const context = useContext(SortableConfigContext);
  if (!context) {
    throw new Error('SortableItem must be used within a SortableList');
  }
  return context;
}

interface SortableItemProps<T> {
  id: string;
  item: T;
}

const sortableItemStyles = tv({
  variants:{
    usesDragHandle: {
      false: "cursor-grabbing"
    },
    isDragging: {
      true: "opacity-50"
    }
  }
})

function SortableItem<T>({ id, item }: SortableItemProps<T>) {
  const { usesDragHandle, renderItem } = useSortableConfig<T>();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragProps = usesDragHandle ? { listeners, attributes } : undefined;

  return (
    <div
      className={sortableItemStyles({ usesDragHandle, isDragging })}
      ref={setNodeRef}
      style={style}
      {...(usesDragHandle ? {} : { ...attributes, ...listeners })}
    >
      {renderItem({ item, dragProps, isDragging })}
    </div>
  );
}

export const enum ListType {
  Vertical,
  Horizontal
}

interface SortableListProps<T> {
  items: T[];
  onReorder?: (items: T[]) => void;
  children: (items: T[]) => ReactNode;
  getItemId: (item: T) => string;
  renderItem: (props: RenderItemProps<T>) => ReactNode;
  usesDragHandle?: boolean;
  listType?: ListType;
}

function SortableList<T>({
  items,
  onReorder,
  children,
  getItemId,
  renderItem,
  usesDragHandle = false,
  listType = ListType.Vertical
}: SortableListProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [orderedItems, setOrderedItems] = useState<T[]>(items);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

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
      const oldIndex = orderedItems.findIndex(item => getItemId(item) === active.id);
      const newIndex = orderedItems.findIndex(item => getItemId(item) === over.id);

      const reorderedItems = arrayMove(orderedItems, oldIndex, newIndex);
      setOrderedItems(reorderedItems);
      onReorder?.(reorderedItems);
    }

    setActiveId(null);
  }

  const itemIds = orderedItems.map(getItemId);
  const activeItem = activeId ? orderedItems.find(item => getItemId(item) === activeId) : null;

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
          strategy={
            listType === ListType.Vertical
              ? verticalListSortingStrategy
              : horizontalListSortingStrategy}
        >
          {children(orderedItems)}
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <div style={{
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              pointerEvents: 'none'
            }}>
              {renderItem({ item: activeItem, isDragging: true })}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </SortableConfigContext.Provider>
  );
}

export { SortableList, SortableItem };