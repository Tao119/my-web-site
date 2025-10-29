import { NextResponse } from 'next/server';
import { getFirestoreInstance } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export async function DELETE() {
    try {
        const db = getFirestoreInstance();
        const skillsRef = collection(db, 'skills');
        const querySnapshot = await getDocs(skillsRef);

        const deletePromises = querySnapshot.docs.map(docSnapshot =>
            deleteDoc(doc(db, 'skills', docSnapshot.id))
        );

        await Promise.all(deletePromises);

        return NextResponse.json({
            message: `${querySnapshot.docs.length}件のスキルを削除しました`,
            deletedCount: querySnapshot.docs.length
        });

    } catch (error) {
        console.error('Skills clear error:', error);
        return NextResponse.json(
            {
                error: 'スキルの削除に失敗しました',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}