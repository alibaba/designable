export type BuildStyleOptions = {
    filename: string;
    styleEntry: string;
    importCssCompilerToCssTransform?: (fileContent: string) => string;
};
export declare const buildStyle: ({ filename, styleEntry, importCssCompilerToCssTransform, }: BuildStyleOptions) => Promise<unknown>;
