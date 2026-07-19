// components/PlatformSelector.tsx - 招聘平台选择器
'use client';

import { SearchPlatform, getPlatformName } from '@/lib/searchUrlGenerator';

interface PlatformSelectorProps {
  selected: SearchPlatform;
  onChange: (platform: SearchPlatform) => void;
}

const PLATFORMS: SearchPlatform[] = ['boss', 'shixiseng'];

export default function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">搜索平台：</span>
      <div className="flex gap-2">
        {PLATFORMS.map((platform) => (
          <button
            key={platform}
            onClick={() => onChange(platform)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              selected === platform
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {getPlatformName(platform)}
          </button>
        ))}
      </div>
    </div>
  );
}
