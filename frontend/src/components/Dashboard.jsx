import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Import Tabs
import { ScenarioSimulator } from './ScenarioSimulator'; // Import new component
import { cn } from '@/lib/utils';
import { UploadZone } from './UploadZone';
import { api } from '@/services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, ShieldCheck, LayoutDashboard, Info, Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react';

function CollapsibleRecommendations({ recommendations }) {
    const [isOpen, setIsOpen] = useState(false);

    const recs = (() => {
        try {
            const parsed = typeof recommendations === 'string'
                ? JSON.parse(recommendations)
                : recommendations;
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
            return [String(recommendations)];
        }
    })();

    return (
        <div className="mt-6 border border-slate-700 rounded-lg overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    <span className="font-semibold text-yellow-500">View Strategic Recommendations</span>
                    <span className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">
                        {recs.length} Items
                    </span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {isOpen && (
                <div className="bg-slate-900/50 p-4 border-t border-slate-700 animate-in slide-in-from-top-2">
                    <ul className="space-y-3">
                        {recs.map((r, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                                <span className="text-blue-500 font-mono mt-0.5">0{i + 1}.</span>
                                {r}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}


export default function Dashboard() {
    const [theme, setTheme] = useState('dark'); // Default to dark
    const [activeCompany, setActiveCompany] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(false);

    // Theme Effect
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

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
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            {/* Header */}
            <header className="bg-background border-b border-border px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <Activity className="text-blue-500 w-6 h-6" />
                    <h1 className="text-xl font-bold text-foreground">FinPulse</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>
                    <span className="text-sm text-muted-foreground">Demo User</span>
                    <div className="w-8 h-8 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center font-bold">D</div>
                </div>
            </header>

            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                <Tabs defaultValue="overview" className="space-y-6">
                    <div className="flex justify-center mb-8">
                        <TabsList className="grid w-[400px] grid-cols-2 p-1 bg-muted/50 rounded-full">
                            <TabsTrigger
                                value="overview"
                                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="simulator"
                                className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <TrendingUp className="w-4 h-4" />
                                Simulator
                            </TabsTrigger>
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
                                    <Card className="bg-blue-500/10 border-blue-500/20">
                                        <CardContent className="pt-6">
                                            <p className="text-sm font-medium text-blue-400">Revenue</p>
                                            <p className="text-2xl font-bold text-foreground mt-2">
                                                {metrics ? `$${metrics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-red-500/10 border-red-500/20">
                                        <CardContent className="pt-6">
                                            <p className="text-sm font-medium text-red-400">Expenses</p>
                                            <p className="text-2xl font-bold text-foreground mt-2">
                                                {metrics ? `$${metrics.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card className={cn("bg-green-500/10 border-green-500/20")}>
                                        <CardContent className="pt-6">
                                            <p className="text-sm font-medium text-green-400">Net Profit</p>
                                            <p className={cn("text-2xl font-bold mt-2", (metrics?.net_profit || 0) >= 0 ? "text-green-500" : "text-red-500")}>
                                                {metrics ? `$${metrics.net_profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
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
                                                    <AreaChart data={[
                                                        { name: 'Revenue', amount: metrics.revenue },
                                                        { name: 'Expenses', amount: metrics.expenses },
                                                        { name: 'Profit', amount: metrics.net_profit }
                                                    ]}>
                                                        <defs>
                                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                            </linearGradient>
                                                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                                        <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94a3b8" />
                                                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} stroke="#94a3b8" />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                                                            formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Amount']}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="amount"
                                                            stroke="#3b82f6"
                                                            fillOpacity={1}
                                                            fill="url(#colorRevenue)"
                                                        />
                                                    </AreaChart>
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
                                                                <CollapsibleRecommendations recommendations={assessment.recommendations} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </>
                                ) : (
                                    <div className="h-96 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/10 border-border">
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
