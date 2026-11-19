import { Vec3 } from './vec3';

export type Topic =
  | 'Mechanics'
  | 'Electromagnetism'
  | 'Waves and Optics'
  | 'Thermal'
  | 'Modern Physics'
  | 'Math';

export type Level = 'G12' | 'Y1' | 'Y2' | 'Y3' | 'Y4';

export interface ParamDef {
  name: string;
  symbol: string;
  unit: string;
  min: number;
  max: number;
  default: number;
  step?: number;
  log?: boolean;
}

export interface VectorToggle {
  id: string;
  label: string;
  colorVar: string; // e.g. '--q-force'
}

export interface SimDefinition<TState = unknown> {
  id: string;
  title: string;
  topic: Topic;
  levels: Level[];
  params: ParamDef[];
  initState: (params: Record<string, number>) => TState;
  step: (state: TState, params: Record<string, number>, dt: number) => TState;
  Scene: React.ComponentType<{ state: TState; params: Record<string, number> }>;
  equations: (state: TState, params: Record<string, number>) => {
    symbolic: string;
    substituted: string;
    result: string;
  }[];
  graphs: (state: TState, params: Record<string, number>) => {
    label: string;
    data: { x: number[]; y: number[] };
  }[];
  vectorToggles: VectorToggle[];
  predictionPrompts: { question: string; answer: string }[];
  depthLevels: {
    intuition: string;
    equation: string;
    derivation?: string;
    advanced?: string;
  };
}
