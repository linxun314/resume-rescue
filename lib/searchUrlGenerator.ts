// lib/searchUrlGenerator.ts - 招聘平台搜索链接生成

export type SearchPlatform = 'boss' | 'shixiseng';

interface PlatformConfig {
  name: string;
  urlTemplate: string;
}

const PLATFORM_CONFIGS: Record<SearchPlatform, PlatformConfig> = {
  boss: {
    name: 'Boss直聘',
    urlTemplate: 'https://www.zhipin.com/web/geek/job?query={keyword}',
  },
  shixiseng: {
    name: '实习僧',
    urlTemplate: 'https://www.shixiseng.com/intern/search?keyword={keyword}',
  },
};

export function generateSearchUrls(
  keywords: string[],
  platforms: SearchPlatform[] = ['boss', 'shixiseng']
): Record<string, string> {
  const primaryKeyword = keywords[0];
  const urls: Record<string, string> = {};

  for (const platform of platforms) {
    const config = PLATFORM_CONFIGS[platform];
    urls[platform] = config.urlTemplate.replace('{keyword}', encodeURIComponent(primaryKeyword));
  }

  return urls;
}

export function getPlatformName(platform: SearchPlatform): string {
  return PLATFORM_CONFIGS[platform].name;
}
