import os
from PIL import Image

# create jpegs folder if it doesn't exist
if not os.path.exists('jpegs'):
    os.makedirs('jpegs')

# loop through all files in current directory
for filename in os.listdir('.'):
    if not os.path.isfile(filename):  # skip directories
        continue

    name, ext = os.path.splitext(filename)

    if ext.lower() not in ('.jpg', '.jpeg', '.png', '.bmp', '.gif'):  # skip non-image files
        continue

    # open image with PIL
    with Image.open(filename) as im:
        if im.mode == 'RGBA':
            # convert RGBA image to RGB for JPEG format
            im = im.convert('RGB')

        # save image in jpeg format to jpegs folder
        new_filename = os.path.join('jpegs', f'{name}.jpeg')
        im.save(new_filename, 'jpeg')
