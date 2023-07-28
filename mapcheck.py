import os

# 이미지 파일의 절대 경로
image_path = 'C:\\songhansol\\servingServer\\map.png'

# 이미지 파일이 실제로 존재하는지 확인합니다.
if os.path.exists(image_path):
    print('File exists')
else:
    print('File does not exist')
