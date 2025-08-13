import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to convert a single file
function convertFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already converted
    if (content.includes('import ') && content.includes('export ')) {
      console.log(`Skipping ${filePath} - already converted`);
      return;
    }
    
    // Convert require statements to import statements
    content = content.replace(/const\s+(\w+)\s*=\s*require\(['"`]([^'"`]+)['"`]\);?/g, (match, varName, modulePath) => {
      // Add .js extension for relative imports
      if (modulePath.startsWith('./') || modulePath.startsWith('../')) {
        if (!modulePath.endsWith('.js')) {
          modulePath += '.js';
        }
      }
      return `import ${varName} from '${modulePath}';`;
    });
    
    // Convert destructured require statements
    content = content.replace(/const\s*\{\s*([^}]+)\s*\}\s*=\s*require\(['"`]([^'"`]+)['"`]\);?/g, (match, destructured, modulePath) => {
      // Add .js extension for relative imports
      if (modulePath.startsWith('./') || modulePath.startsWith('../')) {
        if (!modulePath.endsWith('.js')) {
          modulePath += '.js';
        }
      }
      return `import { ${destructured} } from '${modulePath}';`;
    });
    
    // Convert module.exports to export default
    content = content.replace(/module\.exports\s*=\s*([^;]+);?/g, 'export default $1;');
    
    // Convert exports.something to export
    content = content.replace(/exports\.(\w+)\s*=\s*([^;]+);?/g, 'export const $1 = $2;');
    
    // Write the converted content back
    fs.writeFileSync(filePath, content);
    console.log(`Converted ${filePath}`);
    
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error.message);
  }
}

// Function to recursively find and convert all JS files
function convertDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      convertDirectory(fullPath);
    } else if (item.endsWith('.js') && !item.includes('convert-to-es6')) {
      convertFile(fullPath);
    }
  }
}

// Start conversion
console.log('Starting ES6 modules conversion...');
convertDirectory(path.join(__dirname, 'src'));
console.log('Conversion completed!');

