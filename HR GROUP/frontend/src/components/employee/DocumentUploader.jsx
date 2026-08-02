import React, { useState } from 'react';
import { FiUploadCloud, FiFile, FiCheckCircle, FiTrash2 } from 'react-icons/fi';

/**
 * Reusable Document Uploader component supporting drag-and-drop file input,
 * document category selection, and upload progress animation.
 */
export default function DocumentUploader({
  documents = [],
  onAddDocument,
  onRemoveDocument,
}) {
  const [selectedCategory, setSelectedCategory] = useState('Resume');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = ['Resume', 'Aadhaar', 'PAN', 'Education Certificates', 'Experience Certificates', 'Offer Acceptance'];

  const handleSimulatedUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onAddDocument?.({
            id: `doc-${Date.now()}`,
            name: file.name,
            type: selectedCategory,
            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            uploadedAt: new Date().toISOString().split('T')[0],
          });
          return 0;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className="space-y-4">
      {/* Category selector */}
      <div>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
          Document Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-3 py-2 w-full focus:outline-none focus:border-primary"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Drag and Drop Zone */}
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 relative">
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleSimulatedUpload}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          disabled={isUploading}
        />
        <FiUploadCloud size={32} className="mx-auto text-violet-500 mb-2" />
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          Click or Drag file to upload {selectedCategory}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Supported formats: PDF, PNG, JPG (Max limit: 5MB)
        </p>
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
            <span>Uploading {selectedCategory}…</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 transition-all duration-200 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {documents.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Uploaded Documents ({documents.length})
          </p>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FiFile className="text-violet-500 flex-shrink-0" size={18} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {doc.type} · {doc.size} · {doc.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <FiCheckCircle size={12} /> Ready
                  </span>
                  {onRemoveDocument && (
                    <button
                      onClick={() => onRemoveDocument(doc.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                      title="Remove file"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
