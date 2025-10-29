"use client";

import React from "react";
import PortfolioLayout from "@/components/portfolio/PortfolioLayout";
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Label, FormGroup } from "@/components/ui";

const DemoPage: React.FC = () => {
    return (
        <PortfolioLayout>
            <div className="neo-container neo-section">
                <div className="text-center mb-12">
                    <h1 className="neo-heading text-responsive-4xl mb-4">
                        Neobrutalism UI Demo
                    </h1>
                    <p className="neo-text text-responsive-lg text-gray-600">
                        ポートフォリオ基盤とNeobrutalism UIコンポーネントのデモページ
                    </p>
                </div>

                {/* Button Demo */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Button Components</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <Button variant="primary">Primary Button</Button>
                            <Button variant="secondary">Secondary Button</Button>
                            <Button variant="accent">Accent Button</Button>
                            <Button variant="outline">Outline Button</Button>
                            <Button variant="ghost">Ghost Button</Button>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                            <Button size="xl">Extra Large</Button>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <Button loading>Loading Button</Button>
                            <Button disabled>Disabled Button</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Card Demo */}
                <div className="neo-grid neo-grid-responsive mb-8">
                    <Card variant="default">
                        <CardHeader>
                            <CardTitle>Default Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>これはデフォルトカードです。白い背景に黒いボーダーが特徴です。</p>
                        </CardContent>
                    </Card>

                    <Card variant="accent">
                        <CardHeader>
                            <CardTitle>Accent Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>これはアクセントカードです。ネオンライムの背景が特徴です。</p>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle>Glass Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>これはグラスカードです。透明感のある背景が特徴です。</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Form Demo */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Form Components</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormGroup>
                                <Label htmlFor="name" required>名前</Label>
                                <Input
                                    type="text"
                                    placeholder="お名前を入力してください"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="email" required>メールアドレス</Label>
                                <Input
                                    type="email"
                                    placeholder="email@example.com"
                                />
                            </FormGroup>

                            <FormGroup className="md:col-span-2">
                                <Label htmlFor="message" required>メッセージ</Label>
                                <Input
                                    type="textarea"
                                    placeholder="メッセージを入力してください"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="error-demo">エラー例</Label>
                                <Input
                                    type="text"
                                    error="このフィールドは必須です"
                                    placeholder="エラー状態のデモ"
                                />
                            </FormGroup>
                        </div>
                    </CardContent>
                </Card>

                {/* Typography Demo */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Typography & Responsive Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <h1 className="neo-heading text-responsive-4xl">Heading 1 (Responsive 4XL)</h1>
                            <h2 className="neo-heading text-responsive-3xl">Heading 2 (Responsive 3XL)</h2>
                            <h3 className="neo-heading text-responsive-2xl">Heading 3 (Responsive 2XL)</h3>
                            <h4 className="neo-heading text-responsive-xl">Heading 4 (Responsive XL)</h4>
                            <p className="neo-text text-responsive-base">
                                これは本文テキストです。レスポンシブフォントサイズを使用しており、
                                画面サイズに応じて適切なサイズに調整されます。
                            </p>
                            <p className="font-mono text-responsive-sm">
                                これはモノスペースフォントのテキストです。コードやデータ表示に適しています。
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Animation Demo */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Animation & Effects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="neo-card neo-hover-lift">
                                <h4 className="neo-heading text-lg mb-2">Hover Lift</h4>
                                <p className="neo-text text-sm">ホバーすると上に浮き上がります</p>
                            </div>

                            <div className="neo-card neo-hover-press">
                                <h4 className="neo-heading text-lg mb-2">Hover Press</h4>
                                <p className="neo-text text-sm">クリックすると押し込まれます</p>
                            </div>

                            <div className="neo-card animate-shadow-pulse">
                                <h4 className="neo-heading text-lg mb-2">Shadow Pulse</h4>
                                <p className="neo-text text-sm">シャドウがパルスします</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Color Palette Demo */}
                <Card>
                    <CardHeader>
                        <CardTitle>Color Palette</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="w-full h-20 bg-navy-900 border-4 border-black mb-2"></div>
                                <p className="neo-text text-sm">Navy Blue</p>
                            </div>
                            <div className="text-center">
                                <div className="w-full h-20 bg-neon-yellow border-4 border-black mb-2"></div>
                                <p className="neo-text text-sm">Neon Yellow</p>
                            </div>
                            <div className="text-center">
                                <div className="w-full h-20 bg-neon-pink border-4 border-black mb-2"></div>
                                <p className="neo-text text-sm">Electric Pink</p>
                            </div>
                            <div className="text-center">
                                <div className="w-full h-20 bg-neon-lime border-4 border-black mb-2"></div>
                                <p className="neo-text text-sm">Lime Green</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PortfolioLayout>
    );
};

export default DemoPage;