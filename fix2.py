import re

with open('mask.txt', 'r', encoding='utf-8') as f:
    mask = f.read().strip()
    
with open('src/components/dom/LoadingScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the whole mask path
start_str = '<mask id="writeMask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1200" height="600">\n                  <motion.path\n                    d="'
end_str = '"\n                    fill="none"'

start_idx = content.find('<mask id="writeMask"')
end_idx = content.find('fill="none"', start_idx)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + start_str + mask + end_str + content[end_idx + 11:]
    with open('src/components/dom/LoadingScreen.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
        print("Success!")
else:
    print("Failed to find boundaries")
