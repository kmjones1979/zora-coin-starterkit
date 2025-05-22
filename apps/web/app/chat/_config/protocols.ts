// Define protocol types
export type ProtocolId = "uniswap_v2" | "uniswap_v3" | string;

// Protocol interface
export interface Protocol {
  id: ProtocolId;
  name: string;
  description?: string;
  icon?: string;
  url?: string;
}

// Define supported protocols
export const PROTOCOLS: Protocol[] = [
  { id: "uniswap_v2", name: "Uniswap V2" },
  { id: "uniswap_v3", name: "Uniswap V3" },
];

// Helper functions for protocols
export const getProtocolById = (id: ProtocolId): Protocol | undefined => {
  return PROTOCOLS.find(protocol => protocol.id === id);
};

export const getProtocolName = (id: ProtocolId): string => {
  return getProtocolById(id)?.name || id;
};

export const formatProtocolDisplay = (protocolId: ProtocolId): string => {
  return getProtocolName(protocolId);
};
