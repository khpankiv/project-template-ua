import sys
import os
import random
from PIL import Image, ImageDraw, ImageFont

# Example usage:
# python generate_suitcase.py "Product Name" "src/assets/images/items/image21.png" "pink" "L"

COLOR_MAP = {
    'black': (40, 40, 40),
    'grey': (160, 160, 160),
    'gray': (160, 160, 160),
    'blue': (70, 130, 180),
    'red': (220, 70, 70),
    'green': (60, 180, 90),
    'yellow': (240, 220, 70),
    'pink': (230, 120, 180),
}

# Background colors for variety
BG_COLORS = [
    (250, 248, 245),  # Warm white
    (245, 250, 252),  # Cool white
    (252, 250, 245),  # Cream
    (248, 248, 250),  # Light grey
]

# Sticker colors
STICKER_COLORS = [
    (255, 200, 50),   # Gold
    (255, 100, 100),  # Light red
    (100, 200, 255),  # Light blue
    (150, 255, 150),  # Light green
    (255, 150, 200),  # Light pink
]

def get_reference_size(ref_path):
    try:
        with Image.open(ref_path) as ref_img:
            return ref_img.size
    except Exception:
        return (400, 297)

def rounded_rectangle(draw, xy, radius, fill=None, outline=None, width=1):
    """Draw a rounded rectangle."""
    x0, y0, x1, y1 = xy
    draw.rectangle([x0 + radius, y0, x1 - radius, y1], fill=fill, outline=outline, width=0)
    draw.rectangle([x0, y0 + radius, x1, y1 - radius], fill=fill, outline=outline, width=0)
    draw.pieslice([x0, y0, x0 + radius * 2, y0 + radius * 2], 180, 270, fill=fill, outline=outline)
    draw.pieslice([x1 - radius * 2, y0, x1, y0 + radius * 2], 270, 360, fill=fill, outline=outline)
    draw.pieslice([x0, y1 - radius * 2, x0 + radius * 2, y1], 90, 180, fill=fill, outline=outline)
    draw.pieslice([x1 - radius * 2, y1 - radius * 2, x1, y1], 0, 90, fill=fill, outline=outline)
    if outline and width > 0:
        # Draw outline
        draw.arc([x0, y0, x0 + radius * 2, y0 + radius * 2], 180, 270, fill=outline, width=width)
        draw.arc([x1 - radius * 2, y0, x1, y0 + radius * 2], 270, 360, fill=outline, width=width)
        draw.arc([x0, y1 - radius * 2, x0 + radius * 2, y1], 90, 180, fill=outline, width=width)
        draw.arc([x1 - radius * 2, y1 - radius * 2, x1, y1], 0, 90, fill=outline, width=width)
        draw.line([x0 + radius, y0, x1 - radius, y0], fill=outline, width=width)
        draw.line([x0 + radius, y1, x1 - radius, y1], fill=outline, width=width)
        draw.line([x0, y0 + radius, x0, y1 - radius], fill=outline, width=width)
        draw.line([x1, y0 + radius, x1, y1 - radius], fill=outline, width=width)

