import type { OutputOptions, RollupOptions } from 'rollup';
export declare const getRollupBasePlugin: () => import("rollup").Plugin<any>[];
export declare const build: (rollupConfig: Omit<RollupOptions, "output"> & {
    output: OutputOptions;
}) => Promise<import("rollup").RollupOutput>;
