// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from '@graphql-mesh/utils';
import { usePersistedOperations } from '@graphql-yoga/plugin-persisted-operations';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { ZoraCoinProdTypes } from './sources/zoraCoinProd/types';
import * as importedModule$0 from "./sources/zoraCoinProd/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
};

export type Aggregation_interval =
  | 'hour'
  | 'day';

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Caller = {
  id: Scalars['Bytes']['output'];
  coinsCreated: Array<CoinCreated>;
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};


export type CallercoinsCreatedArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CoinCreated_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<CoinCreated_filter>;
};

export type Caller_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  coinsCreated_?: InputMaybe<CoinCreated_filter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Caller_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Caller_filter>>>;
};

export type Caller_orderBy =
  | 'id'
  | 'coinsCreated'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type CoinCreated = {
  id: Scalars['Bytes']['output'];
  caller: Caller;
  payoutRecipient: Scalars['Bytes']['output'];
  platformReferrer: Scalars['Bytes']['output'];
  currency: Scalars['Bytes']['output'];
  uri: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  coin: Scalars['Bytes']['output'];
  pool: Scalars['Bytes']['output'];
  version: Scalars['String']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type CoinCreated_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  caller?: InputMaybe<Scalars['String']['input']>;
  caller_not?: InputMaybe<Scalars['String']['input']>;
  caller_gt?: InputMaybe<Scalars['String']['input']>;
  caller_lt?: InputMaybe<Scalars['String']['input']>;
  caller_gte?: InputMaybe<Scalars['String']['input']>;
  caller_lte?: InputMaybe<Scalars['String']['input']>;
  caller_in?: InputMaybe<Array<Scalars['String']['input']>>;
  caller_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  caller_contains?: InputMaybe<Scalars['String']['input']>;
  caller_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_not_contains?: InputMaybe<Scalars['String']['input']>;
  caller_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_starts_with?: InputMaybe<Scalars['String']['input']>;
  caller_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  caller_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_ends_with?: InputMaybe<Scalars['String']['input']>;
  caller_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  caller_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_?: InputMaybe<Caller_filter>;
  payoutRecipient?: InputMaybe<Scalars['Bytes']['input']>;
  payoutRecipient_not?: InputMaybe<Scalars['Bytes']['input']>;
  payoutRecipient_gt?: InputMaybe<Scalars['Bytes']['input']>;
  payoutRecipient_lt?: InputMaybe<Scalars['Bytes']['input']>;
  payoutRecipient_gte?: InputMaybe<Scalars['Bytes']['input']>;
  payoutRecipient_lte?: InputMaybe<Scalars['Bytes']['input']>;
  payoutRecipient_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  payoutRecipient_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  payoutRecipient_contains?: InputMaybe<Scalars['Bytes']['input']>;
  payoutRecipient_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  platformReferrer?: InputMaybe<Scalars['Bytes']['input']>;
  platformReferrer_not?: InputMaybe<Scalars['Bytes']['input']>;
  platformReferrer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  platformReferrer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  platformReferrer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  platformReferrer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  platformReferrer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  platformReferrer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  platformReferrer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  platformReferrer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  currency?: InputMaybe<Scalars['Bytes']['input']>;
  currency_not?: InputMaybe<Scalars['Bytes']['input']>;
  currency_gt?: InputMaybe<Scalars['Bytes']['input']>;
  currency_lt?: InputMaybe<Scalars['Bytes']['input']>;
  currency_gte?: InputMaybe<Scalars['Bytes']['input']>;
  currency_lte?: InputMaybe<Scalars['Bytes']['input']>;
  currency_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  currency_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  currency_contains?: InputMaybe<Scalars['Bytes']['input']>;
  currency_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  uri?: InputMaybe<Scalars['String']['input']>;
  uri_not?: InputMaybe<Scalars['String']['input']>;
  uri_gt?: InputMaybe<Scalars['String']['input']>;
  uri_lt?: InputMaybe<Scalars['String']['input']>;
  uri_gte?: InputMaybe<Scalars['String']['input']>;
  uri_lte?: InputMaybe<Scalars['String']['input']>;
  uri_in?: InputMaybe<Array<Scalars['String']['input']>>;
  uri_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  uri_contains?: InputMaybe<Scalars['String']['input']>;
  uri_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_not_contains?: InputMaybe<Scalars['String']['input']>;
  uri_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_starts_with?: InputMaybe<Scalars['String']['input']>;
  uri_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  uri_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_ends_with?: InputMaybe<Scalars['String']['input']>;
  uri_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  uri_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  coin?: InputMaybe<Scalars['Bytes']['input']>;
  coin_not?: InputMaybe<Scalars['Bytes']['input']>;
  coin_gt?: InputMaybe<Scalars['Bytes']['input']>;
  coin_lt?: InputMaybe<Scalars['Bytes']['input']>;
  coin_gte?: InputMaybe<Scalars['Bytes']['input']>;
  coin_lte?: InputMaybe<Scalars['Bytes']['input']>;
  coin_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  coin_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  coin_contains?: InputMaybe<Scalars['Bytes']['input']>;
  coin_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pool?: InputMaybe<Scalars['Bytes']['input']>;
  pool_not?: InputMaybe<Scalars['Bytes']['input']>;
  pool_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pool_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pool_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pool_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pool_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pool_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pool_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pool_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
  version_not?: InputMaybe<Scalars['String']['input']>;
  version_gt?: InputMaybe<Scalars['String']['input']>;
  version_lt?: InputMaybe<Scalars['String']['input']>;
  version_gte?: InputMaybe<Scalars['String']['input']>;
  version_lte?: InputMaybe<Scalars['String']['input']>;
  version_in?: InputMaybe<Array<Scalars['String']['input']>>;
  version_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  version_contains?: InputMaybe<Scalars['String']['input']>;
  version_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  version_not_contains?: InputMaybe<Scalars['String']['input']>;
  version_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  version_starts_with?: InputMaybe<Scalars['String']['input']>;
  version_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  version_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version_ends_with?: InputMaybe<Scalars['String']['input']>;
  version_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  version_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<CoinCreated_filter>>>;
  or?: InputMaybe<Array<InputMaybe<CoinCreated_filter>>>;
};

