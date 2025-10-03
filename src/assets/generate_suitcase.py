import sys
import os
from PIL import Image, ImageDraw, ImageFont

# Example usage:
# python generate_suitcase.py "Product Name" "src/assets/images/items/image21.png" "pink" "400" "400"

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

def get_reference_size(ref_path):
    try:
        with Image.open(ref_path) as ref_img:
            return ref_img.size
    except Exception:
        return (400, 297)

def generate_suitcase_image(text, output_path, color='grey', width=None, height=None, ref_path=None):
    # If width/height not set, use reference image size
    if width is None or height is None:
        if ref_path:
            width, height = get_reference_size(ref_path)
        else:
            width, height = 400, 297
    bg_color = (255, 255, 255)
    suitcase_color = COLOR_MAP.get(color.lower(), COLOR_MAP['grey'])

    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # Draw rectangular parallelepiped (3D box)
    # Suitcase size as a fraction of image size
    body_w = int(width * 0.55)
    body_h = int(height * 0.38)
    body_d = int(min(width, height) * 0.10)
    depth = body_d
    # Center suitcase horizontally, leave space at bottom for wheels and text
    margin_bottom = int(height * 0.18)
    margin_top = int(height * 0.10)
    usable_height = height - margin_top - margin_bottom
    y0 = margin_top + max(0, (usable_height - body_h - body_d) // 2)
    margin_side = int((width - body_w - body_d) // 2)
    x0 = margin_side
    # 8 corners of the box
    A = (x0, y0)
    B = (x0 + body_w, y0)
    C = (x0 + body_w, y0 + body_h)
    D = (x0, y0 + body_h)
    E = (x0 + body_d, y0 - body_d)
    F = (x0 + body_w + body_d, y0 - body_d)
    G = (x0 + body_w + body_d, y0 + body_h - body_d)
    H = (x0 + body_d, y0 + body_h - body_d)
    # Faces
    front = [A, B, C, D]
    top = [E, F, B, A]
    side = [B, F, G, C]
    # Draw faces
    draw.polygon(front, fill=suitcase_color, outline=(68, 68, 68))
    draw.polygon(top, fill=tuple(min(255, c+30) for c in suitcase_color), outline=(68, 68, 68))
    draw.polygon(side, fill=tuple(max(0, c-30) for c in suitcase_color), outline=(68, 68, 68))

    # Draw handle (on top face)
    handle_w = int(body_w * 0.27)
    handle_h = max(10, int(body_h * 0.10))
    handle_x = x0 + body_w // 2 + body_d // 2 - handle_w // 2
    handle_y = y0 - body_d - handle_h - 4
    draw.rectangle([handle_x, handle_y, handle_x + handle_w, handle_y + handle_h], fill=(85, 85, 85), outline=(34, 34, 34), width=2)

    # Draw wheels (front face, bottom corners)
    wheel_r = max(10, int(min(body_w, body_h) * 0.09))
    wheel_y = y0 + body_h + wheel_r // 2
    wheel1_x = x0 + int(body_w * 0.08)
    wheel2_x = x0 + body_w - int(body_w * 0.08)
    for wx in [wheel1_x, wheel2_x]:
        draw.ellipse([wx - wheel_r, wheel_y - wheel_r, wx + wheel_r, wheel_y + wheel_r], fill=(60, 60, 60), outline=(34, 34, 34), width=2)

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
    # Center text block
    text_x = width // 2 - max_w // 2
    min_text_y = wheel_y + wheel_r + 8
    max_text_y = height - total_h - 8
    text_y = min(max(min_text_y, 0), max_text_y)
    for i, line in enumerate(lines):
        w, h = bboxes[i]
        line_x = width // 2 - w // 2
        draw.text((line_x, text_y), line, fill=(34, 34, 34), font=font)
        text_y += h + spacing

    # Ensure output directory exists (relative to new script location)
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
        print(f"Generating: {out_path} for {text} ({color})")
        generate_suitcase_image(text, out_path, color, ref_size[0], ref_size[1], ref_path=ref_path)

if __name__ == "__main__":
    if len(sys.argv) >= 2 and sys.argv[1] == "all":
        # Usage: python generate_suitcase.py all [json_path]
        json_path = sys.argv[2] if len(sys.argv) > 2 else "./data.json"
        batch_generate_from_json(json_path, start_index=20)
    else:
        if len(sys.argv) < 3:
            print("Usage: python generate_suitcase.py 'Product Name' 'src/assets/images/items/image21.png' [color] [width] [height]  OR  python generate_suitcase.py all [json_path]")
            sys.exit(1)
        text = sys.argv[1]
        output_path = sys.argv[2]
        color = sys.argv[3] if len(sys.argv) > 3 else 'grey'
    width = int(sys.argv[4]) if len(sys.argv) > 4 else None
    height = int(sys.argv[5]) if len(sys.argv) > 5 else None
    # Use reference image size if width/height not set
    script_dir = os.path.dirname(os.path.abspath(__file__))
    ref_path = os.path.join(script_dir, "./images/items/image1.png")
    generate_suitcase_image(text, output_path, color, width, height, ref_path=ref_path)
