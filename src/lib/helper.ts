/**
 * Return file extension from string
 *
 * @param   {string}  filename  [filename description]
 *
 * @return  {string}            [return description]
 */
export const extensionIs = (filename: string): string => {
  const regex = /(?:\.([^.]+))?$/;

  return regex.exec(filename)![1];
};

export const replaceExtension = (
  filename: string,
  newExtension: string,
): string => {
  const regex = /(?:\.([^.]+))?$/;

  return filename.replace(regex, newExtension);
};

/**
 * Check if viewport is mobile
 *
 * @return  {boolean}
 */
export const isMobileViewport = (): boolean => {
  return window.innerWidth < 768;
};
