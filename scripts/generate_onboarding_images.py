from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('public', exist_ok=True)
slides = [
    ('onboarding1.png', 'Accueil'),
    ('onboarding2.png', 'Événements'),
    ('onboarding3.png', 'Dévotions'),
    ('onboarding4.png', 'Profil')
]

for name, label in slides:
    img = Image.new('RGB', (900, 1600), (30, 30, 30))
    draw = ImageDraw.Draw(img)
    color = (72, 0, 0) if '1' in name else (0, 40, 72) if '2' in name else (40, 0, 40) if '3' in name else (0, 72, 24)
    draw.rectangle([40, 40, 860, 1560], fill=color)
    try:
        font = ImageFont.truetype('arial.ttf', 72)
    except Exception:
        font = ImageFont.load_default()
    w, h = draw.textsize(label, font=font)
    draw.text(((900 - w) / 2, 760), label, fill='white', font=font)
    img.save(os.path.join('public', name))
    print('created', name)
