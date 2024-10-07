'use client';

import { fetchFileSource } from "@/app/api/(client)/client";
import { getCodeHostFilePreviewLink } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CodePreview, CodePreviewFile } from "./codePreview";
import { SearchResultFile } from "@/lib/types";

interface CodePreviewPanelProps {
    fileMatch?: SearchResultFile;
    onClose: () => void;
    selectedMatchIndex: number;
    onSelectedMatchIndexChange: (index: number) => void;
}

export const CodePreviewPanel = ({
    fileMatch,
    onClose,
    selectedMatchIndex,
    onSelectedMatchIndexChange,
}: CodePreviewPanelProps) => {

    const { data: file } = useQuery({
        queryKey: ["source", fileMatch?.FileName, fileMatch?.Repository],
        queryFn: async (): Promise<CodePreviewFile | undefined> => {
            if (!fileMatch) {
                return undefined;
            }

            return fetchFileSource(fileMatch.FileName, fileMatch.Repository)
                .then(({ source }) => {
                    // @todo : refector this to use the templates provided by zoekt.
                    const link = getCodeHostFilePreviewLink(fileMatch.Repository, fileMatch.FileName)

                    const decodedSource = atob(source);

                    // Filter out filename matches
                    const filteredMatches = fileMatch.ChunkMatches.filter((match) => {
                        return !match.FileName;
                    });

                    return {
                        content: decodedSource,
                        filepath: fileMatch.FileName,
                        matches: filteredMatches,
                        link: link,
                        language: fileMatch.Language,
                    };
                });
        },
        enabled: fileMatch !== undefined,
    });

    return (
        <CodePreview
            file={file}
            onClose={onClose}
            selectedMatchIndex={selectedMatchIndex}
            onSelectedMatchIndexChange={onSelectedMatchIndexChange}
        />
    )

}