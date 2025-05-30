'use client';
import { useState } from 'react';
import Image from 'next/image';
import { User as TUser } from 'next-auth';
import { useTranslations } from 'next-intl';

import type { PutBlobResult } from '@vercel/blob';
import clsx from 'clsx';
import { CirclePlus, Trash2 } from 'lucide-react';

import { compressFile } from './utils';

import Spinner from '@/components/ui/spinner';
import useUpdateSession from '@/hooks/useUpdateSession';
import useUserStore from '@/stores/user';

const ImageUploader = ({ id }: { id: number }) => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const { updateSession } = useUpdateSession();
  const [fileEnter, setFileEnter] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [loading, setLoading] = useState(false);
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif']; // Supported image types
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(user?.photos?.[id] || null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const commonMessage = !user?.photos?.[id] ? t('no-photo-uploaded') : t('photo-uploaded');

  const handleFileSelection = async (file: File) => {
    setError('');
    setSuccessMessage('');
    if (allowedMimeTypes.includes(file.type)) {
      setIsCompressing(true);
      setSuccessMessage(t('image-processing'));
      try {
        const compressedImage = await compressFile(file); // Compress the image
        if (compressedImage) {
          const response = await fetch(`/api/avatar?filename=${compressedImage.name}`, {
            method: 'POST',
            body: compressedImage,
          });

          const newBlob = (await response.json()) as PutBlobResult;
          setBlob(newBlob);
          setPhotoUrl(newBlob?.url);

          // Save the compressed image to the user's profile
          const responseSQL = await fetch(`/api/avatar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: user?.id,
              url: newBlob?.url,
            }),
          });

          const result = await responseSQL.json();
          const updatedUserData: TUser = result.user;

          if (responseSQL.ok) {
            if (updatedUserData) {
              //setUser({ ...user, ...updatedUserData });
              await updateSession(updatedUserData);
            }
          } else {
            setError(t(result.error));
          }

          setSuccessMessage(t('image-processed-success'));
        } else {
          setSuccessMessage('');
          setError(t('image-compression-failed'));
        }
      } catch (error) {
        setSuccessMessage('');
        setError(t('image-upload-failed'));
      }
      setIsCompressing(false);
    } else {
      setSuccessMessage('');
      setError(t('only-image-files-allowed'));
    }
  };

  const handleFileDeletion = async () => {
    setLoading(true);
    const response = await fetch(
      `/api/avatar?id=${user?.id}&url=${encodeURIComponent(photoUrl!)}`,
      {
        method: 'DELETE',
      }
    );

    const result = await response.json();
    const updatedUserData: TUser = result.user;
    if (response.ok) {
      setSuccessMessage(t(result.message));
      setLoading(false);
      if (updatedUserData) {
        //setUser({ ...user, ...updatedUserData });
        await updateSession(updatedUserData);
      }
    } else {
      setLoading(false);
      setError(t(result.error));
    }

    setBlob(null);
    setPhotoUrl(null);
    setLoading(false);
  };

  return (
    <div className="container flex max-w-3xl flex-row items-center justify-between gap-5 rounded-lg border py-1">
      <>
        {!photoUrl ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setFileEnter(true);
            }}
            onDragLeave={() => {
              setFileEnter(false);
            }}
            onDragEnd={(e) => {
              e.preventDefault();
              setFileEnter(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setFileEnter(false);

              if (e.dataTransfer.items) {
                [...e.dataTransfer.items].forEach((item) => {
                  if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file) {
                      handleFileSelection(file); // Handle file compression and preview
                    }
                  }
                });
              } else {
                [...e.dataTransfer.files].forEach((file) => {
                  handleFileSelection(file); // Handle file compression and preview
                });
              }
            }}
            className={clsx(
              'border-muted-foreground bg-input flex h-20 w-20 max-w-xs flex-col items-center justify-center border-dashed',
              fileEnter ? 'border-4' : 'border-2'
            )}
          >
            <label
              htmlFor={`file{${id}}`}
              className="flex h-full flex-col justify-center text-center"
            >
              {isCompressing || loading ? (
                <Spinner size={21} />
              ) : (
                <CirclePlus
                  size={21}
                  className="text-muted-foreground smooth42transition hover:text-positive cursor-pointer"
                />
              )}
            </label>
            <input
              id={`file{${id}}`}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files[0]) {
                  handleFileSelection(files[0]); // Handle file compression and preview
                }
              }}
            />
          </div>
        ) : (
          <div className="relative flex h-20 w-20 items-center justify-center">
            {/* PREVIEW SECTION */}
            {photoUrl && (
              <Image
                src={`${photoUrl}`}
                alt="photo2"
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-full rounded-md object-cover"
                placeholder="blur"
                blurDataURL={'/identity/logo-square.png'}
                priority
                style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
              />
            )}
            {/* REMOVE BUTTON */}

            <button
              disabled={loading}
              className={clsx(
                'bg-card/80 text-muted-foreground smooth42transition absolute top-1 right-1 flex rounded-full border p-1',
                loading ? 'opacity-60' : 'hover:text-destructive opacity-100'
              )}
            >
              <Trash2 size={15} onClick={handleFileDeletion} />
            </button>
          </div>
        )}
      </>
      <div className="w-52">
        {loading ? (
          <Spinner size={21} />
        ) : (
          <div>
            {error && <div className="text-destructive text-xs">{error}</div>}
            {successMessage && <div className="text-positive text-xs">{successMessage}</div>}
            {!error && !successMessage && !loading && commonMessage && (
              <div className="text-foreground text-xs">{commonMessage}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
