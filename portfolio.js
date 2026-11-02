const frame=document.getElementById('dashboard-frame');
const loader=document.querySelector('.frame-loader');
const label=document.getElementById('browser-label');
const openLink=document.getElementById('open-dashboard');
const panel=document.getElementById('demo-panel');
const demoButtons=[...document.querySelectorAll('[data-dashboard]')];
function selectDashboard(button,updateUrl=true){
  if(!button)return;
  loader.classList.add('loading');
  frame.classList.add('switching');
  frame.title=button.dataset.title;
  label.textContent=new URL(button.dataset.dashboard).hostname;
  openLink.href=button.dataset.open||button.dataset.dashboard;
  demoButtons.forEach(item=>{
    const active=item===button;
    item.classList.toggle('active',active);
    item.setAttribute('aria-selected',String(active));
    item.tabIndex=active?0:-1;
  });
  panel.setAttribute('aria-labelledby',button.id);
  if(frame.getAttribute('src')!==button.dataset.dashboard)frame.src=button.dataset.dashboard;
  else{loader.classList.remove('loading');frame.classList.remove('switching');}
  if(updateUrl){const url=new URL(location.href);url.searchParams.set('demo',button.dataset.product);history.replaceState(null,'',url);}
}
demoButtons.forEach((button,index)=>{
  button.addEventListener('click',()=>selectDashboard(button));
  button.addEventListener('keydown',event=>{
    let target;
    if(event.key==='ArrowRight')target=(index+1)%demoButtons.length;
    if(event.key==='ArrowLeft')target=(index+demoButtons.length-1)%demoButtons.length;
    if(event.key==='Home')target=0;
    if(event.key==='End')target=demoButtons.length-1;
    if(target!==undefined){event.preventDefault();demoButtons[target].focus();selectDashboard(demoButtons[target]);}
  });
});
frame.addEventListener('load',()=>{loader.classList.remove('loading');frame.classList.remove('switching');});
selectDashboard(demoButtons.find(button=>button.dataset.product===new URL(location.href).searchParams.get('demo'))??demoButtons[0],false);
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
