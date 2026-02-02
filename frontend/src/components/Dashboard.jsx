import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Import Tabs
import { ScenarioSimulator } from './ScenarioSimulator'; // Import new component
import { cn } from '@/lib/utils';
import { UploadZone } from './UploadZone';
import { api } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
    const [activeCompany, setActiveCompany] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(false);

    // Auto-create a test company for Hackathon Demo Flow
    useEffect(() => {
        const init = async () => {
            try {
                const companies = await api.createCompany({
                    name: "Demo SME Ltd",
                    industry: "Retail",
                    business_type: "E-Commerce"
                });
                setActiveCompany(companies.id);
            } catch (e) {
                setActiveCompany(1);
            }
        };
        init();
    }, []);

    const handleAnalysisComplete = (data) => {
        setMetrics(data.metrics);
        if (data.assessment) {
            setAssessment(data.assessment);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <Activity className="text-blue-600 w-6 h-6" />
                    <h1 className="text-xl font-bold text-gray-900">FinPulse</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Demo User</span>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">D</div>
                </div>
            </header>

            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                <Tabs defaultValue="overview">
                    <div className="flex justify-between items-center mb-6">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="simulator">Future Simulator (Beta)</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


                            {/* Left Col: Upload & Input */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Financial Input</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-500 mb-4">Upload your latest Profit & Loss statement or Balance Sheet (CSV).</p>
                                        <UploadZone companyId={activeCompany} onUploadSuccess={handleAnalysisComplete} />
                                    </CardContent>
                                </Card>

                                {/* Quick Stats or Company Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Company Profile</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Name</span>
                                            <span className="font-medium">Demo SME Ltd</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Industry</span>
                                            <span className="font-medium">Retail</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Col: Dashboard & Visuals */}
                            <div className="md:col-span-2 space-y-6">

                                {/* KPI Cards */}
                                <div className="grid grid-cols-3 gap-4">
                                    <Card className="bg-white border-l-4 border-l-blue-500">
                                        <CardContent className="pt-6">
                                            <p className="text-sm text-gray-500">Revenue</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {metrics ? `$${metrics.revenue.toLocaleString()}` : "—"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-white border-l-4 border-l-red-500">
                                        <CardContent className="pt-6">
                                            <p className="text-sm text-gray-500">Expenses</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {metrics ? `$${metrics.expenses.toLocaleString()}` : "—"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card className={cn("bg-white border-l-4", (metrics?.net_profit || 0) >= 0 ? "border-l-green-500" : "border-l-orange-500")}>
                                        <CardContent className="pt-6">
                                            <p className="text-sm text-gray-500">Net Profit</p>
                                            <p className={cn("text-2xl font-bold", (metrics?.net_profit || 0) >= 0 ? "text-green-600" : "text-red-600")}>
                                                {metrics ? `$${metrics.net_profit.toLocaleString()}` : "—"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Main Viz Area */}
                                {metrics ? (
                                    <>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <TrendingUp className="w-5 h-5 text-gray-400" />
                                                    Financial Overview
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={[
                                                        { name: 'Revenue', amount: metrics.revenue },
                                                        { name: 'Expenses', amount: metrics.expenses },
                                                        { name: 'Profit', amount: metrics.net_profit }
                                                    ]}>
                                                        <XAxis dataKey="name" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Bar dataKey="amount" fill="#3b82f6">
                                                            {
                                                                [0, 1, 2].map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={index === 1 ? '#ef4444' : index === 2 ? '#22c55e' : '#3b82f6'} />
                                                                ))
                                                            }
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </CardContent>
                                        </Card>

                                        {/* AI Assessment */}
                                        {assessment && (
                                            <Card className="bg-slate-900 text-white border-slate-800">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-yellow-500">
                                                        <ShieldCheck className="w-5 h-5" />
                                                        AI Assessment
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-1 space-y-2">
                                                            <h4 className="font-semibold text-lg">
                                                                Financial Health Score:
                                                                <span className={cn("ml-2", assessment.score < 50 ? "text-red-400" : "text-green-400")}>
                                                                    {assessment.score}/100
                                                                </span>
                                                            </h4>
                                                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                                {assessment.summary}
                                                            </p>

                                                            {assessment.recommendations && (
                                                                <div className="mt-4">
                                                                    <strong className="text-yellow-500 block mb-2">Recommendations:</strong>
                                                                    <ul className="list-disc pl-5 space-y-1 text-slate-400 text-sm">
                                                                        {(() => {
                                                                            try {
                                                                                const recs = typeof assessment.recommendations === 'string'
                                                                                    ? JSON.parse(assessment.recommendations)
                                                                                    : assessment.recommendations;
                                                                                return Array.isArray(recs) ? recs.map((r, i) => <li key={i}>{r}</li>) : <li>{recs}</li>;
                                                                            } catch (e) {
                                                                                return <li>{String(assessment.recommendations)}</li>
                                                                            }
                                                                        })()}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </>
                                ) : (
                                    <div className="h-96 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed rounded-xl bg-gray-50/50">
                                        <Activity className="w-12 h-12 mb-4 opacity-50" />
                                        <p>Upload data to visualize insights</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="simulator">
                        <ScenarioSimulator baseMetrics={metrics} companyInfo={{
                            name: "Demo SME Ltd",
                            industry: "Retail",
                            business_type: "E-Commerce"
                        }} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
