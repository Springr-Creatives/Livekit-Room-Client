import { Request, Response } from "express";

type ValidationRule = string | string[];
type ValidationRules = Record<string, ValidationRule>;
type ValidationErrors = Record<string, string[]>;

interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
  validated: Record<string, any>;
}

class Validator {
  private data: Record<string, any>;
  private rules: ValidationRules;
  private errors: ValidationErrors = {};

  constructor(data: Record<string, any>, rules: ValidationRules) {
    this.data = data;
    this.rules = rules;
  }

  static make(data: Record<string, any>, rules: ValidationRules): Validator {
    return new Validator(data, rules);
  }

  validate(): ValidationResult {
    this.errors = {};

    for (const [field, rule] of Object.entries(this.rules)) {
      const rules = Array.isArray(rule) ? rule : rule.split("|");
      this.validateField(field, rules);
    }

    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: this.errors,
      validated: this.getValidatedData(),
    };
  }

  private validateField(field: string, rules: string[]): void {
    const value = this.data[field];

    for (const rule of rules) {
      const [ruleName, ...params] = rule.split(":");

      switch (ruleName.trim()) {
        case "required":
          if (!this.isRequired(value)) {
            this.addError(field, "The :field field is required.");
          }
          break;

        case "string":
          if (value !== undefined && typeof value !== "string") {
            this.addError(field, "The :field must be a string.");
          }
          break;

        case "url":
          if (value !== undefined && !this.isValidUrl(value)) {
            this.addError(field, "The :field must be a valid URL.");
          }
          break;

        case "min":
          const minLength = parseInt(params[0] || "0", 10);
          if (value !== undefined && this.getStringLength(value) < minLength) {
            this.addError(
              field,
              `The :field must be at least ${minLength} characters.`
            );
          }
          break;

        case "max":
          const maxLength = parseInt(params[0] || "0", 10);
          if (value !== undefined && this.getStringLength(value) > maxLength) {
            this.addError(
              field,
              `The :field must not exceed ${maxLength} characters.`
            );
          }
          break;

        case "email":
          if (value !== undefined && !this.isValidEmail(value)) {
            this.addError(field, "The :field must be a valid email address.");
          }
          break;

        case "numeric":
          if (value !== undefined && isNaN(Number(value))) {
            this.addError(field, "The :field must be a number.");
          }
          break;

        case "integer":
          if (value !== undefined && !Number.isInteger(Number(value))) {
            this.addError(field, "The :field must be an integer.");
          }
          break;

        case "array":
          if (value !== undefined && !Array.isArray(value)) {
            this.addError(field, "The :field must be an array.");
          }
          break;

        case "boolean":
          if (value !== undefined && typeof value !== "boolean") {
            this.addError(field, "The :field must be a boolean.");
          }
          break;
      }
    }
  }

  private isRequired(value: any): boolean {
    if (value === undefined || value === null) {
      return false;
    }
    if (typeof value === "string" && value.trim().length === 0) {
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return true;
  }

  private isValidUrl(value: any): boolean {
    if (typeof value !== "string") {
      return false;
    }
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  private isValidEmail(value: any): boolean {
    if (typeof value !== "string") {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  private getStringLength(value: any): number {
    if (typeof value === "string") {
      return value.length;
    }
    if (Array.isArray(value)) {
      return value.length;
    }
    return 0;
  }

  private addError(field: string, message: string): void {
    if (!this.errors[field]) {
      this.errors[field] = [];
    }
    const formattedMessage = message.replace(/:field/g, field);
    if (!this.errors[field].includes(formattedMessage)) {
      this.errors[field].push(formattedMessage);
    }
  }

  private getValidatedData(): Record<string, any> {
    const validated: Record<string, any> = {};
    for (const field of Object.keys(this.rules)) {
      if (this.data[field] !== undefined) {
        validated[field] = this.data[field];
      }
    }
    return validated;
  }

  fails(): boolean {
    return !this.validate().isValid;
  }

  passes(): boolean {
    return this.validate().isValid;
  }

  getErrors(): ValidationErrors {
    return this.errors;
  }

  getValidated(): Record<string, any> {
    return this.getValidatedData();
  }
}

// Helper function to validate request and send error response if validation fails
function validateRequest(
  req: Request,
  res: Response,
  rules: ValidationRules
): ValidationResult | null {
  const validator = Validator.make(req.body, rules);
  const result = validator.validate();

  if (!result.isValid) {
    res.status(400).json({
      message: "Validation failed",
      errors: result.errors,
    });
    return null;
  }

  return result;
}

export { Validator, validateRequest, ValidationResult, ValidationErrors };
export default Validator;
