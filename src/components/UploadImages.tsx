import { DragEvent, useState } from 'react';
import { AspectRatio, Box, Flex } from '@chakra-ui/react';
import { css } from '@emotion/react';
import Image from 'next/image';

const styles = {
  input: css`
    opacity: 0;
    visibility: hidden;
    width: 100%;
    height: 100%;
  `,
};

type ImageType = {
  name: string;
  data: string;
};

// refs: https://felixgerschau.com/react-typescript-ondrop-event-type/
export const UploadImages = (): JSX.Element => {
  const [images, setImages] = useState<ImageType[]>([]);
  const MAX_WIDTH = 300;
  const MAX_HEIGHT = 300;
  const MAX_IMAGE_NUMBER = 5;
  const allowedExtensions = new Array('jpg', 'jpeg', 'png');

  const getExtention = (filename: string) => {
    const position = filename.lastIndexOf('.');
    if (position === -1) return '';
    return filename.slice(position + 1);
  };

  const allowedExtention = (filename: string) => {
    const extention = getExtention(filename).toLowerCase();
    if (allowedExtensions.indexOf(extention) === -1) return false;
    return true;
  };

  const isOverMaxLength = (currentFiles: ImageType[], newFiles: File[]): boolean => {
    return currentFiles.length + newFiles.length > MAX_IMAGE_NUMBER;
  };

  const loadImage = (src: string) => {
    return new Promise((resolve, reject) => {
      let img = document.createElement('img');
      img.src = src;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        reject(img);
      };
    });
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    let files = Array.from(e.dataTransfer.files);

    if (images.length > MAX_IMAGE_NUMBER) return;

    if (files && files.length > 0) {
      const existingFiles = images.map((f) => f.name);
      files = files.filter((f) => !existingFiles.includes(f.name) && allowedExtention(f.name));
    }

    if (isOverMaxLength(images, files)) return;

    if (files && files.length > 0) {
      files.map((f) => {
        const reader = new FileReader();
        // ref: https://qiita.com/rch850/items/33d6933b3c73e112c5b6
        reader.onload = (e: any) => {
          const base64 = e.target.result;

          loadImage(base64)
            .then((img: any) => {
              let canvas = document.createElement('canvas');
              let ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0);

              let width = img.width;
              let height = img.height;

              if (width > height && width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              } else if (width <= height && height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
              canvas.height = height;
              canvas.width = width;
              ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);

              const data = canvas.toDataURL(f.type);

              setImages(
                images.concat([
                  {
                    name: f.name,
                    data: data,
                  },
                ]),
              );
            })
            .catch((e: unknown) => {
              console.log('error');
            });
        };
        reader.readAsDataURL(f);
      });
    }
  };
  return (
    <Flex
      pt={`100px`}
      justifyContent={`center`}
      flexDirection={`column`}
      alignItems={`center`}
      gap={`48px`}
    >
      <Box
        position={`relative`}
        width={`sm`}
        height={`180px`}
        border={`1px`}
        borderColor={`blue.600`}
        borderStyle={`dashed`}
        borderRadius={`8px`}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <Flex
          position={`absolute`}
          top={`50%`}
          left={`50%`}
          transform={`translate(-50%, -50%)`}
          justifyContent={`center`}
          alignItems={`center`}
          height={`full`}
          textAlign={`center`}
        >
          ドラッグ&amp;ドロップ
          <br />
          してください
        </Flex>
        <label>
          <input
            type={`file`}
            multiple
            css={styles.input}
            accept='image/png, image/jpeg, image/jpg'
          />
        </label>
      </Box>
      <Flex gap={`24px`}>
        {images.map((f) => {
          return (
            <AspectRatio width={`100px`} ratio={4 / 3} key={`${f.name}`}>
              <Image alt={`${f.name}`} src={f.data} layout={`fill`} objectFit={`cover`} />
            </AspectRatio>
          );
        })}
      </Flex>
    </Flex>
  );
};
