
import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext(null);

export function Tabs({ defaultValue, children, className }) {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={cn("", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

export function TabsList({ children, className }) {
    return (
        <div className={cn("flex space-x-1 rounded-xl bg-gray-100 p-1", className)}>
            {children}
        </div>
    );
}

export function TabsTrigger({ value, children, className }) {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === value;

    return (
        <button
            onClick={() => setActiveTab(value)}
            className={cn(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all",
                "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                    ? "bg-white text-blue-700 shadow"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-200",
                className
            )}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, children, className }) {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    const { activeTab } = context;

    if (activeTab !== value) return null;

    return (
        <div className={cn("mt-4 focus:outline-none animate-in fade-in duration-300", className)}>
            {children}
        </div>
    );
}
