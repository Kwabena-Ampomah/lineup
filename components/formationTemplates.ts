export type FormationSlot = {
  slot: string;
  x: number;
  y: number;
  row?: number;
};

export type FormationTemplates = Record<string, FormationSlot[]>;

// Helper to spread players evenly across a row
const spreadAcross = (
  count: number,
  y: number,
  prefix: string,
  row?: number
): FormationSlot[] => {
  if (count <= 0) return [];
  const padding = count === 1 ? 50 : 15;
  const span = 100 - padding * 2;
  const step = count > 1 ? span / (count - 1) : 0;

  return Array.from({ length: count }, (_, idx) => ({
    slot: `${prefix}${idx + 1}`,
    x: count === 1 ? 50 : padding + idx * step,
    y,
    row,
  }));
};

// Generate formation from formation string (e.g., "4-3-3", "4-2-3-1")
export function generateFormationPositions(formation: string): FormationSlot[] {
  const parts = formation.split("-").map((p) => parseInt(p, 10));
  if (parts.some(isNaN) || parts.length < 2) return [];

  const slots: FormationSlot[] = [];

  // Goalkeeper always at the back
  slots.push({ slot: "GK", x: 50, y: 92, row: 0 });

  // Calculate Y positions for each row
  const yStart = 76; // Defense line
  const yEnd = 26; // Attack line
  const yStep = (yStart - yEnd) / (parts.length - 1);

  const prefixes = ["DEF", "MID", "MID2", "AM", "FWD"];

  parts.forEach((count, idx) => {
    const y = yStart - idx * yStep;
    const prefix = prefixes[idx] || `ROW${idx}`;
    const rowSlots = spreadAcross(count, y, prefix, idx + 1);
    slots.push(...rowSlots);
  });

  return slots;
}

