import type { RefObject } from 'react';
import { Alert, Platform, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export async function captureAndShareSummaryCard(
  ref: RefObject<View | null>
): Promise<void> {
  if (Platform.OS === 'web') {
    Alert.alert('Sharing is not available in the web build.');
    return;
  }
  try {
    if (!ref.current) {
      Alert.alert('Share', 'Card is not ready.');
      return;
    }
    const uri = await captureRef(ref, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    });
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert('Share', 'Sharing is not available on this device.');
      return;
    }
    await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Flow' });
  } catch (e) {
    console.warn('shareSummaryCard', e);
    Alert.alert('Share', 'Could not create or share the image.');
  }
}
