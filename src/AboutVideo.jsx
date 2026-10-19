import { useEffect, useState } from 'react';
import { rawFootage } from './data';
import { getYouTubeId, getYouTubeEmbedUrl } from './youtube';
import { VideoModal } from './ProjectVideos';

export default function AboutVideo() {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const videoId = getYouTubeId(rawFootage.url);
  const preview = hovered && !open && videoId;

  useEffect(() => {
    const stopPreview = () => setHovered(false);
    window.addEventListener('blur', stopPreview);
    document.addEventListener('visibilitychange', stopPreview);
    return () => {
      window.removeEventListener('blur', stopPreview);
      document.removeEventListener('visibilitychange', stopPreview);
    };
  }, []);

  return <>
    <div className="about-art paper-card relative mx-auto flex aspect-[4/5] w-full max-w-md -rotate-2 flex-col items-center justify-center bg-teal p-8 text-cream"
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={() => setHovered(false)}>
      {videoId && <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[11px]">
        <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" width="480" height="360" loading="lazy" className="h-full w-full object-cover" onError={event => { event.currentTarget.hidden = true; }} />
        <div className="absolute inset-0 bg-black/45" />
        {preview && <iframe className="absolute inset-0 h-full w-full border-0 bg-black" title="Raw Footage — muted preview" src={getYouTubeEmbedUrl(videoId, true)} tabIndex={-1} aria-hidden="true" allow="autoplay; encrypted-media" referrerPolicy="strict-origin-when-cross-origin" />}
      </div>}
      <span className="tape pointer-events-none absolute -top-4 left-1/2 z-30 h-9 w-28 -translate-x-1/2 rotate-3" aria-hidden="true" />
      <div className={`pointer-events-none relative text-center ${preview ? 'opacity-0' : ''}`}>
        <span aria-hidden="true" className="font-display text-7xl">[ ▶ ]</span>
        <span className="font-hand mt-6 block text-3xl">RAW FOOTAGE</span>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-8 z-10 text-center">
        <span className="block text-xs tracking-[.25em]">THE STORY STARTS HERE</span>
        {videoId && <span className="mt-3 inline-block rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ink">{preview ? 'Muted preview · Click to watch' : 'Watch raw footage ↗'}</span>}
      </div>
      {videoId && <button type="button" onClick={() => { setHovered(false); setOpen(true); }} aria-label="Watch Raw Footage video" aria-haspopup="dialog" className="project-open absolute inset-0 z-20 h-full w-full rounded-[10px]" />}
    </div>
    {open && <VideoModal project={rawFootage} onClose={() => setOpen(false)} />}
  </>;
}