// Predefined formations with carefully positioned slots
export const formationTemplates: FormationTemplates = {
  "4-3-3": [
    { slot: "GK", x: 50, y: 92, row: 0 },
    { slot: "LB", x: 15, y: 76, row: 1 },
    { slot: "LCB", x: 38, y: 78, row: 1 },
    { slot: "RCB", x: 62, y: 78, row: 1 },
    { slot: "RB", x: 85, y: 76, row: 1 },
    { slot: "LCM", x: 30, y: 54, row: 2 },
    { slot: "CDM", x: 50, y: 56, row: 2 },
    { slot: "RCM", x: 70, y: 54, row: 2 },
    { slot: "LW", x: 20, y: 30, row: 3 },
    { slot: "ST", x: 50, y: 26, row: 3 },
    { slot: "RW", x: 80, y: 30, row: 3 },
  ],
  "4-4-2": [
    { slot: "GK", x: 50, y: 92, row: 0 },
    { slot: "LB", x: 15, y: 76, row: 1 },
    { slot: "LCB", x: 38, y: 78, row: 1 },
    { slot: "RCB", x: 62, y: 78, row: 1 },
    { slot: "RB", x: 85, y: 76, row: 1 },
    { slot: "LM", x: 18, y: 52, row: 2 },
    { slot: "LCM", x: 40, y: 54, row: 2 },
    { slot: "RCM", x: 60, y: 54, row: 2 },
    { slot: "RM", x: 82, y: 52, row: 2 },
    { slot: "LST", x: 40, y: 28, row: 3 },
    { slot: "RST", x: 60, y: 28, row: 3 },
  ],
  "4-2-3-1": [
    { slot: "GK", x: 50, y: 92, row: 0 },
    { slot: "LB", x: 15, y: 76, row: 1 },
    { slot: "LCB", x: 38, y: 78, row: 1 },
    { slot: "RCB", x: 62, y: 78, row: 1 },
    { slot: "RB", x: 85, y: 76, row: 1 },
    { slot: "LDM", x: 38, y: 62, row: 2 },
    { slot: "RDM", x: 62, y: 62, row: 2 },
    { slot: "LAM", x: 22, y: 42, row: 3 },
    { slot: "CAM", x: 50, y: 40, row: 3 },
    { slot: "RAM", x: 78, y: 42, row: 3 },
    { slot: "ST", x: 50, y: 24, row: 4 },
  ],
  "3-5-2": [
    { slot: "GK", x: 50, y: 92, row: 0 },
    { slot: "LCB", x: 30, y: 78, row: 1 },
    { slot: "CB", x: 50, y: 80, row: 1 },
    { slot: "RCB", x: 70, y: 78, row: 1 },
    { slot: "LWB", x: 12, y: 56, row: 2 },
    { slot: "LCM", x: 35, y: 54, row: 2 },
    { slot: "CDM", x: 50, y: 58, row: 2 },
    { slot: "RCM", x: 65, y: 54, row: 2 },
    { slot: "RWB", x: 88, y: 56, row: 2 },
    { slot: "LST", x: 40, y: 28, row: 3 },
    { slot: "RST", x: 60, y: 28, row: 3 },
  ],
  "3-4-3": [
    { slot: "GK", x: 50, y: 92, row: 0 },
    { slot: "LCB", x: 30, y: 78, row: 1 },
    { slot: "CB", x: 50, y: 80, row: 1 },
    { slot: "RCB", x: 70, y: 78, row: 1 },
    { slot: "LWB", x: 15, y: 55, row: 2 },
    { slot: "LCM", x: 40, y: 54, row: 2 },
    { slot: "RCM", x: 60, y: 54, row: 2 },
    { slot: "RWB", x: 85, y: 55, row: 2 },
    { slot: "LW", x: 25, y: 30, row: 3 },
    { slot: "ST", x: 50, y: 25, row: 3 },
    { slot: "RW", x: 75, y: 30, row: 3 },
  ],
  "5-3-2": [
    { slot: "GK", x: 50, y: 92, row: 0 },
    { slot: "LWB", x: 10, y: 72, row: 1 },
    { slot: "LCB", x: 30, y: 78, row: 1 },
    { slot: "CB", x: 50, y: 80, row: 1 },
    { slot: "RCB", x: 70, y: 78, row: 1 },
    { slot: "RWB", x: 90, y: 72, row: 1 },
    { slot: "LCM", x: 30, y: 52, row: 2 },
    { slot: "CDM", x: 50, y: 55, row: 2 },
    { slot: "RCM", x: 70, y: 52, row: 2 },
    { slot: "LST", x: 40, y: 28, row: 3 },
    { slot: "RST", x: 60, y: 28, row: 3 },
  ],
  "4-1-4-1": [
    { slot: "GK", x: 50, y: 92, row: 0 },
    { slot: "LB", x: 15, y: 76, row: 1 },
    { slot: "LCB", x: 38, y: 78, row: 1 },
    { slot: "RCB", x: 62, y: 78, row: 1 },
    { slot: "RB", x: 85, y: 76, row: 1 },
    { slot: "CDM", x: 50, y: 62, row: 2 },
    { slot: "LM", x: 18, y: 45, row: 3 },
    { slot: "LCM", x: 40, y: 48, row: 3 },
    { slot: "RCM", x: 60, y: 48, row: 3 },
    { slot: "RM", x: 82, y: 45, row: 3 },
    { slot: "ST", x: 50, y: 25, row: 4 },
  ],
  "4-3-1-2": [
    { slot: "GK", x: 50, y: 92, row: 0 },
    { slot: "LB", x: 15, y: 76, row: 1 },
    { slot: "LCB", x: 38, y: 78, row: 1 },
    { slot: "RCB", x: 62, y: 78, row: 1 },
    { slot: "RB", x: 85, y: 76, row: 1 },
    { slot: "LCM", x: 30, y: 58, row: 2 },
    { slot: "CDM", x: 50, y: 60, row: 2 },
    { slot: "RCM", x: 70, y: 58, row: 2 },
    { slot: "CAM", x: 50, y: 42, row: 3 },
    { slot: "LST", x: 40, y: 26, row: 4 },
    { slot: "RST", x: 60, y: 26, row: 4 },
  ],
  "5-4-1": [
    { slot: "GK", x: 50, y: 92, row: 0 },
    { slot: "LWB", x: 10, y: 72, row: 1 },
    { slot: "LCB", x: 30, y: 78, row: 1 },
    { slot: "CB", x: 50, y: 80, row: 1 },
    { slot: "RCB", x: 70, y: 78, row: 1 },
    { slot: "RWB", x: 90, y: 72, row: 1 },
    { slot: "LM", x: 18, y: 50, row: 2 },
    { slot: "LCM", x: 40, y: 52, row: 2 },
    { slot: "RCM", x: 60, y: 52, row: 2 },
    { slot: "RM", x: 82, y: 50, row: 2 },
    { slot: "ST", x: 50, y: 26, row: 3 },
  ],
  "4-4-1-1": [
    { slot: "GK", x: 50, y: 92, row: 0 },
    { slot: "LB", x: 15, y: 76, row: 1 },
    { slot: "LCB", x: 38, y: 78, row: 1 },
    { slot: "RCB", x: 62, y: 78, row: 1 },
    { slot: "RB", x: 85, y: 76, row: 1 },
    { slot: "LM", x: 18, y: 55, row: 2 },
    { slot: "LCM", x: 40, y: 57, row: 2 },
    { slot: "RCM", x: 60, y: 57, row: 2 },
    { slot: "RM", x: 82, y: 55, row: 2 },
    { slot: "CAM", x: 50, y: 38, row: 3 },
    { slot: "ST", x: 50, y: 24, row: 4 },
  ],
  "4-5-1": [
    { slot: "GK", x: 50, y: 92, row: 0 },
    { slot: "LB", x: 15, y: 76, row: 1 },
    { slot: "LCB", x: 38, y: 78, row: 1 },
    { slot: "RCB", x: 62, y: 78, row: 1 },
    { slot: "RB", x: 85, y: 76, row: 1 },
    { slot: "LM", x: 15, y: 52, row: 2 },
    { slot: "LCM", x: 35, y: 54, row: 2 },
    { slot: "CDM", x: 50, y: 56, row: 2 },
    { slot: "RCM", x: 65, y: 54, row: 2 },
    { slot: "RM", x: 85, y: 52, row: 2 },
    { slot: "ST", x: 50, y: 26, row: 3 },
  ],
};

