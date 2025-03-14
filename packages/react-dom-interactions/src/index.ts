import {MutableRefObject, useMemo, useRef, useState} from 'react';
import {
  useFloating as usePositionalFloating,
  ComputePositionReturn,
  VirtualElement,
} from '@floating-ui/react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import type {
  FloatingContext,
  Middleware,
  Placement,
  Strategy,
  ContextData,
} from './types';
import {createPubSub} from './createPubSub';
import {useFloatingTree} from './FloatingTree';

type Data = Omit<ComputePositionReturn, 'x' | 'y'> & {
  x: number | null;
  y: number | null;
};

export type UseFloatingReturn = Data & {
  update: () => void;
  reference: (node: Element | VirtualElement | null) => void;
  floating: (node: HTMLElement | null) => void;
  refs: {
    reference: MutableRefObject<Element | VirtualElement | null>;
    floating: MutableRefObject<HTMLElement | null>;
  };
};

export interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement: Placement;
  middleware: Array<Middleware>;
  strategy: Strategy;
  nodeId: string;
}

export function useFloating({
  open = false,
  onOpenChange = () => {},
  placement,
  middleware,
  strategy,
  nodeId,
}: Partial<Props> = {}): UseFloatingReturn & {context: FloatingContext} {
  const tree = useFloatingTree();
  const dataRef = useRef<ContextData>({});
  const events = useState(() => createPubSub())[0];
  const floating = usePositionalFloating({placement, middleware, strategy});

  const context = useMemo<FloatingContext>(
    () => ({
      ...floating,
      dataRef,
      nodeId,
      events,
      open,
      onOpenChange,
    }),
    [floating, dataRef, nodeId, events, open, onOpenChange]
  );

  useLayoutEffect(() => {
    const node = tree?.nodesRef.current.find((node) => node.id === nodeId);
    if (node) {
      node.context = context;
    }
  });

  return useMemo(
    () => ({
      context,
      ...floating,
    }),
    [floating, context]
  );
}

export * from '@floating-ui/react-dom';
export {useInteractions} from './useInteractions';
export {safePolygon} from './safePolygon';
export {FloatingPortal} from './FloatingPortal';
export {FloatingOverlay} from './FloatingOverlay';
export {
  FloatingTree,
  FloatingNode,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
} from './FloatingTree';
export {
  FloatingDelayGroup,
  useDelayGroup,
  useDelayGroupContext,
} from './FloatingDelayGroup';
export {useRole} from './hooks/useRole';
export {useClick} from './hooks/useClick';
export {useDismiss} from './hooks/useDismiss';
export {useId} from './hooks/useId';
export {useFocus} from './hooks/useFocus';
export {useFocusTrap} from './hooks/useFocusTrap';
export {useHover} from './hooks/useHover';
export {useListNavigation} from './hooks/useListNavigation';
export {useTypeahead} from './hooks/useTypeahead';
