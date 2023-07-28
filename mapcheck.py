import os

# Check if the file exists:
if not os.path.isfile('map.png'):
    print("File does not exist")
else:
    try:
        image = cv2.imread('map.png', cv2.IMREAD_GRAYSCALE)
        cv2.imshow('Image', image)
    except Exception as e:
        print(f"Error opening image: {e}")