// ATLAS Core application / waiting list. Estimate is worked out on the page; the answers are emailed to Kyle via /api/notify.
(function(){
  const tc=document.getElementById('tcount'),tp=document.getElementById('tper');
  if(tc&&tp){const upd=()=>{const n=+tc.value,m=+tp.value,h=n*m/60*365;document.getElementById('tout').textContent=n;
    document.getElementById('tperout').textContent=m<60?m+' min':(m/60)+(m===60?' hour':' hours');
    document.getElementById('thours').textContent=Math.round(h).toLocaleString('en-AU');
    document.getElementById('tfte').textContent=(h/2080).toFixed(1);
    document.getElementById('twage').textContent='A$'+Math.round(h*35).toLocaleString('en-AU')};
    tc.addEventListener('input',upd);tp.addEventListener('input',upd);upd()}
  const form=document.getElementById('acform'); if(!form) return;
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const st={count:10,cm:null,pt:null,mode:null};
  const steps=$$('.ac-step'); let cur=0;
  const sync=v=>{v=Math.max(1,Math.min(2000,Math.round(+v||1)));st.count=v;$('#acout').textContent=v;$('#accountn').value=v;$('#account').value=Math.min(200,v)};
  $('#account').addEventListener('input',e=>sync(e.target.value));
  $('#accountn').addEventListener('input',e=>sync(e.target.value));
  $$('.ac-opts').forEach(g=>{const n=g.dataset.name,multi=g.hasAttribute('data-multi');
    const paint=()=>g.querySelectorAll('.ac-opt').forEach(o=>o.classList.toggle('sel',o.querySelector('input').checked));
    g.addEventListener('change',()=>{if(!multi){const c=g.querySelector('input:checked');st[n]=c?c.value:null}paint();$('#acerr').textContent=''});paint()});
  const vals=n=>$$(`input[name="${n}"]:checked`).map(i=>i.value);
  const vis=()=>steps.filter(s=>!s.dataset.when||s.dataset.when===st.cm);
  function show(i){const v=vis();cur=Math.max(0,Math.min(i,v.length-1));steps.forEach(s=>s.classList.remove('on'));v[cur].classList.add('on');
    $('#acbar').style.width=((cur+1)/(v.length+1)*100)+'%';$('#acstep').textContent=`Step ${cur+1} of ${v.length}`;
    $('#acback').style.visibility=cur?'visible':'hidden';$('#acnext').textContent=cur===v.length-1?'Join the waiting list':'Next';$('#acerr').textContent=''}
  function err(){const s=vis()[cur].dataset.step;
    if(s==='2'&&!st.cm)return'Choose your channel manager.';
    if(s==='4'&&!st.pt)return'Choose how you set prices.';if(s==='5'&&!vals('channels').length)return'Choose at least one place you list.';
    if(s==='7'&&!st.mode)return'Choose overnight or 24/7 autopilot.';
    if(s==='8'){if(!$('#acname').value.trim())return'Enter your name.';if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#acemail').value.trim()))return'Enter a valid email.';
      if(!$('#acphone').value.trim())return'Enter your mobile.';if(!$('#acconsent').checked)return'Please tick the box to agree to be contacted.'}
    return''}
  const aud=n=>'A$'+Math.round(n).toLocaleString('en-AU');
  // Plans: base price includes a number of properties, then a price per extra property (cheapest plan picked automatically)
  const PLANS=[{name:'Pillar',base:399,inc:5,extra:69},{name:'Titan',base:999,inc:15,extra:59},{name:'Celestial',base:2499,inc:40,extra:49}];
  const cost=(p,n)=>p.base+Math.max(0,n-p.inc)*p.extra;
  const best=n=>PLANS.reduce((a,p)=>cost(p,n)<cost(a,n)?p:a);
  const monthly=n=>cost(best(n),n), setup=n=>1999;
  function fit(){const H=st.cm==='Hospitable',P=st.pt==='PriceLabs',none=st.cm==='None';
    if(H&&P)return['ready','Looks compatible','ATLAS should connect to your current setup',"Good news: ATLAS works with the systems you use. We'll confirm the details with you before launch."];
    if(none)return['not','Setup needed','We\'ll set you up',"ATLAS connects through a booking system, and you don't have one yet. We'll recommend a setup and set it up for you."];
    return['custom','We\'ll check your setup','We\'ll see if ATLAS can connect to your current setup',"If it can't, we'll recommend a setup and set it up for you."]}
  async function submit(){
    const n=st.count,f=fit();const est=`${f[1]} | ${best(n).name} plan ${aud(monthly(n))}/month + from ${aud(setup(n))} setup (estimate, + GST)`;$('#acest').value=est;
    const fd=new FormData();
    fd.append('form-name','atlas-waitlist');fd.append('bot-field',form.querySelector('[name=bot-field]').value);
    [['name','#acname'],['business','#acbiz'],['email','#acemail'],['phone','#acphone']].forEach(([k,s])=>fd.append(k,$(s).value.trim()));
    fd.append('properties',String(n));fd.append('channel_manager',st.cm);fd.append('other_systems',$('#acsys').value.trim());fd.append('pricing',st.pt);
    fd.append('channels',vals('channels').join(', '));fd.append('operation',vals('ops').join(', '));fd.append('wants',vals('want').join(', '));
    fd.append('mode',st.mode);fd.append('estimate',est);fd.append('consent','yes');
    const b=$('#acnext');b.disabled=true;b.textContent='Sending…';
    try{const r=await fetch('/api/notify',{method:'POST',body:fd,headers:{Accept:'application/json'}});if(!r.ok)throw new Error(await r.text());result(true)}
    catch(e){b.disabled=false;b.textContent='Join the waiting list';$('#acerr').textContent="Sorry, that didn't go through. Please try again, or email kyle@turnkeybnbs.com.au."}}
  function result(){const n=st.count,f=fit(),p=best(n),extra=Math.max(0,n-p.inc);
    form.hidden=true;$('.ac-progress').hidden=true;$('#acstep').hidden=true;const r=$('#acresult');r.hidden=false;
    r.innerHTML=`<div class="ac-done"><span class="t" aria-hidden="true">✓</span><div><b>You're on the ATLAS Core waiting list.</b><p>Thanks${$('#acname').value.trim()?', '+$('#acname').value.trim().split(' ')[0]:''}. We'll check your setup and be in touch before launch.</p></div></div>
      <div class="ac-fit ${f[0]}"><div class="lbl">${f[1]}</div><h3>${f[2]}</h3><p>${f[3]}</p></div>
      <div class="ac-cards"><div class="ac-kpi hi"><div class="k">ATLAS Core ${p.name} per month (founding price)</div><div class="v">${aud(monthly(n))}</div><div class="n">${aud(p.base)} for up to ${p.inc} properties${extra?` + ${extra} extra × ${aud(p.extra)}`:''}, plus GST</div></div>
      <div class="ac-kpi"><div class="k">Estimated time back</div><div class="v">${Math.round(n*182.5).toLocaleString('en-AU')} hrs</div><div class="n">A year, at about 30 minutes of admin per property a day (estimate)</div></div>
      <div class="ac-kpi"><div class="k">One-off setup</div><div class="v">from ${aud(setup(n))}</div><div class="n">Plus GST. Confirmed once we've checked your setup</div></div></div>
      <table class="ac-table"><thead><tr><th>Plan</th><th class="r">Per month</th><th class="r">Includes</th><th class="r">Each extra property</th></tr></thead><tbody>
      ${PLANS.map(x=>`<tr><td>${x.name}${x===p?'<span class="ac-pill">your plan</span>':''}</td><td class="r">${aud(x.base)}</td><td class="r">up to ${x.inc}</td><td class="r">${aud(x.extra)}</td></tr>`).join('')}</tbody></table>
      <p class="ac-note">Founding prices, for our first 10 clients only. Estimate only, confirmed before launch. Every plan includes your ATLAS's own phone number and call minutes (fair use), the AI, voice, hosting, messaging, ongoing updates and support. Your own software stays on your own accounts and is paid directly to those providers. Prices exclude GST.</p>`;
    r.scrollIntoView({behavior:'smooth',block:'start'})}
  $('#acnext').addEventListener('click',()=>{const e=err();if(e){$('#acerr').textContent=e;return}if(cur===vis().length-1)return submit();show(cur+1)});
  $('#acback').addEventListener('click',()=>show(cur-1));
  form.addEventListener('submit',e=>e.preventDefault());
  show(0);
})();
