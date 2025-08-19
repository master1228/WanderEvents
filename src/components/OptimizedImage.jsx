import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes = '',
  quality = 85,
  format = 'auto',
  fallbackSrc = null,
  onLoad = null,
  onError = null,
  itemProp = null,
  ...props
}) => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef(null);

  // Генерируем srcSet для разных разрешений
  const generateSrcSet = (baseSrc, baseFormat = format) => {
    if (!baseSrc || baseSrc.startsWith('data:')) return '';

    const formats = baseFormat === 'auto' ? ['webp', 'avif'] : [baseFormat];
    const scales = [1, 1.5, 2, 3];
    
    return formats.map(fmt => 
      scales.map(scale => {
        const scaleSuffix = scale === 1 ? '' : `@${scale}x`;
        // Простая замена расширения для демонстрации
        const optimizedSrc = baseSrc.replace(/\.(jpg|jpeg|png|gif)$/i, `${scaleSuffix}.${fmt}`);
        return `${optimizedSrc} ${scale}x`;
      }).join(', ')
    ).join(', ');
  };

  // Intersection Observer для lazy loading
  useEffect(() => {
    if (!imgRef.current || loading !== 'lazy' || priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Загружаем изображение когда оно попадает в viewport
            setIsLoaded(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Начинаем загрузку за 50px до попадания в viewport
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loading, priority]);

  // Обработчики событий
  const handleLoad = (event) => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) onLoad(event);
  };

  const handleError = (event) => {
    setHasError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    if (onError) onError(event);
  };

  // Генерируем автоматический alt текст если не передан
  const getAltText = () => {
    if (alt) return alt;
    
    // Извлекаем имя файла для автоматического alt
    const fileName = src?.split('/').pop()?.split('.')[0] || '';
    const cleanName = fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return cleanName || t('image.default_alt', { defaultValue: 'Image' });
  };

  // Определяем размеры для responsive изображений
  const getImageSizes = () => {
    if (sizes) return sizes;
    
    // Автоматические размеры на основе ширины
    if (width) {
      const numWidth = parseInt(width);
      if (numWidth <= 400) return '(max-width: 768px) 100vw, 400px';
      if (numWidth <= 800) return '(max-width: 768px) 100vw, 800px';
      return '(max-width: 768px) 100vw, 1200px';
    }
    
    return '100vw';
  };

  // Inline стили для улучшения LCP
  const imageStyles = {
    maxWidth: '100%',
    height: 'auto',
    transition: 'opacity 0.3s ease',
    opacity: isLoaded ? 1 : 0,
    ...(width && { width: `${width}px` }),
    ...(height && { height: `${height}px` }),
  };

  // Placeholder для загрузки
  const placeholderSrc = `data:image/svg+xml;base64,${btoa(`
    <svg width="${width || 300}" height="${height || 200}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="14" fill="#666">
        ${t('image.loading', { defaultValue: 'Loading...' })}
      </text>
    </svg>
  `)}`;

  // Возвращаем элемент изображения
  return (
    <div 
      className={`optimized-image-container ${className}`} 
      ref={imgRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Placeholder пока изображение загружается */}
      {!isLoaded && !hasError && (
        <img
          src={placeholderSrc}
          alt=""
          style={{
            ...imageStyles,
            opacity: 1,
            filter: 'blur(2px)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Основное изображение */}
      {(priority || isLoaded || loading === 'eager') && !hasError && (
        <picture>
          {/* WebP источник для современных браузеров */}
          <source
            srcSet={generateSrcSet(src, 'webp')}
            sizes={getImageSizes()}
            type="image/webp"
          />
          
          {/* AVIF источник для самых современных браузеров */}
          <source
            srcSet={generateSrcSet(src, 'avif')}
            sizes={getImageSizes()}
            type="image/avif"
          />
          
          {/* Основной источник */}
          <img
            src={currentSrc}
            alt={getAltText()}
            width={width}
            height={height}
            loading={priority ? 'eager' : loading}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            style={{
              ...imageStyles,
              position: !isLoaded ? 'absolute' : 'static',
              top: !isLoaded ? 0 : 'auto',
              left: !isLoaded ? 0 : 'auto',
            }}
            itemProp={itemProp}
            {...props}
          />
        </picture>
      )}

      {/* Сообщение об ошибке */}
      {hasError && (
        <div
          style={{
            ...imageStyles,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#666',
            fontSize: '14px',
            border: '1px solid #ddd',
          }}
          role="img"
          aria-label={getAltText()}
        >
          {t('image.error', { defaultValue: 'Failed to load image' })}
        </div>
      )}
    </div>
  );
};

// Компонент для preloading критических изображений
export const ImagePreloader = ({ images = [] }) => {
  useEffect(() => {
    // Preload критических изображений
    images.forEach(({ src, format = 'webp' }) => {
      if (!src) return;
      
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      
      // Указываем MIME тип для WebP/AVIF
      if (format === 'webp') link.type = 'image/webp';
      if (format === 'avif') link.type = 'image/avif';
      
      link.setAttribute('data-image-preload', 'true');
      document.head.appendChild(link);
    });

    // Очистка при размонтировании
    return () => {
      document.head.querySelectorAll('[data-image-preload]').forEach(link => link.remove());
    };
  }, [images]);

  return null;
};

export default OptimizedImage;
