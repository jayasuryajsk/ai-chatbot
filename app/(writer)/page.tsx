import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SidebarProvider } from '@/components/ui/sidebar';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { auth } from '../(auth)/auth';
import { generateUUID } from '@/lib/utils';
import { WriterClient } from '@/components/writer-client';

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
      <WriterClient session={session} chatId={id} initialModel={initialModel} />
    </SidebarProvider>
  );
}
