# HyperLaunch Icon Generator
# This script creates simple PNG icons for the Chrome extension
# Using PIL/Pillow to create basic placeholder icons

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    
    def create_icon(size):
        """Create a simple icon with gradient background and rocket emoji"""
        # Create image with transparent background
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Draw gradient background (rounded rectangle)
        corner_radius = int(size * 0.2)
        
        # Create gradient from purple to violet
        for y in range(size):
            # Calculate color gradient
            ratio = y / size
            r = int(99 + (139 - 99) * ratio)
            g = int(102 + (92 - 102) * ratio)
            b = int(241 + (246 - 241) * ratio)
            
            # Draw horizontal line
            draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
        
        # Draw rounded corners mask
        mask = Image.new('L', (size, size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([(0, 0), (size, size)], corner_radius, fill=255)
        
        # Apply mask
        output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        output.paste(img, (0, 0), mask)
        
        # Draw simple rocket shape
        rocket_draw = ImageDraw.Draw(output)
        
        # Scale rocket to icon size
        scale = size / 128
        
        # Rocket body (white triangle-ish shape)
        body_points = [
            (int(64 * scale), int(20 * scale)),
            (int(80 * scale), int(90 * scale)),
            (int(48 * scale), int(90 * scale))
        ]
        rocket_draw.polygon(body_points, fill=(255, 255, 255, 240))
        
        # Window (circle)
        window_center = (int(64 * scale), int(50 * scale))
        window_radius = int(10 * scale)
        rocket_draw.ellipse(
            [
                (window_center[0] - window_radius, window_center[1] - window_radius),
                (window_center[0] + window_radius, window_center[1] + window_radius)
            ],
            fill=(199, 210, 254, 255)
        )
        
        # Flames (yellow triangles)
        flame1 = [
            (int(52 * scale), int(90 * scale)),
            (int(48 * scale), int(110 * scale)),
            (int(56 * scale), int(90 * scale))
        ]
        rocket_draw.polygon(flame1, fill=(251, 191, 36, 255))
        
        flame2 = [
            (int(64 * scale), int(90 * scale)),
            (int(64 * scale), int(115 * scale)),
            (int(68 * scale), int(90 * scale))
        ]
        rocket_draw.polygon(flame2, fill=(245, 158, 11, 255))
        
        flame3 = [
            (int(76 * scale), int(90 * scale)),
            (int(80 * scale), int(110 * scale)),
            (int(72 * scale), int(90 * scale))
        ]
        rocket_draw.polygon(flame3, fill=(251, 191, 36, 255))
        
        return output
    
    # Create icons in different sizes
    sizes = [16, 48, 128]
    assets_dir = os.path.dirname(os.path.abspath(__file__))
    
    for size in sizes:
        icon = create_icon(size)
        icon.save(os.path.join(assets_dir, f'icon-{size}.png'))
        print(f"Created icon-{size}.png")
    
    print("\nAll icon files created successfully!")
    print("You can replace these with higher quality icons if needed.")
    
except ImportError:
    print("PIL/Pillow not installed. Creating simple placeholder files instead.")
    print("Install Pillow with: pip install Pillow")
    print("\nAlternatively, you can:")
    print("1. Use an online SVG to PNG converter")
    print("2. Use design software like Figma, Inkscape, or GIMP")
    print("3. Manually create 16x16, 48x48, and 128x128 PNG files")
