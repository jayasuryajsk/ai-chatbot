import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AppSidebar } from '@/components/app-sidebar';
import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { WorkbenchLayout } from '@/components/workbench-layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { auth } from '../(auth)/auth';
import { generateUUID } from '@/lib/utils';
import { Editor } from '@/components/text-editor';

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  const id = generateUUID();
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');
  const initialModel = modelIdFromCookie?.value ?? DEFAULT_CHAT_MODEL;

  return (
    <SidebarProvider defaultOpen={true}>
      <WorkbenchLayout
        sidebar={<AppSidebar user={session.user} />}
        editor={
          <Editor
            content=""
            suggestions={[]}
            isCurrentVersion={true}
            currentVersionIndex={0}
            status="idle"
            onSaveContent={() => {}}
          />
        }
        chat={
          <>
            <Chat
              key={id}
              id={id}
              initialMessages={[]}
              initialChatModel={initialModel}
              initialVisibilityType="private"
              isReadonly={false}
              session={session}
              autoResume={false}
            />
            <DataStreamHandler id={id} />
          </>
        }
      />
    </SidebarProvider>
  );
}
