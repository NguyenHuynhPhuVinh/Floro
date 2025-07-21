import i18n from './i18n';

/**
 * Get translated error messages for file operations
 */
export const getFileErrorMessage = (errorKey: string): string => {
  const t = i18n.getFixedT(i18n.language, 'fileUpload');
  
  switch (errorKey) {
    case 'FILE_TOO_LARGE':
      return t('errors.fileTooLarge');
    case 'UNSUPPORTED_TYPE':
      return t('errors.unsupportedType');
    case 'MEDIA_FILES_BLOCKED':
      return t('errors.mediaFilesBlocked');
    case 'UPLOAD_FAILED':
      return t('errors.uploadFailed');
    case 'NETWORK_ERROR':
      return t('errors.networkError');
    default:
      return t('errors.uploadFailed');
  }
};

/**
 * Legacy error messages for backward compatibility
 * These will be replaced by translated messages
 */
export const FILE_ERROR_MESSAGES = {
  FILE_TOO_LARGE: getFileErrorMessage('FILE_TOO_LARGE'),
  UNSUPPORTED_TYPE: getFileErrorMessage('UNSUPPORTED_TYPE'),
  MEDIA_FILES_BLOCKED: getFileErrorMessage('MEDIA_FILES_BLOCKED'),
  UPLOAD_FAILED: getFileErrorMessage('UPLOAD_FAILED'),
  NETWORK_ERROR: getFileErrorMessage('NETWORK_ERROR'),
} as const;
