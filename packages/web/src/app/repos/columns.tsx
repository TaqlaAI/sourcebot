'use client';

import { Button } from "@/components/ui/button";
import { getRepoCodeHostInfo } from "@/lib/utils";
import { Column, ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import prettyBytes from "pretty-bytes";

export type RepositoryColumnInfo = {
    name: string;
    branches: {
        name: string,
        version: string,
    }[];
    repoSizeBytes: number;
    indexedFiles: number;
    indexSizeBytes: number;
    shardCount: number;
    lastIndexed: string;
    latestCommit: string;
    commitUrlTemplate: string;
}

export const columns: ColumnDef<RepositoryColumnInfo>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const repo = row.original;
            const info = getRepoCodeHostInfo(repo.name);
            return (
                <div className="flex flex-row items-center gap-2">
                    <span
                        className={info?.repoLink ? "cursor-pointer text-blue-500 hover:underline": ""}
                        onClick={() => {
                            if (info?.repoLink) {
                                window.open(info.repoLink, "_blank");
                            }
                        }}
                    >
                        {repo.name}
                    </span>
                </div>
            );
        }
    },
    {
        accessorKey: "branches",
        header: "Branches",
        cell: ({ row }) => {
            const branches = row.original.branches;
            return (
                <div className="flex flex-col gap-2">
                    {branches.map(({ name, version }, index) => {
                        const shortVersion = version.substring(0, 8);
                        return (
                            <span key={index}>
                                {name}
                                @
                                <span
                                    className="cursor-pointer text-blue-500 hover:underline"
                                    onClick={() => {
                                        const url = row.original.commitUrlTemplate.replace("{{.Version}}", version);
                                        window.open(url, "_blank");
                                    }}
                                >
                                    {shortVersion}
                                </span>
                            </span>
                        )
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: "shardCount",
        header: ({ column }) => createSortHeader("Shard Count", column),
        cell: ({ row }) => (
            <div className="text-right">{row.original.shardCount}</div>
        )
    },
    {
        accessorKey: "indexedFiles",
        header: ({ column }) => createSortHeader("Indexed Files", column),
        cell: ({ row }) => (
            <div className="text-right">{row.original.indexedFiles}</div>
        )
    },
    {
        accessorKey: "indexSizeBytes",
        header: ({ column }) => createSortHeader("Index Size", column),
        cell: ({ row }) => {
            const size = prettyBytes(row.original.indexSizeBytes);
            return <div className="text-right">{size}</div>;
        }
    },
    {
        accessorKey: "repoSizeBytes",
        header: ({ column }) => createSortHeader("Repository Size", column),
        cell: ({ row }) => {
            const size = prettyBytes(row.original.repoSizeBytes);
            return <div className="text-right">{size}</div>;
        }
    },
    {
        accessorKey: "lastIndexed",
        header: ({ column }) => createSortHeader("Last Indexed", column),
        cell: ({ row }) => {
            const date = new Date(row.original.lastIndexed);
            return date.toISOString();
        }
    },
    {
        accessorKey: "latestCommit",
        header: ({ column }) => createSortHeader("Latest Commit", column),
        cell: ({ row }) => {
            const date = new Date(row.original.latestCommit);
            return date.toISOString();
        }
    }
]

const createSortHeader = (name: string, column: Column<RepositoryColumnInfo, unknown>) => {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {name}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    )
}