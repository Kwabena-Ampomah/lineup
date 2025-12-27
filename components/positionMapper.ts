const mapping: Record<string, string[]> = {
  GK: ["GK"],
  GOALKEEPER: ["GK"],
  G: ["GK"],
  LB: ["LB", "LWB"],
  LEFTBACK: ["LB", "LWB"],
  LWB: ["LWB", "LB"],
  RB: ["RB", "RWB"],
  RIGHTBACK: ["RB", "RWB"],
  RWB: ["RWB", "RB"],
  CB: ["LCB", "RCB", "CB"],
  CENTERBACK: ["LCB", "RCB", "CB"],
  LCB: ["LCB", "CB"],
  RCB: ["RCB", "CB"],
  SW: ["CB", "LCB", "RCB"],
  DM: ["CDM", "LDM", "RDM"],
  CDM: ["CDM", "LDM", "RDM"],
  LDM: ["LDM", "CDM"],
  RDM: ["RDM", "CDM"],
  CM: ["CM", "LCM", "RCM"],
  LCM: ["LCM", "CM"],
  RCM: ["RCM", "CM"],
  AM: ["CAM", "LAM", "RAM"],
  CAM: ["CAM", "LAM", "RAM"],
  LAM: ["LAM", "LW"],
  RAM: ["RAM", "RW"],
  LM: ["LM", "LAM"],
  RM: ["RM", "RAM"],
  LW: ["LW", "LAM"],
  RW: ["RW", "RAM"],
  CF: ["ST", "CF"],
  FW: ["ST", "CF"],
  F: ["ST", "CF"],
  ST: ["ST", "CF"],
  STRIKER: ["ST", "CF"],
  SS: ["SS", "ST", "CF"],
  LS: ["LS", "ST", "CF"],
  RS: ["RS", "ST", "CF"],
};

const broadMapping: Record<string, string[]> = {
  DEFENDER: ["LB", "RB", "LCB", "RCB", "CB"],
  MIDFIELDER: ["CM", "LCM", "RCM", "CDM", "CAM"],
  ATTACKER: ["ST", "CF", "SS", "LW", "RW"],
  FORWARD: ["ST", "CF", "LW", "RW"],
};

export const mapPositionToSlots = (position?: string) => {
  if (!position) return [] as string[];
  const key = position.toUpperCase().replace(/[^A-Z]/g, "");
  if (mapping[key]) return mapping[key];
  if (broadMapping[key]) return broadMapping[key];
  return [];
};
