import { Platform } from 'react-native';
import NativeModal from '@/components/home/QuickRecordSmoothModal.native';
import WebModal from '@/components/home/QuickRecordSmoothModal.web';

export default Platform.OS === 'web' ? WebModal : NativeModal;
