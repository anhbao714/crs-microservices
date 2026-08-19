// course-service va registration-service: 404/400/409 tra ve { message }
export interface ApiErrorResponse {
  message: string;
}

// Loi validation (400) tra ve map { fieldName: errorMessage } tu MethodArgumentNotValidException
export type ValidationErrorResponse = Record<string, string>;
