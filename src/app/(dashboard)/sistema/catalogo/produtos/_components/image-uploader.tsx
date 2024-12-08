'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { Media } from '@/payload/payload-types'

import { toast } from 'sonner'

import { getFileIconAndColor } from '@/lib/upload'

import { UploadCloud, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { ProgressBar } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Lead, Small } from '@/components/typography/texts'

import { ACCEPTED_IMAGE_TYPES } from '../_logic/validations'

interface FileUploadProgress {
  progress: number
  File: File
}

interface ImageUploaderProps {
  setMedia: any
}

export function ImageUploader({ setMedia }: ImageUploaderProps) {
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([])

  const uploadImageToPayload = async (formData: FormData) => {
    return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/media`, {
      method: 'POST',
      body: formData,
    })
  }

  const removeFile = (file: File) => {
    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.filter((item) => item.File !== file)
    })
  }

  const onDrop = useCallback(async (files: File[]) => {
    const acceptedFiles = files.filter((file) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`O formato de ${file.name} não é suportado.`)
        return false
      }

      return true
    })

    if (acceptedFiles.length === 0) {
      return
    }

    setFilesToUpload((prevUploadProgress) => {
      return [
        ...prevUploadProgress,
        ...acceptedFiles.map((file) => {
          return {
            progress: 0,
            File: file,
            source: null,
          }
        }),
      ]
    })

    const fileUploadBatch = acceptedFiles.map((file) => {
      const formData = new FormData()
      formData.append('file', file)

      return uploadImageToPayload(formData)
    })

    try {
      await Promise.all(fileUploadBatch).then((promises) =>
        promises.map((promise) =>
          promise.json().then((data) => {
            setMedia((prevState: Media[]) => [...prevState, data.doc])
          }),
        ),
      )

      setFilesToUpload([])

      toast.success('Upload realizado com sucesso.')
    } catch (error) {
      toast.error('Houve um erro ao realizar o upload.', error)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div>
      <div>
        <label
          {...getRootProps()}
          className='relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100'
        >
          <div className='text-center'>
            <div className='mx-auto max-w-min rounded-full bg-emerald-100 p-2'>
              <UploadCloud size={20} />
            </div>

            <Lead className='text-md mt-2 font-semibold'>Arraste arquivos</Lead>

            <Small className='text-xs text-gray-500'>
              ou clique para encontrar imagens na sua máquina
            </Small>
          </div>
        </label>

        <Input
          {...getInputProps()}
          id='dropzone-file'
          accept='image/png, image/jpeg'
          type='file'
          className='hidden'
        />
      </div>

      {filesToUpload.length > 0 && (
        <div>
          <ScrollArea className='h-40'>
            <p className='my-2 mt-6 text-sm font-medium text-muted-foreground'>
              Arquivos a serem salvos
            </p>
            <div className='space-y-2 pr-3'>
              {filesToUpload.map((fileUploadProgress) => {
                return (
                  <div
                    key={fileUploadProgress.File.lastModified}
                    className='group flex justify-between gap-2 overflow-hidden rounded-lg border border-slate-100 pr-2 hover:pr-0'
                  >
                    <div className='flex flex-1 items-center p-2'>
                      <div className='text-white'>
                        {getFileIconAndColor(fileUploadProgress.File).icon}
                      </div>

                      <div className='ml-2 w-full space-y-1'>
                        <div className='flex justify-between text-sm'>
                          <p className='text-muted-foreground '>
                            {fileUploadProgress.File.name.slice(0, 25)}
                          </p>
                          <span className='text-xs'>
                            {fileUploadProgress.progress}%
                          </span>
                        </div>
                        <ProgressBar
                          progress={fileUploadProgress.progress}
                          className={
                            getFileIconAndColor(fileUploadProgress.File).color
                          }
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        removeFile(fileUploadProgress.File)
                      }}
                      className='hidden cursor-pointer items-center justify-center bg-red-500 px-2 text-white transition-all group-hover:flex'
                    >
                      <X size={20} />
                    </button>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
