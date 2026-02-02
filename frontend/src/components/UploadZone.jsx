import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';

export function UploadZone({ companyId, onUploadSuccess }) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError(null);
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file || !companyId) return;

        setUploading(true);
        setError(null);
        try {
            const result = await api.uploadFinancials(companyId, file);
            onUploadSuccess(result);
            setFile(null); // Reset after success
        } catch (err) {
            console.error("Upload error details:", err);
            let msg = "Upload failed. ";
            if (err.response) {
                msg += `Server responded with ${err.response.status}: ${JSON.stringify(err.response.data)}`;
            } else if (err.request) {
                msg += "No response received. Check console for CORS or Network errors.";
            } else {
                msg += err.message;
            }
            setError(msg);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-64 border-dashed rounded-lg cursor-pointer transition-colors border-2",
                    isDragging
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-border bg-muted/5 hover:bg-muted/10"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    accept=".csv,.xlsx,.xls"
                />

                <div className="flex flex-col items-center pt-5 pb-6">
                    {file ? (
                        <>
                            <FileText className="w-10 h-10 mb-3 text-green-500" />
                            <p className="mb-2 text-sm text-foreground font-semibold">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                        </>
                    ) : (
                        <>
                            <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">CSV, Excel (MAX. 10MB)</p>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="mt-2 text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}

            {file && (
                <Button
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? "Analyzing..." : "Analyze Financial Health"}
                </Button>
            )}
        </div>
    );
}
