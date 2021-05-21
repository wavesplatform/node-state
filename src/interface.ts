import {TransactionMap, WithId} from '@waves/ts-types';

export type TLong = string | number;

export interface IState<ASSETS extends Record<string, IAsset>, ACCOUNTS extends Record<string, IAccount<ASSETS>>> {
    ASSETS?: ASSETS;
    ACCOUNTS?: ACCOUNTS;
}

export interface IAccount<ASSETS extends Record<string, IAsset>> {
    seed?: string | undefined;
    script?: boolean | string | undefined;
    alias?: boolean | string | undefined;
    balance?: { [Key in keyof ASSETS]?: number };
    data?: Record<string, { value: string | boolean | number, type: 'string' | 'boolean' | 'number' | 'binary' }>
}

export interface IAsset {
    name: string;
    quantity?: number | undefined;
    decimals?: number | undefined;
    description?: string;
    reissuable?: boolean;
    script?: boolean | string | undefined;
    owner?: string;
    sponsorship?: boolean;
}

export type TAssetsResponse<ASSETS extends Record<string, IAsset>> = { [Key in keyof ASSETS]: TransactionMap<TLong>[3] & WithId };
export type TAccountsResponse<ASSETS extends Record<string, IAsset>, ACCOUNTS extends Record<string, IAccount<ASSETS>>> = {
    [Key in keyof ACCOUNTS]: {
        seed: string;
        alias: TReturnAlias<ACCOUNTS[Key]['alias']>;
        address: string;
        publicKey: string;
        scripted: boolean;
    }
}
export type TReturnAlias<T> = T extends string ? string : T extends boolean ? string : never;

export type TRespinse<ASSETS extends Record<string, IAsset>, ACCOUNTS extends Record<string, IAccount<ASSETS>>> = {
    ACCOUNTS: TAccountsResponse<ASSETS, ACCOUNTS>;
    ASSETS: TAssetsResponse<ASSETS>;
}
