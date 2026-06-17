import 'server-only'
import fs from 'fs/promises'
import path from 'path'
import { Language } from '@/types/index'

export type Locale = Language;

const defaultLocale: Locale = "ja_JP";

export async function getDictionary(locale: string, namespace: string) {
  // Map short codes to full codes if necessary, or ensure we use the correct directory
  let targetLocale = locale;

  const validLocales = [
    "ja_JP", 
    "en_US", 
    "en_GB", 
    "en_AU", 
    "en_CA", 
    "en_IN", 
    "en_NZ", 
    "zh-CN", 
    "zh-TW", 
    "zh-HK", 
    "ko_KR",
    "es_ES",
    "fr_FR",
    "de_DE",
    "it_IT",
    "pt_BR",
    "ru_RU",
    "ar_SA",
    "ar_EG"
  ];
  if (!validLocales.includes(targetLocale)) {
    targetLocale = defaultLocale;
  }

  const filePath = path.join(process.cwd(), 'public', 'locales', targetLocale, `${namespace}.json`);
  
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error loading dictionary for ${targetLocale}/${namespace}:`, error);
    console.error(`Attempted file path: ${filePath}`);
    console.error(`CWD: ${process.cwd()}`);
    // Fallback to default locale
    if (targetLocale !== defaultLocale) {
      console.log(`Falling back to default locale ${defaultLocale} for ${namespace}`);
      return getDictionary(defaultLocale, namespace);
    }
    return {};
  }
}
