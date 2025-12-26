import { useMemo } from 'react';

export class FileNameValidator {
  static validate(fileName: string): boolean {
    if (!fileName || fileName.trim().length === 0) {
      return false;
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
    if (invalidChars.test(fileName)) {
      return false;
    }

    // Check for reserved names (Windows)
    const reservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
    if (reservedNames.test(fileName)) {
      return false;
    }

    return true;
  }

  static validateName(name: string, type: 'file' | 'folder'): { isValid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { isValid: false, error: `${type} name cannot be empty` };
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
    if (invalidChars.test(name)) {
      return { isValid: false, error: `${type} name contains invalid characters` };
    }

    // Check for reserved names (Windows)
    const reservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
    if (reservedNames.test(name)) {
      return { isValid: false, error: `${type} name is reserved` };
    }

    return { isValid: true };
  }

  static checkNameConflict(name: string, existingNames: string[]): boolean {
    return existingNames.some(existing => existing.toLowerCase() === name.toLowerCase());
  }

  static getFriendlyErrorMessage(name: string, type: 'file' | 'folder'): string {
    const validation = this.validateName(name, type);
    return validation.error || `Invalid ${type} name`;
  }

  static sanitize(fileName: string): string {
    // Remove invalid characters
    return fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
  }
}

export function useNameValidation(name: string, type: 'file' | 'folder', existingNames?: string[]) {
  return useMemo(() => {
    const validation = FileNameValidator.validateName(name, type);

    if (!validation.isValid) {
      return {
        isValid: false,
        friendlyError: validation.error || `Invalid ${type} name`,
      };
    }

    if (existingNames && FileNameValidator.checkNameConflict(name, existingNames)) {
      return {
        isValid: false,
        friendlyError: `A ${type} with this name already exists`,
      };
    }

    return {
      isValid: true,
      friendlyError: null,
    };
  }, [name, type, existingNames]);
}
