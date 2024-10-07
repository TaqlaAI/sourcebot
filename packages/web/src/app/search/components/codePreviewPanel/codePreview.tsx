'use client';

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useExtensionWithDependency } from "@/hooks/useExtensionWithDependency";
import { useKeymapType } from "@/hooks/useKeymapType";
import { useSyntaxHighlightingExtension } from "@/hooks/useSyntaxHighlightingExtension";
import { useThemeNormalized } from "@/hooks/useThemeNormalized";
import { gutterWidthExtension } from "@/lib/extensions/gutterWidthExtension";
import { highlightRanges, searchResultHighlightExtension } from "@/lib/extensions/searchResultHighlightExtension";
import { SearchResultFileMatch } from "@/lib/types";
import { defaultKeymap } from "@codemirror/commands";
import { search } from "@codemirror/search";
import { EditorView, keymap } from "@codemirror/view";
import { Cross1Icon, FileIcon } from "@radix-ui/react-icons";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { vim } from "@replit/codemirror-vim";
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import clsx from "clsx";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface CodePreviewFile {
    content: string;
    filepath: string;
    link?: string;
    matches: SearchResultFileMatch[];
    language: string;
}

interface CodePreviewProps {
    file?: CodePreviewFile;
    selectedMatchIndex: number;
    onSelectedMatchIndexChange: (index: number) => void;
    onClose: () => void;
}

export const CodePreview = ({
    file,
    selectedMatchIndex,
    onSelectedMatchIndexChange,
    onClose,
}: CodePreviewProps) => {
    const editorRef = useRef<ReactCodeMirrorRef>(null);

    const [ keymapType ] = useKeymapType();
    const { theme  } = useThemeNormalized();
    const [gutterWidth, setGutterWidth] = useState(0);

    const keymapExtension = useExtensionWithDependency(
        editorRef.current?.view ?? null,
        () => {
            switch (keymapType) {
                case "default":
                    return keymap.of(defaultKeymap);
                case "vim":
                    return vim();
            }
        },
        [keymapType]
    );

    const syntaxHighlighting = useSyntaxHighlightingExtension(file?.language ?? '', editorRef.current?.view);

    const extensions = useMemo(() => {
        return [
            keymapExtension,
            gutterWidthExtension,
            syntaxHighlighting,
            EditorView.lineWrapping,
            searchResultHighlightExtension(),
            search({
                top: true,
            }),
            EditorView.updateListener.of(update => {
                const width = update.view.plugin(gutterWidthExtension)?.width;
                if (width) {
                    setGutterWidth(width);
                }
            }),
        ];
    }, [keymapExtension, syntaxHighlighting]);

    const ranges = useMemo(() => {
        if (!file || !file.matches.length) {
            return [];
        }

        return file.matches.flatMap((match) => {
            return match.Ranges;
        })
    }, [file]);

    useEffect(() => {
        if (!file || !editorRef.current?.view) {
            return;
        }

        highlightRanges(selectedMatchIndex, ranges, editorRef.current.view);
    }, [ranges, selectedMatchIndex, file]);

    const onUpClicked = useCallback(() => {
        onSelectedMatchIndexChange(selectedMatchIndex - 1);
    }, [onSelectedMatchIndexChange, selectedMatchIndex]);

    const onDownClicked = useCallback(() => {
        onSelectedMatchIndexChange(selectedMatchIndex + 1);
    }, [onSelectedMatchIndexChange, selectedMatchIndex]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-row bg-cyan-200 dark:bg-cyan-900 items-center justify-between pr-3 py-0.5 border">
                <div className="flex flex-row">
                    <div
                        style={{ width: `${gutterWidth}px` }}
                        className="flex justify-center items-center"
                    >
                        <FileIcon className="h-4 w-4" />
                    </div>
                    <span
                        className={clsx("", {
                            "cursor-pointer text-blue-500 hover:underline" : file?.link
                        })}
                        onClick={() => {
                            if (file?.link) {
                                window.open(file.link, "_blank");
                            }
                        }}
                    >
                        {file?.filepath}
                    </span>
                </div>
                <div className="flex flex-row gap-1 items-center">
                    {file && file.matches.length > 0 && (
                        <>
                            <p className="text-sm">{`${selectedMatchIndex + 1} of ${ranges.length}`}</p>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                disabled={selectedMatchIndex === 0}
                                onClick={onUpClicked}
                            >
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={onDownClicked}
                                disabled={file ? selectedMatchIndex === ranges.length - 1 : true}
                            >
                                <ArrowDown className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={onClose}
                    >
                        <Cross1Icon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <ScrollArea className="h-full overflow-auto flex-1">
                <CodeMirror
                    ref={editorRef}
                    readOnly={true}
                    value={file?.content}
                    theme={theme === "dark" ? "dark" : "light"}
                    extensions={extensions}
                />
                <Scrollbar orientation="vertical" />
                <Scrollbar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}