export type CoinCreated_orderBy =
  | 'id'
  | 'caller'
  | 'caller__id'
  | 'caller__blockNumber'
  | 'caller__blockTimestamp'
  | 'caller__transactionHash'
  | 'payoutRecipient'
  | 'platformReferrer'
  | 'currency'
  | 'uri'
  | 'name'
  | 'symbol'
  | 'coin'
  | 'pool'
  | 'version'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type CoinCreationEvent = {
  id: Scalars['Int8']['output'];
  timestamp: Scalars['Timestamp']['output'];
  coin: Scalars['Bytes']['output'];
  caller: Scalars['Bytes']['output'];
  currency: Scalars['Bytes']['output'];
};

export type CoinCreationEvent_filter = {
  id?: InputMaybe<Scalars['Int8']['input']>;
  id_not?: InputMaybe<Scalars['Int8']['input']>;
  id_gt?: InputMaybe<Scalars['Int8']['input']>;
  id_lt?: InputMaybe<Scalars['Int8']['input']>;
  id_gte?: InputMaybe<Scalars['Int8']['input']>;
  id_lte?: InputMaybe<Scalars['Int8']['input']>;
  id_in?: InputMaybe<Array<Scalars['Int8']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Int8']['input']>>;
  timestamp?: InputMaybe<Scalars['Timestamp']['input']>;
  timestamp_not?: InputMaybe<Scalars['Timestamp']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Timestamp']['input']>;
  timestamp_lt?: InputMaybe<Scalars['Timestamp']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Timestamp']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Timestamp']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Timestamp']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Timestamp']['input']>>;
  coin?: InputMaybe<Scalars['Bytes']['input']>;
  coin_not?: InputMaybe<Scalars['Bytes']['input']>;
  coin_gt?: InputMaybe<Scalars['Bytes']['input']>;
  coin_lt?: InputMaybe<Scalars['Bytes']['input']>;
  coin_gte?: InputMaybe<Scalars['Bytes']['input']>;
  coin_lte?: InputMaybe<Scalars['Bytes']['input']>;
  coin_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  coin_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  coin_contains?: InputMaybe<Scalars['Bytes']['input']>;
  coin_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  caller?: InputMaybe<Scalars['Bytes']['input']>;
  caller_not?: InputMaybe<Scalars['Bytes']['input']>;
  caller_gt?: InputMaybe<Scalars['Bytes']['input']>;
  caller_lt?: InputMaybe<Scalars['Bytes']['input']>;
  caller_gte?: InputMaybe<Scalars['Bytes']['input']>;
  caller_lte?: InputMaybe<Scalars['Bytes']['input']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  caller_contains?: InputMaybe<Scalars['Bytes']['input']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  currency?: InputMaybe<Scalars['Bytes']['input']>;
  currency_not?: InputMaybe<Scalars['Bytes']['input']>;
  currency_gt?: InputMaybe<Scalars['Bytes']['input']>;
  currency_lt?: InputMaybe<Scalars['Bytes']['input']>;
  currency_gte?: InputMaybe<Scalars['Bytes']['input']>;
  currency_lte?: InputMaybe<Scalars['Bytes']['input']>;
  currency_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  currency_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  currency_contains?: InputMaybe<Scalars['Bytes']['input']>;
  currency_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<CoinCreationEvent_filter>>>;
  or?: InputMaybe<Array<InputMaybe<CoinCreationEvent_filter>>>;
};

export type CoinCreationEvent_orderBy =
  | 'id'
  | 'timestamp'
  | 'coin'
  | 'caller'
  | 'currency';

export type CoinCreationStats = {
  id: Scalars['Int8']['output'];
  timestamp: Scalars['Timestamp']['output'];
  coinCount: Scalars['BigInt']['output'];
  caller: Scalars['Bytes']['output'];
};

