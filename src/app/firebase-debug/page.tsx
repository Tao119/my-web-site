"use client";

import { useEffect, useState } from 'react';
import { checkFirestoreConnection } from '@/lib/firebase';
import { debugFirebaseConfig } from '@/lib/firebaseDebug';

export default function FirebaseDebugPage() {
    const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // デバッグ情報を表示
        debugFirebaseConfig();

        // 接続テスト
        const testConnection = async () => {
            try {
                const isConnected = await checkFirestoreConnection();
                setConnectionStatus(isConnected ? 'connected' : 'failed');
            } catch (err: any) {
                setConnectionStatus('failed');
                setError(err.message);
            }
        };

        testConnection();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>🔥 Firebase Debug Page</h1>

            <div style={{ marginBottom: '20px' }}>
                <h2>Environment Variables</h2>
                <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                    <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</p>
                    <p><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '❌ Missing'}</p>
                    <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ Missing'}</p>
                    <p><strong>Storage Bucket:</strong> {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '❌ Missing'}</p>
                    <p><strong>Messaging Sender ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID || '❌ Missing'}</p>
                    <p><strong>App ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '❌ Missing'}</p>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>Connection Status</h2>
                <div style={{
                    background: connectionStatus === 'connected' ? '#d4edda' : connectionStatus === 'failed' ? '#f8d7da' : '#fff3cd',
                    padding: '10px',
                    borderRadius: '5px',
                    border: `1px solid ${connectionStatus === 'connected' ? '#c3e6cb' : connectionStatus === 'failed' ? '#f5c6cb' : '#ffeaa7'}`
                }}>
                    {connectionStatus === 'checking' && '🔄 Checking connection...'}
                    {connectionStatus === 'connected' && '✅ Firestore connection successful!'}
                    {connectionStatus === 'failed' && '❌ Firestore connection failed'}
                    {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
                </div>
            </div>

            <div>
                <h2>Troubleshooting</h2>
                <ul>
                    <li>Make sure all environment variables are set in your .env.local file</li>
                    <li>Check that your Firebase project ID contains only lowercase letters, numbers, and hyphens</li>
                    <li>Verify that Firestore is enabled in your Firebase project</li>
                    <li>Check your Firestore security rules</li>
                    <li>Ensure your network connection is stable</li>
                </ul>
            </div>

            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '10px 20px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    🔄 Retry Connection
                </button>
            </div>
        </div>
    );
}