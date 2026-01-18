import React, { useState } from 'react'
import { useConfigStore } from '@renderer/store/configProvider'
import { Box } from '@mui/material'
import { BoxIcon } from 'lucide-react'

interface ImageDefaultProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  url?: string | null
  alt?: string
  className?: string
  style?: React.CSSProperties
  rounded?: string
  width?: string
  height?: string
  objectFit?: string
  fallbackUrl?: string
  fallbackBoxIcon?: React.ReactNode
  fallbackBoxSx?: object
  boxProps?: React.ComponentProps<typeof Box>
}
export const ImageDefault: React.FC<ImageDefaultProps> = ({
  url,
  alt = 'Image',
  className = '',
  style,
  rounded = 'rounded-lg',
  width = 'w-full',
  height = '',
  objectFit = 'object-cover',
  fallbackUrl,
  fallbackBoxIcon,
  fallbackBoxSx,
  boxProps,
  ...imgProps
}) => {
  const { assetsPathConfig } = useConfigStore()
  const defaultFallbackUrl = `${assetsPathConfig}\\images\\no_img.jpg`
  const [imgSrc, setImgSrc] = useState(url || fallbackUrl || defaultFallbackUrl)

  if (url) {
    return (
      <img
        style={style}
        src={imgSrc}
        alt={alt}
        onError={() => setImgSrc(fallbackUrl || defaultFallbackUrl)}
        className={`${rounded} ${width} ${height} ${objectFit} ${className}`}
        {...imgProps}
      />
    )
  }
  return (
    <Box
      sx={{
        height: 140,
        bgcolor: 'grey.100',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '4rem',
        ...fallbackBoxSx
      }}
      {...boxProps}
    >
      {fallbackBoxIcon || (
        <BoxIcon style={{ fontSize: '2rem', color: 'gray', width: '3rem', height: '3rem' }} />
      )}
    </Box>
  )
}
