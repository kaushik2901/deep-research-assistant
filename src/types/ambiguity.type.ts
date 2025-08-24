export default interface Ambiguity {
  isAmbiguousQuery: boolean;
  ambiguityReason: string;
  criticalAmbiguities: string[];
  confidence: number;
}
