export type FormationSlot = {
  slot: string;
  x: number;
  y: number;
};

export type FormationTemplates = Record<string, FormationSlot[]>;

const spreadAcross = (count: number, y: number, prefix: string) => {
  if (count <= 0) return [];
  const padding = 12;
  const span = 100 - padding * 2;
  const step = count > 1 ? span / (count - 1) : 0;
  return Array.from({ length: count }, (_, idx) => ({
    slot: `${prefix}${idx + 1}`,
    x: padding + idx * step,
    y,
  }));
};

export const formationTemplates: FormationTemplates = {
  "4-3-3": [
    { slot: "GK", x: 50, y: 92 },
    { slot: "LB", x: 18, y: 78 },
    { slot: "LCB", x: 38, y: 74 },
    { slot: "RCB", x: 62, y: 74 },
    { slot: "RB", x: 82, y: 78 },
    { slot: "LCM", x: 32, y: 56 },
    { slot: "CM", x: 50, y: 52 },
    { slot: "RCM", x: 68, y: 56 },
    { slot: "LW", x: 22, y: 32 },
    { slot: "ST", x: 50, y: 26 },
    { slot: "RW", x: 78, y: 32 },
  ],
  "4-2-3-1": [
    { slot: "GK", x: 50, y: 92 },
    { slot: "LB", x: 18, y: 78 },
    { slot: "LCB", x: 38, y: 74 },
    { slot: "RCB", x: 62, y: 74 },
    { slot: "RB", x: 82, y: 78 },
    { slot: "LDM", x: 35, y: 62 },
    { slot: "RDM", x: 65, y: 62 },
    { slot: "LAM", x: 30, y: 46 },
    { slot: "CAM", x: 50, y: 42 },
    { slot: "RAM", x: 70, y: 46 },
    { slot: "ST", x: 50, y: 26 },
  ],
  "4-4-2": [
    { slot: "GK", x: 50, y: 92 },
    { slot: "LB", x: 18, y: 78 },
    { slot: "LCB", x: 38, y: 74 },
    { slot: "RCB", x: 62, y: 74 },
    { slot: "RB", x: 82, y: 78 },
    { slot: "LM", x: 24, y: 54 },
    { slot: "LCM", x: 44, y: 56 },
    { slot: "RCM", x: 56, y: 56 },
    { slot: "RM", x: 76, y: 54 },
    { slot: "LS", x: 44, y: 30 },
    { slot: "RS", x: 56, y: 30 },
  ],
  "3-5-2": [
    { slot: "GK", x: 50, y: 92 },
    { slot: "LCB", x: 35, y: 78 },
    { slot: "CB", x: 50, y: 74 },
    { slot: "RCB", x: 65, y: 78 },
    { slot: "LWB", x: 26, y: 58 },
    { slot: "LDM", x: 40, y: 54 },
    { slot: "CM", x: 50, y: 50 },
    { slot: "RDM", x: 60, y: 54 },
    { slot: "RWB", x: 74, y: 58 },
    { slot: "LS", x: 44, y: 30 },
    { slot: "RS", x: 56, y: 30 },
  ],
  "3-4-3": [
    { slot: "GK", x: 50, y: 92 },
    { slot: "LCB", x: 36, y: 78 },
    { slot: "CB", x: 50, y: 74 },
    { slot: "RCB", x: 64, y: 78 },
    { slot: "LWB", x: 30, y: 58 },
    { slot: "LCM", x: 44, y: 54 },
    { slot: "RCM", x: 56, y: 54 },
    { slot: "RWB", x: 70, y: 58 },
    { slot: "LW", x: 34, y: 34 },
    { slot: "ST", x: 50, y: 26 },
    { slot: "RW", x: 66, y: 34 },
  ],
};

export const buildFallbackTemplate = (count: number): FormationSlot[] => {
  const layout = [
    { count: 1, y: 90, prefix: "GK" },
    { count: 4, y: 72, prefix: "DEF" },
    { count: 3, y: 54, prefix: "MID" },
    { count: 3, y: 36, prefix: "ATT" },
  ];

  const slots: FormationSlot[] = [];
  layout.forEach((row) => {
    spreadAcross(row.count, row.y, row.prefix).forEach((slot) =>
      slots.push(slot),
    );
  });

  // Add an extra high line if more slots are needed
  let extraRow = 1;
  while (slots.length < count) {
    const extra = spreadAcross(3, 18 - extraRow * 4, `EX${extraRow}-`);
    extra.forEach((slot) => slots.push(slot));
    extraRow += 1;
  }

  return slots.slice(0, count);
};

export const normalizeFormation = (formation?: string) =>
  formation?.trim().replace(/\s+/g, "") ?? "";
