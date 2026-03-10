export interface Episode {
  id: string;
  number: number;
  season: number;
  title: string;
  duration: string;
  telegramCode: string;
  downloadCode?: string;
  downloadLink?: string;
  fileSize?: string;
  audioLanguage?: string;
  subtitles?: string;
  quality?: string;
  thumbnail?: string;            // 16:9 ratio recommended (1280x720)
  isComingSoon?: boolean;
  releaseDate?: string;
  isUpcoming?: boolean;
  watchAdCount?: number;   // এই episode এ কতটা ad — -1 বা undefined = global default
}

// Season level lock support
export interface SeasonInfo {
  season: number;
  isLocked?: boolean;
  isComingSoon?: boolean;
  releaseDate?: string;
  title?: string;
}

export interface Movie {
  id: string;
  title: string;
  thumbnail: string;             // 2:3 portrait poster (e.g. 400x600)
  category: string;
  telegramCode: string;
  downloadCode?: string;
  downloadLink?: string;
  rating: number;
  views: string;
  year?: string;
  quality?: string;
  description?: string;
  episodes?: Episode[];
  seasons?: SeasonInfo[];        // Season level lock info
  isPremium?: boolean;
  createdAt?: any;
  fileSize?: string;
  duration?: string;
  audioLanguage?: string;
  subtitles?: string;
  videoQuality?: string;
  detailBanner?: string;         // 16:9 landscape (1920x1080 or 1280x720)
  screenshots?: string[];        // 16:9 screenshots (1280x720)
  isUpcoming?: boolean;
  releaseDate?: string;
  isFeatured?: boolean;
  featuredOrder?: number;
  isTop10?: boolean;
  top10Position?: number;
  storyImage?: string;
  storyEnabled?: boolean;
  priority?: number;
  isExclusive?: boolean;
  // ✅ Ad Settings per movie
  watchAdCount?: number;      // Watch করতে কতটা ad দেখতে হবে (0 = free)
  downloadAdCount?: number;   // Download করতে কতটা ad দেখতে হবে (0 = free)
}

export interface StoryItem {
  id: string;
  image: string;
  thumbnailUrl?: string;
  movieId?: string;
  link?: string;
  order: number;
  createdAt?: any;
  storyBadge?: string;   // e.g. 'NEW', 'HOT', '#1', '#2', '#3', 'TOP', 'LIVE'
}

export interface BannerItem {
  id: string;
  movieId?: string;
  title: string;
  image: string;                 // 16:9 landscape (1920x1080)
  description?: string;
  link?: string;
  order: number;
  isActive: boolean;
  createdAt?: any;
}

export interface AppSettings {
  botUsername: string;
  channelLink: string;
  noticeChannelLink?: string;
  noticeText?: string;
  noticeEnabled?: boolean;
  autoViewIncrement?: boolean;
  categories?: string[];
  enableTop10?: boolean;
  enableStories?: boolean;
  enableBanners?: boolean;
  primaryColor?: string;
  appName?: string;
  // ✅ Ad Settings
  adEnabled?: boolean;
  adZoneId?: string;
  adScriptUrl?: string;
  // ✅ Adsgram Settings
  adsgramEnabled?: boolean;
  adsgramBlockId?: string;
  defaultWatchAdCount?: number;    // সব movie এর default watch ad count
  defaultDownloadAdCount?: number; // সব movie এর default download ad count
  tutorialChannelLink?: string;    // "বুঝলাম না" button এর Telegram channel link
}

export type Category = 'All' | 'Exclusive' | 'Movies' | 'Web Series' | 'K-Drama' | 'Anime' | string;
