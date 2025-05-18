'use client'

import { ReactNode } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface WorkbenchLayoutProps {
  sidebar: ReactNode;
  editor: ReactNode;
  chat: ReactNode;
}

export function WorkbenchLayout({ sidebar, editor, chat }: WorkbenchLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="h-dvh w-full flex">
      <PanelGroup direction="horizontal" className="flex w-full h-full">
        <Panel
          defaultSize={isMobile ? 0 : 20}
          minSize={15}
          collapsedSize={0}
          collapsible
          className={cn('border-r bg-sidebar overflow-y-auto', isMobile && 'hidden')}
        >
          {sidebar}
        </Panel>
        <PanelResizeHandle className="w-1 bg-border cursor-col-resize" />
        <Panel
          defaultSize={isMobile ? 100 : 60}
          minSize={20}
          className="overflow-y-auto"
        >
          {editor}
        </Panel>
        <PanelResizeHandle className={cn('w-1 bg-border cursor-col-resize', isMobile && 'hidden')} />
        <Panel
          defaultSize={isMobile ? 0 : 20}
          minSize={15}
          collapsedSize={0}
          collapsible
          className={cn('border-l overflow-y-auto', isMobile && 'hidden')}
        >
          {chat}
        </Panel>
      </PanelGroup>
    </div>
  );
}
