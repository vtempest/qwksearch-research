/**
 * File name validation utility
 */

import { useState, useEffect } from "react";

const INVALID_FILENAME_CHARS = /[<>:"/\\|?*\x00-\x1F]/;
const RESERVED_NAMES = [
  "CON",
  "PRN",
  "AUX",
  "NUL",
  "COM1",
  "COM2",
  "COM3",
  "COM4",
  "COM5",
  "COM6",
  "COM7",
  "COM8",
  "COM9",
  "LPT1",
  "LPT2",
  "LPT3",
  "LPT4",
  "LPT5",
  "LPT6",
  "LPT7",
  "LPT8",
  "LPT9",
];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class FileNameValidator {
  /**
   * Validates a file or folder name
   */
  static validateName(
    name: string,
    type: "file" | "folder" = "file"
  ): ValidationResult {
    // Check if name is empty
    if (!name || name.trim().length === 0) {
      return {
        isValid: false,
        error: `${type} name cannot be empty`,
      };
    }

    // Check for invalid characters
    if (INVALID_FILENAME_CHARS.test(name)) {
      return {
        isValid: false,
        error: `${type} name contains invalid characters`,
      };
    }

    // Check if name starts or ends with a space or period
    if (name.startsWith(" ") || name.endsWith(" ")) {
      return {
        isValid: false,
        error: `${type} name cannot start or end with a space`,
      };
    }

    if (name.startsWith(".") || name.endsWith(".")) {
      return {
        isValid: false,
        error: `${type} name cannot start or end with a period`,
      };
    }

    // Check for reserved Windows names
    const nameUpper = name.toUpperCase();
    const baseName = nameUpper.split(".")[0];
    if (RESERVED_NAMES.includes(baseName)) {
      return {
        isValid: false,
        error: `${type} name "${name}" is reserved`,
      };
    }

    // Check length
    if (name.length > 255) {
      return {
        isValid: false,
        error: `${type} name is too long (max 255 characters)`,
      };
    }

    return { isValid: true };
  }

  /**
   * Checks if a name conflicts with existing names
   */
  static checkNameConflict(name: string, existingNames: string[]): boolean {
    return existingNames.some(
      (existing) => existing.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Returns a user-friendly error message
   */
  static getFriendlyErrorMessage(
    name: string,
    type: "file" | "folder" = "file"
  ): string {
    const validation = this.validateName(name, type);
    return validation.error || "Invalid name";
  }
}

/**
 * React hook for name validation
 */
export function useNameValidation(
  name: string,
  type: "file" | "folder",
  existingNames: string[] = []
) {
  const [validation, setValidation] = useState<ValidationResult & { hasConflict?: boolean; friendlyError?: string }>({
    isValid: true,
  });

  useEffect(() => {
    const nameValidation = FileNameValidator.validateName(name, type);
    const hasConflict =
      nameValidation.isValid &&
      FileNameValidator.checkNameConflict(name, existingNames);
    const isValid = nameValidation.isValid && !hasConflict;

    setValidation({
      isValid,
      hasConflict,
      error: hasConflict
        ? `A ${type} with this name already exists`
        : nameValidation.error,
      friendlyError: hasConflict
        ? `A ${type} with this name already exists`
        : FileNameValidator.getFriendlyErrorMessage(name, type),
    });
  }, [name, type, existingNames]);

  return validation;
}
