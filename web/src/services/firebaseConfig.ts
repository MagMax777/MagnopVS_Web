/**
 * ==============================================================================
 * MagnopVS - FIREBASE CONFIG & INITIALIZATION SERVICE
 * ==============================================================================
 * Re-exports singleton Firebase instances from src/firebase.ts
 * so only one FirebaseApp and Firestore instance exists across the platform.
 * ==============================================================================
 */

import app, { db, auth } from '../firebase';

export const firestore = db;
export { app, db, auth };
export default app;
