import React, { useState } from 'react';
import { validateDocumentFile, formatFileSize } from '../../utils/documentHelpers';
import { DOCUMENT_CATEGORIES } from '../../mock/documents';
import { FiUploadCloud, FiFileText, FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

export default function DocumentUploadQueue({ onUploadFiles, employees = [] }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[0]?.id || 'EMP-2026-0014');
  const [selectedCategory, setSelectedCategory] = useState('Government ID');
  const [selectedType, setSelectedType] = useState('Aadhaar Card');
  const [expiryDate, setExpiryDate] = useState('');
  const [queue, setQueue] = useState([]);

  const categoryOptions = Object.keys(DOCUMENT_CATEGORIES);
  const typeOptions = DOCUMENT_CATEGORIES[selectedCategory] || [];

  const handleFileDrop = (filesList) => {
    const newItems = Array.from(filesList).map((file) => {
      const validation = validateDocumentFile(file);
      return {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        file,
        name: file.name,
        sizeBytes: file.size,
        format: file.name.split('.').pop().toUpperCase(),
        validation,
        progress: validation.valid ? 100 : 0,
      };
    });
    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleRemoveQueueItem = (id) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCompleteUpload = () => {
    const validItems = queue.filter((item) => item.validation.valid);
    if (validItems.length === 0) {
      alert('Please add at least one valid document file to upload.');
      return;
    }

    const employeeObj = employees.find((e) => e.id === selectedEmployeeId) || { name: 'Arjun Mehta', department: 'Engineering' };

    validItems.forEach((item) => {
      onUploadFiles({
        name: item.name,
        sizeBytes: item.sizeBytes,
        format: item.format,
        employeeId: selectedEmployeeId,
        employeeName: employeeObj.name,
        department: employeeObj.department,
        category: selectedCategory,
        type: selectedType,
        expiryDate: expiryDate || null,
        uploadedBy: 'Admin User',
      });
    });

    setQueue([]);
    setExpiryDate('');
  };

  return (
    <div className="space-y-6">
      {/* Upload Settings Configuration Grid */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4 shadow-sm text-xs">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
          Document Classification Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Target Employee</label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedType(DOCUMENT_CATEGORIES[e.target.value]?.[0] || 'Miscellaneous');
              }}
              className="w-full min-h-[40px] px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Document Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Expiry Date (Optional)</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleFileDrop(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-400 rounded-2xl p-8 bg-slate-50 dark:bg-slate-900/50 text-center cursor-pointer transition-colors space-y-3"
      >
        <FiUploadCloud size={40} className="mx-auto text-violet-500 opacity-80" />
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Drag & Drop Document Files Here
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supports PDF, PNG, JPG, JPEG, DOC, DOCX up to 5 MB per file.
          </p>
        </div>
        <label className="inline-block px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all">
          Browse Files
          <input
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            onChange={(e) => e.target.files && handleFileDrop(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      {/* File Queue List */}
      {queue.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-3 shadow-sm text-xs">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
            <span>Upload Queue ({queue.length} file(s))</span>
            <button onClick={() => setQueue([])} className="text-rose-500 hover:underline text-xs">Clear Queue</button>
          </h4>

          <div className="space-y-2">
            {queue.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                  item.validation.valid
                    ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FiFileText size={18} className={item.validation.valid ? 'text-violet-500' : 'text-rose-500'} />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {formatFileSize(item.sizeBytes)} · Format: {item.format}
                    </p>
                    {!item.validation.valid && (
                      <span className="text-[11px] font-semibold text-rose-500">{item.validation.error}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {item.validation.valid ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                      <FiCheckCircle size={14} /> Ready
                    </span>
                  ) : (
                    <span className="text-rose-500 font-semibold text-[11px] flex items-center gap-1">
                      <FiAlertCircle size={14} /> Invalid
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveQueueItem(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 flex justify-end">
            <button
              onClick={handleCompleteUpload}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
            >
              Confirm & Upload {queue.filter((i) => i.validation.valid).length} Valid Document(s)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
