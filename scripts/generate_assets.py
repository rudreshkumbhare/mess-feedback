#!/usr/bin/env python3
import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "/Users/rudresh/Documents/dt-prototype/public"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# System fonts on macOS
FONT_REGULAR = "/System/Library/Fonts/Helvetica.ttc"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

def get_font(size, bold=False):
    try:
        font_path = FONT_BOLD if bold else FONT_REGULAR
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()

def draw_squircle(draw, bounds, radius, fill_color, stroke_color=None, stroke_width=0):
    """Draw a smooth rounded rectangle."""
    draw.rounded_rectangle(bounds, radius=radius, fill=fill_color, outline=stroke_color, width=stroke_width)

def draw_logo_mark(canvas, x, y, size):
    """
    Draws the modern MessMate logo squircle at (x, y) with dimension (size, size).
    Rendered with 2x supersampling for extreme sharpness.
    """
    scale = 2
    img = Image.new("RGBA", (size * scale, size * scale), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    
    s = size * scale
    radius = int(s * 0.24)
    
    # Gradient background simulated via concentric/vertical blended rounded rects
    # Primary: #16a34a (22, 163, 74) to #15803d (21, 128, 61)
    d.rounded_rectangle([(0, 0), (s - 1, s - 1)], radius=radius, fill=(22, 163, 74, 255))
    
    # Subtle inner highlight/depth
    d.rounded_rectangle([(scale, scale), (s - scale - 1, s - scale - 1)], radius=radius, 
                        outline=(34, 197, 94, 200), width=int(scale * 1.5))

    # Dish / Cloche Tray Base
    base_y = int(s * 0.68)
    base_w = int(s * 0.54)
    base_h = int(s * 0.055)
    base_x = (s - base_w) // 2
    d.rounded_rectangle([(base_x, base_y), (base_x + base_w, base_y + base_h)], 
                        radius=base_h // 2, fill=(255, 255, 255, 255))
    
    # Tray Lip Underneath
    lip_w = int(base_w * 0.65)
    lip_h = int(s * 0.025)
    lip_x = (s - lip_w) // 2
    lip_y = base_y + base_h + int(s * 0.015)
    d.rounded_rectangle([(lip_x, lip_y), (lip_x + lip_w, lip_y + lip_h)], 
                        radius=lip_h // 2, fill=(255, 255, 255, 170))
    
    # Cloche Dome
    dome_w = int(s * 0.44)
    dome_h = int(s * 0.28)
    dome_x = (s - dome_w) // 2
    dome_top = base_y - dome_h
    # Draw arc/dome
    d.pieslice([(dome_x, dome_top - dome_h), (dome_x + dome_w, base_y)], 
               start=180, end=0, fill=(255, 255, 255, 255))
    
    # Cloche Top Handle Knob
    knob_r = int(s * 0.045)
    knob_x = s // 2
    knob_y = dome_top - int(s * 0.02)
    d.ellipse([(knob_x - knob_r, knob_y - knob_r), (knob_x + knob_r, knob_y + knob_r)], 
              fill=(255, 255, 255, 255))
    
    # Geometric 'M' Cutout inside Dome
    # Points for M
    mw = int(dome_w * 0.42)
    mx = (s - mw) // 2
    my = base_y - int(s * 0.06)
    m_top = my - int(s * 0.11)
    
    # Draw green stylized 'M'
    m_pts = [
        (mx, my),
        (mx + int(mw * 0.28), m_top),
        (s // 2, my - int(s * 0.04)),
        (mx + int(mw * 0.72), m_top),
        (mx + mw, my)
    ]
    stroke_w = max(int(scale * 3.5), int(s * 0.03))
    d.line(m_pts, fill=(22, 163, 74, 255), width=stroke_w, joint="curve")

    # Star / Sparkle in Top Right of Logo
    star_cx = int(s * 0.75)
    star_cy = int(s * 0.30)
    star_size = int(s * 0.08)
    # 4-point star
    star_pts = [
        (star_cx, star_cy - star_size),
        (star_cx + int(star_size * 0.25), star_cy - int(star_size * 0.25)),
        (star_cx + star_size, star_cy),
        (star_cx + int(star_size * 0.25), star_cy + int(star_size * 0.25)),
        (star_cx, star_cy + star_size),
        (star_cx - int(star_size * 0.25), star_cy + int(star_size * 0.25)),
        (star_cx - star_size, star_cy),
        (star_cx - int(star_size * 0.25), star_cy - int(star_size * 0.25))
    ]
    d.polygon(star_pts, fill=(251, 191, 36, 255)) # amber-400
    
    # Downscale for anti-aliasing
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    canvas.paste(final_img, (x, y), final_img)
    return final_img

def generate_icons():
    print("Generating standard app and browser icons...")
    sizes = [
        ("favicon-16x16.png", 16),
        ("favicon-32x32.png", 32),
        ("apple-touch-icon.png", 180),
        ("android-chrome-192x192.png", 192),
        ("android-chrome-512x512.png", 512),
    ]
    
    images_for_ico = []
    
    for filename, size in sizes:
        icon_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        draw_logo_mark(icon_img, 0, 0, size)
        out_path = os.path.join(OUTPUT_DIR, filename)
        icon_img.save(out_path, "PNG")
        print(f" Saved {filename} ({size}x{size})")
        
        if size in (16, 32):
            images_for_ico.append(icon_img)

    # Generate favicon.ico (multi-resolution container)
    ico_path = os.path.join(OUTPUT_DIR, "favicon.ico")
    icon_32 = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    draw_logo_mark(icon_32, 0, 0, 32)
    icon_16 = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    draw_logo_mark(icon_16, 0, 0, 16)
    icon_48 = Image.new("RGBA", (48, 48), (0, 0, 0, 0))
    draw_logo_mark(icon_48, 0, 0, 48)
    
    icon_32.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=[icon_16, icon_48])
    print(" Saved favicon.ico (16, 32, 48px)")

def generate_open_graph_image():
    print("Generating 1200x630 Open Graph (OG) social card...")
    W, H = 1200, 630
    
    # 2x supersampling for ultra-crisp typography and cards
    scale = 2
    canvas_w = W * scale
    canvas_h = H * scale
    
    img = Image.new("RGBA", (canvas_w, canvas_h), (11, 15, 25, 255)) # #0b0f19
    draw = ImageDraw.Draw(img)
    
    # Draw subtle background glow behind the branding
    # Large soft radial emerald gradient at left center
    glow = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    gx, gy, gr = int(320 * scale), int(260 * scale), int(280 * scale)
    glow_draw.ellipse([(gx - gr, gy - gr), (gx + gr, gy + gr)], fill=(22, 163, 74, 45))
    glow = glow.filter(ImageFilter.GaussianBlur(int(90 * scale)))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)
    
    # Draw fine subtle grid pattern for modern developer aesthetic
    grid_color = (255, 255, 255, 10)
    step = 40 * scale
    for x in range(0, canvas_w, step):
        draw.line([(x, 0), (x, canvas_h)], fill=grid_color, width=1)
    for y in range(0, canvas_h, step):
        draw.line([(0, y), (canvas_w, y)], fill=grid_color, width=1)

    # 1. Top Category Pill / Tag
    tag_x = int(80 * scale)
    tag_y = int(75 * scale)
    tag_text = "HOSTEL MESS FEEDBACK & QUALITY ANALYTICS"
    tag_font = get_font(int(13 * scale), bold=True)
    
    # Measure tag text
    bbox = draw.textbbox((tag_x + int(14 * scale), tag_y + int(6 * scale)), tag_text, font=tag_font)
    tag_w = (bbox[2] - tag_x) + int(14 * scale)
    tag_h = int(32 * scale)
    
    # Tag background
    draw.rounded_rectangle([(tag_x, tag_y), (tag_x + tag_w, tag_y + tag_h)], 
                           radius=int(16 * scale), fill=(20, 83, 45, 140), outline=(34, 197, 94, 90), width=int(1.5 * scale))
    draw.text((tag_x + int(14 * scale), tag_y + int(7 * scale)), tag_text, fill=(74, 222, 128, 255), font=tag_font)

    # 2. Logo Mark + Brand Name Title
    logo_size = int(84 * scale)
    logo_x = tag_x
    logo_y = tag_y + tag_h + int(24 * scale)
    
    # Draw logo squircle
    draw_logo_mark(img, logo_x, logo_y, logo_size)
    
    # Brand Name "MessMate"
    title_font = get_font(int(58 * scale), bold=True)
    title_x = logo_x + logo_size + int(20 * scale)
    title_y = logo_y + int(8 * scale)
    draw.text((title_x, title_y), "MessMate", fill=(255, 255, 255, 255), font=title_font)
    
    # Version/Tag beside title
    sub_title_font = get_font(int(15 * scale), bold=True)
    draw.rounded_rectangle([(title_x + int(310 * scale), title_y + int(16 * scale)), 
                           (title_x + int(390 * scale), title_y + int(42 * scale))],
                           radius=int(6 * scale), fill=(51, 65, 85, 200))
    draw.text((title_x + int(322 * scale), title_y + int(21 * scale)), "LIVE PROTOTYPE", fill=(203, 213, 225, 255), font=sub_title_font)

    # 3. Main Hook / Subtitle
    lead_font = get_font(int(26 * scale), bold=True)
    lead_x = tag_x
    lead_y = logo_y + logo_size + int(32 * scale)
    draw.text((lead_x, lead_y), "Rate every meal in 15 seconds.", fill=(248, 250, 252, 255), font=lead_font)
    
    desc_font = get_font(int(22 * scale), bold=False)
    draw.text((lead_x, lead_y + int(38 * scale)), "Fix food quality before the next one.", fill=(148, 163, 184, 255), font=desc_font)
    
    desc_extra = get_font(int(16 * scale), bold=False)
    draw.text((lead_x, lead_y + int(76 * scale)), 
              "Structured dish-level micro-ratings · Instant caterer quality alerts · Student rewards", 
              fill=(100, 116, 139, 255), font=desc_extra)

    # 4. Feature Badges Row (Left side bottom)
    badge_y = lead_y + int(124 * scale)
    badges = [
        ("★ 1-5 Star Ratings", (245, 158, 11, 240), (254, 243, 199, 40)),
        ("< 15s Feedback", (34, 197, 94, 240), (220, 252, 231, 40)),
        ("Real-Time Analytics", (56, 189, 248, 240), (224, 242, 254, 40)),
        ("Perk Rewards", (168, 85, 247, 240), (243, 232, 255, 40)),
    ]
    
    bx = lead_x
    badge_font = get_font(int(14 * scale), bold=True)
    for text, text_col, bg_col in badges:
        b_bbox = draw.textbbox((bx + int(14 * scale), badge_y + int(8 * scale)), text, font=badge_font)
        bw = (b_bbox[2] - bx) + int(14 * scale)
        bh = int(36 * scale)
        draw.rounded_rectangle([(bx, badge_y), (bx + bw, badge_y + bh)], 
                               radius=int(18 * scale), fill=bg_col, outline=(255, 255, 255, 30), width=int(1 * scale))
        draw.text((bx + int(14 * scale), badge_y + int(9 * scale)), text, fill=text_col, font=badge_font)
        bx += bw + int(12 * scale)

    # 5. Right Side: Interactive UI Card Showcase Mockup
    card_w = int(450 * scale)
    card_h = int(450 * scale)
    card_x = canvas_w - card_w - int(80 * scale)
    card_y = int(85 * scale)
    
    # Outer subtle glow for the card
    card_glow = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    cg_draw = ImageDraw.Draw(card_glow)
    cg_draw.rounded_rectangle([(card_x - int(10*scale), card_y - int(10*scale)), 
                              (card_x + card_w + int(10*scale), card_y + card_h + int(10*scale))],
                              radius=int(28 * scale), fill=(22, 163, 74, 30))
    card_glow = card_glow.filter(ImageFilter.GaussianBlur(int(25 * scale)))
    img = Image.alpha_composite(img, card_glow)
    draw = ImageDraw.Draw(img)
    
    # Main White Card container
    draw.rounded_rectangle([(card_x, card_y), (card_x + card_w, card_y + card_h)],
                           radius=int(24 * scale), fill=(255, 255, 255, 255), 
                           outline=(226, 232, 240, 255), width=int(2 * scale))
    
    # Mockup Card Header
    ch_h = int(68 * scale)
    draw.rounded_rectangle([(card_x, card_y), (card_x + card_w, card_y + ch_h)],
                           radius=int(24 * scale), fill=(248, 250, 252, 255))
    draw.line([(card_x, card_y + ch_h), (card_x + card_w, card_y + ch_h)], fill=(241, 245, 249, 255), width=int(2 * scale))
    
    card_title_font = get_font(int(17 * scale), bold=True)
    draw.text((card_x + int(24 * scale), card_y + int(24 * scale)), "Today's Lunch Dishes", fill=(15, 23, 42, 255), font=card_title_font)
    
    status_font = get_font(int(12 * scale), bold=True)
    draw.rounded_rectangle([(card_x + card_w - int(135 * scale), card_y + int(20 * scale)),
                           (card_x + card_w - int(24 * scale), card_y + int(48 * scale))],
                           radius=int(14 * scale), fill=(220, 252, 231, 255), outline=(187, 247, 208, 255))
    draw.text((card_x + card_w - int(123 * scale), card_y + int(26 * scale)), "✓ 4/4 RATED", fill=(21, 128, 61, 255), font=status_font)

    # Mock Dish Rows
    dishes = [
        ("Dal Tadka", "★★★★★", "4.8", "Good", (34, 197, 94, 255), (240, 253, 244, 255)),
        ("Paneer Masala", "★★★★☆", "4.5", "Good", (34, 197, 94, 255), (240, 253, 244, 255)),
        ("Jeera Rice", "★★★★☆", "4.1", "Good", (34, 197, 94, 255), (240, 253, 244, 255)),
        ("Aloo Sabzi", "★☆☆☆☆", "1.5", "Needs Attention", (239, 68, 68, 255), (254, 242, 242, 255)),
    ]
    
    row_y = card_y + ch_h + int(16 * scale)
    row_h = int(68 * scale)
    dish_font = get_font(int(16 * scale), bold=True)
    star_font = get_font(int(15 * scale), bold=False)
    score_font = get_font(int(14 * scale), bold=True)
    badge_font = get_font(int(11 * scale), bold=True)
    
    for name, stars, score, status_text, badge_col, badge_bg in dishes:
        # Subtle separator
        draw.line([(card_x + int(20 * scale), row_y + row_h - int(4 * scale)), 
                   (card_x + card_w - int(20 * scale), row_y + row_h - int(4 * scale))], 
                  fill=(241, 245, 249, 255), width=int(1 * scale))
        
        # Dish name
        draw.text((card_x + int(24 * scale), row_y + int(8 * scale)), name, fill=(15, 23, 42, 255), font=dish_font)
        
        # Stars & Rating
        draw.text((card_x + int(24 * scale), row_y + int(34 * scale)), stars, fill=(245, 158, 11, 255), font=star_font)
        draw.text((card_x + int(96 * scale), row_y + int(35 * scale)), score, fill=(100, 116, 139, 255), font=score_font)
        
        # Status Pill on Right
        s_bbox = draw.textbbox((0, 0), status_text, font=badge_font)
        sw = (s_bbox[2] - s_bbox[0]) + int(16 * scale)
        sh = int(26 * scale)
        sx = card_x + card_w - sw - int(24 * scale)
        sy = row_y + int(18 * scale)
        
        draw.rounded_rectangle([(sx, sy), (sx + sw, sy + sh)], radius=int(13 * scale), fill=badge_bg, outline=badge_col)
        draw.text((sx + int(8 * scale), sy + int(6 * scale)), status_text, fill=badge_col, font=badge_font)
        
        row_y += row_h

    # Card Bottom Alert / Reward Note
    foot_y = row_y + int(6 * scale)
    draw.rounded_rectangle([(card_x + int(20 * scale), foot_y), (card_x + card_w - int(20 * scale), foot_y + int(44 * scale))],
                           radius=int(10 * scale), fill=(254, 243, 199, 160), outline=(252, 211, 77, 255))
    reward_font = get_font(int(13 * scale), bold=True)
    draw.text((card_x + int(34 * scale), foot_y + int(13 * scale)), 
              "★ +20 MessPoints & Bonus Dessert Token Earned!", 
              fill=(180, 83, 9, 255), font=reward_font)

    # 6. Global Footer line in OG banner
    footer_font = get_font(int(14 * scale), bold=False)
    footer_y = canvas_h - int(45 * scale)
    draw.text((tag_x, footer_y), "https://messmate.app  ·  Hostel Mess Operations & Caterer Accountability Platform", 
              fill=(100, 116, 139, 255), font=footer_font)

    # Final downsampling to 1200x630 with Lanczos
    final_og = img.resize((W, H), Image.Resampling.LANCZOS)
    og_path = os.path.join(OUTPUT_DIR, "og-image.png")
    final_og.save(og_path, "PNG", optimize=True)
    print(f" Saved og-image.png ({W}x{H}) at {og_path}")

if __name__ == "__main__":
    generate_icons()
    generate_open_graph_image()
    print("All image assets generated successfully!")
