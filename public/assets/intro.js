(function(){var d=document.documentElement,seen=null,r=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
try{seen=sessionStorage.getItem('tk-intro');}catch(e){}
if(r||seen){d.classList.add('no-intro');return;}
try{sessionStorage.setItem('tk-intro','1');}catch(e){}
d.classList.add('intro-hold');
var t1=setTimeout(function(){d.classList.remove('intro-hold');},1550),t2=setTimeout(function(){d.classList.add('no-intro');},2450);
function skip(){if(d.classList.contains('intro-skip')||d.classList.contains('no-intro'))return;clearTimeout(t1);clearTimeout(t2);d.classList.add('intro-skip');d.classList.remove('intro-hold');setTimeout(function(){d.classList.add('no-intro');},560);}
['pointerdown','keydown','wheel','touchstart'].forEach(function(e){window.addEventListener(e,skip,{once:true,passive:true});});
})();
