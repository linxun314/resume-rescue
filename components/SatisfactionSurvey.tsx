'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { showToast } from '@/lib/useToast';

interface SatisfactionSurveyProps {
  onSubmit: (rating: number, tags: string[]) => void;
  onDismiss: () => void;
}

const DISSATISFIED_TAGS = [
  '内容不符',
  '表达不佳',
  '太短/太长',
  '格式问题',
  '其他',
];

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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center"
      >
        <div className="text-3xl mb-2">🙏</div>
        <p className="text-gray-700 font-medium">感谢你的反馈！</p>
        <p className="text-sm text-gray-500">你的意见将帮助我们变得更好</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative"
    >
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>

      <h3 className="font-bold text-gray-800 mb-1">这次体验如何？</h3>
      <p className="text-sm text-gray-500 mb-4">你的反馈将帮助我们改进</p>

      {/* 星级评分 */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setRating(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoveredStar || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      {rating > 0 && rating <= 3 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <p className="text-sm text-gray-600 mb-2">哪里可以改进？</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {DISSATISFIED_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {rating > 0 && rating > 3 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-green-600 text-center mb-4"
        >
          {rating === 5 ? '太好了！很高兴对你有帮助 ✨' : '谢谢你的认可！'}
        </motion.p>
      )}

      <button
        onClick={handleSubmit}
        className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
      >
        提交反馈
      </button>
    </motion.div>
  );
}
