"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
exports.validateRequest = validateRequest;
class Validator {
    constructor(data, rules) {
        this.errors = {};
        this.data = data;
        this.rules = rules;
    }
    static make(data, rules) {
        return new Validator(data, rules);
    }
    validate() {
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
    validateField(field, rules) {
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
                        this.addError(field, `The :field must be at least ${minLength} characters.`);
                    }
                    break;
                case "max":
                    const maxLength = parseInt(params[0] || "0", 10);
                    if (value !== undefined && this.getStringLength(value) > maxLength) {
                        this.addError(field, `The :field must not exceed ${maxLength} characters.`);
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
    isRequired(value) {
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
    isValidUrl(value) {
        if (typeof value !== "string") {
            return false;
        }
        try {
            new URL(value);
            return true;
        }
        catch {
            return false;
        }
    }
    isValidEmail(value) {
        if (typeof value !== "string") {
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }
    getStringLength(value) {
        if (typeof value === "string") {
            return value.length;
        }
        if (Array.isArray(value)) {
            return value.length;
        }
        return 0;
    }
    addError(field, message) {
        if (!this.errors[field]) {
            this.errors[field] = [];
        }
        const formattedMessage = message.replace(/:field/g, field);
        if (!this.errors[field].includes(formattedMessage)) {
            this.errors[field].push(formattedMessage);
        }
    }
    getValidatedData() {
        const validated = {};
        for (const field of Object.keys(this.rules)) {
            if (this.data[field] !== undefined) {
                validated[field] = this.data[field];
            }
        }
        return validated;
    }
    fails() {
        return !this.validate().isValid;
    }
    passes() {
        return this.validate().isValid;
    }
    getErrors() {
        return this.errors;
    }
    getValidated() {
        return this.getValidatedData();
    }
}
exports.Validator = Validator;
// Helper function to validate request and send error response if validation fails
function validateRequest(req, res, rules) {
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
exports.default = Validator;
//# sourceMappingURL=Validator.js.map