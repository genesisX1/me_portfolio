import {AmbientAudioProvider} from '../src/components/AmbientAudio';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {PreferencesProvider} from '../src/components/Preferences';
import Portfolio from '../src/components/Portfolio';
createRoot(document.getElementById('root')!).render(<AmbientAudioProvider><PreferencesProvider><Portfolio/></PreferencesProvider></AmbientAudioProvider>);
