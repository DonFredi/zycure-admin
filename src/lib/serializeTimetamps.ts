export function serializeTimestamp(ts: any): string | null {
  // Firestore Timestamp
  if (ts?.toDate) {
    return ts.toDate().toISOString();
  }

  // Serialized Firestore timestamp
  if (ts?.seconds) {
    return new Date(ts.seconds * 1000).toISOString();
  }

  return null;
}
