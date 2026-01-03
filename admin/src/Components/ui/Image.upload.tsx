import { Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './button';
import { Card, CardContent } from './card';

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
  disabled?: boolean;
}

const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(value || null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
    disabled,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        try {
          const base64 = await convertToBase64(acceptedFiles[0]);
          setPreview(base64);
          onChange(base64);
        } catch (error) {
          console.error('Error converting file to base64:', error);
        }
      }
    },
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(''); // Clear the base64 value
  };
  return (
    <Card className='border-dashed overflow-hidden'>
      <CardContent className='p-0'>
        <div
          {...getRootProps({
            className: 'flex items-center justify-center p-6 cursor-pointer',
          })}
        >
          <input
            type='file'
            {...getInputProps()}
          />

          {preview ? (
            <div className='relative w-full'>
              <img
                src={preview}
                alt='Preview'
                className='w-full h-50 object-cover rounded-md'
              />
              <Button
                type='button'
                variant={'destructive'}
                size={'icon'}
                className='absolute top-2 right-2'
                onClick={handleRemove}
                disabled={disabled}
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center gap-2 h-50 w-full border border-dashed text-sm border-muted-foreground/50 rounded-md'>
              <Upload className='w-10 h-10 text-muted-foreground mb-2' />
              <p className='text-sm text-muted-foreground mb-1'>
                Drag &amp; Drop or Click to Upload
              </p>
              <p className='text-xs text-muted-foreground/70'>
                an Image ( Max 10MB )
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
