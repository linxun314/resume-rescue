'use client';
import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { showToast } from '@/lib/useToast';

interface PdfExportProps {
  targetRef: React.RefObject<HTMLElement>;
  fileName?: string;
}

export default function PdfExport({ targetRef, fileName = '简历' }: PdfExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!targetRef.current) {
      showToast('导出失败：找不到简历内容', 'error');
      return;
    }

    setIsExporting(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = targetRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // A4 纸尺寸 (mm)
      const pdfWidth = 210;
      const pdfHeight = 297;

      // 计算缩放比例
      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      const pdf = new jsPDF('p', 'mm', 'a4');

      if (scaledHeight <= pdfHeight) {
        // 单页
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight);
      } else {
        // 多页
        let position = 0;
        const pageImgHeight = pdfHeight / ratio;
        let remainingHeight = imgHeight;

        while (remainingHeight > 0) {
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = imgWidth;
          pageCanvas.height = Math.min(pageImgHeight, remainingHeight);

          const ctx = pageCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(
              canvas,
              0, position * pageImgHeight,
              imgWidth, pageCanvas.height,
              0, 0,
              imgWidth, pageCanvas.height
            );

            const pageImgData = pageCanvas.toDataURL('image/png');
            const pagePdfHeight = (pageCanvas.height * pdfWidth) / imgWidth;

            if (position > 0) pdf.addPage();
            pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pagePdfHeight);
          }

          remainingHeight -= pageImgHeight;
          position++;
        }
      }

      pdf.save(`${fileName}.pdf`);
      showToast('PDF 已下载！', 'success');
    } catch (error) {
      console.error('PDF 导出失败:', error);
      showToast('PDF 导出失败，请重试', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          导出中...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          下载 PDF
        </>
      )}
    </button>
  );
}
