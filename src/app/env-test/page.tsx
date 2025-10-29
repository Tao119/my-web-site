"use client";

export default function EnvTestPage() {
    const envVars = {
        'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        'NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID': process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
        'NEXT_PUBLIC_FIREBASE_APP_ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>Environment Variables Test</h1>
            <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
                {Object.entries(envVars).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '10px' }}>
                        <strong>{key}:</strong>{' '}
                        <span style={{ color: value ? 'green' : 'red' }}>
                            {value ? (key.includes('API_KEY') ? `${value.substring(0, 8)}...` : value) : 'NOT SET'}
                        </span>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '20px' }}>
                <h2>Node Environment</h2>
                <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h2>Instructions</h2>
                <ol>
                    <li>Make sure your <code>.env.local</code> file is in the root directory</li>
                    <li>Restart your development server (<code>npm run dev</code>)</li>
                    <li>Check that all environment variables show as &quot;SET&quot; above</li>
                </ol>
            </div>
        </div>
    );
}