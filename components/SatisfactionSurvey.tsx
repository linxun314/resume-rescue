// components/SatisfactionSurvey.tsx — 高端视觉重构
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { showToast } from '@/lib/useToast';

interface SatisfactionSurveyProps {
  onSubmit: (rating: number, tags: string[]) => void;
  onDismiss: () => void;
}

const DISSATISFIED_TAGS = ['内容不符', '表达不佳', '太短/太长', '格式问题', '其他'];

export default function SatisfactionSurvey({ onSubmit, onDismiss }: SatisfactionSurveyProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      showToast('请先选择评分', 'info');
      return;
    }
    onSubmit(rating, selectedTags);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 ring-1 ring-emerald-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-surface-700 font-medium text-sm">感谢你的反馈！</p>
        <p className="text-surface-400 text-xs">你的意见将帮助我们变得更好</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="card relative"
    >
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 text-surface-400 hover:text-surface-600 transition-colors duration-200 min-h-touch min-w-touch flex items-center justify-center"
        aria-label="关闭评分"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h3 className="font-bold text-surface-900 text-sm mb-1">这次体验如何？</h3>
      <p className="text-xs text-surface-400 mb-5">你的反馈将帮助我们改进</p>

      {/* Star rating */}
      <div className="flex justify-center gap-1.5 mb-5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setRating(star)}
            className="transition-all duration-300 ease-premium hover:scale-110 min-h-touch min-w-touch flex items-center justify-center"
            aria-label={`评分 ${star} 星`}
          >
            <svg
              className={`w-7 h-7 transition-colors duration-300 ${
                star <= (hoveredStar || rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-surface-200'
              }`}
              fill={star <= (hoveredStar || rating) ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={1}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </button>
        ))}
      </div>

      {rating > 0 && rating <= 3 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-5"
        >
          <p className="text-xs text-surface-500 mb-2.5">哪里可以改进？</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {DISSATISFIED_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedTags.includes(tag)
                    ? 'bg-surface-900 text-white'
                    : 'bg-surface-50 text-surface-500 ring-1 ring-surface-200 hover:ring-surface-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {rating > 3 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-emerald-600 text-center mb-5"
        >
          {rating === 5 ? '太好了！很高兴对你有帮助' : '谢谢你的认可！'}
        </motion.p>
      )}

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-full font-semibold text-sm bg-surface-900 text-white
          hover:bg-surface-800 transition-all duration-500 ease-premium active:scale-[0.97]"
      >
        提交反馈
      </button>
    </motion.div>
  );
}
