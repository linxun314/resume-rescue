// components/PdfExport.tsx — 高端视觉重构
'use client';
import { useState } from 'react';
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

      const pdfWidth = 210;
      const pdfHeight = 297;

      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      const pdf = new jsPDF('p', 'mm', 'a4');

      if (scaledHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight);
      } else {
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
      className="btn-primary"
      aria-label="下载 PDF"
    >
      {isExporting ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          导出中...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          下载 PDF
        </>
      )}
    </button>
  );
}
