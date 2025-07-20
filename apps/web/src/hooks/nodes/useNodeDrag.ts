import { useState, useCallback, useRef } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';

import { NodeService } from '../../services/core/node.service';
import { useNodesStore } from '../../store/nodes.store';
import { useNodeSelection } from './useNodeSelection';

export interface UseNodeDragReturn {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  handleDragStart: (e: KonvaEventObject<DragEvent>) => void;
  handleDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  isLoading: boolean; // NEW: For database persistence
}

export interface DragState {
  nodeId: string;
  startPosition: { x: number; y: number };
  selectedNodes: Array<{
    id: string;
    startPosition: { x: number; y: number };
  }>;
}

export function useNodeDrag(): UseNodeDragReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const dragStateRef = useRef<DragState | null>(null);

  const { updateNode } = useNodesStore();
  const { getSelectedNodes, isSelected } = useNodeSelection();

  const handleDragStart = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const target = e.target;
      const nodeId =
        target.getAttr('nodeId') || target.parent?.getAttr('nodeId');

      if (!nodeId) return;

      const position = target.position();
      const selectedNodes = getSelectedNodes();

      // If dragging a selected node, prepare to drag all selected nodes
      // If dragging an unselected node, just drag that node
      const nodesToDrag = isSelected(nodeId)
        ? selectedNodes.map(node => ({
            id: node.id,
            startPosition: { x: node.position.x, y: node.position.y },
          }))
        : [{ id: nodeId, startPosition: position }];

      dragStateRef.current = {
        nodeId,
        startPosition: position,
        selectedNodes: nodesToDrag,
      };

      setIsDragging(true);
      setDragOffset({ x: 0, y: 0 });
    },
    [getSelectedNodes, isSelected]
  );

  const handleDragEnd = useCallback(
    async (e: KonvaEventObject<DragEvent>) => {
      if (!dragStateRef.current) return;

      const target = e.target;
      const currentPosition = target.position();
      const { startPosition, selectedNodes } = dragStateRef.current;

      // Calculate the offset from the dragged node
      const deltaX = currentPosition.x - startPosition.x;
      const deltaY = currentPosition.y - startPosition.y;

      setIsLoading(true);

      try {
        // Prepare batch updates for all nodes that were dragged
        const updates = selectedNodes.map(node => ({
          nodeId: node.id,
          data: {
            position: {
              x: node.startPosition.x + deltaX,
              y: node.startPosition.y + deltaY,
            },
          },
        }));

        // Update positions in database (batch operation)
        if (updates.length === 1) {
          // Single node update
          await NodeService.updateNode(updates[0].nodeId, updates[0].data);
          updateNode(updates[0].nodeId, updates[0].data);
        } else {
          // Multiple nodes update
          await NodeService.updateMultipleNodes(updates);
          updates.forEach(update => {
            updateNode(update.nodeId, update.data);
          });
        }

        // Update local state for all dragged nodes
        selectedNodes.forEach(node => {
          if (node.id !== dragStateRef.current?.nodeId) {
            // Update other selected nodes to follow the drag
            updateNode(node.id, {
              position: {
                x: node.startPosition.x + deltaX,
                y: node.startPosition.y + deltaY,
              },
            });
          }
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to update node positions:', error);

        // Rollback: Reset all nodes to their original positions
        selectedNodes.forEach(node => {
          updateNode(node.id, {
            position: node.startPosition,
          });
        });
      } finally {
        setIsLoading(false);
        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });
        dragStateRef.current = null;
      }
    },
    [updateNode]
  );

  return {
    isDragging,
    dragOffset,
    handleDragStart,
    handleDragEnd,
    isLoading,
  };
}
