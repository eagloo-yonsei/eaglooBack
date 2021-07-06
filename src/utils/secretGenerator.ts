import { adjs, nouns } from "./words";

export function secretGenerator(): string {
    const ranAdj = adjs[Math.floor(Math.random() * adjs.length)];
    const ranNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${ranAdj} ${ranNoun}`;
}
