'use client';
import {cloneElement,createContext,isValidElement,useContext,useEffect,useMemo,useState,type ReactNode,type ReactElement} from 'react';
import {AmbientAudioControl} from './AmbientAudio';
import {translate} from '@/lib/localization.mjs';
export type Language='fr'|'en';
export type Theme='light'|'dark';
/** Translate the React render tree, never the DOM. Keys, refs and event handlers stay intact.
 * Stable option values remain French so existing validation and form state are unchanged. */
function localizeNode(node:ReactNode,language:Language):ReactNode{
 if(typeof node==='string')return translate(node,language);
 if(Array.isArray(node))return node.map(item=>localizeNode(item,language));
 if(!isValidElement(node))return node;
 const element=node as ReactElement<Record<string,unknown>>;
 const props=element.props,updates:Record<string,unknown>={};
 for(const name of ['aria-label','title','alt','placeholder','text'])if(typeof props[name]==='string')updates[name]=translate(props[name] as string,language);
 if(Array.isArray(props.lines))updates.lines=(props.lines as ReactNode[]).map(line=>localizeNode(line,language));
 if(element.type==='option'&&props.value===undefined&&typeof props.children==='string')updates.value=props.children;
 if(props.children!==undefined&&element.type!=='pre'&&element.type!=='textarea'&&element.type!=='style')updates.children=localizeNode(props.children as ReactNode,language);
 return cloneElement(element,updates);
}
type PreferencesValue={language:Language;theme:Theme;setLanguage:(value:Language)=>void;setTheme:(value:Theme)=>void;t:(text:string)=>string;localize:(node:ReactNode)=>ReactNode};
const PreferencesContext=createContext<PreferencesValue>({language:'fr',theme:'light',setLanguage:()=>{},setTheme:()=>{},t:text=>text,localize:node=>node});
export function PreferencesProvider({children}:{children:ReactNode}){
 // Same first render on the server and client; read browser preferences only after hydration.
 const [language,setLanguage]=useState<Language>('fr'),[theme,setTheme]=useState<Theme>('light'),[ready,setReady]=useState(false);
 useEffect(()=>{try{const l=localStorage.getItem('joackim-language'),th=localStorage.getItem('joackim-theme');if(l==='fr'||l==='en')setLanguage(l);if(th==='light'||th==='dark')setTheme(th);}catch{}setReady(true);},[]);
 useEffect(()=>{document.documentElement.lang=language;document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;document.title=language==='en'?'Joackim DATE — Developer & Designer':'Joackim DATE — Développeur & Designer';const description=document.querySelector('meta[name="description"]');description?.setAttribute('content',language==='en'?'Two perspectives, one standard. The portfolio of Joackim DATE, full-stack developer and graphic designer in Lomé.':'Deux regards, une même exigence. Le portfolio de Joackim DATE, développeur Full-Stack et graphiste à Lomé.');if(ready)try{localStorage.setItem('joackim-language',language);localStorage.setItem('joackim-theme',theme);}catch{}},[language,theme,ready]);
 const value=useMemo(()=>({language,theme,setLanguage,setTheme,t:(text:string)=>translate(text,language),localize:(node:ReactNode)=>localizeNode(node,language)}),[language,theme]);
 return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
export function usePreferences(){return useContext(PreferencesContext);}
export function PreferenceControls({compact=false,tabIndex=0}:{compact?:boolean;tabIndex?:number}){
 const {language,theme,setLanguage,setTheme,t}=usePreferences();
 return <div className={`preference-controls ${compact?'compact':''}`} aria-label={t('Apparence et langue')}>
  <AmbientAudioControl language={language} tabIndex={tabIndex}/>
  <div className="theme-options" role="group" aria-label={t('Choisir l’apparence')}>
   <button type="button" tabIndex={tabIndex} aria-label={t(theme==='light'?'Mode sombre':'Mode clair')} title={t(theme==='light'?'Mode sombre':'Mode clair')} aria-pressed={theme==='dark'} onClick={()=>setTheme(theme==='light'?'dark':'light')}><span aria-hidden="true">{theme==='light'?'☾':'☀'}</span></button>
  </div>
  {compact?<button className="language-toggle" type="button" tabIndex={tabIndex} lang={language} aria-label={t(language==='fr'?'Anglais':'Français')} title={t(language==='fr'?'Anglais':'Français')} onClick={()=>setLanguage(language==='fr'?'en':'fr')}>{language.toUpperCase()}</button>:<div className="language-options" role="group" aria-label={t('Choisir la langue')}><button type="button" lang="fr" aria-label="Français" aria-pressed={language==='fr'} onClick={()=>setLanguage('fr')}>FR</button><button type="button" lang="en" aria-label="English" aria-pressed={language==='en'} onClick={()=>setLanguage('en')}>EN</button></div>}
 </div>;
}
