with open('src/components/dom/LoadingScreen.tsx', 'r', encoding='windows-1252', errors='replace') as f:
    text = f.read()

text = text.replace('initial={ pathLength: 0 }', 'initial={{ pathLength: 0 }}')
text = text.replace('animate={ pathLength: 1 }', 'animate={{ pathLength: 1 }}')
text = text.replace('transition={ duration: 1.2, ease: "linear" }', 'transition={{ duration: 1.2, ease: "linear" }}')

with open('src/components/dom/LoadingScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
