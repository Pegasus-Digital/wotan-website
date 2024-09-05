import { Icons } from '@/components/icons'

enum FileTypes {
  Image = 'image',
  Pdf = 'pdf',
  Audio = 'audio',
  Video = 'video',
  Other = 'other',
}

const ImageColor = {
  bgColor: 'bg-purple-600',
  fillColor: 'fill-purple-600',
}

const PdfColor = {
  bgColor: 'bg-blue-400',
  fillColor: 'fill-blue-400',
}

const AudioColor = {
  bgColor: 'bg-yellow-400',
  fillColor: 'fill-yellow-400',
}

const VideoColor = {
  bgColor: 'bg-green-400',
  fillColor: 'fill-green-400',
}

const OtherColor = {
  bgColor: 'bg-gray-400',
  fillColor: 'fill-gray-400',
}

export const getFileIconAndColor = (file: File) => {
  if (!file) {
    return null
  }

  if (file.type.includes(FileTypes.Image)) {
    return {
      icon: <Icons.FileImage size={40} className={ImageColor.fillColor} />,
      color: ImageColor.bgColor,
    }
  }

  if (file.type.includes(FileTypes.Pdf)) {
    return {
      icon: <Icons.File size={40} className={PdfColor.fillColor} />,
      color: PdfColor.bgColor,
    }
  }

  if (file.type.includes(FileTypes.Audio)) {
    return {
      icon: <Icons.AudioWaveform size={40} className={AudioColor.fillColor} />,
      color: AudioColor.bgColor,
    }
  }

  if (file.type.includes(FileTypes.Video)) {
    return {
      icon: <Icons.Video size={40} className={VideoColor.fillColor} />,
      color: VideoColor.bgColor,
    }
  }

  return {
    icon: <Icons.FolderArchive size={40} className={OtherColor.fillColor} />,
    color: OtherColor.bgColor,
  }
}
