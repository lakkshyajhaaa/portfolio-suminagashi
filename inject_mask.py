with open('mask.txt', 'r') as f:
    mask = f.read().strip()
    
with open('src/components/dom/LoadingScreen.tsx', 'r') as f:
    content = f.read()

new_content = content.replace('style={{ clipPath: `inset(0 ${100 - displayValue}% 0 0)` }}', '')

svg = f'''<svg viewBox="0 0 800 200" className="w-full h-auto" style={{ overflow: 'visible' }}>
              <defs>
                <filter id="blur">
                  <feGaussianBlur stdDeviation="10" />
                </filter>
                <mask id="writeMask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1200" height="600">
                  <motion.path
                    d="{mask}"
                    fill="none"
                    stroke="white"
                    strokeWidth="80"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#blur)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "linear" }}
                  />
                </mask>
              </defs>
              <text 
                x="50%" 
                y="55%" 
                dominantBaseline="middle" 
                textAnchor="middle" 
                fill="white" 
                mask="url(#writeMask)"
                className={{`${{signatureFont.className}}`}}
                fontSize="130"
              >
                Lakkshya Jha
              </text>
            </svg>'''

import re
content = re.sub(r'<span.*?>.*?</span>', svg.strip(), new_content, flags=re.DOTALL)

with open('src/components/dom/LoadingScreen.tsx', 'w') as f:
    f.write(content)
