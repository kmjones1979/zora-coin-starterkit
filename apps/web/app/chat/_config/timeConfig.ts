// Time interval definitions
export interface TimeInterval {
  id: string;
  name: string;
}

export const TIME_INTERVALS: TimeInterval[] = [
  { id: "1h", name: "1 Hour" },
  { id: "4h", name: "4 Hours" },
  { id: "1d", name: "1 Day" },
  { id: "1w", name: "1 Week" },
];

// Time span definitions
export interface TimeSpan {
  id: string;
  name: string;
  seconds: number;
}

export const TIME_SPANS: TimeSpan[] = [
  { id: "1d", name: "Last 24 Hours", seconds: 86400 },
  { id: "7d", name: "Last 7 Days", seconds: 604800 },
  { id: "30d", name: "Last 30 Days", seconds: 2592000 },
  { id: "90d", name: "Last 90 Days", seconds: 7776000 },
  { id: "180d", name: "Last 180 Days", seconds: 15552000 },
  { id: "1y", name: "Last Year", seconds: 31536000 },
];

// Helper functions
export const getTimeSpanById = (id: string): TimeSpan | undefined => {
  return TIME_SPANS.find(span => span.id === id);
};

export const getTimeIntervalById = (id: string): TimeInterval | undefined => {
  return TIME_INTERVALS.find(interval => interval.id === id);
};

// Calculate time range based on selected time span
export const getTimeRange = (timeSpanId: string) => {
  const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const timeSpan = getTimeSpanById(timeSpanId);

  if (!timeSpan) {
    // Default to 30 days if not found
    return { startTime: now - 2592000, endTime: now };
  }

  return {
    startTime: now - timeSpan.seconds,
    endTime: now,
  };
};
