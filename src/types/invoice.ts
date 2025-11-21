// 發票資料類型定義
export interface Invoice {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  status: 'processing' | 'completed' | 'error';
  ocrResult?: OCRResult;
  previewUrl?: string;
}

// OCR 辨識結果
export interface OCRResult {
  invoiceNumber: string;
  date: string;
  seller: {
    name: string;
    taxId: string;
    address: string;
  };
  buyer?: {
    name: string;
    taxId: string;
    address: string;
  };
  items: InvoiceItem[];
  totalAmount: number;
  taxAmount: number;
  confidence: number; // 辨識信心度 0-1
}

// 發票項目
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

// 檔案上傳狀態
export interface UploadStatus {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  result?: OCRResult;
}

// API 回應格式
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}