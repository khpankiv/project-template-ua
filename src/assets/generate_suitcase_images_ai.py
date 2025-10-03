import json
import os
import requests
from time import sleep

DATA_PATH = 'src/assets/data.json'
IMG_DIR = 'src/assets/images/items'
API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2"
HF_TOKEN = "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"  # Replace with your token

HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}

def generate_prompt(product):
    color = product.get('color', 'grey')
    size = product.get('size', '')
    name = product.get('name', 'suitcase')
    return f"{color} {size} suitcase with handle, studio photo, white background, product photo, no text"

def generate_image(prompt, out_path):
    response = requests.post(
        API_URL,
        headers=HEADERS,
        json={"inputs": prompt}
    )
    if response.status_code == 200:
        with open(out_path, "wb") as f:
            f.write(response.content)
        print(f"Saved: {out_path}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

def main():
    os.makedirs(IMG_DIR, exist_ok=True)
    with open(DATA_PATH, encoding='utf-8') as f:
        products = json.load(f)
    for product in products:
        img_url = product.get('imageUrl', '')
        img_num = ''.join(filter(str.isdigit, os.path.splitext(os.path.basename(img_url))[0]))
        if not img_num:
            continue
        img_filename = f'image{img_num}.png'
        img_path = os.path.join(IMG_DIR, img_filename)
        prompt = generate_prompt(product)
        generate_image(prompt, img_path)
        sleep(5)  # Avoid rate limits (adjust as needed)

if __name__ == '__main__':
    main()