export type CoinCreationStats_filter = {
  id?: InputMaybe<Scalars['Int8']['input']>;
  id_gt?: InputMaybe<Scalars['Int8']['input']>;
  id_lt?: InputMaybe<Scalars['Int8']['input']>;
  id_gte?: InputMaybe<Scalars['Int8']['input']>;
  id_lte?: InputMaybe<Scalars['Int8']['input']>;
  id_in?: InputMaybe<Array<Scalars['Int8']['input']>>;
  timestamp?: InputMaybe<Scalars['Timestamp']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Timestamp']['input']>;
  timestamp_lt?: InputMaybe<Scalars['Timestamp']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Timestamp']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Timestamp']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Timestamp']['input']>>;
  caller?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<CoinCreationStats_filter>>>;
  or?: InputMaybe<Array<InputMaybe<CoinCreationStats_filter>>>;
};

export type Initialized = {
  id: Scalars['Bytes']['output'];
  version: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type Initialized_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  version?: InputMaybe<Scalars['BigInt']['input']>;
  version_not?: InputMaybe<Scalars['BigInt']['input']>;
  version_gt?: InputMaybe<Scalars['BigInt']['input']>;
  version_lt?: InputMaybe<Scalars['BigInt']['input']>;
  version_gte?: InputMaybe<Scalars['BigInt']['input']>;
  version_lte?: InputMaybe<Scalars['BigInt']['input']>;
  version_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  version_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Initialized_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Initialized_filter>>>;
};

export type Initialized_orderBy =
  | 'id'
  | 'version'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type OwnershipTransferred = {
  id: Scalars['Bytes']['output'];
  previousOwner: Scalars['Bytes']['output'];
  newOwner: Scalars['Bytes']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type OwnershipTransferred_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  previousOwner?: InputMaybe<Scalars['Bytes']['input']>;
  previousOwner_not?: InputMaybe<Scalars['Bytes']['input']>;
  previousOwner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  previousOwner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  previousOwner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  previousOwner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  previousOwner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  previousOwner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  previousOwner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  previousOwner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_not?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  newOwner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  newOwner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OwnershipTransferred_filter>>>;
  or?: InputMaybe<Array<InputMaybe<OwnershipTransferred_filter>>>;
};

