
(function(){
  var ICONS={
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2"/>',
    pin:'<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/>',
    phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    bed:'<path d="M3 18V8M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/>',
    key:'<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M15 12v2"/>',
    box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    qr:'<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2"/>',
    drop:'<path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z"/>',
    towel:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 8h14M9 12h6"/>',
    doc:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    trend:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    chat:'<path d="M4 5h16v10H9l-5 4V5z"/><path d="M8 9h8M8 12h5"/>',
    list:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h1M4 12h1M4 18h1"/>',
    star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
    bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'
  };
  document.querySelectorAll('[data-icon]').forEach(function(el){var st=el.dataset.stroke||'#ff474f';el.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="'+st+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICONS[el.dataset.icon]+'</svg>'});

  var taken=[1,2,14,29,34,35,37,44,49,50,52,100,101,102],g=document.getElementById('wallgrid'),h='';if(g){
  for(var i=1;i<=110;i++){h+='<i class="'+(taken.indexOf(i)>=0?'t':'')+'">'+('00'+i).slice(-3)+'</i>'}
  g.innerHTML=h;}

  
  
  var nf=document.querySelector('form.notify');
  if(nf){nf.addEventListener('submit',function(e){e.preventDefault();var m=nf.querySelector('.nmsg'),btn=nf.querySelector('button');btn.disabled=true;
    fetch('/api/notify',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(nf)).toString()})
    .then(function(r){if(!r.ok)throw 0;nf.classList.add('ok');m.textContent="Thanks! We'll email you when "+(nf.name==='services-launch'?'TurnKey Services':'TurnKey Pro')+" launches.";nf.querySelector('input[type=email]').value='';})
    .catch(function(){m.textContent='That didn\'t go through. Email kyle@turnkeybnbs.com.au and we\'ll add you.';})
    .finally(function(){btn.disabled=false;});});}

  var NAMES={services:'TurnKey Services',bnbs:'TurnKey BnBs',stays:'TurnKey Stays',access:'TurnKey Access',pro:'TurnKey Pro'};
  var PICK={
    guest:{b:['stays','services'],note:'Book your next Gold Coast or Brisbane holiday. Guest extras coming soon.'},
    owner:{b:['bnbs','pro'],note:'Short-stay solutions, plus upgrades to make it stand out.'},
    host:{b:['bnbs','access','pro'],note:'One-on-one coaching, key handovers and upgrades.'},
    keys:{b:['access'],note:'Main Beach, open 6am to 10pm.'}
  };
  var tiles=document.querySelectorAll('#ring .tile'),answer=document.getElementById('answer');
  var OP=document.getElementById('opts');if(OP)OP.addEventListener('click',function(e){
    var b=e.target.closest('.opt');if(!b)return;var p=PICK[b.dataset.pick];
    document.querySelectorAll('.opt').forEach(function(o){o.setAttribute('aria-pressed',o===b?'true':'false')});
    tiles.forEach(function(t){var on=p.b.indexOf(t.dataset.b)>=0;t.classList.toggle('lit',on);t.classList.toggle('dim',!on)});
    answer.innerHTML=p.b.map(function(k){return '<a href="/'+k+'/">'+NAMES[k]+' →</a>'}).join('')+'<span>'+p.note+'</span>';
  });
})();

(function(){var m=document.querySelector('details.mnav');if(!m)return;document.addEventListener('click',function(e){if(m.open&&!m.contains(e.target))m.open=false;});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.open){m.open=false;m.querySelector('summary').focus();}});})();

/* ===== Motion layer: reveals, counters, spotlight, showreel ===== */
(function(){
  var d=document,root=d.documentElement;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia&&matchMedia('(pointer: fine)').matches;

  /* header shadow on scroll */
  var hdr=d.querySelector('header');
  function onScroll(){if(hdr)hdr.classList.toggle('scrolled',window.scrollY>8);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* stagger index for children */
  d.querySelectorAll('[data-stagger]').forEach(function(p){Array.prototype.forEach.call(p.children,function(c,i){c.style.setProperty('--i',i);});});

  /* counters */
  function count(el){
    var to=+el.dataset.count,suf=el.dataset.suffix||'',t0=null,dur=1400;
    if(reduce){el.textContent=to+suf;return;}
    function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e)+suf;if(p<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  }

  /* scroll reveal */
  var items=d.querySelectorAll('[data-reveal],[data-stagger],.row,[data-count]');
  if('IntersectionObserver' in window && !reduce){
    root.classList.add('motion');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return;var el=e.target;el.classList.add('in');
      if(el.dataset.count)count(el);
      el.querySelectorAll&&el.querySelectorAll('h2').forEach(function(h){h.classList.add('in');});
      io.unobserve(el);
    });},{rootMargin:'0px 0px -8% 0px',threshold:.12});
    items.forEach(function(el){io.observe(el);});
    d.querySelectorAll('.head h2').forEach(function(h){io.observe(h);});
  }else{
    items.forEach(function(el){el.classList.add('in');});
  }

  /* hero spotlight + tile glow follow the cursor (desktop only) */
  if(fine&&!reduce){
    var hero=d.querySelector('[data-spot]');
    if(hero){hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();hero.style.setProperty('--mx',(e.clientX-r.left)+'px');hero.style.setProperty('--my',(e.clientY-r.top)+'px');});}
    d.querySelectorAll('.tile').forEach(function(t){t.addEventListener('pointermove',function(e){var r=t.getBoundingClientRect();t.style.setProperty('--tx',(e.clientX-r.left)+'px');t.style.setProperty('--ty',(e.clientY-r.top)+'px');});});
  }

  /* statement: words light up as it scrolls through the screen */
  var st=d.querySelector('.stmt');
  if(st){
    var ws=st.querySelectorAll('.sw');
    ws.forEach(function(w){if(/^(guest\.|key\.|team\.)$/i.test(w.textContent))w.classList.add('k');});
    st.setAttribute('role','text');
    if(!reduce&&root.classList.contains('motion')){
      var tick=0;
      function lite(){tick=0;var r=st.getBoundingClientRect(),vh=window.innerHeight;
        var p=(vh*0.85-r.top)/(r.height+vh*0.35);p=Math.max(0,Math.min(1,p));
        var n=Math.round(p*ws.length);for(var i=0;i<ws.length;i++)ws[i].classList.toggle('lit',i<n);}
      window.addEventListener('scroll',function(){if(!tick)tick=requestAnimationFrame(lite);},{passive:true});lite();
    }
  }
})();
/* copy-code buttons on Tech we use */
document.querySelectorAll('button.copy[data-copy]').forEach(function(b){b.addEventListener('click',function(){var c=b.dataset.copy;function ok(){b.textContent='Copied';b.classList.add('done');setTimeout(function(){b.textContent='Copy';b.classList.remove('done');},2000);}
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(c).then(ok,function(){});}else{var t=document.createElement('textarea');t.value=c;document.body.appendChild(t);t.select();try{document.execCommand('copy');ok();}catch(e){}t.remove();}});});
