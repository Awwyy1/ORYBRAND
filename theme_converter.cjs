const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'components');
const rootPath = __dirname;

const replacements = [
  // Backgrounds
  { regex: /bg-\[#0F0F0F\]/g, replacement: 'bg-[#F8F9FA]' },
  { regex: /bg-black/g, replacement: 'bg-white' },
  { regex: /bg-white\/5/g, replacement: 'bg-black/5' },
  { regex: /bg-white\/10/g, replacement: 'bg-black/10' },
  { regex: /bg-zinc-900/g, replacement: 'bg-zinc-100' },
  
  // Overlays
  { regex: /bg-black\/60/g, replacement: 'bg-white/80 backdrop-blur-md' },
  { regex: /bg-black\/80/g, replacement: 'bg-white/80 backdrop-blur-md' },
  { regex: /bg-black\/90/g, replacement: 'bg-white/90 backdrop-blur-xl' },
  { regex: /bg-black\/95/g, replacement: 'bg-white/95 backdrop-blur-xl' },
  { regex: /bg-black\/20/g, replacement: 'bg-white/20' },
  { regex: /bg-black\/0/g, replacement: 'bg-white/0' },
  { regex: /to-\[#0F0F0F\]/g, replacement: 'to-[#F8F9FA]' },
  { regex: /via-\[#0F0F0F\]/g, replacement: 'via-[#F8F9FA]' },
  { regex: /from-transparent/g, replacement: 'from-transparent' },
  
  // Text
  { regex: /text-white/g, replacement: 'text-zinc-900' },
  { regex: /hover:text-white/g, replacement: 'hover:text-zinc-900' },
  { regex: /text-slate-400/g, replacement: 'text-slate-600' },
  { regex: /text-slate-300/g, replacement: 'text-slate-600' },
  { regex: /text-slate-700/g, replacement: 'text-slate-300' }, // For empty stars
  
  // Accents
  { regex: /text-sky-400/g, replacement: 'text-sky-600' },
  { regex: /hover:text-sky-400/g, replacement: 'hover:text-sky-600' },
  { regex: /bg-sky-500/g, replacement: 'bg-sky-600' },
  { regex: /hover:bg-sky-400/g, replacement: 'hover:bg-sky-500' },
  { regex: /border-sky-500/g, replacement: 'border-sky-600' },
  { regex: /shadow-\[0_0_10px_rgba\(56,189,248,0\.5\)\]/g, replacement: 'shadow-md shadow-sky-600/20' },
  { regex: /shadow-\[0_0_10px_rgba\(56,189,248,0\.8\)\]/g, replacement: 'shadow-md shadow-sky-600/30' },
  { regex: /fill-sky-400/g, replacement: 'fill-sky-600' },
  
  // Borders
  { regex: /border-white\/5/g, replacement: 'border-black/5' },
  { regex: /border-white\/10/g, replacement: 'border-black/10' },
  { regex: /border-white\/20/g, replacement: 'border-black/20' },
  { regex: /border-sky-400/g, replacement: 'border-sky-600' },
  { regex: /hover:border-white\/40/g, replacement: 'hover:border-black/20' },
  { regex: /border-slate-800/g, replacement: 'border-slate-200' },
  
  // Specific exceptions
  { regex: /text-white\/60/g, replacement: 'text-zinc-900/60' },
  { regex: /bg-sky-500\/10/g, replacement: 'bg-sky-600/10' },
  { regex: /text-sky-400\/40/g, replacement: 'text-sky-600/40' },
  { regex: /bg-sky-400\/20/g, replacement: 'bg-sky-600/20' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let newContent = content;
      
      replacements.forEach(({ regex, replacement }) => {
        newContent = newContent.replace(regex, replacement);
      });
      // Special manual fixes if we want some contrasting buttons to stay dark or white
      // For instance, the main 'Add to cart' which was bg-sky-500 text-white
      // Since we replaced text-white with text-zinc-900, the button might have dark text on a dark blue button.
      // We should fix `bg-sky-600 text-zinc-900` -> `bg-sky-600 text-white`
      newContent = newContent.replace(/bg-sky-600(.*?)text-zinc-900/g, 'bg-sky-600$1text-white');
      newContent = newContent.replace(/bg-sky-600 text-zinc-900/g, 'bg-sky-600 text-white');
      
      // also `bg-sky-600 hover:bg-sky-500 text-zinc-900`
      newContent = newContent.replace(/bg-sky-600 hover:bg-sky-500 text-zinc-900/g, 'bg-sky-600 hover:bg-sky-500 text-white');
      // in CartDrawer, ProductDetail, etc.
      
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  });
}

processDirectory(directoryPath);

// Also process root specific files
['App.tsx', 'index.html', 'index.tsx'].forEach(file => {
  const filePath = path.join(rootPath, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    
    replacements.forEach(({ regex, replacement }) => {
      newContent = newContent.replace(regex, replacement);
    });
    
    newContent = newContent.replace(/bg-sky-600(.*?)text-zinc-900/g, 'bg-sky-600$1text-white');
    
    // In index.html, we also need to change body background
    newContent = newContent.replace(/background-color: #0F0F0F;/g, 'background-color: #F8F9FA;');
    newContent = newContent.replace(/background: #0F0F0F;/g, 'background: #F8F9FA;');
    newContent = newContent.replace(/color: #E2E8F0;/g, 'color: #18181b;');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
});

console.log('Replaced dark theme classes with light theme classes.');
