'use server';

import { listRepositories } from "@/lib/server/searchService";

export const GET = async () => {
    const response = await listRepositories();
    return Response.json(response);
}