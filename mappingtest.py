# pip install opencv-python
import cv2
import numpy as np
import matplotlib.pyplot as plt

# 이미지를 로드합니다.
image = cv2.imread('C:\\songhansol\\servingServer\\map.png', cv2.IMREAD_GRAYSCALE)  # 'your_image_file.png'을 실제 파일 경로로 바꿔주세요.

# 클릭 이벤트를 처리하는 함수입니다.
def on_click(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONUP:
        # 클릭한 위치를 0으로 만듭니다.
        image[y, x] = 0
        # 변경된 이미지를 다시 표시합니다.
        cv2.imshow('Image', image)

cv2.imshow('Image', image)
cv2.setMouseCallback('Image', on_click)

# 'q' 키를 누를 때까지 대기합니다.
while True:
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cv2.destroyAllWindows()
