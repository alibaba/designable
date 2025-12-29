const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function fixImports() {
  // Find all TypeScript files in the core package
  const files = await glob('/Users/binhnt/Lab/form-center/designable/packages/core/src/**/*.ts');
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    
    // Fix relative imports that need .js extensions
    const relativeImportRegex = /import\s+.*?\s+from\s+['"](\.\/?[^'"]*)['"]/g;
    
    content = content.replace(relativeImportRegex, (match, importPath) => {
      // Skip if already has extension or is a directory import
      if (importPath.endsWith('.js') || importPath.endsWith('/')) {
        return match;
      }
      
      hasChanges = true;
      return match.replace(importPath, `${importPath}.js`);
    });
    
    if (hasChanges) {
      fs.writeFileSync(file, content);
      console.log(`Fixed imports in: ${path.relative(process.cwd(), file)}`);
    }
  }
}

fixImports().catch(console.error);
