import { cert, getApps, initializeApp } from 'firebase-admin/app'
// import { initialize } from 'next/dist/server/lib/render-server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
const initFirebaseAdmin = () => {
    const apps = getApps();
    if (!apps.length) {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;

        // Basic validation with a helpful error message if any required env var is missing
        if (!projectId || !clientEmail || !privateKey) {
            throw new Error(
                'Missing Firebase admin credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in your environment (see firebase/admin.ts).'
            );
        }

        // The private key often contains newline characters. When stored in env vars they are
        // usually escaped ("\\n") — convert them back to real newlines.
        privateKey = privateKey.replace(/\\n/g, "\n");

        initializeApp({
            credential: cert({
                projectId,
                clientEmail,
                privateKey
            })
        });
    }

    return {
        auth: getAuth(),
        db: getFirestore()
    };
};

export const { auth, db } = initFirebaseAdmin();