export type OwnershipTransferred_orderBy =
  | 'id'
  | 'previousOwner'
  | 'newOwner'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type Query = {
  coinCreated?: Maybe<CoinCreated>;
  coinCreateds: Array<CoinCreated>;
  caller?: Maybe<Caller>;
  callers: Array<Caller>;
  initialized?: Maybe<Initialized>;
  initializeds: Array<Initialized>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
  upgraded?: Maybe<Upgraded>;
  upgradeds: Array<Upgraded>;
  coinCreationEvent?: Maybe<CoinCreationEvent>;
  coinCreationEvents: Array<CoinCreationEvent>;
  /** Collection of aggregated `CoinCreationStats` values */
  coinCreationStats_collection: Array<CoinCreationStats>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QuerycoinCreatedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycoinCreatedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CoinCreated_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<CoinCreated_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycallerArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycallersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Caller_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Caller_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryinitializedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryinitializedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Initialized_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Initialized_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryownershipTransferredArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryownershipTransferredsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OwnershipTransferred_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OwnershipTransferred_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryupgradedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryupgradedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Upgraded_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Upgraded_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycoinCreationEventArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycoinCreationEventsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CoinCreationEvent_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<CoinCreationEvent_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycoinCreationStats_collectionArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  interval: Aggregation_interval;
  where?: InputMaybe<CoinCreationStats_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  coinCreated?: Maybe<CoinCreated>;
  coinCreateds: Array<CoinCreated>;
  caller?: Maybe<Caller>;
  callers: Array<Caller>;
  initialized?: Maybe<Initialized>;
  initializeds: Array<Initialized>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
  upgraded?: Maybe<Upgraded>;
  upgradeds: Array<Upgraded>;
  coinCreationEvent?: Maybe<CoinCreationEvent>;
  coinCreationEvents: Array<CoinCreationEvent>;
  /** Collection of aggregated `CoinCreationStats` values */
  coinCreationStats_collection: Array<CoinCreationStats>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptioncoinCreatedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncoinCreatedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CoinCreated_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<CoinCreated_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncallerArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncallersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Caller_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Caller_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioninitializedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioninitializedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Initialized_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Initialized_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionownershipTransferredArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionownershipTransferredsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OwnershipTransferred_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OwnershipTransferred_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionupgradedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionupgradedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Upgraded_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Upgraded_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncoinCreationEventArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncoinCreationEventsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CoinCreationEvent_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<CoinCreationEvent_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncoinCreationStats_collectionArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  interval: Aggregation_interval;
  where?: InputMaybe<CoinCreationStats_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Upgraded = {
  id: Scalars['Bytes']['output'];
  implementation: Scalars['Bytes']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type Upgraded_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  implementation?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_not?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_gt?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_lt?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_gte?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_lte?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  implementation_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  implementation_contains?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Upgraded_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Upgraded_filter>>>;
};

export type Upgraded_orderBy =
  | 'id'
  | 'implementation'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
export type ResolversTypes = ResolversObject<{
  Aggregation_interval: Aggregation_interval;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']['output']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']['output']>;
  Caller: ResolverTypeWrapper<Caller>;
  Caller_filter: Caller_filter;
  Caller_orderBy: Caller_orderBy;
  CoinCreated: ResolverTypeWrapper<CoinCreated>;
  CoinCreated_filter: CoinCreated_filter;
  CoinCreated_orderBy: CoinCreated_orderBy;
  CoinCreationEvent: ResolverTypeWrapper<CoinCreationEvent>;
  CoinCreationEvent_filter: CoinCreationEvent_filter;
  CoinCreationEvent_orderBy: CoinCreationEvent_orderBy;
  CoinCreationStats: ResolverTypeWrapper<CoinCreationStats>;
  CoinCreationStats_filter: CoinCreationStats_filter;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Initialized: ResolverTypeWrapper<Initialized>;
  Initialized_filter: Initialized_filter;
  Initialized_orderBy: Initialized_orderBy;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Int8: ResolverTypeWrapper<Scalars['Int8']['output']>;
  OrderDirection: OrderDirection;
  OwnershipTransferred: ResolverTypeWrapper<OwnershipTransferred>;
  OwnershipTransferred_filter: OwnershipTransferred_filter;
  OwnershipTransferred_orderBy: OwnershipTransferred_orderBy;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']['output']>;
  Upgraded: ResolverTypeWrapper<Upgraded>;
  Upgraded_filter: Upgraded_filter;
  Upgraded_orderBy: Upgraded_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  BigDecimal: Scalars['BigDecimal']['output'];
  BigInt: Scalars['BigInt']['output'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean']['output'];
  Bytes: Scalars['Bytes']['output'];
  Caller: Caller;
  Caller_filter: Caller_filter;
  CoinCreated: CoinCreated;
  CoinCreated_filter: CoinCreated_filter;
  CoinCreationEvent: CoinCreationEvent;
  CoinCreationEvent_filter: CoinCreationEvent_filter;
  CoinCreationStats: CoinCreationStats;
  CoinCreationStats_filter: CoinCreationStats_filter;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Initialized: Initialized;
  Initialized_filter: Initialized_filter;
  Int: Scalars['Int']['output'];
  Int8: Scalars['Int8']['output'];
  OwnershipTransferred: OwnershipTransferred;
  OwnershipTransferred_filter: OwnershipTransferred_filter;
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
  Timestamp: Scalars['Timestamp']['output'];
  Upgraded: Upgraded;
  Upgraded_filter: Upgraded_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String']['input'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String']['input'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type CallerResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Caller'] = ResolversParentTypes['Caller']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  coinsCreated?: Resolver<Array<ResolversTypes['CoinCreated']>, ParentType, ContextType, RequireFields<CallercoinsCreatedArgs, 'skip' | 'first'>>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CoinCreatedResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CoinCreated'] = ResolversParentTypes['CoinCreated']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Caller'], ParentType, ContextType>;
  payoutRecipient?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  platformReferrer?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  coin?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  pool?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CoinCreationEventResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CoinCreationEvent'] = ResolversParentTypes['CoinCreationEvent']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int8'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  coin?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CoinCreationStatsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CoinCreationStats'] = ResolversParentTypes['CoinCreationStats']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int8'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  coinCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InitializedResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Initialized'] = ResolversParentTypes['Initialized']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
  name: 'Int8';
}

