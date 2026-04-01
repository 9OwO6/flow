import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { DelightTokens } from '@/constants/DelightTokens';

const MIN_INTERVAL_MS = DelightTokens.sound.minSuccessIntervalMs;

let sound: Audio.Sound | null = null;
let loadPromise: Promise<void> | null = null;
let lastSuccessPlayTime = 0;

async function ensureLoaded(): Promise<Audio.Sound | null> {
  if (sound) return sound;
  if (loadPromise) {
    await loadPromise;
    return sound;
  }
  loadPromise = (async () => {
    try {
      const { sound: created } = await Audio.Sound.createAsync(
        require('../../assets/sounds/success.wav'),
        {
          shouldPlay: false,
          volume: DelightTokens.sound.defaultVolume,
        }
      );
      sound = created;
    } catch {
      sound = null;
    } finally {
      loadPromise = null;
    }
  })();
  await loadPromise;
  return sound;
}

export async function configureDelightAudioMode(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
      });
      return;
    }
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
      allowsRecordingIOS: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch {
    /* non-blocking (Web may partially support audio mode APIs) */
  }
}

export type CustomSuccessPayload = { uris: string[]; random: boolean };

function pickCustomUri(payload: CustomSuccessPayload): string | null {
  const { uris, random } = payload;
  if (uris.length === 0) return null;
  if (random) return uris[Math.floor(Math.random() * uris.length)]!;
  return uris[0]!;
}

async function playUriOnce(uri: string): Promise<void> {
  await configureDelightAudioMode();
  const { sound: instance } = await Audio.Sound.createAsync(
    { uri },
    { shouldPlay: false, volume: DelightTokens.sound.defaultVolume }
  );
  try {
    instance.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (status.didJustFinish) {
        void instance.unloadAsync();
      }
    });
    await instance.playAsync();
  } catch {
    try {
      await instance.unloadAsync();
    } catch {
      /* ignore */
    }
  }
}

/** Throttled success — bundled wav, or custom URIs when provided */
export async function playSuccessThrottled(custom?: CustomSuccessPayload | null): Promise<void> {
  const now = Date.now();
  if (now - lastSuccessPlayTime < MIN_INTERVAL_MS) return;

  if (custom && custom.uris.length > 0) {
    const uri = pickCustomUri(custom);
    if (!uri) return;
    lastSuccessPlayTime = now;
    await playUriOnce(uri);
    return;
  }

  const s = await ensureLoaded();
  if (!s) return;
  lastSuccessPlayTime = now;
  try {
    await s.stopAsync();
    await s.setPositionAsync(0);
    await s.playAsync();
  } catch {
    /* non-blocking */
  }
}

/** Settings “Test sound” — ignores throttle; supports custom URIs */
export async function playSuccessTestSample(custom?: CustomSuccessPayload | null): Promise<void> {
  if (custom && custom.uris.length > 0) {
    const uri = pickCustomUri(custom);
    if (uri) {
      await playUriOnce(uri);
      return;
    }
  }
  const s = await ensureLoaded();
  if (!s) return;
  try {
    await s.stopAsync();
    await s.setPositionAsync(0);
    await s.playAsync();
  } catch {
    /* non-blocking */
  }
}

export async function unloadDelightSounds(): Promise<void> {
  if (!sound) return;
  try {
    await sound.stopAsync();
    await sound.unloadAsync();
  } catch {
    /* non-blocking */
  } finally {
    sound = null;
  }
}

/** Preview a saved clip from settings (no throttle) */
export async function previewCustomSuccessClip(uri: string): Promise<void> {
  await configureDelightAudioMode();
  await playUriOnce(uri);
}
