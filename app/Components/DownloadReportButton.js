'use client';

import { useState } from 'react';
import { FaDownload } from 'react-icons/fa';

export default function DownloadReportButton({
    apiEndpoint,
    filters = {},
    fileName = 'report',
    className = ''
}) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setLoading(true);

            // Construct Query Params
            const params = new URLSearchParams();
            // Add filters (remove empty values)
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value);
                }
            });
            // Add export flag
            params.append('export', 'true');

            // Fetch
            const res = await fetch(`${apiEndpoint}?${params.toString()}`);

            if (!res.ok) {
                throw new Error('Failed to generate report');
            }

            // Get Blob
            const blob = await res.blob();

            // Create Filename
            const date = new Date().toISOString().split('T')[0];
            const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
            const finalFileName = `${fileName}_${date}_${time}.xlsx`;

            // Trigger Download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = finalFileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (error) {
            console.error('Download error:', error);
            alert('Error downloading report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <FaDownload />
            )}
            Download Report
        </button>
    );
}
