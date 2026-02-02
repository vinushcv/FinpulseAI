
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Wand2, RefreshCcw, FileDown, Info } from 'lucide-react';
import { api } from '@/services/api';
import { generateStrategyPDF } from '@/lib/pdf-generator';

export function ScenarioSimulator({ baseMetrics, companyInfo }) {
    const [modifiers, setModifiers] = useState({
        revenue_growth: 0.0,
        expense_change: 0.0
    });

    const [projection, setProjection] = useState(null);
    const [aiAnalysis, setAiAnalysis] = useState("");
    const [loading, setLoading] = useState(false);

    // Initial Projection (No change)
    useEffect(() => {
        if (baseMetrics) {
            setProjection({
                original: baseMetrics,
                projected: {
                    ...baseMetrics,
                    net_profit: baseMetrics.revenue - baseMetrics.expenses
                }
            });
        }
    }, [baseMetrics]);

    // Update modifiers
    const handleSliderChange = (key, value) => {
        setModifiers(prev => ({ ...prev, [key]: value / 100 }));
    };

    // Calculate Local Math Immediately
    useEffect(() => {
        if (!baseMetrics) return;

        const rev = baseMetrics.revenue * (1 + modifiers.revenue_growth);
        const exp = baseMetrics.expenses * (1 + modifiers.expense_change);

        setProjection({
            original: baseMetrics,
            projected: {
                revenue: rev,
                expenses: exp,
                net_profit: rev - exp
            }
        });

    }, [modifiers, baseMetrics]);

    const runAiAnalysis = async () => {
        setLoading(true);
        try {
            const result = await api.runSimulation({
                base_metrics: baseMetrics,
                modifiers: modifiers,
                company_info: companyInfo
            });
            setAiAnalysis(result.ai_analysis);
        } catch (e) {
            console.error(e);
            setAiAnalysis("Failed to get AI critique.");
        } finally {
            setLoading(false);
        }
    };

    if (!baseMetrics) return <div>Load data first.</div>;

    const chartData = [
        {
            name: 'Revenue',
            Actual: baseMetrics.revenue,
            Projected: projection?.projected?.revenue || 0
        },
        {
            name: 'Expenses',
            Actual: baseMetrics.expenses,
            Projected: projection?.projected?.expenses || 0
        },
        {
            name: 'Net Profit',
            Actual: baseMetrics.revenue - baseMetrics.expenses,
            Projected: projection?.projected?.net_profit || 0
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Controls */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <RefreshCcw className="w-5 h-5 text-blue-500" />
                        Simulation Controls
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <label className="font-medium text-sm">Revenue Growth Target</label>
                                <div className="group relative">
                                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-50">
                                        Adjust this to simulate increased sales, new market entry, or pricing changes.
                                    </div>
                                </div>
                            </div>
                            <span className="font-bold text-blue-600">{(modifiers.revenue_growth * 100).toFixed(0)}%</span>
                        </div>
                        <Slider
                            min={-20} max={50} step={1}
                            value={modifiers.revenue_growth * 100}
                            onValueChange={(v) => handleSliderChange('revenue_growth', v)}
                        />
                        <p className="text-xs text-gray-500">Targeting aggressive sales or market expansion.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <label className="font-medium text-sm">OpEx Adjustment</label>
                                <div className="group relative">
                                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-50">
                                        Simulate cost-cutting measures (negative) or new operational investments/hiring (positive).
                                    </div>
                                </div>
                            </div>
                            <span className="font-bold text-red-600">{(modifiers.expense_change * 100).toFixed(0)}%</span>
                        </div>
                        <Slider
                            min={-20} max={50} step={1}
                            value={modifiers.expense_change * 100}
                            onValueChange={(v) => handleSliderChange('expense_change', v)}
                        />
                        <p className="text-xs text-gray-500">Cost cutting measures or new investments.</p>
                    </div>

                    <Button onClick={runAiAnalysis} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                        {loading ? "Analyzing Risks..." : "Ask AI CFO to Critique Plan"}
                        <Wand2 className="w-4 h-4 ml-2" />
                    </Button>
                </CardContent>
            </Card>

            {/* Visualization and AI */}
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Projected Impact</CardTitle></CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                                    formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Amount']}
                                />
                                <Legend />
                                <Bar dataKey="Actual" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Projected" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {aiAnalysis && (
                    <Card className="bg-slate-900 text-white border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-sm font-mono text-indigo-400">AI CFO FEEDBACK</CardTitle>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-white border-slate-600 hover:bg-slate-800"
                                    onClick={() => generateStrategyPDF(companyInfo.name, projection, aiAnalysis, modifiers)}
                                >
                                    <FileDown className="w-4 h-4 mr-2" />
                                    Export Strategy PDF
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed">{aiAnalysis}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
