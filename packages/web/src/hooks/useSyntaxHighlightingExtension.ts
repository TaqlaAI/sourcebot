'use client';

import { EditorView } from "@codemirror/view";
import { useExtensionWithDependency } from "./useExtensionWithDependency";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { markdown } from "@codemirror/lang-markdown";
import { cpp } from "@codemirror/lang-cpp";
import { csharp } from "@replit/codemirror-lang-csharp";
import { json } from "@codemirror/lang-json";
import { java } from "@codemirror/lang-java";
import { rust } from "@codemirror/lang-rust";
import { go } from "@codemirror/lang-go";
import { sql } from "@codemirror/lang-sql";
import { php } from "@codemirror/lang-php";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";


export const useSyntaxHighlightingExtension = (language: string, view: EditorView | undefined) => {
    const extension = useExtensionWithDependency(
        view ?? null,
        () => {
            switch (language.toLowerCase()) {
                case "c":
                case "c++":
                    return cpp();
                case "c#":
                    return csharp();
                case "json":
                    return json();
                case "java":
                    return java();
                case "rust":
                    return rust();
                case "go":
                    return go();
                case "sql":
                    return sql();
                case "php":
                    return php();
                case "html":
                    return html();
                case "css":
                    return css();
                case "jsx":
                case "tsx":
                case "typescript":
                case "javascript":
                    return javascript({
                        jsx: true,
                        typescript: true,
                    });
                case "python":
                    return python();
                case "markdown":
                    return markdown();
                default:
                    return [];
            }
        },
        [language]
    );

    return extension;
}