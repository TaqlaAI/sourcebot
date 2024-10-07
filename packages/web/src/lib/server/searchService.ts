import escapeStringRegexp from "escape-string-regexp";
import { SHARD_MAX_MATCH_COUNT, TOTAL_MAX_MATCH_COUNT } from "../environment";
import { listRepositoriesResponseSchema, searchResponseSchema } from "../schemas";
import { FileSourceRequest, FileSourceResponse, ListRepositoriesResponse, SearchRequest, SearchResponse } from "../types";
import { fileNotFound, invalidZoektResponse, ServiceError, unexpectedError } from "../serviceError";
import { isServiceError } from "../utils";
import { zoektFetch } from "./zoektClient";

export const search = async ({ query, maxMatchDisplayCount, whole }: SearchRequest): Promise<SearchResponse | ServiceError> => {
    const body = JSON.stringify({
        q: query,
        // @see: https://github.com/sourcebot-dev/zoekt/blob/main/api.go#L892
        opts: {
            NumContextLines: 2,
            ChunkMatches: true,
            MaxMatchDisplayCount: maxMatchDisplayCount,
            Whole: !!whole,
            ShardMaxMatchCount: SHARD_MAX_MATCH_COUNT,
            TotalMaxMatchCount: TOTAL_MAX_MATCH_COUNT,
        }
    });

    const searchResponse = await zoektFetch({
        path: "/api/search",
        body,
        method: "POST",
    });

    if (!searchResponse.ok) {
        return invalidZoektResponse(searchResponse);
    }

    const searchBody = await searchResponse.json();
    const parsedSearchResponse = searchResponseSchema.safeParse(searchBody);
    if (!parsedSearchResponse.success) {
        console.error(`Failed to parse zoekt response. Error: ${parsedSearchResponse.error}`);
        return unexpectedError(`Something went wrong while parsing the response from zoekt`);
    }

    return parsedSearchResponse.data;
}

export const getFileSource = async ({ fileName, repository }: FileSourceRequest): Promise<FileSourceResponse | ServiceError> => {
    const escapedFileName = escapeStringRegexp(fileName);
    const escapedRepository = escapeStringRegexp(repository);

    const searchResponse = await search({
        query: `file:${escapedFileName} repo:^${escapedRepository}$`,
        maxMatchDisplayCount: 1,
        whole: true,
    });

    if (isServiceError(searchResponse)) {
        return searchResponse;
    }

    const files = searchResponse.Result.Files;

    if (!files || files.length === 0) {
        return fileNotFound(fileName, repository);
    }

    const source = files[0].Content ?? '';
    return {
        source
    }
}

export const listRepositories = async (): Promise<ListRepositoriesResponse | ServiceError> => {
    const body = JSON.stringify({
        opts: {
            Field: 0,
        }
    });
    const listResponse = await zoektFetch({
        path: "/api/list",
        body,
        method: "POST",
        cache: "no-store",
    });

    if (!listResponse.ok) {
        return invalidZoektResponse(listResponse);
    }

    const listBody = await listResponse.json();
    const parsedListResponse = listRepositoriesResponseSchema.safeParse(listBody);
    if (!parsedListResponse.success) {
        console.error(`Failed to parse zoekt response. Error: ${parsedListResponse.error}`);
        return unexpectedError(`Something went wrong while parsing the response from zoekt`);
    }

    return parsedListResponse.data;
}