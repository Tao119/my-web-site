import { NextResponse } from 'next/server';
import { initialSkillsData } from '@/scripts/initializeSkills';
import { addSkill, getSkills } from '@/lib/dataService';

export async function POST() {
    try {
        // 既存のスキルを確認
        const existingSkills = await getSkills();

        if (existingSkills.length > 0) {
            return NextResponse.json({
                message: `スキルデータは既に存在します（${existingSkills.length}件）。先にクリアしてから初期化してください。`,
                count: existingSkills.length,
                existing: true
            });
        }

        // 初期スキルデータを追加
        const results = [];
        for (const skillData of initialSkillsData) {
            try {
                const skill = {
                    ...skillData,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                const skillId = await addSkill(skill);
                results.push({ id: skillId, name: skill.name, success: true });
            } catch (error) {
                console.error(`Failed to add skill ${skillData.name}:`, error);
                results.push({
                    name: skillData.name,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;

        return NextResponse.json({
            message: `スキルデータベースを初期化しました`,
            success: successCount,
            failures: failureCount,
            results
        });

    } catch (error) {
        console.error('Skills initialization error:', error);
        return NextResponse.json(
            {
                error: 'スキルデータベースの初期化に失敗しました',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// 既存スキルの確認
export async function GET() {
    try {
        const skills = await getSkills();

        return NextResponse.json({
            count: skills.length,
            skills: skills.map(skill => ({
                id: skill.id,
                name: skill.name,
                category: skill.category,
                level: skill.level,
                years: skill.years
            }))
        });
    } catch (error) {
        console.error('Skills fetch error:', error);
        return NextResponse.json(
            { error: 'スキルデータの取得に失敗しました' },
            { status: 500 }
        );
    }
}