import { DataTable } from "@/components/ui/data-table";
import { columns, RepositoryColumnInfo } from "./columns";
import { listRepositories } from "@/lib/server/searchService";
import { isServiceError } from "@/lib/utils";

export const RepositoryTable = async () => {
    const _repos = await listRepositories();

    if (isServiceError(_repos)) {
        return <div>Error fetching repositories</div>;
    }

    const repos = _repos.List.Repos.map((repo): RepositoryColumnInfo => {
        return {
            name: repo.Repository.Name,
            branches: repo.Repository.Branches.map((branch) => {
                return {
                    name: branch.Name,
                    version: branch.Version,
                }
            }),
            repoSizeBytes: repo.Stats.ContentBytes,
            indexSizeBytes: repo.Stats.IndexBytes,
            shardCount: repo.Stats.Shards,
            lastIndexed: repo.IndexMetadata.IndexTime,
            latestCommit: repo.Repository.LatestCommitDate,
            indexedFiles: repo.Stats.Documents,
            commitUrlTemplate: repo.Repository.CommitURLTemplate,
        }
    }).sort((a, b) => {
        return new Date(b.lastIndexed).getTime() -  new Date(a.lastIndexed).getTime();
    });

    return (
        <DataTable
            columns={columns}
            data={repos}
            searchKey="name"
            searchPlaceholder="Search repositories..."
        />
    );
}