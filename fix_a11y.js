const fs = require('fs');
const files = [
  'src/components/ProjectCreator.tsx',
  'src/components/StudentPoolModal.tsx',
  'src/components/StudentProfileDrawer.tsx',
  'src/components/AuthModal.tsx',
  'src/components/WhyThisMatchModal.tsx',
  'src/components/GroupsView.tsx',
  'src/components/DemoVerificationModal.tsx',
  'src/components/UserProfileView.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  // Replace <button \n ... \n <X  with aria-label injected
  content = content.replace(/(<button[^>]*?)(>[\s]*<X )/g, '$1 aria-label="Close"$2');
  fs.writeFileSync(file, content);
});
console.log('Fixed X buttons');
