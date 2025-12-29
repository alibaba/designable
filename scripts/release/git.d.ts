export declare function changedPaths(sha: string): Promise<string[]>;
export declare function getSortableAllTags(): string[];
export declare function getCurrentBranch(): string;
export declare function getTaggedTime(tag: string): string;
export declare function getGithubToken(): string;
/**
 * All existing tags in the repository
 */
export declare function listTagNames(): string[];
/**
 * The latest reachable tag starting from HEAD
 */
export declare function lastTag(): string;
export declare function getPreviousTag(current: string): string;
export interface CommitListItem {
    sha: string;
    refName: string;
    summary: string;
    date: string;
    author: string;
}
export declare function parseLogMessage(commit: string): CommitListItem | null;
export declare function listCommits(from: string, to?: string): CommitListItem[];
