import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0.5,
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0.5,
    }
  },
}

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

export default function ImagesCarousel({
  images,
  className,
  autoplay = true,
}: {
  autoplay?: boolean
  className?: string
  images: string[]
}) {
  const [[page, direction], setPage] = useState([0, 0])

  const [loading, setLoading] = useState(false)
  const [loadedImages, setLoadedImages] = useState<string[]>([])

  const handleNext = () => {
    setPage(([currentPage, currentDirection]) => [
      currentPage + 1 === images.length ? 0 : currentPage + 1,
      1,
    ])
  }

  const handlePrevious = () => {
    setPage(([currentPage, currentDirection]) => [
      currentPage - 1 < 0 ? images.length - 1 : currentPage - 1,
      -1,
    ])
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNext()
      } else if (event.key === 'ArrowLeft') {
        handlePrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // autoplay
    let interval: any
    if (autoplay) {
      interval = setInterval(() => {
        handleNext
      }, 5000)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    loadImages()
  }, [])

  useEffect(() => {}, [])

  const loadImages = () => {
    setLoading(true)
    const loadPromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = image
        img.onload = () => resolve(image)
        img.onerror = reject
      })
    })

    Promise.all(loadPromises)
      .then((loadedImages) => {
        setLoadedImages(loadedImages as string[])
        setLoading(false)
      })
      .catch((error) => console.error('Failed to load images', error))
  }

  const areImagesLoaded = loadedImages.length > 0

  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden ',
        className,
      )}
    >
      {areImagesLoaded && (
        <>
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={page}
              src={loadedImages[page]}
              custom={direction}
              variants={variants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={{
                x: { type: 'spring', stiffness: 100, damping: 15 },
                opacity: { duration: 0.5 },
              }}
              className='image animate-fade-in absolute inset-0 h-full w-full object-cover object-center'
              drag='x'
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x)

                if (swipe < -swipeConfidenceThreshold) {
                  handleNext
                } else if (swipe > swipeConfidenceThreshold) {
                  handlePrevious
                }
              }}
            />
          </AnimatePresence>
          <div className='flex h-full items-center justify-between'>
            <div
              className='absolute left-0 z-10 mx-2  my-auto  flex h-7  w-7 items-center justify-center rounded-full bg-background text-wotanRed-500 shadow-wotan-light hover:bg-wotanRed-500 hover:text-background'
              onClick={handlePrevious}
            >
              <ArrowLeft className='h-6 w-6' />
            </div>
            <div
              className='absolute right-0 z-10 mx-2 my-auto  flex h-7  w-7 items-center justify-center rounded-full bg-background text-wotanRed-500 shadow-wotan-light hover:bg-wotanRed-500 hover:text-background'
              onClick={handleNext}
            >
              <ArrowRight className='h-6 w-6' />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
