const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function fixDirectoryImports() {
  // Find all TypeScript files in the core package
  const files = await glob('/Users/binhnt/Lab/form-center/designable/packages/core/src/**/*.ts');
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    
    // Fix directory imports that need index.js
    const patterns = [
      { from: "from '../events'", to: "from '../events/index.js'" },
      { from: "from '../types'", to: "from '../types.js'" },
      { from: "from './models'", to: "from './models/index.js'" },
      { from: "from '../models'", to: "from '../models/index.js'" },
      { from: "from './drivers'", to: "from './drivers/index.js'" },
      { from: "from './effects'", to: "from './effects/index.js'" },
      { from: "from './shortcuts'", to: "from './shortcuts/index.js'" },
    ];
    
    for (const pattern of patterns) {
      const regex = new RegExp(pattern.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.includes(pattern.from)) {
        content = content.replace(regex, pattern.to);
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(file, content);
      console.log(`Fixed directory imports in: ${path.relative(process.cwd(), file)}`);
    }
  }
}

fixDirectoryImports().catch(console.error);
