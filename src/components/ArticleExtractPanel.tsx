'use client';

import React, { useState, useEffect } from 'react';
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
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

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

  // Extract URL content when panel opens
  useEffect(() => {
    if (isOpen && url) {
      extractURL();
    }
  }, [isOpen, url]);

  const extractURL = async () => {
    setIsLoadingExtract(true);
    try {
      const response = await fetch(
        `https://app.qwksearch.com/api/extract?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) {
        throw new Error('Failed to extract URL');
      }
      const data = await response.json();
      setExtractedArticle(data);
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
        setAiResponse(data.content || '');
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'user',
            content: userPrompt,
            time: new Date().toISOString(),
          },
          {
            role: 'assistant',
            content: data.content || '',
            time: new Date().toISOString(),
          },
        ]);
      } else {
        setFollowupQuestions(data.extract || []);
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
                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white dark:bg-dark-secondary shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-light-100 dark:bg-dark-100 px-4 py-3 border-b border-light-200 dark:border-dark-200">
                      <h2 className="text-lg font-semibold dark:text-white">
                        Article Extract
                      </h2>
                      <button
                        onClick={onClose}
                        className="rounded-md p-1 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
                      >
                        <X className="h-5 w-5 dark:text-white" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                      {isLoadingExtract ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        <PanelGroup direction="vertical">
                          {/* AI Interaction Panel */}
                          <Panel defaultSize={40} minSize={20}>
                            <div className="h-full overflow-y-auto p-4 space-y-4">
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
                              className="bg-[#FAFAF7] dark:bg-dark-100 rounded-lg shadow-md p-4"
                              dangerouslySetInnerHTML={{ __html: aiResponse }}
                            />
                          )}

                              {aiError && (
                                <div className="bg-red-500 text-white p-2 rounded-md text-sm">
                                  {aiError}
                                </div>
                              )}
                            </div>
                          </Panel>

                          {/* Resize Handle */}
                          <PanelResizeHandle className="h-2 bg-light-200 dark:bg-dark-200 hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors cursor-row-resize flex items-center justify-center">
                            <div className="w-12 h-1 rounded-full bg-gray-400 dark:bg-gray-600" />
                          </PanelResizeHandle>

                          {/* Article Content Panel */}
                          <Panel defaultSize={60} minSize={30}>
                            <div className="h-full overflow-y-auto p-4">
                              {/* Extracted Article */}
                              {extractedArticle && (
                            <div className="mt-4 border-t border-light-200 dark:border-dark-200 pt-4">
                              {/* Title and Favorite Button */}
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold dark:text-white flex-1">
                                  {extractedArticle.title || 'Extracted Content'}
                                </h3>
                                <button
                                  onClick={toggleFavorite}
                                  disabled={isLoadingFavorite}
                                  className="ml-2 p-1 hover:bg-light-200 dark:hover:bg-dark-200 rounded transition-colors disabled:opacity-50"
                                  title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                  <Star
                                    className={`h-5 w-5 ${
                                      isFavorited
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-400'
                                    }`}
                                  />
                                </button>
                              </div>

                              {/* Citation Information */}
                              {extractedArticle.cite && (
                                <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                  <p className="italic">{extractedArticle.cite}</p>
                                </div>
                              )}

                              {/* Metadata */}
                              <div className="mb-3 text-xs text-gray-500 dark:text-gray-500 space-y-1">
                                {extractedArticle.author && (
                                  <p>
                                    <span className="font-semibold">Author:</span>{' '}
                                    {extractedArticle.author}
                                  </p>
                                )}
                                {extractedArticle.date && (
                                  <p>
                                    <span className="font-semibold">Date:</span>{' '}
                                    {extractedArticle.date}
                                  </p>
                                )}
                                {extractedArticle.source && (
                                  <p>
                                    <span className="font-semibold">Source:</span>{' '}
                                    {extractedArticle.source}
                                  </p>
                                )}
                                {extractedArticle.word_count && (
                                  <p>
                                    <span className="font-semibold">Word Count:</span>{' '}
                                    {extractedArticle.word_count.toLocaleString()}
                                  </p>
                                )}
                              </div>

                                {/* Article HTML Content */}
                                <div
                                  className="prose dark:prose-invert max-w-none text-sm"
                                  dangerouslySetInnerHTML={{
                                    __html: extractedArticle.html || '',
                                  }}
                                />
                              </div>
                              )}
                            </div>
                          </Panel>
                        </PanelGroup>
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
