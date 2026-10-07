'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {useInView} from 'framer-motion';

const tools=[
 {name:'Photoshop',label:'Ps',className:'tool-ps',start:'8%',delay:'0s'},
 {name:'Illustrator',label:'Ai',className:'tool-ai',start:'34%',delay:'.08s'},
 {name:'InDesign',label:'Id',className:'tool-id',start:'61%',delay:'.16s'},
 {name:'Figma',label:'',className:'tool-figma',start:'86%',delay:'.24s'},
];

/** Decorative only: never intercept the portrait's precise silhouette hit test. */
export default function PortraitEffects({design}:{design:boolean}){
 const ref=useRef<HTMLSpanElement>(null);
 const inView=useInView(ref,{amount:.1});
 const [visible,setVisible]=useState(true);
 useEffect(()=>{const update=()=>setVisible(!document.hidden);update();document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update);},[]);
 return <span ref={ref} aria-hidden="true" className={`portrait-effects ${design?'effects-design':''} ${inView&&visible?'effects-running':''}`}>
  <span className="portrait-orbit">
   {tools.map(tool=><span key={tool.name} className="tool-path" style={{'--orbit-start':tool.start,'--tool-delay':tool.delay} as CSSProperties}>
    <span className={`portrait-tool ${tool.className}`} title={tool.name}>
     {tool.label||<svg viewBox="0 0 38 57" fill="none"><path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0" fill="#1ABCFE"/><path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0" fill="#0ACF83"/><path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19" fill="#FF7262"/><path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5" fill="#F24E1E"/><path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5" fill="#A259FF"/></svg>}
    </span>
   </span>)}
  </span>
 </span>;
}
