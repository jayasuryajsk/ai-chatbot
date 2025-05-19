import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import * as Y from 'yjs';

const docs = new Map<string, Y.Doc>();

function getDoc(id: string) {
  let doc = docs.get(id);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(id, doc);
  }
  return doc;
}

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '', 'http://localhost');
  const docId = url.searchParams.get('docId') || 'default';
  const doc = getDoc(docId);

  const updateHandler = (update: Uint8Array, origin: unknown) => {
    if (origin !== ws && ws.readyState === WebSocket.OPEN) {
      ws.send(update);
    }
  };

  doc.on('update', updateHandler);

  ws.on('message', (data) => {
    const update = new Uint8Array(data as ArrayBuffer);
    Y.applyUpdate(doc, update, ws);
  });

  ws.on('close', () => {
    doc.off('update', updateHandler);
  });
});

const PORT = Number(process.env.COLLAB_PORT || 1234);
server.listen(PORT, () => {
  console.log(`WebSocket server listening on ${PORT}`);
});
