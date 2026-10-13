import React from 'react';
import { X, Clock, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { GuideArticle } from '../../types/website';

interface ContentArticleModalProps {
  article: GuideArticle | null;
  onClose: () => void;
}

export const ContentArticleModal: React.FC<ContentArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#161618] border border-white/[0.12] rounded-[32px] w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative text-[#F5F5F7] space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4 shrink-0 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#0A84FF] font-semibold mb-1">
              <BookOpen className="w-4 h-4" />
              <span>MotoPilot Rehber & İçerik Merkezi</span>
              <span>·</span>
              <span className="text-[#8E8E93]">{article.readingTimeMinutes} dk okuma</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
              {article.title}
            </h3>
            <div className="flex items-center gap-3 text-[11px] text-[#8E8E93] mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {article.publishDate}
              </span>
              <span>·</span>
              <span>Uzman Denetiminden Geçti</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs text-zinc-300 pr-2 leading-relaxed whitespace-pre-line">
          {article.contentMarkdown}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex justify-between items-center shrink-0 text-xs">
          <span className="text-[#8E8E93]">MotoPilot Bilgi Merkezi · Güncellenme: Ekim 2026</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-zinc-200 transition-all"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
