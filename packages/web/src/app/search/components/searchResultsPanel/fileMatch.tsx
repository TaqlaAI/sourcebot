'use client';

import { useMemo } from "react";
import { CodePreview } from "./codePreview";
import { SearchResultFile, SearchResultFileMatch } from "@/lib/types";


interface FileMatchProps {
    match: SearchResultFileMatch;
    file: SearchResultFile;
    onOpen: () => void;
}

export const FileMatch = ({
    match,
    file,
    onOpen,
}: FileMatchProps) => {
    const content = useMemo(() => {
        return atob(match.Content);
    }, [match.Content]);

    // If it's just the title, don't show a code preview
    if (match.FileName) {
        return null;
    }

    return (
        <div
            tabIndex={0}
            className="cursor-pointer p-1 focus:ring-inset focus:ring-4 bg-white dark:bg-[#282c34]"
            onKeyDown={(e) => {
                if (e.key !== "Enter") {
                    return;
                }
                onOpen();
            }}
            onClick={onOpen}
        >
            <CodePreview
                content={content}
                language={file.Language}
                ranges={match.Ranges}
                lineOffset={match.ContentStart.LineNumber - 1}
            />
        </div>
    );
}