import { chargedParticle } from '../sims/chargedParticle';
import { SimDefinition } from '../core/types';

export const simRegistry: SimDefinition<any>[] = [chargedParticle];

export const getSim = (id: string) => simRegistry.find((s) => s.id === id);
