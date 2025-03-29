import React, { useState, useCallback } from 'react';
import { X, Tag, Star, Lock, Clock, Download, ChevronDown, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadNote } from '../utils/downloadUtils';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { useNotes } from '../context/NoteContext';

interface NoteViewerProps {
  note: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    isFavorite: boolean;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
    isShared?: boolean;
    color?: string;
  };
  onClose: () => void;
}

export function NoteViewer({ note, onClose }: NoteViewerProps) {
  const [showFormatOptions, setShowFormatOptions] = useState(false);
  
  const handleCloseFormatOptions = useCallback(() => {
    setShowFormatOptions(false);
  }, []);

  const formatOptionsRef = useOutsideClick({
    onOutsideClick: handleCloseFormatOptions,
    isOpen: showFormatOptions
  });

  const handleDownload = async (format: 'txt' | 'pdf') => {
    await downloadNote(note, { format });
    setShowFormatOptions(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex ${
            note.color ? `bg-note-${note.color}-light dark:bg-note-${note.color}-dark` : 'bg-white dark:bg-gray-800'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {/* Main Content */}
          <div className="flex-1 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className={`p-6 border-b ${
              note.color ? `border-note-${note.color}-dark/20 dark:border-note-${note.color}-light/20` : 'border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold mb-2 break-words overflow-hidden text-gray-900 dark:text-white">
                    {note.title || 'Untitled Note'}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>Created {new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    {note.isPrivate && (
                      <div className="flex items-center gap-1 text-purple-500 dark:text-purple-400">
                        <Lock className="w-4 h-4 flex-shrink-0" />
                        <span>Private</span>
                      </div>
                    )}
                    {note.isFavorite && (
                      <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                        <Star className="w-4 h-4 flex-shrink-0" />
                        <span>Favorite</span>
                      </div>
                    )}
                    {note.isShared && (
                      <div className="flex items-center gap-1 text-blue-500 dark:text-blue-400">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>Shared</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative" ref={formatOptionsRef}>
                    <button
                      onClick={() => setShowFormatOptions(!showFormatOptions)}
                      className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {showFormatOptions && (
                      <div 
                        className={`absolute right-0 mt-2 w-32 rounded-lg shadow-lg overflow-hidden z-50 ${
                          note.color ? `bg-note-${note.color}-light dark:bg-note-${note.color}-dark` : 'bg-white dark:bg-gray-700'
                        }`}
                      >
                        <button
                          onClick={() => handleDownload('txt')}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                            note.color ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          Download TXT
                        </button>
                        <button
                          onClick={() => handleDownload('pdf')}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                            note.color ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          Download PDF
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className={`prose dark:prose-invert max-w-none ${
                  note.color ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                }`}>
                  {note.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 