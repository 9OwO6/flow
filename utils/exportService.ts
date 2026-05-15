import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { StorageService } from './storage';
import { PoopRecord } from '@/types';
import { WaterRecord } from '@/types/water';
import { SmoothLevel } from '@/types';

type LegacyFileSystem = typeof FileSystem & {
  documentDirectory?: string | null;
  EncodingType?: {
    UTF8: string;
  };
};
type WriteStringOptions = NonNullable<Parameters<typeof FileSystem.writeAsStringAsync>[2]>;

export class ExportService {
  // 导出为CSV格式
  static async exportToCSV(): Promise<string> {
    try {
      const records = await StorageService.getAllRecords();
      const waterRecords = await StorageService.getAllWaterRecords();
      
      // CSV头部
      let csv = 'Date,Time,Smooth Level,Diet Tags,Exercise Level,Water Intake (ml),Notes\n';
      
      // 合并记录和饮水记录
      const allDates = new Set<string>();
      records.forEach(r => allDates.add(r.date));
      waterRecords.forEach(r => allDates.add(r.date));
      
      const sortedDates = Array.from(allDates).sort().reverse();
      
      sortedDates.forEach(date => {
        const dayRecords = records.filter(r => r.date === date);
        const dayWater = waterRecords.filter(r => r.date === date);
        const totalWater = dayWater.reduce((sum, r) => sum + r.amount, 0);
        
        if (dayRecords.length > 0) {
          dayRecords.forEach(record => {
            const smoothLevelMap: Record<SmoothLevel, string> = {
              [SmoothLevel.VERY_DIFFICULT]: 'Very Difficult',
              [SmoothLevel.DIFFICULT]: 'Difficult',
              [SmoothLevel.NORMAL]: 'Normal',
              [SmoothLevel.SMOOTH]: 'Smooth',
              [SmoothLevel.VERY_SMOOTH]: 'Very Smooth',
            };
            
            const dietTags = record.dietTags?.join('; ') || '';
            const exerciseLevel = record.exerciseLevel !== undefined 
              ? ['None', 'Light', 'Moderate', 'Intense'][record.exerciseLevel] 
              : '';
            
            csv += `"${record.date}","${record.time}","${smoothLevelMap[record.smoothLevel]}","${dietTags}","${exerciseLevel}","${totalWater}","${record.notes || ''}"\n`;
          });
        } else if (totalWater > 0) {
          // 只有饮水记录，没有排便记录
          csv += `"${date}","","","","","${totalWater}",""\n`;
        }
      });
      
      return csv;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }

  // 导出为JSON格式
  static async exportToJSON(): Promise<string> {
    try {
      const records = await StorageService.getAllRecords();
      const waterRecords = await StorageService.getAllWaterRecords();
      const settings = await StorageService.getUserSettings();
      
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        settings,
        records,
        waterRecords,
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw error;
    }
  }

  // 保存文件并分享
  static async saveAndShare(content: string, filename: string, mimeType: string = 'text/plain'): Promise<void> {
    try {
      const legacyFileSystem = FileSystem as LegacyFileSystem;
      const documentDirectory = legacyFileSystem.documentDirectory;
      if (!documentDirectory) {
        throw new Error('Document directory is not available');
      }
      const fileUri = documentDirectory + filename;
      const encoding = (legacyFileSystem.EncodingType?.UTF8 ?? 'utf8') as WriteStringOptions['encoding'];
      
      // 写入文件
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding,
      });
      
      // 检查是否可以分享
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType,
          dialogTitle: 'Export Data',
        });
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error saving and sharing file:', error);
      throw error;
    }
  }

  // 导出CSV并分享
  static async exportCSVAndShare(): Promise<void> {
    try {
      const csv = await this.exportToCSV();
      const filename = `lalemo_export_${new Date().toISOString().split('T')[0]}.csv`;
      await this.saveAndShare(csv, filename, 'text/csv');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw error;
    }
  }

  // 导出JSON并分享
  static async exportJSONAndShare(): Promise<void> {
    try {
      const json = await this.exportToJSON();
      const filename = `lalemo_export_${new Date().toISOString().split('T')[0]}.json`;
      await this.saveAndShare(json, filename, 'application/json');
    } catch (error) {
      console.error('Error exporting JSON:', error);
      throw error;
    }
  }
}

