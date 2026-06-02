import fs from 'fs/promises';

export const cleanupFiles = async (filePaths: string[]) => {
  for (const filePath of filePaths) {
    try {
      await fs.unlink(filePath);
      console.log(`Cleaned up file: ${filePath}`);
    } catch (error) {
      console.error(`Failed to clean up file ${filePath}:`, error);
    }
  }
};
