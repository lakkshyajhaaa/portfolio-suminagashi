from pyhershey import shape_text
import json

text = 'Lakkshya Jha'
glyphs = shape_text(text, 'script_complex', advance_height=20, font_size=1)

svg_paths = []
min_x, max_x = float('inf'), float('-inf')
min_y, max_y = float('inf'), float('-inf')

for g in glyphs:
    glyph_view = g['glyph']
    pos_x, pos_y = g['pos']
    
    for segment in glyph_view.segments:
        if len(segment) == 0: continue
        
        path_str = f"M {segment[0][0] + pos_x:.2f},{segment[0][1] + pos_y:.2f}"
        for pt in segment[1:]:
            x, y = pt[0] + pos_x, pt[1] + pos_y
            path_str += f" L {x:.2f},{y:.2f}"
            min_x = min(min_x, x)
            max_x = max(max_x, x)
            min_y = min(min_y, y)
            max_y = max(max_y, y)
        svg_paths.append(path_str)

full_path = " ".join(svg_paths)
print(f'<svg viewBox="{min_x} {min_y} {max_x-min_x} {max_y-min_y}">')
print(f'<path d="{full_path}" />')
print('</svg>')