export type OwnershipTransferredResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['OwnershipTransferred'] = ResolversParentTypes['OwnershipTransferred']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  previousOwner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  newOwner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  coinCreated?: Resolver<Maybe<ResolversTypes['CoinCreated']>, ParentType, ContextType, RequireFields<QuerycoinCreatedArgs, 'id' | 'subgraphError'>>;
  coinCreateds?: Resolver<Array<ResolversTypes['CoinCreated']>, ParentType, ContextType, RequireFields<QuerycoinCreatedsArgs, 'skip' | 'first' | 'subgraphError'>>;
  caller?: Resolver<Maybe<ResolversTypes['Caller']>, ParentType, ContextType, RequireFields<QuerycallerArgs, 'id' | 'subgraphError'>>;
  callers?: Resolver<Array<ResolversTypes['Caller']>, ParentType, ContextType, RequireFields<QuerycallersArgs, 'skip' | 'first' | 'subgraphError'>>;
  initialized?: Resolver<Maybe<ResolversTypes['Initialized']>, ParentType, ContextType, RequireFields<QueryinitializedArgs, 'id' | 'subgraphError'>>;
  initializeds?: Resolver<Array<ResolversTypes['Initialized']>, ParentType, ContextType, RequireFields<QueryinitializedsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ownershipTransferred?: Resolver<Maybe<ResolversTypes['OwnershipTransferred']>, ParentType, ContextType, RequireFields<QueryownershipTransferredArgs, 'id' | 'subgraphError'>>;
  ownershipTransferreds?: Resolver<Array<ResolversTypes['OwnershipTransferred']>, ParentType, ContextType, RequireFields<QueryownershipTransferredsArgs, 'skip' | 'first' | 'subgraphError'>>;
  upgraded?: Resolver<Maybe<ResolversTypes['Upgraded']>, ParentType, ContextType, RequireFields<QueryupgradedArgs, 'id' | 'subgraphError'>>;
  upgradeds?: Resolver<Array<ResolversTypes['Upgraded']>, ParentType, ContextType, RequireFields<QueryupgradedsArgs, 'skip' | 'first' | 'subgraphError'>>;
  coinCreationEvent?: Resolver<Maybe<ResolversTypes['CoinCreationEvent']>, ParentType, ContextType, RequireFields<QuerycoinCreationEventArgs, 'id' | 'subgraphError'>>;
  coinCreationEvents?: Resolver<Array<ResolversTypes['CoinCreationEvent']>, ParentType, ContextType, RequireFields<QuerycoinCreationEventsArgs, 'skip' | 'first' | 'subgraphError'>>;
  coinCreationStats_collection?: Resolver<Array<ResolversTypes['CoinCreationStats']>, ParentType, ContextType, RequireFields<QuerycoinCreationStats_collectionArgs, 'skip' | 'first' | 'interval' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  coinCreated?: SubscriptionResolver<Maybe<ResolversTypes['CoinCreated']>, "coinCreated", ParentType, ContextType, RequireFields<SubscriptioncoinCreatedArgs, 'id' | 'subgraphError'>>;
  coinCreateds?: SubscriptionResolver<Array<ResolversTypes['CoinCreated']>, "coinCreateds", ParentType, ContextType, RequireFields<SubscriptioncoinCreatedsArgs, 'skip' | 'first' | 'subgraphError'>>;
  caller?: SubscriptionResolver<Maybe<ResolversTypes['Caller']>, "caller", ParentType, ContextType, RequireFields<SubscriptioncallerArgs, 'id' | 'subgraphError'>>;
  callers?: SubscriptionResolver<Array<ResolversTypes['Caller']>, "callers", ParentType, ContextType, RequireFields<SubscriptioncallersArgs, 'skip' | 'first' | 'subgraphError'>>;
  initialized?: SubscriptionResolver<Maybe<ResolversTypes['Initialized']>, "initialized", ParentType, ContextType, RequireFields<SubscriptioninitializedArgs, 'id' | 'subgraphError'>>;
  initializeds?: SubscriptionResolver<Array<ResolversTypes['Initialized']>, "initializeds", ParentType, ContextType, RequireFields<SubscriptioninitializedsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ownershipTransferred?: SubscriptionResolver<Maybe<ResolversTypes['OwnershipTransferred']>, "ownershipTransferred", ParentType, ContextType, RequireFields<SubscriptionownershipTransferredArgs, 'id' | 'subgraphError'>>;
  ownershipTransferreds?: SubscriptionResolver<Array<ResolversTypes['OwnershipTransferred']>, "ownershipTransferreds", ParentType, ContextType, RequireFields<SubscriptionownershipTransferredsArgs, 'skip' | 'first' | 'subgraphError'>>;
  upgraded?: SubscriptionResolver<Maybe<ResolversTypes['Upgraded']>, "upgraded", ParentType, ContextType, RequireFields<SubscriptionupgradedArgs, 'id' | 'subgraphError'>>;
  upgradeds?: SubscriptionResolver<Array<ResolversTypes['Upgraded']>, "upgradeds", ParentType, ContextType, RequireFields<SubscriptionupgradedsArgs, 'skip' | 'first' | 'subgraphError'>>;
  coinCreationEvent?: SubscriptionResolver<Maybe<ResolversTypes['CoinCreationEvent']>, "coinCreationEvent", ParentType, ContextType, RequireFields<SubscriptioncoinCreationEventArgs, 'id' | 'subgraphError'>>;
  coinCreationEvents?: SubscriptionResolver<Array<ResolversTypes['CoinCreationEvent']>, "coinCreationEvents", ParentType, ContextType, RequireFields<SubscriptioncoinCreationEventsArgs, 'skip' | 'first' | 'subgraphError'>>;
  coinCreationStats_collection?: SubscriptionResolver<Array<ResolversTypes['CoinCreationStats']>, "coinCreationStats_collection", ParentType, ContextType, RequireFields<SubscriptioncoinCreationStats_collectionArgs, 'skip' | 'first' | 'interval' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type UpgradedResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Upgraded'] = ResolversParentTypes['Upgraded']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  implementation?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  parentHash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Caller?: CallerResolvers<ContextType>;
  CoinCreated?: CoinCreatedResolvers<ContextType>;
  CoinCreationEvent?: CoinCreationEventResolvers<ContextType>;
  CoinCreationStats?: CoinCreationStatsResolvers<ContextType>;
  Initialized?: InitializedResolvers<ContextType>;
  Int8?: GraphQLScalarType;
  OwnershipTransferred?: OwnershipTransferredResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  Upgraded?: UpgradedResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = ZoraCoinProdTypes.Context & BaseMeshContext;


