(function(){
  const w=document.getElementById('wave');
  for(let i=0;i<34;i++){const s=document.createElement('span');s.style.animationDelay=(-(i*137)%1200)+'ms';s.style.animationDuration=(900+(i*53)%700)+'ms';w.appendChild(s);}
  const b=document.getElementById('burger'),m=document.getElementById('mmenu');
  b.addEventListener('click',()=>{const o=m.hidden;m.hidden=!o;b.setAttribute('aria-expanded',String(o));});
  m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.hidden=true;b.setAttribute('aria-expanded','false');}));
  const hero=document.getElementById('hero'),slides=[...document.querySelectorAll('.slide')],tabs=[...document.querySelectorAll('.tab')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur=0;
  function go(n){
    n=(n+slides.length)%slides.length; if(n===cur)return;
    const old=slides[cur]; old.classList.remove('is-active'); old.classList.add('is-leaving'); old.setAttribute('aria-hidden','true');
    setTimeout(()=>old.classList.remove('is-leaving'),600);
    tabs[cur].classList.remove('is-active'); tabs[cur].removeAttribute('aria-current');
    cur=n; const s=slides[cur];
    s.classList.add('is-active'); s.removeAttribute('aria-hidden');
    tabs[cur].classList.add('is-active'); tabs[cur].setAttribute('aria-current','true');
    hero.style.setProperty('--glow',s.dataset.glow);
    schedule();
    s.querySelectorAll('.bars span').forEach(b=>{b.style.animation='none';b.offsetHeight;b.style.animation='';});
  }
  const DUR=10000;let timer;
  function schedule(){clearTimeout(timer);timer=setTimeout(()=>go(cur+1),DUR);}
  tabs.forEach(t=>t.addEventListener('click',()=>go(+t.dataset.i)));
  document.getElementById('prev').onclick=()=>go(cur-1);
  document.getElementById('next').onclick=()=>go(cur+1);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(timer);else{const a=tabs[cur].querySelector('.track i');a.style.animation='none';a.offsetHeight;a.style.animation='';schedule();}});
  schedule();
  hero.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(cur+1);if(e.key==='ArrowLeft')go(cur-1);});
  let sx=null;const area=document.getElementById('slides');
  area.addEventListener('pointerdown',e=>{sx=e.clientX;});
  area.addEventListener('pointerup',e=>{if(sx===null)return;const d=e.clientX-sx;sx=null;if(Math.abs(d)>50)go(cur+(d<0?1:-1));});
  document.querySelectorAll('.tip button').forEach(b=>b.addEventListener('click',()=>{b.textContent='Aplicado';b.classList.add('done');}));
  (function(){
    const stack=document.getElementById('stack'); if(!stack) return;
    const cards=[...stack.querySelectorAll('.stack-card')], title=document.getElementById('stitle');
    cards.forEach((c,i)=>c.style.setProperty('--t',8+((i*7)%22)));
    const N=cards.length, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let front=0, busy=false, t;
    const nameOf=c=>c.querySelector('figcaption').textContent.trim();
    function layout(){
      cards.forEach((c,i)=>{const d=(i-front+N)%N; c.dataset.pos=d<3?String(d):'hidden'; c.setAttribute('aria-hidden',d===0?'false':'true');});
    }
    function setTitle(){
      if(reduce){title.textContent=nameOf(cards[front]);return;}
      title.classList.add('swap');
      setTimeout(()=>{title.textContent=nameOf(cards[front]);title.classList.remove('swap');},250);
    }
    function go(n){
      n=(n+N)%N; if(busy||n===front) return;
      const old=cards[front];
      if(!reduce){busy=true; old.classList.add('leaving');
        setTimeout(()=>{old.classList.add('no-anim');old.classList.remove('leaving');front=n;layout();setTitle();
          requestAnimationFrame(()=>requestAnimationFrame(()=>old.classList.remove('no-anim')));busy=false;},420);
      } else {front=n;layout();setTitle();}
      schedule();
    }
    function schedule(){clearTimeout(t); if(!reduce) t=setTimeout(()=>go(front+1),4000);}
    let sx=null;
    stack.addEventListener('pointerdown',e=>{sx=e.clientX;});
    stack.addEventListener('pointerup',e=>{if(sx===null)return;const d=e.clientX-sx;sx=null;if(Math.abs(d)>50)go(front+(d<0?1:-1));});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(t);else schedule();});
    layout(); title.textContent=nameOf(cards[front]); schedule();
  })();
  (function(){
    const body=document.body, VIEWS=['sobre','comunidade','planos','privacidade','termos'];
    const navLinks=[...document.querySelectorAll('[data-nav]')];
    function show(view){
      ['home'].concat(VIEWS).forEach(v=>body.classList.toggle('view-'+v,v===view));
      navLinks.forEach(a=>a.dataset.nav===view?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
    }
    const current=()=>VIEWS.find(v=>body.classList.contains('view-'+v))||'home';
    document.addEventListener('click',e=>{
      const a=e.target.closest('a[href^="#"]'); if(!a) return;
      const id=a.getAttribute('href').slice(1);
      if(VIEWS.includes(id)){
        e.preventDefault(); show(id); window.scrollTo(0,0);
        try{history.pushState(null,'','#'+id);}catch(_){}
      } else if(current()!=='home'||VIEWS.includes(location.hash.slice(1))){
        show('home');
        if(!id){e.preventDefault(); window.scrollTo(0,0); try{history.pushState(null,'',location.pathname+location.search);}catch(_){}}
      }
    });
    function sync(){ const h=location.hash.slice(1); show(VIEWS.includes(h)?h:'home'); }
    window.addEventListener('hashchange',sync);
    window.addEventListener('popstate',sync);
    sync();
  })();
  (function(){
    const items=[...document.querySelectorAll('.side-item')], panels=[...document.querySelectorAll('.cpanel')];
    if(!items.length) return;
    function open(k){
      items.forEach(b=>{const on=b.dataset.panel===k;b.classList.toggle('is-active',on);on?b.setAttribute('aria-current','true'):b.removeAttribute('aria-current');});
      panels.forEach(p=>{const on=p.id==='panel-'+k;p.hidden=!on;p.classList.toggle('is-active',on);});
      const side=document.querySelector('.side');
      if(side && window.innerWidth<=900){ const act=items.find(b=>b.dataset.panel===k); act&&act.scrollIntoView({block:'nearest',inline:'center'}); }
      const top=document.querySelector('.com-body'); if(top && top.getBoundingClientRect().top<0) top.scrollIntoView({block:'start'});
    }
    items.forEach(b=>b.addEventListener('click',()=>open(b.dataset.panel)));
    document.addEventListener('click',e=>{const a=e.target.closest('[data-open-panel]');if(a)setTimeout(()=>{open(a.dataset.openPanel);window.scrollTo(0,0);},0);});
    // busca da base de conhecimentos
    const q=document.getElementById('kb-q'), cards=[...document.querySelectorAll('#kb-grid .kb-card')], empty=document.getElementById('kb-empty');
    q&&q.addEventListener('input',()=>{const t=q.value.trim().toLowerCase();let n=0;
      cards.forEach(c=>{const hit=!t||c.textContent.toLowerCase().includes(t);c.hidden=!hit;if(hit)n++;});empty.hidden=n>0;});
    // copiar código da API
    const cb=document.getElementById('copy-code');
    cb&&cb.addEventListener('click',()=>{const txt=document.getElementById('code-sample').innerText;
      const ok=()=>{cb.textContent='Copiado';setTimeout(()=>cb.textContent='Copiar',1600);};
      try{navigator.clipboard.writeText(txt).then(ok,()=>{selectCode();});}catch(_){selectCode();}
      function selectCode(){const r=document.createRange();r.selectNodeContents(document.getElementById('code-sample'));const s=getSelection();s.removeAllRanges();s.addRange(r);cb.textContent='Selecionado';}
    });
    // calculadora de ROI
    const f=id=>document.getElementById(id), brl=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
    const inputs=['roi-ramais','roi-gasto','roi-plano','roi-manut'].map(f);
    function calc(){
      const ramais=Math.max(0,+f('roi-ramais').value||0), gasto=Math.max(0,+f('roi-gasto').value||0),
            preco=+f('roi-plano').value||0, manut=Math.max(0,+f('roi-manut').value||0);
      const atual=ramais*gasto+manut, novo=preco, mes=atual-novo, pct=atual>0?mes/atual*100:0;
      f('roi-atual').textContent=brl(atual); f('roi-novo').textContent=brl(novo);
      f('roi-mes').textContent=brl(mes); f('roi-ano').textContent=brl(mes*12);
      f('roi-pct').textContent=Math.round(pct).toLocaleString('pt-BR')+'%';
      f('roi-ano').parentElement.classList.toggle('neg',mes<0);
    }
    inputs.forEach(i=>i&&i.addEventListener('input',calc)); if(inputs[0]) calc();
    f('roi-form')&&f('roi-form').addEventListener('submit',e=>e.preventDefault());
  })();
  document.querySelectorAll('.story-video video').forEach(v=>{
    v.muted=true; v.loop=true; v.controls=false;
    v.addEventListener('contextmenu',e=>e.preventDefault());
    v.addEventListener('pause',()=>{ if(!document.hidden && v.getAttribute('src')) v.play().catch(()=>{}); });
    const tryPlay=()=>{ if(v.getAttribute('src')) v.play().catch(()=>{}); };
    v.addEventListener('canplay',tryPlay); tryPlay();
  });
  document.addEventListener('click',e=>{
    const a=e.target.closest('[data-legal-jump]'); if(!a) return;
    e.preventDefault(); e.stopPropagation();
    const el=document.getElementById(a.getAttribute('href').slice(1)); el&&el.scrollIntoView({behavior:'smooth',block:'start'});
  },true);
  const tb=document.getElementById('topbar');
  const onScroll=()=>tb.classList.toggle('scrolled',window.scrollY>8);
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  const bm=document.getElementById('bill-m'),ba=document.getElementById('bill-a');
  function setBill(k){bm.setAttribute('aria-pressed',k==='m');ba.setAttribute('aria-pressed',k==='a');
    document.querySelectorAll('.price').forEach(p=>{p.firstChild.nodeValue='R$ '+p.dataset[k];});}
  bm.onclick=()=>setBill('m');ba.onclick=()=>setBill('a');
  document.getElementById('lead').addEventListener('submit',e=>{e.preventDefault();document.getElementById('ok').hidden=false;e.target.querySelector('button').disabled=true;});
})();