export type Conjugation = {
  conjugation_name: string;
  conjugated: string;
  type: string;
  tense: string;
  speechLevel: string;
  honorific: boolean;
  pronunciation: string;
  romanized: string;
  reasons: string[];
};

interface conjugator {
  verb_type(stem: string, regular?: boolean): string;
  conjugate(
    stem: string,
    regular: boolean,
    isAdj: boolean,
    honorific: boolean,
    callback: (conjugations: Conjugation[]) => void,
  ): void;
  conjugate_one(
    stem: string,
    regular: boolean,
    isAdj: boolean,
    honorific: boolean,
    conjugationName: string,
  ): Conjugation;
  getTypes(): Set<string>;
  getNames(): Set<string>;

  reasons: string[];

  // Catch-all for other functions
  [key: string]: (...args: any[]) => any;
}

export default {} as conjugator;