import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/zoraCoinProd/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const zoraCoinProdTransforms = [];
const additionalTypeDefs = [] as any[];
const zoraCoinProdHandler = new GraphqlHandler({
              name: "zoraCoinProd",
              config: {"endpoint":"https://gateway.thegraph.com/api/subgraphs/id/HmU5oZZCHNxv7h79G6zJjkUN916uQPXamcMrCTg9YNm6","headers":{"Authorization":"Bearer a59c3e4a7014133b6722f0e58ee7681b"}},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("zoraCoinProd"),
              logger: logger.child("zoraCoinProd"),
              importFn,
            });
sources[0] = {
          name: 'zoraCoinProd',
          handler: zoraCoinProdHandler,
          transforms: zoraCoinProdTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })
const documentHashMap = {
        "6b12642e454c695e880223787c6a301a7156469ec389e8171e464336a7441f88": GetCallerInfoDocument,
"99cab0b17613d51cfe738022a043dffa045ccf40e6e3a533c988bcc703e98f43": GetCoinCreationTimeSeriesDocument,
"4d2d2e10c1c1b1de9ed8224bd662dffcbde1adcdbeab8938b71d73b72afa717c": GetAllCoinIdsForCountDocument,
"93409d0f8cb1ee588f0d93cc0c9288b90ba330147ece25c84d3b0bcf0c0c5fee": GetDailyCoinCreationStatsDocument,
"4691ddc2e5391462ece9fe5643945f150c1a7c524fcf3b4c5810f2aa4ffded87": GetRecentCoinCreatedsDocument,
"47c953eee16b876ee1e23969fd651b76e13cb6d0356d38231f114bd89c6bdc84": GetTopCoinCreatorsDocument,
"0bd3d3de26305eb3942620fe2a7ccd22f7290b60315c0f433f9fcb98a4fd5566": GetCoinsCreatedInTimeRangeDocument,
"3106c5a3f03a5d2de6a592f75689d920784c5c3ba3a6464a680b204ea5dc485a": GetCoinDetailsDocument
      }
