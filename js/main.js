(function(){
  var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root=document.documentElement, body=document.body;

  /* ============ LOADER (split-screen, once per load) ============ */
  (function(){
    var W=['Full-Stack','Developer','UI / UX <i>design</i>','Create your <i>website</i>','Let\u2019s <i>begin</i>'], lw=$('#lw'), wi=0, L=$('#loader'), bar=$('#lbar'), num=$('#lnum'), t0=performance.now(), MIN=reduce?200:1700, loaded=document.readyState==='complete', p=0, closed=false;
    if(!loaded) addEventListener('load',function(){loaded=true});
    function finish(){
      if(closed) return; closed=true;
      bar.style.transform='scaleX(1)'; num.textContent='100%'; if(wi!==W.length-1){wi=W.length-1;lw.innerHTML='<b>'+W[wi]+'</b>'}
      setTimeout(function(){
        L.classList.add('go');
        setTimeout(function(){body.classList.remove('loading');document.dispatchEvent(new Event('sg:ready'))},reduce?0:380);
        setTimeout(function(){L.classList.add('done')},1250);
      },reduce?0:260);
    }
    (function step(){
      var el=performance.now()-t0, target=Math.min(1,el/MIN);
      if(!loaded) target=Math.min(target,.9);
      p+=(target-p)*.12; if(target>=1&&p>.995) p=1;
      bar.style.transform='scaleX('+p+')'; num.textContent=Math.round(p*100)+'%';
      var ni=Math.min(W.length-1,Math.floor(p*W.length*.999)); if(ni!==wi){wi=ni;lw.innerHTML='<b>'+W[wi]+'</b>'}
      if(p>=1&&loaded) finish(); else if(el>6000) finish(); else requestAnimationFrame(step);
    })();
  })();

  /* theme */
  try{var th=localStorage.getItem('sg-theme2'); root.dataset.theme=(th==='light')?'light':'dark';}catch(e){}
  $('#themeBtn').onclick=function(){root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('sg-theme2',root.dataset.theme)}catch(e){}};

  /* clock */
  function tick(){try{$('#clock').textContent=new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'})}catch(e){}}
  tick(); setInterval(tick,20000);

  /* flipping word */
  var words=['intelligent','real-time','scalable','human-first'], wi=0, fl=$('#flip');
  setInterval(function(){fl.classList.add('out');setTimeout(function(){wi=(wi+1)%words.length;fl.textContent=words[wi];fl.classList.remove('out')},320)},2400);

  /* hero spotlight */
  $$('.gridbg').forEach(function(sec){
    sec.addEventListener('mousemove',function(e){var r=sec.getBoundingClientRect();sec.style.setProperty('--mx',(e.clientX-r.left)+'px');sec.style.setProperty('--my',(e.clientY-r.top)+'px');sec.style.setProperty('--mo','1')},{passive:true});
    sec.addEventListener('mouseleave',function(){sec.style.setProperty('--mo','0')});
  });

  /* ============ CURSOR: dot + context label + click ripple + magnetic buttons ============ */
  var dot=$('#cur'), lab=$('#clab'), mx=0, my=0, lx=0, ly=0, seen=false, curText='';
  var LABELS=[['.proj','View'],['.ui','View'],['.cl-row','Open'],['.forge a','Visit'],['.pn','Explore'],['.ct-card input,.ct-card textarea,.ct-card textarea','']];
  addEventListener('mousemove',function(e){
    mx=e.clientX; my=e.clientY;
    dot.style.transform='translate3d('+mx+'px,'+my+'px,0)';
    if(!seen){seen=true;lx=mx;ly=my;dot.classList.add('on')}
  },{passive:true});
  document.addEventListener('mouseleave',function(){dot.classList.remove('on');lab.classList.remove('on');seen=false});
  addEventListener('mousedown',function(e){
    dot.classList.add('press');lab.classList.add('press');
    var r=document.createElement('i');r.className='rip';r.style.setProperty('--t','translate3d('+e.clientX+'px,'+e.clientY+'px,0)');r.style.transform='translate3d('+e.clientX+'px,'+e.clientY+'px,0)';
    document.body.appendChild(r);setTimeout(function(){r.remove()},650);
  });
  addEventListener('mouseup',function(){dot.classList.remove('press');lab.classList.remove('press')});
  (function loop(){lx+=(mx-lx)*.16;ly+=(my-ly)*.16;lab.style.transform='translate3d('+lx+'px,'+ly+'px,0)';requestAnimationFrame(loop)})();
  document.addEventListener('mouseover',function(e){
    var t=e.target, txt=null, big=false, ib=false;
    if(t.closest){
      for(var i=0;i<LABELS.length;i++){ if(t.closest(LABELS[i][0])){ txt=LABELS[i][1]; break } }
      ib=!!t.closest('input,textarea');
      if(!txt && !ib && t.closest('a,button,.chip,.st,.bc,.nd b')) big=true;
    }
    var hasLab=!!txt;
    if(hasLab && txt!==curText){ lab.textContent=txt; curText=txt }
    lab.classList.toggle('on',hasLab);
    dot.classList.toggle('hide',hasLab);
    dot.classList.toggle('txt',ib);
    dot.classList.toggle('big',big);
  });
  /* magnetic buttons */
  $$('.pbtn,.fbtn,.nav-cta,.ct-email,.ct-card button.send,.totop').forEach(function(b){
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.22)+'px '+((e.clientY-r.top-r.height/2)*.3)+'px'});
    b.addEventListener('mouseleave',function(){b.style.translate=''});
  });

  /* ============ NAV ============ */
  var nav=$('#nav'), links=$$('#navLinks a'), ind=$('#navInd'), navLabel=$('#navLabel'), activeId='';
  function linkFor(id){return links.filter(function(a){return a.dataset.s===id})[0]}
  function moveInd(a){ if(!a){ind.style.opacity=0;return} ind.style.opacity=1;ind.style.left=a.offsetLeft+'px';ind.style.width=a.offsetWidth+'px'}
  function setActive(id){
    if(id===activeId) return; activeId=id;
    links.forEach(function(a){a.classList.toggle('on',a.dataset.s===id)});
    moveInd(linkFor(id));
    var map={top:'Home',about:'About',services:'What I do',work:'Work',forge:'Studio',journey:'Journey',stack:'Stack',certs:'Proof',contact:'Contact'};
    navLabel.textContent=map[id]||'Home';
  }
  links.forEach(function(a){a.addEventListener('mouseenter',function(){moveInd(a);links.forEach(function(x){x.classList.toggle('on',x===a)})});});
  $('#navLinks').addEventListener('mouseleave',function(){links.forEach(function(a){a.classList.toggle('on',a.dataset.s===activeId)});moveInd(linkFor(activeId))});
  addEventListener('resize',function(){var id=activeId;activeId='';setActive(id)});
  var secIds=['top','about','services','work','forge','journey','stack','certs','contact'];
  function spy(){
    var y=innerHeight*0.4, cur='top';
    secIds.forEach(function(id){var el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<y)cur=id});
    setActive(cur);
  }
  var burger=$('#burger');
  function menu(open){body.classList.toggle('menu-open',open);body.classList.toggle('lock',open);$('#mnav').setAttribute('aria-hidden',!open)}
  burger.onclick=function(){menu(!body.classList.contains('menu-open'))};
  $$('#mnav a').forEach(function(a){a.addEventListener('click',function(){menu(false)})});
  addEventListener('keydown',function(e){if(e.key==='Escape')menu(false)});

  /* ============ SCROLL-REACTIVE SLIDERS ============ */
  var tracks=$$('.trk').map(function(t,ti){
    var items=t.dataset.items.split('|');
    var html=items.map(function(x,i){
      var cls=ti===0?(i%2?'o':''):(i%2?'s':'');
      return '<span class="'+cls+'">'+x+'</span>';
    }).join('');
    return {el:t,html:html,dir:+t.dataset.dir,pos:0,w:1};
  });
  function buildTracks(){
    tracks.forEach(function(k){
      k.el.innerHTML='<div class="set">'+k.html+'</div>';
      k.w=k.el.firstChild.offsetWidth||1;
      var n=Math.ceil((innerWidth*1.2+k.w)/k.w)+1, h='';
      for(var i=0;i<n;i++) h+='<div class="set">'+k.html+'</div>';
      k.el.innerHTML=h;
    });
  }
  buildTracks(); addEventListener('resize',buildTracks);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(buildTracks);

  var lastY=scrollY, sv=0, dirCur=1, skew=0, slow=1, slowT=1, last=performance.now(), slid=$('#slid');
  slid.addEventListener('mouseenter',function(){slowT=.25}); slid.addEventListener('mouseleave',function(){slowT=1});
  function frame(now){
    var dt=Math.min(.05,(now-last)/1000); last=now;
    var dy=scrollY-lastY; lastY=scrollY;
    sv=sv*.88+dy*.12;                                   // smoothed signed scroll speed (down = +)
    var target=Math.abs(sv)>.5 ? (sv>0?-1:1) : 1;       // scroll down flips, scroll up = base, idle = reset
    dirCur+=(target-dirCur)*Math.min(1,dt*6);
    slow+=(slowT-slow)*Math.min(1,dt*6);
    var skT=Math.max(-14,Math.min(14,-sv*.9)); skew+=(skT-skew)*Math.min(1,dt*8);
    var speed=(70+Math.min(1400,Math.abs(sv)*70))*slow;
    tracks.forEach(function(k){
      k.pos=(k.pos + k.dir*-1*dirCur*speed*dt)%k.w;
      if(k.pos<0)k.pos+=k.w;
      k.el.style.transform='translate3d('+(-k.pos)+'px,0,0) skewX('+skew.toFixed(2)+'deg)';
    });
    requestAnimationFrame(frame);
  }
  if(!reduce) requestAnimationFrame(frame);

  /* ============ SCROLL EFFECTS ============ */
  var bar=$('#bar'), words2=[], upBtn=$('#up'), upRing=$('#upRing');
  (function(){
    var p=$('#rw'), nodes=Array.prototype.slice.call(p.childNodes); p.innerHTML='';
    nodes.forEach(function(n){
      var hl=n.nodeType!==3, txt=n.textContent;
      txt.split(/(\s+)/).forEach(function(w){
        if(!w.trim()){p.appendChild(document.createTextNode(w));return}
        var s=document.createElement('span'); if(hl)s.className='hl'; s.textContent=w; p.appendChild(s); words2.push(s);
      });
    });
  })();
  var giant=$('#giant'), aboutEl=$('#about'), tl=$('#tl'), tlFill=$('#tlFill'), tlItems=$$('.tl-i'), tlYears=$$('.tl-year');
  var ticking=false;
  function onScroll(){
    var st=scrollY, dh=root.scrollHeight-innerHeight, vh=innerHeight;
    bar.style.width=(dh>0?st/dh*100:0)+'%';
    upBtn.classList.toggle('show',st>vh*.8); upRing.style.strokeDashoffset=132*(1-(dh>0?st/dh:0));
    nav.classList.toggle('shrunk',st>60);
    spy();
    var r=$('#rw').getBoundingClientRect();
    var prog=Math.min(1,Math.max(0,(vh*0.85-r.top)/(r.height+vh*0.3)));
    var n=Math.round(prog*words2.length);
    words2.forEach(function(s,i){s.classList.toggle('on',i<n)});
    var ar=aboutEl.getBoundingClientRect();
    giant.style.transform='translate3d('+(-(vh-ar.top)*.25)+'px,0,0)';
    /* timeline */
    var tr=tl.getBoundingClientRect(), mark=vh*.55;
    var h=Math.max(0,Math.min(tr.height,mark-tr.top));
    tlFill.style.height=h+'px';
    tlItems.forEach(function(it){var d=$('.tl-dot',it).getBoundingClientRect();it.classList.toggle('on',d.top+9<mark)});
    tlYears.forEach(function(y){y.classList.toggle('on',y.getBoundingClientRect().top+20<mark)});
    ticking=false;
  }
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
  addEventListener('resize',onScroll); onScroll(); setActive('top');

  /* reveal + counters */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  $$('.rv').forEach(function(el,i){el.style.transitionDelay=(i%4)*70+'ms';io.observe(el)});
  var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io2.unobserve(e.target)}})},{threshold:.18});
  tlItems.forEach(function(el){io2.observe(el)});
  var co=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting) return; co.unobserve(e.target);
    var to=parseFloat(e.target.dataset.to), dec=+(e.target.dataset.dec||0), t0=performance.now(), d=1500;
    (function f(t){var k=Math.min(1,(t-t0)/d), v=to*(1-Math.pow(1-k,4));e.target.textContent=v.toFixed(dec);if(k<1)requestAnimationFrame(f)})(t0);
  })},{threshold:.5});
  $$('.cnt').forEach(function(el){ if(reduce){el.textContent=(+el.dataset.to).toFixed(+(el.dataset.dec||0))} else co.observe(el)});

  /* about tabs */
  $$('.tab-btns button').forEach(function(b){b.onclick=function(){$$('.tab-btns button').forEach(function(x){x.classList.toggle('on',x===b)});$$('.tab-p').forEach(function(p){p.classList.toggle('on',p.id===b.dataset.t)})}});

  /* service panels */
  var pns=$$('.pn');
  function act(p){pns.forEach(function(x){x.classList.toggle('active',x===p)})}
  pns.forEach(function(p){
    if(matchMedia('(hover:hover)').matches) p.addEventListener('mouseenter',function(){act(p)});
    p.addEventListener('click',function(){act(p)}); p.addEventListener('focus',function(){act(p)});
  });

  /* brand-colour chips */
  $$('.chip[data-c]').forEach(function(c){
    var hex=c.dataset.c.replace('#',''), R=parseInt(hex.substr(0,2),16),G=parseInt(hex.substr(2,2),16),B=parseInt(hex.substr(4,2),16);
    var lum=(.299*R+.587*G+.114*B)/255;
    c.style.setProperty('--c',c.dataset.c); c.style.setProperty('--tc',lum>.55?'#0b0b0c':'#ffffff');
  });

  if(!reduce){
    $$('.mag').forEach(function(el){
      el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();el.style.transform='translate('+(e.clientX-r.left-r.width/2)*.18+'px,'+(e.clientY-r.top-r.height/2)*.28+'px)'});
      el.addEventListener('mouseleave',function(){el.style.transform=''});
    });
  }
  (function(){var l=$('#leaf');if(!l)return;var h='';for(var i=0;i<160;i++)h+='<i style="animation-delay:'+(Math.random()*3).toFixed(2)+'s"></i>';l.insertAdjacentHTML('afterbegin',h)})();

  /* ============ CERTIFICATES: cursor-following preview + lightbox ============ */
  var rows=$$('.cl-row'), prev=$('#cprev'), pimg=$('img',prev), lb=$('#lb'), lbImg=$('#lbImg'), cur2=0;
  var canHover=matchMedia('(hover:hover)').matches, px=0, py=0, tx2=0, ty2=0, pvis=false, pAnim=false;
  function pTick(){
    px+=(tx2-px)*.16; py+=(ty2-py)*.16;
    var w=prev.offsetWidth, h=prev.offsetHeight, x=px+30, y=py+26;
    if(x+w>innerWidth-12) x=px-w-30;
    if(y+h>innerHeight-12) y=innerHeight-h-12;
    if(y<12) y=12;
    var tilt=Math.max(-7,Math.min(7,(tx2-px)*.12));
    prev.style.transform='translate3d('+x+'px,'+y+'px,0) rotate('+tilt+'deg)';
    if(pvis) requestAnimationFrame(pTick); else pAnim=false;
  }
  if(canHover) rows.forEach(function(r){
    r.addEventListener('mouseenter',function(e){
      pimg.src=r.dataset.img; tx2=px=e.clientX; ty2=py=e.clientY; pvis=true; prev.classList.add('on');
      if(!pAnim){pAnim=true;requestAnimationFrame(pTick)}
    });
    r.addEventListener('mousemove',function(e){tx2=e.clientX;ty2=e.clientY});
    r.addEventListener('mouseleave',function(){pvis=false;prev.classList.remove('on')});
  });
  function lbShow(i){
    cur2=(i+rows.length)%rows.length; var r=rows[cur2];
    lbImg.src=r.dataset.img; lbImg.alt=r.dataset.title;
    $('#lbTitle').textContent=r.dataset.title; $('#lbMeta').textContent=r.dataset.meta;
    $('#lbCount').textContent=('0'+(cur2+1)).slice(-2)+' / '+('0'+rows.length).slice(-2);
  }
  function lbOpen(i){pvis=false;prev.classList.remove('on');lbShow(i);lb.classList.add('open');body.classList.add('lock');requestAnimationFrame(function(){lb.classList.add('show')})}
  function lbClose(){lb.classList.remove('show');body.classList.remove('lock');setTimeout(function(){lb.classList.remove('open')},300)}
  rows.forEach(function(r,i){r.addEventListener('click',function(e){e.preventDefault();lbOpen(i)})});
  $('#lbX').onclick=lbClose; $('#lbPrev').onclick=function(e){e.stopPropagation();lbShow(cur2-1)}; $('#lbNext').onclick=function(e){e.stopPropagation();lbShow(cur2+1)};
  lb.addEventListener('click',function(e){if(e.target===lb)lbClose()});
  addEventListener('keydown',function(e){
    if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')lbClose(); if(e.key==='ArrowLeft')lbShow(cur2-1); if(e.key==='ArrowRight')lbShow(cur2+1);
  });

  /* ============ FOOTER ============ */
  var wm=$('#wm'), wmBox=$('#wmBox');
  function fitWm(){wm.style.fontSize='100px';var w=wm.getBoundingClientRect().width;if(w)wm.style.fontSize=(100*wmBox.clientWidth/w*0.995)+'px'}
  fitWm(); addEventListener('resize',fitWm); addEventListener('load',fitWm); if(window.ResizeObserver){new ResizeObserver(fitWm).observe(wmBox);new ResizeObserver(function(){if(Math.abs(wm.getBoundingClientRect().width-wmBox.clientWidth)>4)fitWm()}).observe(wm)} if(document.fonts)document.fonts.addEventListener('loadingdone',fitWm); if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fitWm);
  wmBox.addEventListener('mousemove',function(e){var r=wm.getBoundingClientRect();wm.style.setProperty('--wx',(e.clientX-r.left)+'px');wm.style.setProperty('--wy',(e.clientY-r.top)+'px')});
  wmBox.addEventListener('mouseleave',function(){wm.style.setProperty('--wx','-400px')});
  $('#toTop').onclick=upBtn.onclick=function(){scrollTo({top:0,behavior:'smooth'})};
  var toast=$('#toast');
  function say(t){toast.textContent=t;toast.classList.add('show');setTimeout(function(){toast.classList.remove('show')},2000)}
  $('#copyMail').onclick=function(){var m='guptasagar04742@gmail.com';if(navigator.clipboard)navigator.clipboard.writeText(m).then(function(){say('Email copied ✓')},function(){location.href='mailto:'+m});else location.href='mailto:'+m};
  $('#cform').addEventListener('submit',function(e){
    e.preventDefault(); var f=e.target;
    var sub=encodeURIComponent('Portfolio enquiry from '+f.n.value), bd=encodeURIComponent(f.m.value+'\n\n— '+f.n.value+' ('+f.e.value+')');
    location.href='mailto:guptasagar04742@gmail.com?subject='+sub+'&body='+bd; say('Opening your email app…');
  });
  /* ============ MOTION LAYER ============ */
  var FX=matchMedia('(min-width:821px) and (hover:hover)').matches && !reduce;
  var vh=innerHeight; addEventListener('resize',function(){vh=innerHeight});
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  var armAll=function(){};
  var ready=!body.classList.contains('loading');
  document.addEventListener('sg:ready',function(){ready=true;armAll()});

  /* sticky stack — previous card scales back + dims as the next lands (every screen) */
  var projs=$$('.proj');
  function stackFx(){
    for(var i=0;i<projs.length-1;i++){
      var a=projs[i].getBoundingClientRect(), b=projs[i+1].getBoundingClientRect();
      var k=1-clamp((b.top-a.top-16)/Math.max(1,a.height-16),0,1);
      projs[i].style.setProperty('--p',k.toFixed(3));
    }
  }

  var heroT=$('.hero-title'), heroS=$('.hero-side'), heroM=$('.hero-sub'), forgeC=$('.forge-card'), ftEl=$('.ft'), pars=[];
  var mt=false;
  function motion(){
    mt=false; stackFx();
    if(!FX) return;
    var y=scrollY;
    if(y<vh*1.3){
      var s=clamp(y/vh,0,1);
      heroT.style.translate='0 '+(-s*70)+'px'; heroT.style.opacity=(1-s*.9).toFixed(3);
      heroS.style.translate='0 '+(s*90)+'px'; heroS.style.scale=(1-s*.1).toFixed(3);
      heroM.style.opacity=(1-s*1.2).toFixed(3);
    }
    if(forgeC){var r=forgeC.getBoundingClientRect(); if(r.top<vh&&r.bottom>0) forgeC.style.scale=(.9+clamp((vh-r.top)/(vh*.7),0,1)*.1).toFixed(3)}
    if(ftEl){var q=ftEl.getBoundingClientRect(); if(q.top<vh){var fp=clamp((vh-q.top)/(vh*.6),0,1); ftEl.style.translate='0 '+((1-fp)*70).toFixed(1)+'px'; ftEl.style.scale=(.96+fp*.04).toFixed(3)}}
    pars.forEach(function(p){
      var r=p.box.getBoundingClientRect(); if(r.bottom<-100||r.top>vh+100) return;
      var t=clamp(((r.top+r.height/2)-vh/2)/(vh/2+r.height/2),-1,1);
      p.el.style.translate='0 '+(-t*p.amp).toFixed(1)+'px';
    });
  }
  addEventListener('scroll',function(){if(!mt){mt=true;requestAnimationFrame(motion)}},{passive:true});
  addEventListener('resize',motion);

  if(FX){
    /* headline words rise out of a mask */
    function splitWords(el){
      var n=0;
      (function walk(node){
        [].slice.call(node.childNodes).forEach(function(ch){
          if(ch.nodeType===3){
            var f=document.createDocumentFragment();
            ch.textContent.split(/(\s+)/).forEach(function(p){
              if(!p) return;
              if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(' '))}
              else{var w=document.createElement('span');w.className='wd';var i=document.createElement('span');i.className='wi';i.style.setProperty('--i',n++);i.textContent=p;w.appendChild(i);f.appendChild(w)}
            });
            ch.parentNode.replaceChild(f,ch);
          }else if(ch.nodeType===1 && ch.tagName!=='BR'){walk(ch)}
        });
      })(el);
    }
    var splits=$$('.h-xl.rv');
    splits.forEach(function(h){h.classList.remove('rv');h.classList.add('split');splitWords(h)});
    var splitIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&ready){e.target.classList.add('in');splitIO.unobserve(e.target)}})},{threshold:.25});

    /* scatter → assemble */
    var seedN=0; function rnd(n){var x=Math.sin(n*127.1)*43758.5453;return x-Math.floor(x)}
    var scList=[];
    var scIO=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting||!ready) return;
      var el=e.target; scIO.unobserve(el); el.classList.add('in');
      var d=parseFloat(el.style.getPropertyValue('--sd'))*1000||0;
      setTimeout(function(){el.classList.remove('sc','in');['--sx','--sy','--sr','--ss','--sd'].forEach(function(p){el.style.removeProperty(p)})},d+1500);
    })},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
    function scatter(sel,mode){
      var counts=new Map();
      $$(sel).forEach(function(el){
        if(el.classList.contains('sc')||el.closest('.proj')||el.closest('.tl-i')) return;
        var i=counts.get(el.parentNode)||0; counts.set(el.parentNode,i+1);
        el.classList.remove('rv'); el.style.transitionDelay='';
        var r=el.getBoundingClientRect(), cx=(r.left+r.width/2)/innerWidth, a=rnd(++seedN), b=rnd(seedN+7), c2=rnd(seedN+13);
        var sx='0px', sy='60px', sr='0deg', ss=1;
        if(mode==='pop'){ss=.35;sr=((a-.5)*60)+'deg';sy=((b-.5)*80)+'px';sx=((c2-.5)*80)+'px'}
        else if(cx<.36){sx=-(90+a*160)+'px';sy=(20+b*90)+'px';sr=(-3-c2*7)+'deg'}
        else if(cx>.64){sx=(90+a*160)+'px';sy=(20+b*90)+'px';sr=(3+c2*7)+'deg'}
        else{sy=(b>.5?(90+a*80):-(70+a*60))+'px';sr=((c2-.5)*9)+'deg';ss=.9}
        el.style.setProperty('--sx',sx);el.style.setProperty('--sy',sy);el.style.setProperty('--sr',sr);el.style.setProperty('--ss',ss);
        el.style.setProperty('--sd',((i%6)*.09).toFixed(2)+'s');
        el.classList.add('sc'); scList.push(el);
      });
    }
    scatter('.stats .st'); scatter('.ab-photo'); scatter('.ab-text > :not(h2)'); scatter('.pn'); scatter('.ui'); scatter('.ex');
    scatter('.bc'); scatter('.bc .chip','pop'); scatter('.orbit .ring','pop'); scatter('.cl-tier'); scatter('.cl-row');
    scatter('.forge-r'); scatter('.ct-sub'); scatter('.ct-mail'); scatter('.ct-links'); scatter('.ct-card'); scatter('.ft-grid > div'); scatter('.gh');
    armAll=function(){ splits.forEach(function(h){splitIO.observe(h)}); scList.forEach(function(el){scIO.unobserve(el);scIO.observe(el)}) }
    if(ready) armAll();

    /* parallax images */
    $$('.ab-frame img').forEach(function(im){im.classList.add('par-img');pars.push({el:im,box:im.parentNode,amp:34})});
    $$('.portrait img').forEach(function(im){im.classList.add('par-img');pars.push({el:im,box:im.parentNode,amp:22})});

    /* crazy button hovers */
    var BTN='.btn,.pbtn,.fbtn,.ct-email,.ct-copy,.ct-links a,.ct-card button.send,.nav-cta,.totop';
    var COLS=['#ff5a1f','#ffb454','#efece4','#ff8a3d'];
    function burst(x,y){
      for(var k=0;k<14;k++){
        var p=document.createElement('i'), ang=Math.random()*6.283, d=46+Math.random()*80;
        p.className='pt'; p.style.background=COLS[k%COLS.length];
        p.style.setProperty('--x0',x+'px');p.style.setProperty('--y0',y+'px');
        p.style.setProperty('--x1',(x+Math.cos(ang)*d)+'px');p.style.setProperty('--y1',(y+Math.sin(ang)*d)+'px');
        document.body.appendChild(p); setTimeout((function(n){return function(){n.remove()}})(p),850);
      }
    }
    $$(BTN).forEach(function(b){
      b.classList.add('fx'); var s=document.createElement('i'); s.className='shine'; b.appendChild(s);
      b.addEventListener('mouseenter',function(){if(b.animate)b.animate([{scale:'1 1'},{scale:'1.15 .85',offset:.22},{scale:'.9 1.12',offset:.42},{scale:'1.06 .96',offset:.62},{scale:'.99 1.02',offset:.82},{scale:'1 1'}],{duration:750,easing:'cubic-bezier(.3,1.4,.4,1)'})});
      b.addEventListener('click',function(e){burst(e.clientX,e.clientY)});
    });

    /* 3-D tilt */
    $$('.ui,.ab-photo').forEach(function(el){
      el.classList.add('tilt');
      el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--rx',(-py*9).toFixed(2)+'deg');el.style.setProperty('--ry',(px*11).toFixed(2)+'deg')});
      el.addEventListener('mouseleave',function(){el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
    });
  }
  motion();

  /* ============ POP-UP INVITE (5s after the loader) ============ */
  (function(){
    var pop=$('#pop'); if(!pop)return;
    try{if(sessionStorage.getItem('sg-pop'))return}catch(e){}
    var shown=false;
    function arm(){if(shown)return;shown=true;setTimeout(function(){pop.classList.add('show');pop.setAttribute('aria-hidden','false')},5000)}
    function close(){pop.classList.remove('show');pop.setAttribute('aria-hidden','true');try{sessionStorage.setItem('sg-pop','1')}catch(e){}}
    $('#popX').onclick=close; $('.pop-wa',pop).addEventListener('click',close);
    if(!document.body.classList.contains('loading'))arm(); else document.addEventListener('sg:ready',arm);
    setTimeout(arm,9000);
  })();
})();
