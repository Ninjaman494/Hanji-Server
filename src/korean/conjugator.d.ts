export type Conjugation = {
  conjugation_name: string;
  conjugated: string;
  infinitive: string;
  type: string;
  tense: string;
  speechLevel: string;
  honorific: boolean;
  pronunciation: string;
  romanized: string;
  reasons: string[];
};

interface conjugator {
  verb_type(infinitive: string, regular?: boolean): string;
  conjugate(
    infinitive: string,
    regular: boolean,
    isAdj: boolean,
    honorific: boolean,
    callback: (conjugations: Conjugation[]) => void,
  ): void;
  conjugate_one(
    infinitive: string,
    regular: boolean,
    isAdj: boolean,
    honorific: boolean,
    conjugationName: string,
  ): Conjugation | null;
  getTypes(): Set<string>;
  getNames(): Set<string>;

  reasons: string[];

  // Catch-all for other functions
  [key: string]: (...args: any[]) => any;
}

export default {} as conjugator;
