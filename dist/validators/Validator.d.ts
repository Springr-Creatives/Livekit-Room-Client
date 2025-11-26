import { Request, Response } from "express";
type ValidationRule = string | string[];
type ValidationRules = Record<string, ValidationRule>;
type ValidationErrors = Record<string, string[]>;
interface ValidationResult {
    isValid: boolean;
    errors: ValidationErrors;
    validated: Record<string, any>;
}
declare class Validator {
    private data;
    private rules;
    private errors;
    constructor(data: Record<string, any>, rules: ValidationRules);
    static make(data: Record<string, any>, rules: ValidationRules): Validator;
    validate(): ValidationResult;
    private validateField;
    private isRequired;
    private isValidUrl;
    private isValidEmail;
    private getStringLength;
    private addError;
    private getValidatedData;
    fails(): boolean;
    passes(): boolean;
    getErrors(): ValidationErrors;
    getValidated(): Record<string, any>;
}
declare function validateRequest(req: Request, res: Response, rules: ValidationRules): ValidationResult | null;
export { Validator, validateRequest, ValidationResult, ValidationErrors };
export default Validator;
//# sourceMappingURL=Validator.d.ts.map