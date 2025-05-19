'use client';

import { useRef, useState } from 'react';
import type { Session } from 'next-auth';
import type { EditorView } from 'prosemirror-view';

import { WorkbenchLayout } from './workbench-layout';
import { AppSidebar } from './app-sidebar';
import { Chat } from './chat';
import { DataStreamHandler } from './data-stream-handler';
import { Editor } from './text-editor';
import { DocumentOutline } from './document-outline';
import type { Heading } from '@/lib/editor/functions';

interface WriterClientProps {
  session: Session;
  chatId: string;
  initialModel: string;
}

export function WriterClient({ session, chatId, initialModel }: WriterClientProps) {
  const [outline, setOutline] = useState<Heading[]>([]);
  const editorViewRef = useRef<EditorView | null>(null);

  const handleSelect = (heading: Heading) => {
    const view = editorViewRef.current;
    if (!view) return;
    const dom = view.nodeDOM(heading.pos) as HTMLElement | null;
    dom?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <WorkbenchLayout
      sidebar={
        <AppSidebar
          user={session.user}
          extraContent={<DocumentOutline outline={outline} onSelect={handleSelect} />}
        />
      }
      editor={
        <Editor
          content=""
          suggestions={[]}
          isCurrentVersion={true}
          currentVersionIndex={0}
          status="idle"
          onSaveContent={() => {}}
          onHeadingsChange={setOutline}
          editorViewRef={editorViewRef}
        />
      }
      chat={
        <>
          <Chat
            key={chatId}
            id={chatId}
            initialMessages={[]}
            initialChatModel={initialModel}
            initialVisibilityType="private"
            isReadonly={false}
            session={session}
            autoResume={false}
          />
          <DataStreamHandler id={chatId} />
        </>
      }
    />
  );
}
