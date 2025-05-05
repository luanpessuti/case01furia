'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0.1) // Inicialize com valor pequeno para evitar NaN
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Configura todos os event listeners do vídeo
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0.1)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    // Configura os listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    // Limpeza
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Atualiza a duração quando o vídeo é carregado
  useEffect(() => {
    const video = videoRef.current
    if (video && video.readyState > 0) {
      setDuration(video.duration || 0.1)
    }
  }, [videoRef.current?.src])

  // Esconder controles após inatividade
  useEffect(() => {
    const handleActivity = () => {
      setShowControls(true)
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current)
      }

      controlsTimeout.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    handleActivity()
    const container = videoRef.current?.parentElement
    container?.addEventListener('mousemove', handleActivity)
    container?.addEventListener('touchstart', handleActivity)

    return () => {
      container?.removeEventListener('mousemove', handleActivity)
      container?.removeEventListener('touchstart', handleActivity)
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current)
      }
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return

    const rect = progressRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = pos * videoRef.current.duration
  }

  const toggleFullscreen = () => {
    if (!videoRef.current) return

    if (!document.fullscreenElement) {
      videoRef.current.parentElement?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="relative w-full h-full group bg-stone-950 rounded-xl overflow-hidden border border-cyan-400/30 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
      {/* Vídeo principal */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        onClick={togglePlay}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration || 0.1)
          }
        }}
      >
        <source src="/videos/furia-highlights.mp4" type="video/mp4" />
      </video>

      {/* Barra de progresso - ATUALIZADA */}
      <div
        ref={progressRef}
        className="absolute top-0 left-0 right-0 h-1.5 bg-stone-800/80 cursor-pointer z-10 group-hover:h-2 transition-all duration-200"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-pink-400 shadow-[0_0_8px_rgba(0,240,255,0.5)] transition-all duration-200"
          style={{
            width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%'
          }}
        />
      </div>

      {/* Overlay de brilho */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(0,240,255,0.03)_0%,_rgba(0,0,0,0)_70%)]" />

      {/* Controles customizados */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950/95 via-stone-950/80 to-transparent p-4 z-10"
          >
            {/* Controles principais */}
            <div className="flex items-center gap-3 mb-1">
              {/* Botão Play/Pause */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="text-cyan-300 hover:text-pink-400 transition-colors p-1.5 rounded-full hover:bg-cyan-400/10 backdrop-blur-sm"
                aria-label={isPlaying ? "Pausar" : "Reproduzir"}
              >
                {isPlaying ? (
                  <PauseIcon className="h-5 w-5" />
                ) : (
                  <PlayIcon className="h-5 w-5" />
                )}
              </motion.button>

              {/* Controle de Volume */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="text-cyan-300 hover:text-pink-400 transition-colors p-1.5 rounded-full hover:bg-cyan-400/10 backdrop-blur-sm"
                  aria-label={isMuted ? "Ativar som" : "Desativar som"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeOffIcon className="h-4 w-4" />
                  ) : volume > 0.5 ? (
                    <VolumeUpIcon className="h-4 w-4" />
                  ) : (
                    <VolumeDownIcon className="h-4 w-4" />
                  )}
                </motion.button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-cyan-400 hover:accent-pink-400 cursor-pointer rounded-full h-1.5"
                  aria-label="Controle de volume"
                />
              </div>

              {/* Tempo decorrido */}
              <div className="text-cyan-300 text-xs font-mono tracking-tighter ml-2">
                <span>{formatTime(currentTime)}</span>
                <span className="text-cyan-400/50"> / </span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Botão Fullscreen */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullscreen}
                className="text-cyan-300 hover:text-pink-400 transition-colors p-1.5 rounded-full hover:bg-cyan-400/10 backdrop-blur-sm ml-auto"
                aria-label={isFullscreen ? "Sair de tela cheia" : "Tela cheia"}
              >
                {isFullscreen ? (
                  <FullscreenExitIcon className="h-4 w-4" />
                ) : (
                  <FullscreenIcon className="h-4 w-4" />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componentes de ícones atualizados
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function VolumeUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  )
}

function VolumeDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
    </svg>
  )
}

function VolumeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  )
}

function FullscreenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  )
}

function FullscreenExitIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
    </svg>
  )
}