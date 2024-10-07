/* eslint-disable @typescript-eslint/no-empty-object-type */

export type PosthogEventMap = {
    search_finished: {
        contentBytesLoaded: number,
        indexBytesLoaded: number,
        crashes: number,
        durationMs: number,
        fileCount: number,
        shardFilesConsidered: number,
        filesConsidered: number,
        filesLoaded: number,
        filesSkipped: number,
        shardsScanned: number,
        shardsSkipped: number,
        shardsSkippedFilter: number,
        matchCount: number,
        ngramMatches: number,
        ngramLookups: number,
        wait: number,
        matchTreeConstruction: number,
        matchTreeSearch: number,
        regexpsConsidered: number,
        flushReason: number,
        fileLanguages: string[]
    }
}

export type PosthogEvent = keyof PosthogEventMap;