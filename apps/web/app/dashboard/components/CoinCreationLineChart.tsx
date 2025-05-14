"use client";

import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CoinCreationLineChartProps {
    data: { minute: string; count: number }[];
    isLoading: boolean;
    error?: Error | null;
}

const CoinCreationLineChart: React.FC<CoinCreationLineChartProps> = ({
    data,
    isLoading,
    error,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Coin Creation Activity (Last Hour)</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
                {isLoading && <p>Loading chart data...</p>}
                {error && (
                    <p className="text-red-500">Error loading chart data.</p>
                )}
                {!isLoading && !error && data.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                            />
                            <XAxis
                                dataKey="minute"
                                stroke="#9ca3af"
                                interval="preserveStartEnd"
                                tickFormatter={(value) =>
                                    value.endsWith(":00") ||
                                    value.endsWith(":30")
                                        ? value
                                        : ""
                                }
                            />
                            <YAxis stroke="#9ca3af" allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1f2937",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                }}
                                labelStyle={{ color: "#e5e7eb" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                name="Coins Created"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
                {!isLoading && !error && data.length === 0 && (
                    <p>No coins created in the last hour.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default CoinCreationLineChart;
