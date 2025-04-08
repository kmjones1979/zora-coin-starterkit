"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";

export type ExploreQueryType =
    | "new"
    | "topGainers"
    | "topVolume"
    | "mostValuable"
    | "lastTraded"
    | "lastTradedUnique";

interface ExploreTypeSelectorProps {
    value: ExploreQueryType;
    onValueChange: (value: ExploreQueryType) => void;
}

export function ExploreTypeSelector({
    value,
    onValueChange,
}: ExploreTypeSelectorProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select view type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="new">New Coins</SelectItem>
                <SelectItem value="topGainers">Top Gainers</SelectItem>
                <SelectItem value="topVolume">Top Volume</SelectItem>
                <SelectItem value="mostValuable">Most Valuable</SelectItem>
                <SelectItem value="lastTraded">Recently Traded</SelectItem>
                <SelectItem value="lastTradedUnique">
                    Recently Traded (Unique)
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
