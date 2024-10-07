'use server';

import { fileSourceRequestSchema } from "@/lib/schemas";
import { getFileSource } from "@/lib/server/searchService";
import { schemaValidationError, serviceErrorResponse } from "@/lib/serviceError";
import { isServiceError } from "@/lib/utils";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    const body = await request.json();
    const parsed = await fileSourceRequestSchema.safeParseAsync(body);
    if (!parsed.success) {
        return serviceErrorResponse(
            schemaValidationError(parsed.error)
        );
    }

    const response = await getFileSource(parsed.data);
    if (isServiceError(response)) {
        return serviceErrorResponse(response);
    }

    return Response.json(response);
}
