/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Converte URLs do Google Drive para links diretos de imagem carregáveis em tags <img>.
 * Suporta os seguintes formatos de URL:
 * - https://drive.google.com/file/d/ID/view?usp=sharing
 * - https://drive.google.com/file/d/ID/view
 * - https://drive.google.com/open?id=ID
 * - https://drive.google.com/uc?id=ID
 * - https://docs.google.com/file/d/ID/edit
 * 
 * @param url A URL original enviada pelo usuário.
 * @returns A URL direta da imagem ou a original caso não seja do Google Drive.
 */
export function getDirectGoogleDriveUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  // 1. Tenta extrair pelo padrão clássico "/file/d/ID/..."
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }
  
  // 2. Tenta extrair pelo padrão de parâmetro "?id=ID" ou "&id=ID"
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
  }

  // 3. Se já for do lh3 ou do googleusercontent, retorna como está
  if (trimmed.includes('googleusercontent.com')) {
    return trimmed;
  }
  
  return trimmed;
}
