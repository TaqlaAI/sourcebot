import { StatusCodes } from "http-status-codes";
import { ErrorCode } from "./errorCodes";
import { ZodError } from "zod";

export interface ServiceError {
    statusCode: StatusCodes;
    errorCode: ErrorCode;
    message: string;
}

export const serviceErrorResponse = ({ statusCode, errorCode, message }: ServiceError) => {
    return Response.json({
        statusCode,
        errorCode,
        message,
    }, {
        status: statusCode,
    });
}

export const missingQueryParam = (name: string): ServiceError => {
    return {
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: ErrorCode.MISSING_REQUIRED_QUERY_PARAMETER,
        message: `Missing required query parameter: ${name}`,
    };
}

export const schemaValidationError = (error: ZodError): ServiceError => {
    return {
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: ErrorCode.INVALID_REQUEST_BODY,
        message: `Schema validation failed with: ${error.message}`,
    };
}

export const invalidZoektResponse = async (zoektResponse: Response): Promise<ServiceError> => {
    const zoektMessage = await (async () => {
        try {
            const zoektResponseBody = await zoektResponse.json();
            if (zoektResponseBody.Error) {
                return zoektResponseBody.Error;
            }
        } catch (_e) {
            return "Unknown error";
        }
    })();

    return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        errorCode: ErrorCode.INVALID_REQUEST_BODY,
        message: `Zoekt request failed with status code ${zoektResponse.status} and message: "${zoektMessage}"`,
    };
}

export const fileNotFound = async (fileName: string, repository: string): Promise<ServiceError> => {
    return {
        statusCode: StatusCodes.NOT_FOUND,
        errorCode: ErrorCode.FILE_NOT_FOUND,
        message: `File "${fileName}" not found in repository "${repository}"`,
    };
}

export const unexpectedError = (message: string): ServiceError => {
    return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        errorCode: ErrorCode.UNEXPECTED_ERROR,
        message: `Unexpected error: ${message}`,
    };
}