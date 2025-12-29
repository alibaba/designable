export type CopyBaseOptions = Record<'esStr' | 'libStr', string>;
export declare const runCopy: ({ resolveForItem, ...lastOpts }: CopyBaseOptions & {
    resolveForItem?: (filename: string) => unknown;
}) => Promise<unknown>;
