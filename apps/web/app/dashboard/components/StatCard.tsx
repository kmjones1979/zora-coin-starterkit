"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
    title: string;
    value?: string | number | null;
    isLoading: boolean;
    error?: Error | null;
    errorMessage?: string;
    isApproximate?: boolean;
    approximateText?: string;
    // We can add more props later like unit, icon, trend, etc.
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    isLoading,
    error,
    errorMessage = "Error loading data",
    isApproximate,
    approximateText,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && <p className="text-2xl font-bold">Loading...</p>}
                {error && (
                    <p className="text-red-500">
                        {errorMessage}: {error.message}
                    </p>
                )}
                {!isLoading &&
                    !error &&
                    value !== undefined &&
                    value !== null && (
                        <>
                            <p className="text-2xl font-bold">
                                {value}
                                {isApproximate ? "+" : ""}
                            </p>
                            {isApproximate && approximateText && (
                                <p className="text-xs text-gray-400">
                                    {approximateText}
                                </p>
                            )}
                        </>
                    )}
                {!isLoading &&
                    !error &&
                    (value === undefined || value === null) && (
                        <p className="text-2xl font-bold">N/A</p> // Display N/A if value is not available after loading
                    )}
            </CardContent>
        </Card>
    );
};

export default StatCard;
