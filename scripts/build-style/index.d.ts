import { runCopy, type CopyBaseOptions } from './copy.js';
export declare function build({ allStylesOutputFile, ...opts }: CopyBaseOptions & {
    allStylesOutputFile: string;
}): Promise<[void, unknown]>;
export { runCopy };
