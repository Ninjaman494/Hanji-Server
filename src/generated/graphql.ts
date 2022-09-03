import { Tense } from 'datasources/types';
import { SpeechLevel } from 'datasources/types';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export type BugReportResponse = {
  __typename?: 'BugReportResponse';
  message: Scalars['String'];
  success: Scalars['Boolean'];
};

export enum BugReportType {
  Bug = 'BUG',
  NewFeature = 'NEW_FEATURE',
  Other = 'OTHER'
}

export type Conjugation = {
  __typename?: 'Conjugation';
  conjugation: Scalars['String'];
  honorific: Scalars['Boolean'];
  name: Scalars['String'];
  pronunciation: Scalars['String'];
  reasons: Array<Maybe<Scalars['String']>>;
  romanization: Scalars['String'];
  speechLevel: SpeechLevel;
  tense: Tense;
  type: Scalars['String'];
};

export type DeviceInfo = {
  brand: Scalars['String'];
  manufacturer: Scalars['String'];
  model: Scalars['String'];
  sdkVersion: Scalars['String'];
  version: Scalars['String'];
};

export type Entry = {
  __typename?: 'Entry';
  antonyms?: Maybe<Array<Maybe<Scalars['String']>>>;
  definitions: Array<Maybe<Scalars['String']>>;
  examples?: Maybe<Array<Maybe<Example>>>;
  id: Scalars['ID'];
  note?: Maybe<Scalars['String']>;
  pos: Scalars['String'];
  regular?: Maybe<Scalars['Boolean']>;
  synonyms?: Maybe<Array<Maybe<Scalars['String']>>>;
  term: Scalars['String'];
};

