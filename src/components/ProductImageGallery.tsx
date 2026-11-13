import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from 'react';
import { mediaUrl } from '../api/client';
import type { ProductImage } from '../types/product';

interface Props {
  images: ProductImage[];
  productName: string;
}

const LENS_SIZE = 150;
const ZOOM_SCALE = 2.5;

export function ProductImageGallery({ images, productName }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [lens, setLens] = useState({ x: 0, y: 0 });
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const current = images[activeImage];
  const imageSrc = current ? mediaUrl(current.url) : '';

  useEffect(() => {
    setHovering(false);
  }, [activeImage]);

  useEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      setStageSize({ w: rect.width, h: rect.height });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [current?.id]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  function updateLens(clientX: number, clientY: number) {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    setStageSize({ w: rect.width, h: rect.height });

    const half = LENS_SIZE / 2;
    const x = Math.max(half, Math.min(clientX - rect.left, rect.width - half));
    const y = Math.max(half, Math.min(clientY - rect.top, rect.height - half));
    setLens({ x: x - half, y: y - half });
  }

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    setHovering(true);
    updateLens(e.clientX, e.clientY);
  }

  function onTouchMove(e: TouchEvent<HTMLDivElement>) {
    const touch = e.touches[0];
    if (!touch) return;
    setHovering(true);
    updateLens(touch.clientX, touch.clientY);
  }

  const showZoomPane = Boolean(current && hovering && stageSize.w > 0);

  return (
    <div className="gallery flipkart-gallery">
      <div className="gallery-stage-wrap">
        <div
          ref={stageRef}
          className="gallery-main flipkart-stage"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onMouseMove={onMouseMove}
          onTouchStart={onTouchMove}
          onTouchMove={onTouchMove}
          onTouchEnd={() => setHovering(false)}
          onClick={() => {
            if (current) setLightboxOpen(true);
          }}
          role="button"
          tabIndex={0}
          aria-label="Zoom product image"
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && current) {
              e.preventDefault();
              setLightboxOpen(true);
            }
          }}
        >
          {current ? (
            <>
              <img
                src={imageSrc}
                alt={current.alt ?? productName}
                draggable={false}
              />
              {hovering ? (
                <div
                  className="zoom-lens"
                  style={{
                    width: LENS_SIZE,
                    height: LENS_SIZE,
                    transform: `translate(${lens.x}px, ${lens.y}px)`,
                  }}
                />
              ) : null}
            </>
          ) : (
            <div className="placeholder gallery-empty">AT</div>
          )}
        </div>

        {showZoomPane ? (
          <div
            className="zoom-result"
            style={{
              width: stageSize.w,
              height: stageSize.h,
              backgroundImage: `url(${imageSrc})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${stageSize.w * ZOOM_SCALE}px ${stageSize.h * ZOOM_SCALE}px`,
              backgroundPosition: `-${lens.x * ZOOM_SCALE}px -${lens.y * ZOOM_SCALE}px`,
            }}
            aria-hidden
          />
        ) : null}
      </div>

      {images.length > 0 ? (
        <div className="gallery-thumbs">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={index === activeImage ? 'active' : ''}
              onClick={() => setActiveImage(index)}
              onMouseEnter={() => setActiveImage(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={mediaUrl(image.url)}
                alt={image.alt ?? `${productName} ${index + 1}`}
              />
            </button>
          ))}
        </div>
      ) : null}

      {current ? (
        <p className="muted gallery-hint">
          Hover to zoom · click for fullscreen
          {images.length > 1 ? ` · ${images.length} photos` : ''}
        </p>
      ) : null}

      {lightboxOpen && current ? (
        <div
          className="zoom-lightbox"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen product image"
        >
          <button
            type="button"
            className="zoom-lightbox-close"
            onClick={() => setLightboxOpen(false)}
          >
            Close
          </button>
          <img
            src={imageSrc}
            alt={current.alt ?? productName}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
