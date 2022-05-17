import { DragEvent, useState } from 'react';
import { AspectRatio, Box, Center, Container, Flex } from '@chakra-ui/react';
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

// refs: https://felixgerschau.com/react-typescript-ondrop-event-type/
export const UploadImages = (): JSX.Element => {
  const [images, setImages] = useState<File[]>([]);

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('drag enter');
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';

    console.log('drag over');
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('drag leave');
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    let files = Array.from(e.dataTransfer.files);

    if (files && files.length > 0) {
      const existingFiles = images.map((f) => f.name);
      files = files.filter((f) => !existingFiles.includes(f.name));
      setImages(images.concat(files));
    }
    console.log('on drop');
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
              <Image
                alt={`${f.name}`}
                src={URL.createObjectURL(f)}
                layout={`fill`}
                objectFit={`cover`}
              />
            </AspectRatio>
          );
        })}
      </Flex>
    </Flex>
  );
};
