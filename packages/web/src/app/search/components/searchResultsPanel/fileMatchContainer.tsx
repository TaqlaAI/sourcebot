'use client';

import { getRepoCodeHostInfo } from "@/lib/utils";
import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { DoubleArrowDownIcon, DoubleArrowUpIcon, FileIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { Separator } from "@/components/ui/separator";
import { SearchResultFile } from "@/lib/types";
import { FileMatch } from "./fileMatch";

const MAX_MATCHES_TO_PREVIEW = 3;

interface FileMatchContainerProps {
    file: SearchResultFile;
    onOpenFile: () => void;
    onMatchIndexChanged: (matchIndex: number) => void;
}

export const FileMatchContainer = ({
    file,
    onOpenFile,
    onMatchIndexChanged,
}: FileMatchContainerProps) => {

    const [showAll, setShowAll] = useState(false);
    const matchCount = useMemo(() => {
        return file.ChunkMatches.length;
    }, [file]);

    const matches = useMemo(() => {
        const sortedMatches = file.ChunkMatches.sort((a, b) => {
            return a.ContentStart.LineNumber - b.ContentStart.LineNumber;
        });

        if (!showAll) {
            return sortedMatches.slice(0, MAX_MATCHES_TO_PREVIEW);
        }

        return sortedMatches;
    }, [file, showAll]);

    const fileNameRange = useMemo(() => {
        for (const match of matches) {
            if (match.FileName && match.Ranges.length > 0) {
                const range = match.Ranges[0];
                return {
                    from: range.Start.Column - 1,
                    to: range.End.Column - 1,
                }
            }
        }

        return null;
    }, [matches]);

    const { repoIcon, repoName, repoLink } = useMemo(() => {
        const info = getRepoCodeHostInfo(file.Repository);
        if (info) {
            return {
                repoName: info.repoName,
                repoLink: info.repoLink,
                repoIcon: <Image
                    src={info.icon}
                    alt={info.costHostName}
                    className="w-4 h-4 dark:invert"
                />
            }
        }

        return {
            repoName: file.Repository,
            repoLink: undefined,
            repoIcon: <FileIcon className="w-4 h-4" />
        }
    }, [file]);

    const isMoreContentButtonVisible = useMemo(() => {
        return matchCount > MAX_MATCHES_TO_PREVIEW;
    }, [matchCount]);

    const onShowMoreMatches = useCallback(() => {
        setShowAll(!showAll);
    }, [showAll]);

    const onOpenMatch = useCallback((index: number) => {
        const matchIndex = matches.slice(0, index).reduce((acc, match) => {
            return acc + match.Ranges.length;
        }, 0);
        onOpenFile();
        onMatchIndexChanged(matchIndex);
    }, [matches, onMatchIndexChanged, onOpenFile]);


    return (
        <div>
            <div
                className="sticky top-0 bg-cyan-200 dark:bg-cyan-900 primary-foreground px-2 py-0.5 flex flex-row items-center justify-between border cursor-pointer z-10"
                onClick={() => {
                    onOpenFile();
                }}
            >
                <div className="flex flex-row gap-2 items-center">
                    {repoIcon}
                    <span
                        className={clsx("font-medium", {
                            "cursor-pointer hover:underline": repoLink,
                        })}
                        onClick={() => {
                            if (repoLink) {
                                window.open(repoLink, "_blank");
                            }
                        }}
                    >
                        {repoName}
                    </span>
                    <span>·</span>
                    {!fileNameRange ? (
                        <span>{file.FileName}</span>
                    ) : (
                        <span>
                            {file.FileName.slice(0, fileNameRange.from)}
                            <span className="bg-yellow-200 dark:bg-blue-700">
                                {file.FileName.slice(fileNameRange.from, fileNameRange.to)}
                            </span>
                            {file.FileName.slice(fileNameRange.to)}
                        </span>
                    )}
                </div>
            </div>
            {matches.map((match, index) => (
                <div
                    key={index}
                >
                    <FileMatch
                        match={match}
                        file={file}
                        onOpen={() => {
                            onOpenMatch(index);
                        }}
                    />
                    {(index !== matches.length - 1 || isMoreContentButtonVisible) && (
                        <Separator className="dark:bg-gray-400" />
                    )}
                </div>
            ))}
            {isMoreContentButtonVisible && (
                <div
                    tabIndex={0}
                    className="px-4 bg-accent p-0.5"
                    onKeyDown={(e) => {
                        if (e.key !== "Enter") {
                            return;
                        }
                        onShowMoreMatches();
                    }}
                    onClick={onShowMoreMatches}
                >
                    <p
                        className="text-blue-500 cursor-pointer text-sm flex flex-row items-center gap-2"
                    >
                        {showAll ? <DoubleArrowUpIcon className="w-3 h-3" /> : <DoubleArrowDownIcon className="w-3 h-3" />}
                        {showAll ? `Show fewer matches` : `Show ${matchCount - MAX_MATCHES_TO_PREVIEW} more matches`}
                    </p>
                </div>
            )}
        </div>
    );
}