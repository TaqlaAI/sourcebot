'use client';

import { SearchResultFile } from "@/lib/types";
import { FileMatchContainer } from "./fileMatchContainer";

interface SearchResultsPanelProps {
    fileMatches: SearchResultFile[];
    onOpenFileMatch: (fileMatch: SearchResultFile) => void;
    onMatchIndexChanged: (matchIndex: number) => void;
}

export const SearchResultsPanel = ({
    fileMatches,
    onOpenFileMatch,
    onMatchIndexChanged,
}: SearchResultsPanelProps) => {
    return fileMatches.map((fileMatch, index) => (
        <FileMatchContainer
            key={index}
            file={fileMatch}
            onOpenFile={() => {
                onOpenFileMatch(fileMatch);
            }}
            onMatchIndexChanged={(matchIndex) => {
                onMatchIndexChanged(matchIndex);
            }}
        />
    ))
}