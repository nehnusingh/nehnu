import { useEffect, useRef, useState } from 'react';
import { projects } from './data';
import { getYouTubeId, getYouTubeEmbedUrl } from './youtube';

export function VideoModal({ project, onClose }) {
  const dialogRef = useRef(null);
  const videoId = getYouTubeId(project.url);

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  return <dialog ref={dialogRef} className="video-modal" aria-labelledby="video-modal-title"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
    <div className="flex items-center justify-between gap-4 border-b-[3px] border-ink bg-cream px-5 py-4">
      <h2 id="video-modal-title" className="text-lg font-semibold text-ink">{project.title}</h2>
      <button type="button" autoFocus onClick={onClose} aria-label="Close video" className="shrink-0 rounded-lg border-2 border-ink bg-yellow px-3 py-2 font-semibold text-ink">Close ×</button>
    </div>
    <iframe className="modal-player" title={`${project.title} — YouTube player`} src={getYouTubeEmbedUrl(videoId)} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
    <div className="flex flex-wrap items-center justify-between gap-2 bg-cream px-5 py-3 text-xs text-ink">
      <span>Press Escape or click outside to close.</span>
      <a href={project.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">Watch on YouTube ↗</a>
    </div>
  </dialog>;
}

function ProjectCard({ project, index, preview, onHover, onOpen }) {
  const videoId = getYouTubeId(project.url);
  return <article onPointerEnter={event => { if (event.pointerType === 'mouse') onHover(index); }} onPointerLeave={() => onHover(null)}
    className={`project-card paper-card relative overflow-hidden bg-white ${index % 2 ? 'rotate-1' : '-rotate-1'}`}>
    <div className={`project-art ${project.artwork} relative flex aspect-[16/10] flex-col items-center justify-center overflow-hidden border-b-[3px] border-ink px-5 text-center`}>
      <span className="absolute top-3 right-3 z-10 rounded-full border-2 border-ink bg-cream px-3 py-1 text-[10px] font-bold tracking-wide text-ink uppercase">{project.category}</span>
      <span className="relative text-[10px] tracking-[.3em]">{project.note}</span>
      <span aria-hidden="true" className="art-title relative mt-2 text-4xl font-bold sm:text-5xl">{project.lettering}</span>
      {videoId ? <>
        {preview && <iframe className="pointer-events-none absolute inset-0 h-full w-full border-0 bg-black" title={`${project.title} — muted preview`} src={getYouTubeEmbedUrl(videoId, true)} tabIndex={-1} aria-hidden="true" allow="autoplay; encrypted-media" referrerPolicy="strict-origin-when-cross-origin" />}
        <span aria-hidden="true" className={`relative mt-6 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-ink bg-cream text-lg text-ink shadow-[3px_3px_0_var(--color-ink)] ${preview ? 'opacity-0' : ''}`}>▶</span>
        <span className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ink">{preview ? 'Muted preview · Click to watch' : 'Hover to preview · Click to watch'}</span>
      </> : <span className="relative mt-6 rounded-full bg-cream px-4 py-2 text-xs font-semibold text-ink">Video coming soon</span>}
    </div>
    <div className="p-6 text-ink"><h3 className="mb-2 text-xl font-semibold">{project.title}</h3><p className="text-sm leading-7 text-ink/75">{project.description}</p></div>
    {videoId && <button type="button" onClick={() => onOpen(project)} aria-label={`Watch ${project.title}`} aria-haspopup="dialog" className="project-open absolute inset-0 z-20 h-full w-full rounded-[10px]" />}
  </article>;
}

export default function ProjectVideos() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const stopPreview = () => setHovered(null);
    window.addEventListener('blur', stopPreview);
    document.addEventListener('visibilitychange', stopPreview);
    return () => {
      window.removeEventListener('blur', stopPreview);
      document.removeEventListener('visibilitychange', stopPreview);
    };
  }, []);
  return <>
    <div className="relative z-10 grid gap-8 md:grid-cols-2 lg:gap-10">
      {projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} preview={hovered === index && !selected} onHover={setHovered} onOpen={project => { setHovered(null); setSelected(project); }} />)}
    </div>
    {selected && <VideoModal project={selected} onClose={() => setSelected(null)} />}
  </>;
}
