"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

interface CountSelectorProps {
    value: number;
    onValueChange: (value: number) => void;
}

export function CountSelector({ value, onValueChange }: CountSelectorProps) {
    return (
        <Select
            value={value.toString()}
            onValueChange={(val) => onValueChange(Number(val))}
        >
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select count" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
            </SelectContent>
        </Select>
    );
}