additionalEnvelopPlugins.push(usePersistedOperations({
        getPersistedOperation(key) {
          return documentHashMap[key];
        },
        ...{}
      }))

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      {
        document: GetCallerInfoDocument,
        get rawSDL() {
          return printWithCache(GetCallerInfoDocument);
        },
        location: 'GetCallerInfoDocument.graphql',
        sha256Hash: '6b12642e454c695e880223787c6a301a7156469ec389e8171e464336a7441f88'
      },{
        document: GetCoinCreationTimeSeriesDocument,
        get rawSDL() {
          return printWithCache(GetCoinCreationTimeSeriesDocument);
        },
        location: 'GetCoinCreationTimeSeriesDocument.graphql',
        sha256Hash: '99cab0b17613d51cfe738022a043dffa045ccf40e6e3a533c988bcc703e98f43'
      },{
        document: GetAllCoinIdsForCountDocument,
        get rawSDL() {
          return printWithCache(GetAllCoinIdsForCountDocument);
        },
        location: 'GetAllCoinIdsForCountDocument.graphql',
        sha256Hash: '4d2d2e10c1c1b1de9ed8224bd662dffcbde1adcdbeab8938b71d73b72afa717c'
      },{
        document: GetDailyCoinCreationStatsDocument,
        get rawSDL() {
          return printWithCache(GetDailyCoinCreationStatsDocument);
        },
        location: 'GetDailyCoinCreationStatsDocument.graphql',
        sha256Hash: '93409d0f8cb1ee588f0d93cc0c9288b90ba330147ece25c84d3b0bcf0c0c5fee'
      },{
        document: GetRecentCoinCreatedsDocument,
        get rawSDL() {
          return printWithCache(GetRecentCoinCreatedsDocument);
        },
        location: 'GetRecentCoinCreatedsDocument.graphql',
        sha256Hash: '4691ddc2e5391462ece9fe5643945f150c1a7c524fcf3b4c5810f2aa4ffded87'
      },{
        document: GetTopCoinCreatorsDocument,
        get rawSDL() {
          return printWithCache(GetTopCoinCreatorsDocument);
        },
        location: 'GetTopCoinCreatorsDocument.graphql',
        sha256Hash: '47c953eee16b876ee1e23969fd651b76e13cb6d0356d38231f114bd89c6bdc84'
      },{
        document: GetCoinsCreatedInTimeRangeDocument,
        get rawSDL() {
          return printWithCache(GetCoinsCreatedInTimeRangeDocument);
        },
        location: 'GetCoinsCreatedInTimeRangeDocument.graphql',
        sha256Hash: '0bd3d3de26305eb3942620fe2a7ccd22f7290b60315c0f433f9fcb98a4fd5566'
      },{
        document: GetCoinDetailsDocument,
        get rawSDL() {
          return printWithCache(GetCoinDetailsDocument);
        },
        location: 'GetCoinDetailsDocument.graphql',
        sha256Hash: '3106c5a3f03a5d2de6a592f75689d920784c5c3ba3a6464a680b204ea5dc485a'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export const pollingInterval = null;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    if (pollingInterval) {
      setInterval(() => {
        getMeshOptions()
        .then(meshOptions => getMesh(meshOptions))
        .then(newMesh =>
          meshInstance$.then(oldMesh => {
            oldMesh.destroy()
            meshInstance$ = Promise.resolve(newMesh)
          })
        ).catch(err => {
          console.error("Mesh polling failed so the existing version will be used:", err);
        });
      }, pollingInterval)
    }
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type GetAllCoinIdsForCountQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllCoinIdsForCountQuery = { coinCreateds: Array<Pick<CoinCreated, 'id'>> };

export type GetCallerInfoQueryVariables = Exact<{
  callerId: Scalars['ID']['input'];
}>;


export type GetCallerInfoQuery = { caller?: Maybe<(
    Pick<Caller, 'id' | 'blockNumber' | 'blockTimestamp' | 'transactionHash'>
    & { coinsCreated: Array<Pick<CoinCreated, 'id' | 'name' | 'symbol' | 'coin' | 'blockTimestamp'>> }
  )> };

export type GetCoinCreationTimeSeriesQueryVariables = Exact<{
  startTime?: InputMaybe<Scalars['BigInt']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCoinCreationTimeSeriesQuery = { coinCreateds: Array<Pick<CoinCreated, 'id' | 'blockTimestamp'>> };

export type GetCoinDetailsQueryVariables = Exact<{
  coinId: Scalars['ID']['input'];
}>;


export type GetCoinDetailsQuery = { coinCreated?: Maybe<(
    Pick<CoinCreated, 'id' | 'name' | 'symbol' | 'coin' | 'uri' | 'payoutRecipient' | 'platformReferrer' | 'currency' | 'pool' | 'version' | 'blockNumber' | 'blockTimestamp' | 'transactionHash'>
    & { caller: Pick<Caller, 'id' | 'blockNumber' | 'blockTimestamp'> }
  )> };

export type GetCoinsCreatedInTimeRangeQueryVariables = Exact<{
  startTime: Scalars['BigInt']['input'];
}>;


export type GetCoinsCreatedInTimeRangeQuery = { coinCreateds: Array<Pick<CoinCreated, 'id'>> };

export type GetDailyCoinCreationStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDailyCoinCreationStatsQuery = { coinCreateds: Array<Pick<CoinCreated, 'id' | 'blockTimestamp' | 'name' | 'symbol' | 'coin' | 'uri'>> };

export type GetRecentCoinCreatedsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRecentCoinCreatedsQuery = { coinCreateds: Array<(
    Pick<CoinCreated, 'id' | 'name' | 'symbol' | 'coin' | 'uri' | 'currency' | 'blockTimestamp' | 'pool' | 'payoutRecipient' | 'platformReferrer'>
    & { caller: Pick<Caller, 'id'> }
  )> };

export type GetTopCoinCreatorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTopCoinCreatorsQuery = { coinCreateds: Array<{ caller: Pick<Caller, 'id'> }> };


export const GetAllCoinIdsForCountDocument = gql`
    query GetAllCoinIdsForCount($first: Int = 1000, $skip: Int = 0) {
  coinCreateds(
    first: $first
    skip: $skip
    orderBy: blockTimestamp
    orderDirection: asc
  ) {
    id
  }
}
    ` as unknown as DocumentNode<GetAllCoinIdsForCountQuery, GetAllCoinIdsForCountQueryVariables>;
export const GetCallerInfoDocument = gql`
    query GetCallerInfo($callerId: ID!) {
  caller(id: $callerId) {
    id
    coinsCreated(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      id
      name
      symbol
      coin
      blockTimestamp
    }
    blockNumber
    blockTimestamp
    transactionHash
  }
}
    ` as unknown as DocumentNode<GetCallerInfoQuery, GetCallerInfoQueryVariables>;
export const GetCoinCreationTimeSeriesDocument = gql`
    query GetCoinCreationTimeSeries($startTime: BigInt, $first: Int = 1000) {
  coinCreateds(
    first: $first
    orderBy: blockTimestamp
    orderDirection: asc
    where: {blockTimestamp_gte: $startTime}
  ) {
    id
    blockTimestamp
  }
}
    ` as unknown as DocumentNode<GetCoinCreationTimeSeriesQuery, GetCoinCreationTimeSeriesQueryVariables>;
export const GetCoinDetailsDocument = gql`
    query GetCoinDetails($coinId: ID!) {
  coinCreated(id: $coinId) {
    id
    name
    symbol
    coin
    uri
    payoutRecipient
    platformReferrer
    currency
    pool
    version
    caller {
      id
      blockNumber
      blockTimestamp
    }
    blockNumber
    blockTimestamp
    transactionHash
  }
}
    ` as unknown as DocumentNode<GetCoinDetailsQuery, GetCoinDetailsQueryVariables>;
export const GetCoinsCreatedInTimeRangeDocument = gql`
    query GetCoinsCreatedInTimeRange($startTime: BigInt!) {
  coinCreateds(
    where: {blockTimestamp_gte: $startTime}
    orderBy: blockTimestamp
    orderDirection: desc
    first: 1000
  ) {
    id
  }
}
    ` as unknown as DocumentNode<GetCoinsCreatedInTimeRangeQuery, GetCoinsCreatedInTimeRangeQueryVariables>;
export const GetDailyCoinCreationStatsDocument = gql`
    query GetDailyCoinCreationStats {
  coinCreateds(orderBy: blockTimestamp, orderDirection: desc, first: 10) {
    id
    blockTimestamp
    name
    symbol
    coin
    uri
  }
}
    ` as unknown as DocumentNode<GetDailyCoinCreationStatsQuery, GetDailyCoinCreationStatsQueryVariables>;
export const GetRecentCoinCreatedsDocument = gql`
    query GetRecentCoinCreateds($first: Int = 5) {
  coinCreateds(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
    id
    name
    symbol
    coin
    uri
    currency
    caller {
      id
    }
    blockTimestamp
    pool
    payoutRecipient
    platformReferrer
  }
}
    ` as unknown as DocumentNode<GetRecentCoinCreatedsQuery, GetRecentCoinCreatedsQueryVariables>;
export const GetTopCoinCreatorsDocument = gql`
    query GetTopCoinCreators {
  coinCreateds(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
    caller {
      id
    }
  }
}
    ` as unknown as DocumentNode<GetTopCoinCreatorsQuery, GetTopCoinCreatorsQueryVariables>;









export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    GetAllCoinIdsForCount(variables?: GetAllCoinIdsForCountQueryVariables, options?: C): Promise<GetAllCoinIdsForCountQuery> {
      return requester<GetAllCoinIdsForCountQuery, GetAllCoinIdsForCountQueryVariables>(GetAllCoinIdsForCountDocument, variables, options) as Promise<GetAllCoinIdsForCountQuery>;
    },
    GetCallerInfo(variables: GetCallerInfoQueryVariables, options?: C): Promise<GetCallerInfoQuery> {
      return requester<GetCallerInfoQuery, GetCallerInfoQueryVariables>(GetCallerInfoDocument, variables, options) as Promise<GetCallerInfoQuery>;
    },
    GetCoinCreationTimeSeries(variables?: GetCoinCreationTimeSeriesQueryVariables, options?: C): Promise<GetCoinCreationTimeSeriesQuery> {
      return requester<GetCoinCreationTimeSeriesQuery, GetCoinCreationTimeSeriesQueryVariables>(GetCoinCreationTimeSeriesDocument, variables, options) as Promise<GetCoinCreationTimeSeriesQuery>;
    },
    GetCoinDetails(variables: GetCoinDetailsQueryVariables, options?: C): Promise<GetCoinDetailsQuery> {
      return requester<GetCoinDetailsQuery, GetCoinDetailsQueryVariables>(GetCoinDetailsDocument, variables, options) as Promise<GetCoinDetailsQuery>;
    },
    GetCoinsCreatedInTimeRange(variables: GetCoinsCreatedInTimeRangeQueryVariables, options?: C): Promise<GetCoinsCreatedInTimeRangeQuery> {
      return requester<GetCoinsCreatedInTimeRangeQuery, GetCoinsCreatedInTimeRangeQueryVariables>(GetCoinsCreatedInTimeRangeDocument, variables, options) as Promise<GetCoinsCreatedInTimeRangeQuery>;
    },
    GetDailyCoinCreationStats(variables?: GetDailyCoinCreationStatsQueryVariables, options?: C): Promise<GetDailyCoinCreationStatsQuery> {
      return requester<GetDailyCoinCreationStatsQuery, GetDailyCoinCreationStatsQueryVariables>(GetDailyCoinCreationStatsDocument, variables, options) as Promise<GetDailyCoinCreationStatsQuery>;
    },
    GetRecentCoinCreateds(variables?: GetRecentCoinCreatedsQueryVariables, options?: C): Promise<GetRecentCoinCreatedsQuery> {
      return requester<GetRecentCoinCreatedsQuery, GetRecentCoinCreatedsQueryVariables>(GetRecentCoinCreatedsDocument, variables, options) as Promise<GetRecentCoinCreatedsQuery>;
    },
    GetTopCoinCreators(variables?: GetTopCoinCreatorsQueryVariables, options?: C): Promise<GetTopCoinCreatorsQuery> {
      return requester<GetTopCoinCreatorsQuery, GetTopCoinCreatorsQueryVariables>(GetTopCoinCreatorsDocument, variables, options) as Promise<GetTopCoinCreatorsQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;