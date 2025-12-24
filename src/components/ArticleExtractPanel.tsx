'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Clipboard,
  Bot,
  MessageCircleQuestion,
  X,
  Star,
} from 'lucide-react';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment } from 'react';

interface Article {
  html?: string;
  cite?: string;
  title?: string;
  url?: string;
  author?: string;
  author_cite?: string;
  author_short?: string;
  author_type?: string;
  date?: string;
  source?: string;
  word_count?: number;
  followUpQuestions?: string[];
  qaHistory?: Array<{ question: string; answer: string }>;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface ArticleExtractPanelProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  searchText?: string;
}

const ArticleExtractPanel: React.FC<ArticleExtractPanelProps> = ({
  isOpen,
  onClose,
  url,
  searchText = '',
}) => {
  const defaultSummarizePrompt = 'Summarize in bullet points and bold topics';
  const MAX_ARTICLE_LENGTH = 1500;
  const MAX_FOLLOWUP_QUESTIONS = 4;

  const [extractedArticle, setExtractedArticle] = useState<Article | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [userPrompt, setUserPrompt] = useState(defaultSummarizePrompt);
  const [isLoadingExtract, setIsLoadingExtract] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isLoadingFollowups, setIsLoadingFollowups] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiError, setAiError] = useState('');
  const [followupQuestions, setFollowupQuestions] = useState<string[]>([]);
  const [followupError, setFollowupError] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [panelWidth, setPanelWidth] = useState(600);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Track window width for desktop/mobile layout
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth > 800);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Handle horizontal resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      setPanelWidth(Math.max(400, Math.min(newWidth, window.innerWidth - 100)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Extract URL content when panel opens
  useEffect(() => {
    if (isOpen && url) {
      extractURL();
    }
  }, [isOpen, url]);

  const extractURL = async () => {
    setIsLoadingExtract(true);
    try {
      // Use cache API instead of external API
      const response = await fetch(
        `/api/article?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) {
        throw new Error('Failed to extract URL');
      }
      const data = await response.json();
      setExtractedArticle(data.article);

      // Load cached follow-up questions if available
      if (data.article.followUpQuestions && data.article.followUpQuestions.length > 0) {
        setFollowupQuestions(data.article.followUpQuestions);
      }

      // Check if this article is already favorited
      checkIfFavorited(url);
    } catch (error) {
      console.error('Error extracting URL:', error);
      setAiError('Failed to extract URL content');
    } finally {
      setIsLoadingExtract(false);
    }
  };

  const checkIfFavorited = async (articleUrl: string) => {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        const isFav = data.favorites?.some(
          (fav: any) => fav.url === articleUrl
        );
        setIsFavorited(isFav);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!extractedArticle) return;

    setIsLoadingFavorite(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(
          `/api/favorites?url=${encodeURIComponent(extractedArticle.url || url)}`,
          {
            method: 'DELETE',
          }
        );
        if (response.ok) {
          setIsFavorited(false);
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: extractedArticle.url || url,
            title: extractedArticle.title,
            cite: extractedArticle.cite,
            author: extractedArticle.author,
            author_cite: extractedArticle.author_cite,
            date: extractedArticle.date,
            source: extractedArticle.source,
            word_count: extractedArticle.word_count,
            html: extractedArticle.html,
          }),
        });
        if (response.ok) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const callLanguageAPI = async (agent: 'question' | 'suggest-followups') => {
    if (!extractedArticle) return;

    const article = extractedArticle.html
      ?.replace(/<[^>]*>?/g, '')
      .slice(0, MAX_ARTICLE_LENGTH);

    const isQuestion = agent === 'question';
    const setLoading = isQuestion ? setIsLoadingAI : setIsLoadingFollowups;
    const setError = isQuestion ? setAiError : setFollowupError;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://app.qwksearch.com/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent,
          query: searchText + '\n' + userPrompt,
          chat_history: chatHistory
            .slice(-5)
            .map((c) => `${c.role}: ${c.content}`)
            .join('\n'),
          article,
          MAX_FOLLOWUP_QUESTIONS,
          provider: 'groq',
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      if (isQuestion) {
        const aiAnswer = data.content || '';
        setAiResponse(aiAnswer);
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'user',
            content: userPrompt,
            time: new Date().toISOString(),
          },
          {
            role: 'assistant',
            content: aiAnswer,
            time: new Date().toISOString(),
          },
        ]);

        // Store Q&A pair in cache
        try {
          await fetch('/api/article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url,
              question: userPrompt,
              answer: aiAnswer,
            }),
          });
        } catch (error) {
          console.error('Error storing Q&A in cache:', error);
        }
      } else {
        const questions = data.extract || [];
        setFollowupQuestions(questions);

        // Store follow-up questions in cache
        try {
          await fetch('/api/article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url,
              followUpQuestions: questions,
            }),
          });
        } catch (error) {
          console.error('Error storing follow-up questions in cache:', error);
        }
      }
    } catch (error) {
      console.error('Error calling language API:', error);
      setError('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setUserPrompt(question);
    callLanguageAPI('question');
  };

  const handleCopyHTMLToClipboard = async () => {
    if (!extractedArticle) return;

    const textToCopy = `${aiResponse}\n\n\n${extractedArticle.cite || ''}\n\n\n${extractedArticle.html}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setShowCopiedMessage(true);
      setTimeout(() => {
        setShowCopiedMessage(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const highlightCodeSyntax = (element: HTMLDivElement | null) => {
    if (!element) return;
    // This would integrate with highlight.js if needed
    // For now, just a placeholder
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel
                  className="pointer-events-auto relative"
                  style={{ width: `${panelWidth}px` }}
                >
                  {/* Horizontal Resize Handle */}
                  <div
                    ref={resizeRef}
                    onMouseDown={() => setIsResizing(true)}
                    className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500 bg-transparent transition-colors z-50"
                    style={{ touchAction: 'none' }}
                  >
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-gray-400 dark:bg-gray-600 opacity-50 hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex h-full flex-col bg-white dark:bg-dark-secondary shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-light-100 dark:bg-dark-100 px-4 py-3 border-b border-light-200 dark:border-dark-200">
                      <button
                        onClick={onClose}
                        className="rounded-md p-1 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
                      >
                        <X className="h-5 w-5 dark:text-white" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      {isLoadingExtract ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        <div className="p-4 space-y-6">
                          {/* AI Interaction Section */}
                          <div className="space-y-4">
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => callLanguageAPI('question')}
                                disabled={isLoadingAI}
                                className="px-4 py-2 text-sm font-semibold flex items-center rounded-md bg-white text-blue-500 hover:bg-blue-100 disabled:opacity-50 transition-all duration-300 border border-blue-200 shadow-sm"
                              >
                                <Bot className="mr-2 h-4 w-4" />
                                {isLoadingAI ? '...' : 'Ask'}
                              </button>

                              <button
                                onClick={() => callLanguageAPI('suggest-followups')}
                                disabled={isLoadingFollowups}
                                className="px-4 py-2 text-sm font-semibold flex items-center rounded-md bg-white text-blue-500 hover:bg-blue-100 disabled:opacity-50 transition-all duration-300 border border-blue-200 shadow-sm"
                              >
                                <MessageCircleQuestion className="mr-2 h-4 w-4" />
                                Suggest ?
                              </button>

                              <button
                                onClick={handleCopyHTMLToClipboard}
                                className="px-4 py-2 text-sm font-semibold flex items-center rounded-md bg-white text-blue-500 hover:bg-blue-100 transition-all duration-300 border border-blue-200 shadow-sm"
                              >
                                <Clipboard className="mr-2 h-4 w-4" />
                              </button>


                              <button
                                onClick={toggleFavorite}
                                disabled={isLoadingFavorite}
                                className="ml-2 p-1 hover:bg-light-200 dark:hover:bg-dark-200 rounded transition-colors disabled:opacity-50"
                                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                              >
                                <Star
                                  className={`h-5 w-5 ${isFavorited
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-400'
                                    }`}
                                />
                              </button>
                            </div>

                            {showCopiedMessage && (
                              <div className="bg-blue-500 text-white text-sm font-medium px-3 py-2 rounded-md shadow-lg">
                                Copied!
                              </div>
                            )}

                            {/* Input */}
                            <div className="relative">
                              <input
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                onKeyDown={(e) =>
                                  e.key === 'Enter' && callLanguageAPI('question')
                                }
                                type="text"
                                placeholder="Ask AI any question..."
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-dark-200 dark:bg-dark-100 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            {/* Follow-up Questions */}
                            {followupQuestions.length > 0 && (
                              <div className="space-y-2">
                                <div
                                  onClick={() =>
                                    handleQuestionClick(defaultSummarizePrompt)
                                  }
                                  className="cursor-pointer rounded-md p-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-gray-800 border border-slate-300 dark:border-dark-200 transition-colors"
                                >
                                  {defaultSummarizePrompt}
                                </div>
                                {followupQuestions.map((question, i) => (
                                  <div
                                    key={i}
                                    onClick={() => handleQuestionClick(question)}
                                    className="cursor-pointer rounded-md p-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-gray-800 border border-slate-300 dark:border-dark-200 transition-colors"
                                    dangerouslySetInnerHTML={{ __html: question }}
                                  />
                                ))}
                              </div>
                            )}

                            {isLoadingFollowups && (
                              <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                              </div>
                            )}

                            {followupError && (
                              <div className="bg-red-500 text-white p-2 rounded-md text-sm">
                                {followupError}
                              </div>
                            )}

                            {/* AI Response */}
                            {isLoadingAI && (
                              <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                              </div>
                            )}

                            {aiResponse && (
                              <div
                                ref={highlightCodeSyntax}
                                className="bg-muted rounded-lg shadow-md p-4"
                                dangerouslySetInnerHTML={{ __html: aiResponse }}
                              />
                            )}

                            {aiError && (
                              <div className="bg-red-500 text-white p-2 rounded-md text-sm">
                                {aiError}
                              </div>
                            )}
                          </div>

                          {/* Article Content Section */}
                          <div className="border-t border-light-200 dark:border-dark-200 pt-6">
                            {/* Extracted Article */}
                            {extractedArticle && (
                              <div>
                                {/* Title and Favorite Button */}
                                <div className="flex items-start justify-between mb-2">

                                </div>
                                {/* Citation Information */}
                                {extractedArticle.cite && (
                                  <div
                                    className="mb-3 text-sm text-gray-600 dark:text-gray-400"
                                    dangerouslySetInnerHTML={{ __html: extractedArticle.cite }}
                                  />
                                )}

                                {/* Metadata */}
                                <div className="mb-3 text-xs text-gray-500 dark:text-gray-500 space-y-1">

                                  {extractedArticle.word_count && (
                                    <p>
                                      <span className="font-semibold">Words:</span>{' '}
                                      {extractedArticle.word_count.toLocaleString()}
                                    </p>
                                  )}
                                </div>

                                {/* Article HTML Content */}
                                <div
                                  id="article-content"
                                  className="prose dark:prose-invert max-w-none text-md dark:text-white leading-relaxed"
                                  dangerouslySetInnerHTML={{
                                    __html: extractedArticle.html || '',
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ArticleExtractPanel;
