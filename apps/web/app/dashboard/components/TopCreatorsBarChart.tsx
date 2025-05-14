"use client";

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

interface CreatorData {
    name: string;
    value: number;
}

interface TopCreatorsBarChartProps {
    data: CreatorData[];
    isLoading: boolean;
    error?: Error | null;
}

const TopCreatorsBarChart: React.FC<TopCreatorsBarChartProps> = ({
    data,
    isLoading,
    error,
}) => {
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Top Coin Creators (Recent 100 Coins)</CardTitle>
                <CardDescription>
                    Creators with the most coins minted in the last 100
                    creations.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && <p>Loading creator data...</p>}
                {error && (
                    <p className="text-red-500">Error loading creator data.</p>
                )}
                {!isLoading && !error && data.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="value"
                                fill="#82ca9d"
                                name="Coins Created"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
                {!isLoading && !error && data.length === 0 && (
                    <p>No creator data available or found.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default TopCreatorsBarChart;