export type EntrySuggestion = {
  __typename?: 'EntrySuggestion';
  antonyms?: Maybe<Array<Maybe<Scalars['String']>>>;
  applied: Scalars['Boolean'];
  entryID: Scalars['ID'];
  examples?: Maybe<Array<Maybe<Example>>>;
  id: Scalars['ID'];
  synonyms?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type EntrySuggestionInput = {
  antonyms?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  entryID: Scalars['ID'];
  examples?: InputMaybe<Array<InputMaybe<ExampleInput>>>;
  synonyms?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type EntrySuggestionResponse = {
  __typename?: 'EntrySuggestionResponse';
  entry?: Maybe<Entry>;
  message: Scalars['String'];
  success: Scalars['Boolean'];
  suggestion?: Maybe<EntrySuggestion>;
};

export type Example = {
  __typename?: 'Example';
  sentence: Scalars['String'];
  translation: Scalars['String'];
};

export type ExampleInput = {
  sentence: Scalars['String'];
  translation: Scalars['String'];
};

export type FavInput = {
  conjugationName: Scalars['String'];
  honorific: Scalars['Boolean'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  createEntrySuggestion: EntrySuggestionResponse;
  createSurveySubmission: BugReportResponse;
  sendBugReport: BugReportResponse;
};


export type MutationCreateEntrySuggestionArgs = {
  suggestion: EntrySuggestionInput;
};


export type MutationCreateSurveySubmissionArgs = {
  submission: Array<InputMaybe<Question>>;
};


export type MutationSendBugReportArgs = {
  deviceInfo: DeviceInfo;
  email?: InputMaybe<Scalars['String']>;
  feedback: Scalars['String'];
  image?: InputMaybe<Scalars['Upload']>;
  type: BugReportType;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  conjugationNames: Array<Maybe<Scalars['String']>>;
  conjugationTypes: Array<Maybe<Scalars['String']>>;
  conjugations: Array<Maybe<Conjugation>>;
  entries: Array<Maybe<Entry>>;
  entry?: Maybe<Entry>;
  favorites: Array<Maybe<Conjugation>>;
  search: Result;
  stems: Array<Maybe<Scalars['String']>>;
  wordOfTheDay: Entry;
};


export type QueryConjugationsArgs = {
  conjugations?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  honorific: Scalars['Boolean'];
  isAdj: Scalars['Boolean'];
  regular?: InputMaybe<Scalars['Boolean']>;
  stem: Scalars['String'];
};


export type QueryEntriesArgs = {
  term: Scalars['String'];
};


export type QueryEntryArgs = {
  id: Scalars['ID'];
};


export type QueryFavoritesArgs = {
  favorites: Array<InputMaybe<FavInput>>;
  isAdj: Scalars['Boolean'];
  regular?: InputMaybe<Scalars['Boolean']>;
  stem: Scalars['String'];
};


export type QuerySearchArgs = {
  cursor?: InputMaybe<Scalars['Int']>;
  query: Scalars['String'];
};


export type QueryStemsArgs = {
  term: Scalars['String'];
};

export type Question = {
  question: Scalars['String'];
  response?: InputMaybe<Scalars['String']>;
};

export type Result = {
  __typename?: 'Result';
  cursor?: Maybe<Scalars['String']>;
  results: Array<Maybe<Entry>>;
};

export { SpeechLevel };

export { Tense };



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BugReportResponse: ResolverTypeWrapper<BugReportResponse>;
  BugReportType: BugReportType;
  Conjugation: ResolverTypeWrapper<Conjugation>;
  DeviceInfo: DeviceInfo;
  Entry: ResolverTypeWrapper<Entry>;
  EntrySuggestion: ResolverTypeWrapper<EntrySuggestion>;
  EntrySuggestionInput: EntrySuggestionInput;
  EntrySuggestionResponse: ResolverTypeWrapper<EntrySuggestionResponse>;
  Example: ResolverTypeWrapper<Example>;
  ExampleInput: ExampleInput;
  FavInput: FavInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Question: Question;
  Result: ResolverTypeWrapper<Result>;
  SpeechLevel: SpeechLevel;
  String: ResolverTypeWrapper<Scalars['String']>;
  Tense: Tense;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  BugReportResponse: BugReportResponse;
  Conjugation: Conjugation;
  DeviceInfo: DeviceInfo;
  Entry: Entry;
  EntrySuggestion: EntrySuggestion;
  EntrySuggestionInput: EntrySuggestionInput;
  EntrySuggestionResponse: EntrySuggestionResponse;
  Example: Example;
  ExampleInput: ExampleInput;
  FavInput: FavInput;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  Query: {};
  Question: Question;
  Result: Result;
  String: Scalars['String'];
  Upload: Scalars['Upload'];
};

export type RateLimitDirectiveArgs = {
  duration?: Scalars['Int'];
  limit?: Scalars['Int'];
};

export type RateLimitDirectiveResolver<Result, Parent, ContextType = any, Args = RateLimitDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type BugReportResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['BugReportResponse'] = ResolversParentTypes['BugReportResponse']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConjugationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Conjugation'] = ResolversParentTypes['Conjugation']> = {
  conjugation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  honorific?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pronunciation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reasons?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  romanization?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  speechLevel?: Resolver<ResolversTypes['SpeechLevel'], ParentType, ContextType>;
  tense?: Resolver<ResolversTypes['Tense'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Entry'] = ResolversParentTypes['Entry']> = {
  antonyms?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  definitions?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  examples?: Resolver<Maybe<Array<Maybe<ResolversTypes['Example']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pos?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  regular?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  synonyms?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  term?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntrySuggestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['EntrySuggestion'] = ResolversParentTypes['EntrySuggestion']> = {
  antonyms?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  applied?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  entryID?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  examples?: Resolver<Maybe<Array<Maybe<ResolversTypes['Example']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  synonyms?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntrySuggestionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['EntrySuggestionResponse'] = ResolversParentTypes['EntrySuggestionResponse']> = {
  entry?: Resolver<Maybe<ResolversTypes['Entry']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  suggestion?: Resolver<Maybe<ResolversTypes['EntrySuggestion']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExampleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Example'] = ResolversParentTypes['Example']> = {
  sentence?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createEntrySuggestion?: Resolver<ResolversTypes['EntrySuggestionResponse'], ParentType, ContextType, RequireFields<MutationCreateEntrySuggestionArgs, 'suggestion'>>;
  createSurveySubmission?: Resolver<ResolversTypes['BugReportResponse'], ParentType, ContextType, RequireFields<MutationCreateSurveySubmissionArgs, 'submission'>>;
  sendBugReport?: Resolver<ResolversTypes['BugReportResponse'], ParentType, ContextType, RequireFields<MutationSendBugReportArgs, 'deviceInfo' | 'feedback' | 'type'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  conjugationNames?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  conjugationTypes?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  conjugations?: Resolver<Array<Maybe<ResolversTypes['Conjugation']>>, ParentType, ContextType, RequireFields<QueryConjugationsArgs, 'honorific' | 'isAdj' | 'stem'>>;
  entries?: Resolver<Array<Maybe<ResolversTypes['Entry']>>, ParentType, ContextType, RequireFields<QueryEntriesArgs, 'term'>>;
  entry?: Resolver<Maybe<ResolversTypes['Entry']>, ParentType, ContextType, RequireFields<QueryEntryArgs, 'id'>>;
  favorites?: Resolver<Array<Maybe<ResolversTypes['Conjugation']>>, ParentType, ContextType, RequireFields<QueryFavoritesArgs, 'favorites' | 'isAdj' | 'stem'>>;
  search?: Resolver<ResolversTypes['Result'], ParentType, ContextType, RequireFields<QuerySearchArgs, 'query'>>;
  stems?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType, RequireFields<QueryStemsArgs, 'term'>>;
  wordOfTheDay?: Resolver<ResolversTypes['Entry'], ParentType, ContextType>;
};

export type ResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['Result'] = ResolversParentTypes['Result']> = {
  cursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  results?: Resolver<Array<Maybe<ResolversTypes['Entry']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpeechLevelResolvers = EnumResolverSignature<{ FORMAL_HIGH?: any, FORMAL_LOW?: any, INFORMAL_HIGH?: any, INFORMAL_LOW?: any, NONE?: any }, ResolversTypes['SpeechLevel']>;

export type TenseResolvers = EnumResolverSignature<{ FUTURE?: any, NONE?: any, PAST?: any, PRESENT?: any }, ResolversTypes['Tense']>;

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type Resolvers<ContextType = any> = {
  BugReportResponse?: BugReportResponseResolvers<ContextType>;
  Conjugation?: ConjugationResolvers<ContextType>;
  Entry?: EntryResolvers<ContextType>;
  EntrySuggestion?: EntrySuggestionResolvers<ContextType>;
  EntrySuggestionResponse?: EntrySuggestionResponseResolvers<ContextType>;
  Example?: ExampleResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Result?: ResultResolvers<ContextType>;
  SpeechLevel?: SpeechLevelResolvers;
  Tense?: TenseResolvers;
  Upload?: GraphQLScalarType;
};

export type DirectiveResolvers<ContextType = any> = {
  rateLimit?: RateLimitDirectiveResolver<any, any, ContextType>;
};
