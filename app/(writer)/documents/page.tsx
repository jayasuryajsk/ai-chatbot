import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { DocumentPreview } from '@/components/document-preview';
import type { Document } from '@/lib/db/schema';
import Link from 'next/link';

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  const res = await fetch('http://localhost:3000/api/document', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch documents');
  }

  const documents: Array<Document> = await res.json();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Your Documents</h1>
      {documents.length === 0 ? (
        <p className="text-muted-foreground">No documents found.</p>
      ) : (
        <div className="space-y-6">
          {documents.map((doc) => (
            <div
              key={`${doc.id}-${doc.createdAt}`}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(doc.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2 text-sm">
                  <Link href="/writer" className="underline">
                    Open
                  </Link>
                  <button className="underline" disabled>
                    Rename
                  </button>
                  <button className="underline" disabled>
                    Delete
                  </button>
                </div>
              </div>
              <DocumentPreview
                isReadonly={false}
                result={{ id: doc.id, title: doc.title, kind: doc.kind }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
