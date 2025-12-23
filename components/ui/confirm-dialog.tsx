'use client';

import { useEffect, useRef } from 'react';
import { Button } from './button';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'destructive';
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default'
}: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div 
                ref={dialogRef}
                className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
                    <p className="text-gray-500">{message}</p>
                </div>
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="rounded-xl"
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
