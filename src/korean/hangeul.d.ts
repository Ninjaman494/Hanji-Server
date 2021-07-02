import { boolean, string } from "casual";

export declare class Geulja extends String {
  length: number;
  hidden_padchim?: boolean;
  original_padchim?: string;
  public charAt(i:number): Geulja;
}

export declare const is_hangeul = (character: string) => boolean;
export declare const is_hangeul_string = (string: string) => boolean;
export declare const lead = (character: string | Geulja) => string;
export declare const vowel = (character: string | Geulja) => string;
export declare const padchim = (character: string | Geulja) => string;
export declare const join = (lead: string, vowel: string, padchim?: string) => string;
export declare const split = (geulja:any) => [string];
export declare const spread = (string: string) => string;
export declare const find_vowel_to_append = (string: string) => string;
export declare const match = (character: string, l:string, v:string, p?:string) => boolean;
