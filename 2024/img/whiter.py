from PIL import Image

def lighten_and_partially_grayscale_image(image_path, output_path, lighten_percent=20, grayscale_percent=50):
    # Open the image
    img = Image.open(image_path)
    
    # Determine if original image has transparency by checking its mode
    has_transparency = img.mode in ('RGBA', 'LA')

    # Convert image to RGBA to preserve transparency during processing
    img = img.convert('RGBA')

    # Calculate the amount to lighten each color component
    lighten_amount = (255 * lighten_percent) // 100
    grayscale_factor = grayscale_percent / 100

    # Process the image to lighten colors and apply partial grayscale
    pixels = img.load()
    for i in range(img.width):
        for j in range(img.height):
            r, g, b, a = pixels[i, j]
            # Lighten the color
            lightened_r = min(255, r + lighten_amount)
            lightened_g = min(255, g + lighten_amount)
            lightened_b = min(255, b + lighten_amount)
            # Convert to grayscale
            grayscale = int(0.299 * lightened_r + 0.587 * lightened_g + 0.114 * lightened_b)
            # Blend the grayscale and color
            final_r = int(lightened_r * (1 - grayscale_factor) + grayscale * grayscale_factor)
            final_g = int(lightened_g * (1 - grayscale_factor) + grayscale * grayscale_factor)
            final_b = int(lightened_b * (1 - grayscale_factor) + grayscale * grayscale_factor)
            # Update the pixel
            pixels[i, j] = (final_r, final_g, final_b, a)

    # Determine the output format based on the output path
    output_format = output_path.split('.')[-1].upper()

    # If saving as JPG, remove the alpha channel as JPG does not support transparency
    if output_format == 'JPG' or output_format == 'JPEG':
        img = img.convert('RGB')  # Convert to RGB to discard the alpha channel

    # Save the modified image
    img.save(output_path)

# Hardcoded image path
image_path = 'background2.jpg'  # Use an appropriate file
output_path = 'background2a.jpg'  # Save as either PNG or JPG

# Call the function with a lightening of 20% and 50% grayscale effect
lighten_and_partially_grayscale_image(image_path, output_path, lighten_percent=40, grayscale_percent=80)
