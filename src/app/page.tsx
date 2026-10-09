import { AmbientAudioProvider } from '@/components/AmbientAudio';
import { PreferencesProvider } from '@/components/Preferences';
import Portfolio from '@/components/Portfolio';
export default function Page() {
  return (
    <AmbientAudioProvider>
      <PreferencesProvider>
        <Portfolio />
      </PreferencesProvider>
    </AmbientAudioProvider>
  );
}