def draw_star(draw, center, size, fill):
    """Draw a simple 5-point star."""
    cx, cy = center
    points = []
    for i in range(10):
        angle = (i * 36 - 90) * 3.14159 / 180
        r = size if i % 2 == 0 else size / 2.5
        x = cx + r * (angle ** 2 - angle ** 2) ** 0  # Using simple calculation
        # Simple star approximation
        if i % 2 == 0:
            x = cx + size * [0, 0.95, 0.59, -0.59, -0.95][i // 2]
            y = cy + size * [-1, 0.31, 0.81, 0.81, 0.31][i // 2]
        else:
            x = cx + size * 0.38 * [0, 0.73, 0.22, -0.22, -0.73][(i - 1) // 2]
            y = cy + size * 0.38 * [-0.85, 0.12, 0.73, 0.73, 0.12][(i - 1) // 2]
        points.append((x, y))
    draw.polygon(points, fill=fill)

def generate_suitcase_image(text, output_path, color='grey', size='M', width=None, height=None, ref_path=None):
    # If width/height not set, use reference image size
    if width is None or height is None:
        if ref_path:
            width, height = get_reference_size(ref_path)
        else:
            width, height = 400, 297
    
    # Use product attributes to seed randomness for consistency
    seed_value = hash(text + str(color) + str(size)) % 10000
    random.seed(seed_value)
    
    # Background: light color or gradient
    use_gradient = random.choice([True, False])
    bg_base = random.choice(BG_COLORS)
    
    if use_gradient:
        # Create gradient background
        img = Image.new('RGB', (width, height), bg_base)
        for y in range(height):
            # Subtle gradient
            factor = y / height * 0.1
            color_val = tuple(int(c * (1 - factor) + 255 * factor) for c in bg_base)
            draw_temp = ImageDraw.Draw(img)
            draw_temp.line([(0, y), (width, y)], fill=color_val)
    else:
        img = Image.new('RGB', (width, height), bg_base)
    
    draw = ImageDraw.Draw(img)
    suitcase_color = COLOR_MAP.get(color.lower(), COLOR_MAP['grey'])
    
    # Suitcase dimensions based on size
    size_multipliers = {'S': 0.45, 'M': 0.50, 'L': 0.55, 'XL': 0.60}
    size_mult = size_multipliers.get(size, 0.50)
    
    body_w = int(width * size_mult)
    body_h = int(height * 0.42)
    corner_radius = int(min(body_w, body_h) * 0.08)
    
    # Position suitcase
    margin_bottom = int(height * 0.20)
    margin_top = int(height * 0.12)
    x0 = (width - body_w) // 2
    y0 = margin_top
    
    # Draw shadow under suitcase
    shadow_offset = 6
    shadow_color = tuple(max(0, c - 40) for c in bg_base)
    shadow_y = y0 + body_h + shadow_offset
    draw.ellipse([x0 + 10, shadow_y, x0 + body_w - 10, shadow_y + 12], 
                 fill=shadow_color, outline=None)
    
    # Draw suitcase body as rounded rectangle
    rounded_rectangle(draw, [x0, y0, x0 + body_w, y0 + body_h], 
                     corner_radius, fill=suitcase_color, outline=(50, 50, 50), width=2)
    
    # Decorative stripe
    stripe_horizontal = random.choice([True, False])
    stripe_width = int(min(body_w, body_h) * 0.08)
    stripe_color = tuple(min(255, c + 40) if sum(suitcase_color) < 400 else max(0, c - 40) 
                        for c in suitcase_color)
    
    if stripe_horizontal:
        stripe_y = y0 + body_h // 2 - stripe_width // 2
        draw.rectangle([x0 + corner_radius, stripe_y, 
                       x0 + body_w - corner_radius, stripe_y + stripe_width], 
                      fill=stripe_color)
    else:
        stripe_x = x0 + body_w // 2 - stripe_width // 2
        draw.rectangle([stripe_x, y0 + corner_radius, 
                       stripe_x + stripe_width, y0 + body_h - corner_radius], 
                      fill=stripe_color)
    
    # Handle: arc or rounded rectangle
    handle_type = random.choice(['arc', 'rounded_rect'])
    handle_w = int(body_w * 0.25)
    handle_h = int(body_h * 0.12)
    handle_x = x0 + body_w // 2 - handle_w // 2
    handle_y = y0 - handle_h - 8
    
    if handle_type == 'arc':
        # Draw arc handle
        arc_height = int(handle_h * 1.5)
        draw.arc([handle_x, handle_y - arc_height // 2, 
                 handle_x + handle_w, handle_y + arc_height // 2],
                start=0, end=180, fill=(80, 80, 80), width=4)
    else:
        # Rounded rectangle handle
        rounded_rectangle(draw, [handle_x, handle_y, handle_x + handle_w, handle_y + handle_h],
                         radius=5, fill=(90, 90, 90), outline=(40, 40, 40), width=2)
    
    # Wheels: round or square, variable spacing
    wheel_style = random.choice(['round', 'square'])
    wheel_size = max(8, int(min(body_w, body_h) * 0.06))
    wheel_spacing = random.uniform(0.1, 0.15)
    
    wheel_y = y0 + body_h - wheel_size // 2
    wheel1_x = x0 + int(body_w * wheel_spacing)
    wheel2_x = x0 + body_w - int(body_w * wheel_spacing)
    
    for wx in [wheel1_x, wheel2_x]:
        if wheel_style == 'round':
            draw.ellipse([wx - wheel_size // 2, wheel_y - wheel_size // 2,
                         wx + wheel_size // 2, wheel_y + wheel_size // 2],
                        fill=(60, 60, 60), outline=(30, 30, 30), width=2)
        else:
            draw.rectangle([wx - wheel_size // 2, wheel_y - wheel_size // 2,
                           wx + wheel_size // 2, wheel_y + wheel_size // 2],
                          fill=(60, 60, 60), outline=(30, 30, 30), width=2)
    
    # Optional sticker
    add_sticker = random.choice([True, False, False])  # 33% chance
    if add_sticker:
        sticker_type = random.choice(['circle', 'star'])
        sticker_size = int(min(body_w, body_h) * 0.08)
        sticker_x = x0 + int(body_w * random.uniform(0.2, 0.8))
        sticker_y = y0 + int(body_h * random.uniform(0.2, 0.5))
        sticker_color = random.choice(STICKER_COLORS)
        
        if sticker_type == 'circle':
            draw.ellipse([sticker_x - sticker_size // 2, sticker_y - sticker_size // 2,
                         sticker_x + sticker_size // 2, sticker_y + sticker_size // 2],
                        fill=sticker_color, outline=(255, 255, 255), width=2)
        else:
            draw_star(draw, (sticker_x, sticker_y), sticker_size, sticker_color)
    
    # Draw text: 'Picture for {name}' and '({id})' on two lines if both present
    if '|' in text:
        name, pid = text.split('|', 1)
        line1 = f"Picture for {name.strip()}"
        line2 = f"({pid.strip()})"
        lines = [line1, line2]
    else:
        lines = [f"Picture for {text}"]

    # Try to fit text: reduce font size if needed
    min_font_size = 14
    font_size = 24
    while font_size >= min_font_size:
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        bboxes = []
        max_w = 0
        total_h = 0
        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=font)
            w = bbox[2] - bbox[0]
            h = bbox[3] - bbox[1]
            bboxes.append((w, h))
            total_h += h
            if w > max_w:
                max_w = w
        spacing = 4
        total_h += spacing * (len(lines) - 1)
        if max_w <= width - 16:
            break
        font_size -= 2
    
    # If still too wide, wrap the first line
    if max_w > width - 16 and len(lines) == 2:
        import textwrap
        wrapped = textwrap.wrap(lines[0], width=18)
        lines = wrapped + [lines[1]]
        # Recalculate with wrapped lines
        font_size = max(font_size, min_font_size)
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        bboxes = []
        max_w = 0
        total_h = 0
        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=font)
            w = bbox[2] - bbox[0]
            h = bbox[3] - bbox[1]
            bboxes.append((w, h))
            total_h += h
            if w > max_w:
                max_w = w
        total_h += spacing * (len(lines) - 1)
    
    # Position text at bottom
    text_y = height - margin_bottom + 10
    for i, line in enumerate(lines):
        w, h = bboxes[i]
        line_x = width // 2 - w // 2
        draw.text((line_x, text_y), line, fill=(34, 34, 34), font=font)
        text_y += h + spacing

    # Ensure output directory exists
    abs_output_path = output_path
    if not os.path.isabs(output_path):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        abs_output_path = os.path.normpath(os.path.join(script_dir, output_path))
    os.makedirs(os.path.dirname(abs_output_path), exist_ok=True)
    img.save(abs_output_path)
    print(f"Saved: {abs_output_path}")

import json

def batch_generate_from_json(json_path, start_index=20):
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)["data"]
    # Use reference image size from sample (image1.png)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    ref_path = os.path.join(script_dir, "./images/items/image1.png")
    ref_size = get_reference_size(ref_path)
    for p in data[start_index:]:
        name = p["name"]
        pid = p["id"]
        color = p.get("color", "grey")
        size = p.get("size", "M")
        # Extract image number from imageUrl (e.g., path/to/image21.jpg -> 21)
        img_url = p.get("imageUrl", "")
        import re
        m = re.search(r"(\d+)", img_url)
        img_num = m.group(1) if m else pid
        out_path = f"./images/items/image{img_num}.png"
        # Check if file already exists (relative to script location)
        abs_out_path = os.path.normpath(os.path.join(script_dir, out_path))
        if os.path.exists(abs_out_path):
            print(f"Skipping (exists): {out_path}")
            continue
        text = f"{name}|{pid}"
        print(f"Generating: {out_path} for {text} ({color}, {size})")
        generate_suitcase_image(text, out_path, color, size, ref_size[0], ref_size[1], ref_path=ref_path)

if __name__ == "__main__":
    if len(sys.argv) >= 2 and sys.argv[1] == "all":
        # Usage: python generate_suitcase.py all [json_path]
        json_path = sys.argv[2] if len(sys.argv) > 2 else "./data.json"
        batch_generate_from_json(json_path, start_index=20)
    else:
        if len(sys.argv) < 3:
            print("Usage: python generate_suitcase.py 'Product Name' 'src/assets/images/items/image21.png' [color] [size]  OR  python generate_suitcase.py all [json_path]")
            sys.exit(1)
        text = sys.argv[1]
        output_path = sys.argv[2]
        color = sys.argv[3] if len(sys.argv) > 3 else 'grey'
        size = sys.argv[4] if len(sys.argv) > 4 else 'M'
        # Use reference image size
        script_dir = os.path.dirname(os.path.abspath(__file__))
        ref_path = os.path.join(script_dir, "./images/items/image1.png")
        width, height = get_reference_size(ref_path)
        generate_suitcase_image(text, output_path, color, size, width, height, ref_path=ref_path)