export const buildFallbackTemplate = (count: number): FormationSlot[] => {
  // Default 4-3-3-ish layout
  const layout = [
    { count: 1, y: 92, prefix: "GK", row: 0 },
    { count: 4, y: 76, prefix: "DEF", row: 1 },
    { count: 3, y: 52, prefix: "MID", row: 2 },
    { count: 3, y: 28, prefix: "FWD", row: 3 },
  ];

  const slots: FormationSlot[] = [];
  let remaining = count;

  for (const row of layout) {
    if (remaining <= 0) break;
    const actualCount = Math.min(row.count, remaining);
    slots.push(...spreadAcross(actualCount, row.y, row.prefix, row.row));
    remaining -= actualCount;
  }

  // Extra rows for more players
  let extraRow = 4;
  while (remaining > 0) {
    const actualCount = Math.min(3, remaining);
    slots.push(
      ...spreadAcross(actualCount, 18 - (extraRow - 4) * 6, `EX${extraRow}`, extraRow)
    );
    remaining -= actualCount;
    extraRow++;
  }

  return slots;
};

export const normalizeFormation = (formation?: string): string => {
  if (!formation) return "";
  return formation.trim().replace(/\s+/g, "");
};

export const getFormationTemplate = (formation: string): FormationSlot[] => {
  const normalized = normalizeFormation(formation);

  // Check predefined templates first
  if (formationTemplates[normalized]) {
    return [...formationTemplates[normalized]];
  }

  // Try to generate from formation string
  const generated = generateFormationPositions(normalized);
  if (generated.length >= 10) {
    return generated;
  }

  // Fall back to default
  return buildFallbackTemplate(11);
};
