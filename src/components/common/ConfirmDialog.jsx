/**
 * 🇬🇦 RSU Gabon - ConfirmDialog Component
 * Standards Top 1% - Dialogue de confirmation réutilisable
 */
import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning', // warning | danger | info | success
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  loading = false,
}) {
  const icons = {
    warning: <AlertTriangle className="text-yellow-600" size={48} />,
    danger: <XCircle className="text-red-600" size={48} />,
    info: <Info className="text-blue-600" size={48} />,
    success: <CheckCircle className="text-green-600" size={48} />,
  };

  const buttonVariants = {
    warning: 'primary',
    danger: 'danger',
    info: 'primary',
    success: 'success',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <div className="text-center py-4">
        <div className="mx-auto mb-4">{icons[type]}</div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariants[type]}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}