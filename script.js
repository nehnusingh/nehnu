document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth'});
    document.querySelector('#site-nav')?.classList.remove('open');
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded','false');
  });
});
const sections = document.querySelectorAll('section');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('show');observer.unobserve(entry.target);}});
  }, {threshold:0.08});
  sections.forEach(el=>observer.observe(el));
} else sections.forEach(el=>el.classList.add('show'));
const menu = document.querySelector('.menu-toggle');
menu?.addEventListener('click',()=>{
  const open=document.querySelector('#site-nav').classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
});
// Use direct MP4/WebM URLs for inline playback. YouTube links open on YouTube.
// Links are assigned to the project cards in the same order as this array.
const videoLinks = [
  'https://youtube.com/shorts/5bnM9J1SXZs?si=GhtrOb47dWkJoHn9',
  'https://youtube.com/shorts/n1nqPwSuB6E?si=75OpUKLKVI_gWkEc',
  '', // Add the direct URL for Solstice Watches.
  '' // Add the direct URL for Static Bloom.
];

document.querySelectorAll('.thumb').forEach((thumb,index)=>{
  const video=thumb.querySelector('video');
  const button=thumb.querySelector('.play');
  if(!video||!button)return;
  const source=videoLinks[index];
  const status=document.createElement('p');
  status.className='video-status';
  status.setAttribute('role','status');
  status.hidden=true;
  thumb.append(status);
  const showError=()=>{
    video.controls=false;
    button.hidden=true;
    status.textContent='Video unavailable. Please try again later.';
    status.hidden=false;
  };
  if(!source){
    button.hidden=true;
    status.textContent='Video coming soon';
    status.hidden=false;
    return;
  }
  const sourceUrl=new URL(source,window.location.href);
  if(/(^|\.)(youtube\.com|youtu\.be|youtube-nocookie\.com)$/.test(sourceUrl.hostname)){
    const link=document.createElement('a');
    link.className='play';
    link.href=sourceUrl.href;
    link.target='_blank';
    link.rel='noopener noreferrer';
    link.textContent='\u25B6';
    link.setAttribute('aria-label','Watch project video on YouTube (opens in a new tab)');
    button.replaceWith(link);
    status.textContent='Watch on YouTube';
    status.hidden=false;
    return;
  }
  video.src=source;
  video.addEventListener('error',showError);
  const updateButton=()=>{
    button.hidden=!video.paused&&!video.ended;
    button.textContent='\u25B6';
    button.setAttribute('aria-label','Play project video');
  };
  video.addEventListener('play',()=>{
    document.querySelectorAll('.thumb video').forEach(otherVideo=>{
      if(otherVideo!==video)otherVideo.pause();
    });
    updateButton();
  });
  video.addEventListener('pause',updateButton);
  video.addEventListener('ended',updateButton);
  button.addEventListener('click',async()=>{
    try{
      video.controls=true;
      video.muted=false;
      await video.play();
    } catch {
      showError();
    }
  });
});

document.querySelector('#contact-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const fields=new FormData(e.currentTarget);
  const subject=encodeURIComponent('Portfolio inquiry: '+(fields.get('project')||'New project'));
  const body=encodeURIComponent(`Name: ${fields.get('name')}\nEmail: ${fields.get('email')}\nProject: ${fields.get('project')}\n\n${fields.get('message')}`);
  window.location.href=`mailto:nehnusingh81@gmail.com?subject=${subject}&body=${body}`;
});
