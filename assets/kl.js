/* Kusuma Lab: skrip bersama untuk semua halaman */
(function(){
  var root=document.documentElement;
  var EMAIL='natannovtarain.partnership@gmail.com';
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){return null;}}

  /* mode */
  /* mode: tiap halaman membuka dengan mode bawaannya (data-default-theme di tag html),
     pilihan pengunjung hanya disimpan saat dia menekan tombol mode sendiri */
  function setMode(m,save){
    root.setAttribute('data-theme',m);
    document.getElementById('mode-mini').innerHTML=m==='dark'
      ?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      :'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
    document.getElementById('mode-mini').setAttribute('aria-label',m==='dark'?'Ganti ke mode Light':'Ganti ke mode Dark');
    var tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute('content',m==='light'?'#F7F7F2':'#07080B');
    if(save)store('kl-mode',m);
  }
  var savedMode=store('kl-mode'),defMode=root.getAttribute('data-default-theme')==='light'?'light':'dark';
  setMode(savedMode==='light'||savedMode==='dark'?savedMode:defMode);
  document.getElementById('mode-mini').addEventListener('click',function(){setMode(root.getAttribute('data-theme')==='light'?'dark':'light',true);});
  var navbar=document.querySelector('.navbar'),menuBtn=document.getElementById('menu-btn');
  function setMenu(open){navbar.classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Tutup menu':'Buka menu');}
  menuBtn.addEventListener('click',function(){setMenu(!navbar.classList.contains('open'));});
  Array.prototype.forEach.call(document.querySelectorAll('#navlinks a'),function(a){a.addEventListener('click',function(){setMenu(false);});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false);});

  /* progress + scroll spy */
  var bar=document.getElementById('progress');
  function onScroll(){var h=document.documentElement.scrollHeight-window.innerHeight;bar.style.transform='scaleX('+(h>0?Math.min(1,window.scrollY/h):0)+')';}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  var links=Array.prototype.slice.call(document.querySelectorAll('#navlinks .btn'));
  var halos=document.querySelectorAll('.halo');
  if('IntersectionObserver' in window){
    var lit=new IntersectionObserver(function(es){es.forEach(function(en){en.target.classList.toggle('lit',en.isIntersecting);});},{threshold:.25});
    Array.prototype.forEach.call(halos,function(h){lit.observe(h);});
  }else{Array.prototype.forEach.call(halos,function(h){h.classList.add('lit');});}
  if('IntersectionObserver' in window){
    var spy=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){links.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('data-sec')===en.target.id);});}});},{rootMargin:'-45% 0px -50% 0px'});
    ['story','roadmap','calculator','freebies','contact'].forEach(function(id){var el=document.getElementById(id);if(el)spy.observe(el);});
  }

  /* clipboard */
  function selectText(el){try{var r=document.createRange();r.selectNodeContents(el);var s=window.getSelection();s.removeAllRanges();s.addRange(r);}catch(e){}}
  function copyText(text,fallbackEl,cb){
    try{navigator.clipboard.writeText(text).then(function(){cb(true);},function(){if(fallbackEl)selectText(fallbackEl);cb(false);});}
    catch(e){if(fallbackEl)selectText(fallbackEl);cb(false);}
  }


  /* spotlight kartu, lewat delegasi supaya kartu yang dibuat belakangan ikut menyala */
  var lastSpot=null;
  function resetSpot(el){el.style.setProperty('--mx','-600px');el.style.setProperty('--my','-600px');}
  document.addEventListener('pointermove',function(e){
    var el=e.target.closest?e.target.closest('.spot'):null;
    if(lastSpot&&lastSpot!==el)resetSpot(lastSpot);
    lastSpot=el;
    if(el){var r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px');}
  },{passive:true});

  /* navigasi: link di halaman yang sama tidak meninggalkan hash, jadi reload selalu mulai dari atas */
  try{if('scrollRestoration' in history)history.scrollRestoration='manual';}catch(e){}
  function clearHash(){try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}}
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey)return;
    var a=e.target.closest?e.target.closest('a[href^="#"]'):null;if(!a)return;
    var id=decodeURIComponent(a.getAttribute('href').slice(1));
    if(!id||id==='top'){e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});return;}
    var t=document.getElementById(id);if(!t)return;
    e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});
  });
  window.addEventListener('load',function(){
    if(!location.hash){window.scrollTo(0,0);return;}
    if(window.KL_KEEP_HASH)return;
    var t=document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if(t)setTimeout(function(){t.scrollIntoView({block:'start'});clearHash();},60);else clearHash();
  });

  /* renderer freebie, dipakai halaman utama dan perpustakaan */
  var AIS={claude:{label:'Claude',url:'https://claude.ai/new'},chatgpt:{label:'ChatGPT',url:'https://chatgpt.com/'},gemini:{label:'Gemini',url:'https://gemini.google.com/app'}};
  var ext='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7"/><path d="M8 7h9v9"/></svg>';
  var copyIco='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
  /* analitik GoatCounter: hanya mencatat nama tombol, tanpa isi yang diketik pengunjung */
  /* event yang terjadi sebelum skrip GoatCounter selesai dimuat (misalnya freebie dibuka dari link langsung) diantrekan dulu */
  var trackQ=[],trackPoll=null;
  function gcReady(){return window.goatcounter&&window.goatcounter.count;}
  function send(ev){try{window.goatcounter.count({path:ev[0],title:ev[1]||ev[0],event:true});}catch(e){}}
  function track(path,title){
    if(gcReady()){send([path,title]);return;}
    trackQ.push([path,title]);
    if(!trackPoll){var tries=0;trackPoll=setInterval(function(){
      if(gcReady()){clearInterval(trackPoll);trackPoll=null;while(trackQ.length)send(trackQ.shift());}
      else if(++tries>40){clearInterval(trackPoll);trackPoll=null;trackQ=[];}
    },250);}
  }
  function mk(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
  function txt(tag,cls,t){var e=document.createElement(tag);if(cls)e.className=cls;e.textContent=t;return e;}

  function buildActions(target,ais){
    var box=mk('div','actions');
    var hint=txt('span','status','Klik salah satu, prompt otomatis tersalin');
    var row=mk('div','row');
    var status=mk('span','status');status.setAttribute('aria-live','polite');
    var copyBtn=mk('button','btn',copyIco+'<span>Salin aja</span>');copyBtn.type='button';
    var timer=null;
    function done(ok,opened){
      status.className='status'+(ok?' ok':'');
      status.textContent=ok?(opened?'Tersalin! Tinggal tempel di tab yang baru kebuka.':'Tersalin! Prompt sudah di clipboard.'):'Teksnya sudah kupilih, tinggal salin manual.';
      copyBtn.querySelector('span').textContent=ok&&!opened?'Tersalin':'Salin aja';
      clearTimeout(timer);
      timer=setTimeout(function(){status.textContent='';copyBtn.querySelector('span').textContent='Salin aja';},opened?4500:2000);
    }
    ais.forEach(function(k,idx){
      var a=mk('a','btn'+(idx===0?' btn-main':''),'Buka '+AIS[k].label+' '+ext);
      a.href=AIS[k].url;a.target='_blank';a.rel='noopener';
      a.addEventListener('click',function(){track('freebie/'+target.id.replace('-prompt','')+'/'+k,'Freebie dibuka di '+AIS[k].label);copyText(target.textContent,target,function(ok){done(ok,true);});});
      row.appendChild(a);
    });
    copyBtn.addEventListener('click',function(){track('freebie/'+target.id.replace('-prompt','')+'/salin','Prompt disalin');copyText(target.textContent,target,function(ok){done(ok,false);});});
    row.appendChild(copyBtn);
    box.appendChild(hint);box.appendChild(row);box.appendChild(status);
    return box;
  }

  /* label perangkat eksekusi: HP atau laptop */
  var DEV={
    hp:{t:'Lebih enak dicoba di HP',i:'<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>'},
    laptop:{t:'Lebih enak dicoba di laptop',i:'<rect x="4" y="4" width="16" height="11" rx="2"/><path d="M2 19h20"/>'}
  };
  function deviceLabel(f){
    var d=DEV[f.device];if(!d)return null;
    return mk('span','device','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d.i+'</svg><span>'+d.t+'</span>');
  }
  var linkIco='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1 1"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1-1"/></svg>';
  /* tombol salin link freebie; label khusus kalau freebie-nya lebih enak di laptop */
  function shareRow(f){
    var site=(window.KL_DATA&&KL_DATA.site)||location.origin,url=site+'/freebies/#'+f.slug;
    var row=mk('div','share-row');
    var b=mk('button','btn',linkIco+'<span>'+(f.device==='laptop'?'Salin link buat dibuka di laptop':'Salin link freebie ini')+'</span>');b.type='button';
    var s=mk('span','status');s.setAttribute('aria-live','polite');var t=null;
    b.addEventListener('click',function(){
      track('freebie/'+f.slug+'/salin-link','Link freebie disalin');
      copyText(url,null,function(ok){s.className='status'+(ok?' ok':'');s.textContent=ok?(f.device==='laptop'?'Link tersalin, buka nanti di laptop':'Link tersalin, tinggal bagikan'):'Salin manual '+url;clearTimeout(t);t=setTimeout(function(){s.textContent='';},3000);});
    });
    row.appendChild(b);row.appendChild(s);return row;
  }

  function fillFreebie(f,box,opt){
    opt=opt||{};var k=f.key;
    if(!opt.noHead){
      var dv=deviceLabel(f);if(dv)box.appendChild(dv);
      box.appendChild(txt('span','step',f.step));
      var ch=mk('div','chips');f.chips.forEach(function(c){ch.appendChild(txt('span','chip',c));});box.appendChild(ch);
      var h=txt('h3',null,f.title);h.id=k+'-title';box.appendChild(h);
      if(f.desc)box.appendChild(txt('p','when',f.desc));
    }
    if(f.edu){var ed=mk('div','edu');ed.appendChild(txt('b',null,f.edu.title));ed.appendChild(txt('p',null,f.edu.text));box.appendChild(ed);}
    if(f.how){var ol=mk('ol','how');f.how.forEach(function(t){ol.appendChild(mk('li',null,t));});box.appendChild(ol);}
    box.appendChild(mk('p','opts-hint','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg><span>Klik dan sesuaikan, prompt-nya ikut berubah</span>'));
    var opts=mk('div','opts');
    f.fields.forEach(function(fd){
      var w=mk('div','field'),id=k+'-'+fd.id;
      var lab=txt('label',null,fd.label);lab.setAttribute('for',id);w.appendChild(lab);
      var inp;
      if(fd.type==='select'){
        inp=document.createElement('select');
        fd.options.forEach(function(o){var op=document.createElement('option');op.textContent=o.label;op.value=o.value!=null?o.value:o.label;if(o.selected)op.selected=true;inp.appendChild(op);});
      }else{inp=document.createElement('input');inp.type='text';inp.value=fd.value||'';inp.setAttribute('autocomplete','off');}
      inp.id=id;w.appendChild(inp);opts.appendChild(w);
    });
    box.appendChild(opts);
    var pr=mk('div','prompt');pr.id=k+'-prompt';box.appendChild(pr);
    function render(){
      pr.textContent=f.prompt.replace(/\{(\w+)\}/g,function(m,name){
        var fd=f.fields.filter(function(x){return x.id===name;})[0],el=opts.querySelector('[id="'+k+'-'+name+'"]');
        var v=el?el.value.trim():'';return v||(fd&&fd.empty)||'';
      });
    }
    function bump(){render();pr.classList.remove('bump');void pr.offsetWidth;pr.classList.add('bump');}
    opts.addEventListener('input',bump);opts.addEventListener('change',bump);render();
    box.appendChild(buildActions(pr,f.ais));
    if(f.fine)box.appendChild(txt('p','fine',f.fine));
    /* di halaman utama, freebie laptop langsung dapat tombol salin link */
    if(!opt.noHead&&f.device==='laptop')box.appendChild(shareRow(f));
    return box;
  }

  window.KL={track:track,store:store,copyText:copyText,fillFreebie:fillFreebie,deviceLabel:deviceLabel,shareRow:shareRow,data:window.KL_DATA,mk:mk,txt:txt,clearHash:clearHash};


  /* ===== Labi: maskot Kusuma Lab, digambar dengan SVG supaya ringan dan bisa bergerak ===== */
  var LB_N=0;
  var BODY='M80 64 L80 74 Q60 104 40 136 Q24 162 26 178 Q28 196 50 198 L150 198 Q172 196 174 178 Q176 162 160 136 Q140 104 120 74 L120 64 Z';
  var INK='#07080B',CHEEK='#FF9FB2',TEAR='#7CC8FF',HEART='#FF6B81',SPARK='#FFB86B';
  function lbEye(cx,cy,m,dx,dy,id){
    dx=dx||0;dy=dy||0;
    if(m==='open')return '<circle cx="'+cx+'" cy="'+cy+'" r="15" fill="#fff"/><g class="lb-pupil"><circle cx="'+(cx+dx)+'" cy="'+(cy+dy)+'" r="8" fill="'+INK+'"/><circle cx="'+(cx+dx+3)+'" cy="'+(cy+dy-3)+'" r="2.6" fill="#fff"/></g>';
    if(m==='wide')return '<circle cx="'+cx+'" cy="'+cy+'" r="17" fill="#fff"/><g class="lb-pupil"><circle cx="'+(cx+dx)+'" cy="'+(cy+dy)+'" r="10" fill="'+INK+'"/><circle cx="'+(cx+dx+3.5)+'" cy="'+(cy+dy-3.5)+'" r="3.4" fill="#fff"/><circle cx="'+(cx+dx-3)+'" cy="'+(cy+dy+3.5)+'" r="1.6" fill="#fff"/></g>';
    if(m==='happy')return '<path d="M'+(cx-11)+' '+(cy+3)+' Q'+cx+' '+(cy-11)+' '+(cx+11)+' '+(cy+3)+'" fill="none" stroke="'+INK+'" stroke-width="5" stroke-linecap="round"/>';
    if(m==='half')return '<circle cx="'+cx+'" cy="'+cy+'" r="15" fill="#fff"/><circle cx="'+(cx+dx)+'" cy="'+(cy+dy+3)+'" r="8" fill="'+INK+'"/><path d="M'+(cx-17)+' '+(cy-17)+' H'+(cx+17)+' V'+(cy+1)+' Q'+cx+' '+(cy-3)+' '+(cx-17)+' '+(cy+1)+' Z" fill="url(#'+id+'g)"/><path d="M'+(cx-15)+' '+(cy+1)+' Q'+cx+' '+(cy-3)+' '+(cx+15)+' '+(cy+1)+'" fill="none" stroke="'+INK+'" stroke-width="3.5" stroke-linecap="round"/>';
    if(m==='focus'){var fl=cx<100?'':' transform="scale(-1 1) translate('+(-2*cx)+' 0)"';
      return '<circle cx="'+cx+'" cy="'+cy+'" r="15" fill="#fff"/><circle cx="'+(cx+dx)+'" cy="'+(cy+dy+2)+'" r="8" fill="'+INK+'"/><circle cx="'+(cx+dx+3)+'" cy="'+(cy+dy-1)+'" r="2.4" fill="#fff"/><path d="M'+(cx-17)+' '+(cy-17)+' H'+(cx+17)+' V'+(cy-6)+' L'+(cx-17)+' '+(cy-2)+' Z" fill="url(#'+id+'g)"'+fl+'/><path d="M'+(cx-15)+' '+(cy-3)+' L'+(cx+15)+' '+(cy-7)+'" stroke="'+INK+'" stroke-width="3.5" stroke-linecap="round"'+fl+'/>';}
    if(m==='teary')return lbEye(cx,cy,'wide',dx,dy,id)+'<path d="M'+(cx-13)+' '+(cy+12)+' Q'+(cx-16)+' '+(cy+24)+' '+(cx-12)+' '+(cy+30)+' Q'+(cx-6)+' '+(cy+26)+' '+(cx-9)+' '+(cy+14)+' Z" fill="'+TEAR+'"/>';
    return '';
  }
  var LB_MOUTH={
    smile:'<path d="M88 146 Q100 162 112 146 Z" fill="'+INK+'"/><path d="M93 152 Q100 158 107 152 Q100 149 93 152 Z" fill="'+CHEEK+'"/>',
    big:'<path d="M84 144 Q100 170 116 144 Z" fill="'+INK+'"/><path d="M90 154 Q100 163 110 154 Q100 150 90 154 Z" fill="'+CHEEK+'"/>',
    flat:'<path d="M92 150 H108" stroke="'+INK+'" stroke-width="4" stroke-linecap="round"/>',
    side:'<path d="M94 152 Q101 148 108 150" fill="none" stroke="'+INK+'" stroke-width="4" stroke-linecap="round"/>',
    wavy:'<path d="M88 152 Q92 147 96 152 T104 152 T112 152" fill="none" stroke="'+INK+'" stroke-width="3.5" stroke-linecap="round"/>',
    frown:'<path d="M90 156 Q100 146 110 156" fill="none" stroke="'+INK+'" stroke-width="4" stroke-linecap="round"/>',
    cat:'<path d="M90 148 Q95 154 100 148 Q105 154 110 148" fill="none" stroke="'+INK+'" stroke-width="3.5" stroke-linecap="round"/>'
  };
  function lbHeart(x,y,s,c){return '<path class="lb-pop" transform="translate('+x+' '+y+') scale('+s+')" d="M0 4 C0 -2 8 -3 8 3 C8 -3 16 -2 16 4 C16 10 8 14 8 16 C8 14 0 10 0 4 Z" fill="'+(c||HEART)+'"/>';}
  function lbSpark(x,y,s,c){return '<path class="lb-pop" transform="translate('+x+' '+y+') scale('+s+')" d="M0 -9 Q2 -2 9 0 Q2 2 0 9 Q-2 2 -9 0 Q-2 -2 0 -9 Z" fill="'+(c||SPARK)+'"/>';}
  var LB_BUB='<circle class="lb-bub" cx="114" cy="32" r="4" fill="#E9FFF9" stroke="#2FA89A" stroke-width="2"/><circle class="lb-bub b2" cx="124" cy="18" r="2.6" fill="#E9FFF9" stroke="#2FA89A" stroke-width="2"/>';
  var LB_POSES={
    halo:{level:150,eyes:['open',2,1],mouth:'smile',arms:[20,150],wave:'R',extra:LB_BUB},
    aha:{level:132,eyes:['wide',0,-1],mouth:'big',arms:[60,60],extra:LB_BUB+lbSpark(32,70,1.1)+lbSpark(168,58,.8)+lbSpark(150,92,.6,'#2FA89A')},
    mikir:{level:152,eyes:['open',-5,-5],mouth:'side',arms:[20,10],extra:'<g class="lb-pop" transform="translate(148 40)"><circle r="17" fill="#fff" stroke="#2FA89A" stroke-width="2.5"/><text x="0" y="7" text-anchor="middle" font-family="Geist, sans-serif" font-weight="700" font-size="20" fill="#0B5C52">?</text></g><circle cx="132" cy="64" r="4" fill="#fff" stroke="#2FA89A" stroke-width="2"/>'},
    fokus:{level:148,eyes:['focus',2,0],mouth:'flat',arms:[35,35],extra:'<path class="lb-steam" d="M104 40 Q100 30 106 22 M114 42 Q112 30 118 24" fill="none" stroke="#2FA89A" stroke-width="3" stroke-linecap="round" opacity=".7"/>'},
    berhasil:{level:140,eyes:['happy'],mouth:'big',arms:[155,155],cheeks:.75,extra:'<g class="lb-pop" transform="translate(100 22)"><circle r="16" fill="#2FA89A"/><path d="M-7 0 L-2 5 L8 -6" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></g>'+lbSpark(40,52,.8)+lbSpark(164,60,.9)},
    capek:{level:176,eyes:['half'],mouth:'wavy',arms:[8,8],wobble:-4,extra:'<path d="M156 92 Q162 104 156 110 Q150 104 156 92 Z" fill="'+TEAR+'"/><text class="lb-pop" x="140" y="44" font-family="Geist, sans-serif" font-weight="600" font-size="15" fill="#2FA89A">z</text><text class="lb-pop" x="152" y="30" font-family="Geist, sans-serif" font-weight="600" font-size="20" fill="#2FA89A">z</text>'},
    makasih:{level:150,eyes:['happy'],mouth:'cat',arms:[-35,-35],cheeks:.95,extra:lbHeart(140,40,1.1)+lbHeart(42,56,.8)+lbHeart(156,74,.6,CHEEK)},
    gagal:{level:180,eyes:['teary',0,2],mouth:'frown',arms:[5,5],cheeks:.4,extra:''}
  };
  function labi(pose,opt){
    opt=opt||{};var P=LB_POSES[pose]||LB_POSES.halo,id='lb'+(++LB_N);
    var lv=opt.level!=null?opt.level:P.level,dy=lv-150,ch=P.cheeks!=null?P.cheeks:.55;
    function arm(side,ang){var x=side==='L'?40:160,a=side==='L'?ang:-ang,w=(P.wave===side)?' lb-wave':'';
      return '<g class="lb-arm'+w+'" style="transform-origin:'+x+'px 142px"><rect x="'+(x-7)+'" y="138" width="14" height="34" rx="7" fill="url(#'+id+'l)" transform="rotate('+a+' '+x+' 142)"/></g>';}
    var wave='M-100 150 Q-75 144 -50 150 T0 150 T50 150 T100 150 T150 150 T200 150 T250 150 T300 150 V270 H-100 Z';
    var crest='M-100 150 Q-75 144 -50 150 T0 150 T50 150 T100 150 T150 150 T200 150 T250 150 T300 150';
    var e=P.eyes;
    return '<svg class="labi labi-'+pose+'" viewBox="0 0 200 222" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Labi, maskot Kusuma Lab">'+
      '<defs><clipPath id="'+id+'c"><path d="'+BODY+'"/></clipPath>'+
      '<radialGradient id="'+id+'g" cx="38%" cy="34%" r="75%"><stop offset="0" stop-color="#F2FFFB"/><stop offset=".55" stop-color="#C6FBEE"/><stop offset="1" stop-color="#93E6D2"/></radialGradient>'+
      '<linearGradient id="'+id+'l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46C9B8"/><stop offset="1" stop-color="#1E7F74"/></linearGradient>'+
      '<linearGradient id="'+id+'k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16857A"/><stop offset="1" stop-color="#0A4F47"/></linearGradient>'+
      '<filter id="'+id+'s" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="4"/></filter></defs>'+
      '<ellipse cx="100" cy="212" rx="60" ry="7" fill="#000" opacity=".22" filter="url(#'+id+'s)"/>'+
      '<g class="lb-bob"><g transform="rotate('+(P.wobble||0)+' 100 200)">'+
      arm('L',P.arms[0])+arm('R',P.arms[1])+
      '<ellipse cx="76" cy="201" rx="14" ry="7" fill="url(#'+id+'k)"/><ellipse cx="124" cy="201" rx="14" ry="7" fill="url(#'+id+'k)"/>'+
      '<path d="'+BODY+'" fill="url(#'+id+'g)" stroke="#8FDCC9" stroke-width="1.5"/>'+
      '<g clip-path="url(#'+id+'c)"><g class="lb-liq" style="transform:translateY('+dy+'px)"><g class="lb-slosh"><path d="'+wave+'" fill="url(#'+id+'l)"/><path d="'+crest+'" fill="none" stroke="#7FE3D4" stroke-width="4"/></g></g>'+
      '<path d="M38 150 Q34 172 44 186" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>'+
      '<path d="M66 92 Q58 104 52 116" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/></g>'+
      '<rect x="74" y="44" width="52" height="24" rx="9" fill="url(#'+id+'k)"/><rect x="82" y="49" width="14" height="5" rx="2.5" fill="#fff" opacity=".35"/>'+
      '<ellipse cx="66" cy="140" rx="9" ry="5.5" fill="'+CHEEK+'" opacity="'+ch+'"/><ellipse cx="134" cy="140" rx="9" ry="5.5" fill="'+CHEEK+'" opacity="'+ch+'"/>'+
      '<g class="lb-eyes">'+lbEye(80,118,e[0],e[1],e[2],id)+lbEye(120,118,e[0],e[1],e[2],id)+'</g>'+
      LB_MOUTH[P.mouth]+'</g></g>'+(P.extra||'')+'</svg>';
  }
  function setLabiLevel(svg,level){var g=svg&&svg.querySelector('.lb-liq');if(g)g.style.transform='translateY('+(level-150)+'px)';}

  /* logo: Labi versi sederhana, satu warna, mata tetap hidup */
  var LOGO='<svg class="logo-labi" viewBox="-3 -4 58 56" aria-hidden="true"><g transform="rotate(-8 24 26)">'+
    '<g class="logo-arm"><path d="M37 31 L45.5 19.5" stroke="var(--logo-2)" stroke-width="6.5" stroke-linecap="round"/></g>'+
    '<path d="M11.5 32 L6.5 39" stroke="var(--logo-2)" stroke-width="6" stroke-linecap="round"/>'+
    '<path transform="translate(2 -6) scale(.22)" d="'+BODY+'" fill="var(--logo-1)"/>'+
    '<rect x="18.3" y="3.6" width="11.4" height="5.4" rx="2.2" fill="var(--logo-2)"/>'+
    '<g class="lb-eyes"><circle cx="19.5" cy="23" r="4.3" fill="#fff"/><circle cx="28.5" cy="23" r="4.3" fill="#fff"/><circle cx="20.2" cy="23.4" r="2.3" fill="#07080B"/><circle cx="29.2" cy="23.4" r="2.3" fill="#07080B"/></g>'+
    '</g><path class="logo-dash" d="M47.5 12.5 L50 9.5 M50.5 17 L53 16" stroke="var(--logo-1)" stroke-width="2.4" stroke-linecap="round"/>'+
    '<circle class="logo-bub" cx="13.5" cy="3" r="2.2" fill="var(--logo-1)"/></svg>';

  /* ===== motion: muncul saat di-scroll, angka berjalan, kartu miring mengikuti kursor ===== */
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  root.classList.add('js');
  var rvObs='IntersectionObserver' in window&&!calm?new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');rvObs.unobserve(en.target);}});},{rootMargin:'0px 0px -14% 0px',threshold:.12}):null;
  function reveal(list){
    Array.prototype.forEach.call(list,function(el,i){
      if(el.classList.contains('rv'))return;
      if(!rvObs){return;}
      var sib=Array.prototype.indexOf.call(el.parentNode.children,el);
      el.style.setProperty('--rvd',Math.min(sib,5)*0.12+'s');
      el.classList.add('rv');rvObs.observe(el);
    });
  }
  var RV='.labi-intro,.sec-head,.story-card,.vision,.stages,.panel,.where,.calc > *,.tabs,.tabpanel > .note,.freebies > *,.more-card,.community,.contact > *,.lib-card,.newbie,.filters,.lib-tools,.lib-back,footer > *';
  document.addEventListener('DOMContentLoaded',function(){reveal(document.querySelectorAll(RV));});
  /* elemen paling bawah tetap muncul walau tidak pernah melewati batas pemicu */
  window.addEventListener('scroll',function(){
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-40){
      Array.prototype.forEach.call(document.querySelectorAll('.rv:not(.in)'),function(el){el.classList.add('in');if(rvObs)rvObs.unobserve(el);});}
  },{passive:true});

  function countTo(el,to,fmt,ms){
    if(!el)return;var from=parseFloat(el.getAttribute('data-v')||'0');el.setAttribute('data-v',to);
    if(calm||from===to){el.textContent=fmt(to);return;}
    var t0=null;ms=ms||550;cancelAnimationFrame(el._raf);
    function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-p,3);el.textContent=fmt(from+(to-from)*e);if(p<1)el._raf=requestAnimationFrame(step);}
    el._raf=requestAnimationFrame(step);
  }

  if(!calm&&window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.addEventListener('pointermove',function(e){
      var t=e.target.closest?e.target.closest('.tilt'):null;
      if(KL._tilt&&KL._tilt!==t){KL._tilt.style.transform='';}
      KL._tilt=t;if(!t)return;
      var r=t.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
      t.style.transform='perspective(700px) rotateX('+(-py*8).toFixed(2)+'deg) rotateY('+(px*10).toFixed(2)+'deg) translateY(-4px)';
    },{passive:true});
  }
  KL.labi=labi;KL.setLabiLevel=setLabiLevel;KL.reveal=reveal;KL.countTo=countTo;KL.calm=calm;
  Array.prototype.forEach.call(document.querySelectorAll('.brand-wrap .mark'),function(m){m.innerHTML=LOGO;});
  var CYCLE=[['halo','Halo!'],['aha','Aha!'],['mikir','Mikir'],['fokus','Fokus'],['berhasil','Berhasil!'],['capek','Capek'],['makasih','Makasih!'],['gagal','Gagal dulu']];
  Array.prototype.forEach.call(document.querySelectorAll('[data-labi-cycle]'),function(btn){
    var i=0,mood=document.getElementById('labi-mood');btn.innerHTML=labi(CYCLE[0][0]);
    btn.addEventListener('click',function(){i=(i+1)%CYCLE.length;btn.innerHTML=labi(CYCLE[i][0]);if(mood)mood.textContent=CYCLE[i][1];
      btn.classList.remove('boing');void btn.offsetWidth;btn.classList.add('boing');});
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-labi]'),function(el){el.innerHTML=labi(el.getAttribute('data-labi'));});

  /* mata Labi mengikuti kursor (laptop) */
  if(!calm&&window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches){
    var eyeRaf=null,ex=0,ey=0;
    document.addEventListener('pointermove',function(e){ex=e.clientX;ey=e.clientY;if(!eyeRaf)eyeRaf=requestAnimationFrame(function(){eyeRaf=null;
      Array.prototype.forEach.call(document.querySelectorAll('svg.labi'),function(sv){
        var r=sv.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight||!r.width)return;
        var cx=r.left+r.width/2,cy=r.top+r.height*.53,dx=ex-cx,dy=ey-cy,d=Math.max(1,Math.hypot(dx,dy)),k=Math.min(1,d/260);
        var tx=(dx/d)*5*k,ty=(dy/d)*4*k;
        Array.prototype.forEach.call(sv.querySelectorAll('.lb-pupil'),function(p){p.style.transform='translate('+tx.toFixed(2)+'px,'+ty.toFixed(2)+'px)';});
      });});},{passive:true});
  }
  /* Labi muncul dari balik kartu community */
  (function(){var w=document.getElementById('community-wrap');if(!w)return;
    if(calm||!('IntersectionObserver' in window)){w.classList.add('go');return;}
    var ob=new IntersectionObserver(function(es){if(es[0].isIntersecting){w.classList.add('go');ob.disconnect();}},{threshold:.55});ob.observe(w);})();
  /* toast Labi setiap kali sesuatu tersalin */
  var toastEl=null,toastT=null;
  function toast(msg,o){
    o=o||{};
    if(!toastEl){toastEl=document.createElement('div');toastEl.className='lb-toast';toastEl.setAttribute('role','status');document.body.appendChild(toastEl);}
    toastEl.classList.toggle('quote',!!o.quote);
    toastEl.innerHTML='<span class="t-labi">'+labi(o.pose||'berhasil')+'</span><span></span>';toastEl.lastChild.textContent=msg;
    toastEl.classList.remove('show');void toastEl.offsetWidth;toastEl.classList.add('show');
    clearTimeout(toastT);toastT=setTimeout(function(){toastEl.classList.remove('show');},o.ms||2400);
  }
  var _copy=copyText;
  copyText=function(t,el,cb){_copy(t,el,function(ok){if(ok)toast('Tersalin! Tinggal tempel ya');cb(ok);});};
  KL.copyText=copyText;KL.toast=toast;

  /* ===== easter egg: klik logo 3 kali ===== */
  var QUOTES=['Hasil butuh waktu dan sistem, bukan trik.','Karakter dulu, baru angka.','AI itu leverage, bukan sulap.','Freedom itu punya pilihan.','Uang itu alat buat mengalami hidup.','Kerjaan tetap itu lantai, bukan langit.'];
  var clicks=[],qi=Math.floor(Math.random()*QUOTES.length);
  Array.prototype.forEach.call(document.querySelectorAll('.brand-wrap'),function(br){
    var mk=br.querySelector('.mark'),bub=br.querySelector('.egg-bubble');
    mk.addEventListener('click',function(){
      var now=Date.now();clicks=clicks.filter(function(t){return now-t<1800;});clicks.push(now);
      if(clicks.length>=3){clicks=[];br.classList.remove('party');void br.offsetWidth;br.classList.add('party','found');
        if(bub)bub.classList.remove('show');store('kl-egg','1');KL.track('easter-egg','Easter egg logo ditemukan');
        qi=(qi+1)%QUOTES.length;toast('“'+QUOTES[qi]+'”',{pose:'aha',quote:true,ms:4800});}
    });
    /* bisikan sekali untuk pengunjung baru */
    if(bub&&!store('kl-egg')&&!calm)setTimeout(function(){bub.classList.add('show');setTimeout(function(){bub.classList.remove('show');},4500);store('kl-egg','hinted');},6000);
  });

  /* ===== surfer: Labi selancar di garis gelombang hero ===== */
  (function(){
    var sf=document.getElementById('surfer'),wl=document.querySelector('.hero .wave-line');if(!sf||!wl)return;
    var path=wl.querySelectorAll('path')[1];if(!path)return;
    sf.insertAdjacentHTML('afterbegin',labi('berhasil'));
    var hero=sf.parentNode,L=path.getTotalLength(),vis=true,t0=null,PER=13000;
    function place(p){
      var pt=path.getPointAtLength(p*L),pt2=path.getPointAtLength(Math.min(L,p*L+6));
      var r=wl.getBoundingClientRect(),hr=hero.getBoundingClientRect(),sx=r.width/1200,sy=r.height/96;
      var x=r.left-hr.left+pt.x*sx,y=r.top-hr.top+pt.y*sy,a=Math.atan2((pt2.y-pt.y)*sy,(pt2.x-pt.x)*sx)*180/Math.PI;
      var w=sf.offsetWidth,h=sf.offsetHeight,o=p<.1?p/.1:p>.9?(1-p)/.1:1;
      sf.style.opacity=o.toFixed(2);
      sf.style.transform='translate('+(x-w/2).toFixed(1)+'px,'+(y-h+4).toFixed(1)+'px) rotate('+(a*.8).toFixed(1)+'deg)';
    }
    if(calm){place(.5);sf.style.opacity=1;return;}
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis)requestAnimationFrame(loop);}).observe(hero);
    function loop(t){if(!vis)return;if(t0===null)t0=t;var e=t-t0-2600;if(e<0){requestAnimationFrame(loop);return;}
      var p=(e%PER)/PER;place(p);requestAnimationFrame(loop);}
    requestAnimationFrame(loop);
  })();

  /* ===== squad: 6 Labi menghibur Labi yang sedih ===== */
  (function(){
    var sq=document.getElementById('squad');if(!sq)return;
    var F=[['halo',-230,'-420px',0],['aha',-160,'-420px',0],['makasih',-92,'-420px',0],['berhasil',92,'420px',0],['halo',160,'420px',0],['aha',230,'420px',0]];
    var small=window.matchMedia&&matchMedia('(max-width:600px)').matches,k=small?.62:1;
    var html='';
    F.forEach(function(f){html+='<div class="m f" style="--x:'+(f[1]*k)+'px;--from:'+f[2]+';--d:'+f[3]+'s"><div class="in">'+labi(f[0])+'</div></div>';});
    html+='<div class="m hero-m"><div class="in" id="squad-c">'+labi('gagal')+'</div></div>';
    sq.innerHTML=html;
    if(calm){document.getElementById('squad-c').innerHTML=labi('makasih');return;}
    var c=document.getElementById('squad-c'),timers=[],cur='gagal';
    function pose(p){if(p===cur)return;cur=p;c.innerHTML=labi(p);}
    function schedule(){
      timers.forEach(clearTimeout);timers=[];
      [[0,'gagal'],[3000,'mikir'],[4100,'makasih'],[5100,'berhasil'],[8600,'halo'],[11000,'capek']].forEach(function(s){timers.push(setTimeout(function(){pose(s[1]);},s[0]));});
    }
    sq.classList.add('run');schedule();
    var lead=sq.querySelector('.f');
    lead.addEventListener('animationiteration',function(e){if(e.target===lead)schedule();});
    document.addEventListener('visibilitychange',function(){if(!document.hidden){sq.classList.remove('run');void sq.offsetWidth;sq.classList.add('run');schedule();}});
  })();

  /* tombol kembali ke atas */
  (function(){var b=document.getElementById('to-top');if(!b)return;
    function upd(){b.classList.toggle('show',window.scrollY>innerHeight*1.2);}
    window.addEventListener('scroll',upd,{passive:true});upd();
    b.addEventListener('click',function(){window.scrollTo({top:0,behavior:calm?'auto':'smooth'});});})();

  /* email */
  var mailBtn=document.getElementById('copy-mail'),mailStatus=document.getElementById('mail-status'),mailTimer=null;
  if(mailBtn)mailBtn.addEventListener('click',function(){
    copyText(EMAIL,null,function(ok){
      mailBtn.querySelector('span').textContent=ok?'Email address copied':'Copy email address';
      mailStatus.className='status'+(ok?' ok':'');
      mailStatus.textContent=ok?EMAIL:'Please copy manually: '+EMAIL;
      clearTimeout(mailTimer);
      mailTimer=setTimeout(function(){mailBtn.querySelector('span').textContent='Copy email address';},2500);
    });
  });

  /* cahaya kursor, laptop saja */
  (function(){
    var fine=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
    var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(!fine||calm)return;
    var g=document.getElementById('cursor-glow'),wrapEl=document.querySelector('main.wrap');
    var CARDS='.lib-card,.more-card,.newbie,.card,.story-card,.vision,.where,.panel > div,.stage,.tabbtn,.community,.fr-card,.reply,.note';
    var x=-999,y=-999,tx=-999,ty=-999,raf=null;
    function loop(){x+=(tx-x)*.22;y+=(ty-y)*.22;g.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';
      raf=(Math.abs(tx-x)>.4||Math.abs(ty-y)>.4)?requestAnimationFrame(loop):null;}
    function level(t,cx){
      if(t.closest('.nav'))return 0;
      if(t.closest('a,button,input,select,textarea,label'))return .55;
      if(t.closest(CARDS))return 1;
      var r=wrapEl.getBoundingClientRect();
      if(cx<r.left||cx>r.right)return .35;
      return .65;
    }
    document.addEventListener('pointermove',function(e){
      if(e.pointerType!=='mouse')return;
      tx=e.clientX;ty=e.clientY;if(x<-900){x=tx;y=ty;}
      var lv=level(e.target,e.clientX);g.style.opacity=lv;g.classList.toggle('big',lv===1);
      if(!raf)raf=requestAnimationFrame(loop);
    },{passive:true});
    document.documentElement.addEventListener('pointerleave',function(){g.style.opacity=0;});
    window.addEventListener('blur',function(){g.style.opacity=0;});
    document.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse'||e.button!==0)return;
      var card=e.target.closest(CARDS),edge=!card&&level(e.target,e.clientX)<=.35;
      var r=document.createElement('span');r.className='ripple'+(card?' strong':'');
      r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';
      r.style.setProperty('--ro',card?'.85':edge?'.3':'.55');r.style.setProperty('--rs',card?'9':edge?'5':'7');
      document.body.appendChild(r);setTimeout(function(){r.remove();},700);
      if(card&&!e.target.closest('a,button,input,select,textarea,label')){card.classList.add('flash');setTimeout(function(){card.classList.remove('flash');},380);}
    },{passive:true});
  })();
})();
