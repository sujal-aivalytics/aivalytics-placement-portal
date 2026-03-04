import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export const downloadResumePDF = async (resumeName: string) => {
    const element = document.getElementById('resume-preview-element');
    if (!element) {
        console.error('Resume preview element not found');
        return false;
    }

    try {
        // 1. Generate High-Quality Image using modern parser
        const dataUrl = await toPng(element, {
            quality: 1.0,
            pixelRatio: 2, // 2x resolution for clear text
            backgroundColor: '#ffffff', // Force white background
        });

        // 2. Initialize PDF (A4)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // 3. Add Image to PDF
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // 4. Generate filename and save
        const sanitizedName = resumeName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        pdf.save(`${sanitizedName || 'My'}_Resume.pdf`);

        return true;
    } catch (error) {
        console.error('PDF Generation failed:', error);
        return false;
    }
};
