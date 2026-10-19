export function getYouTubeId(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');
    let id;
    if (host === 'youtu.be') id = url.pathname.split('/')[1];
    else if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) {
      id = url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1];
    }
    return /^[\w-]{11}$/.test(id || '') ? id : null;
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(id, preview = false) {
  const params = new URLSearchParams({
    autoplay: '1', playsinline: '1', rel: '0',
    controls: preview ? '0' : '1', mute: preview ? '1' : '0',
  });
  if (preview) {
    params.set('loop', '1');
    params.set('playlist', id);
    params.set('disablekb', '1');
    params.set('fs', '0');
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}
