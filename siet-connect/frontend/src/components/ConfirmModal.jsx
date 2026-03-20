import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal-box">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
            <AlertTriangle className="text-warning" size={20} aria-hidden="true" />
          </div>
          <h3 id="confirm-title" className="font-bold text-lg">{title}</h3>
        </div>
        <p className="text-base-content/70">{message}</p>
        <div className="modal-action">
          <button onClick={onCancel} className="btn btn-ghost" disabled={isLoading}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-error" disabled={isLoading}>
            {isLoading && <span className="loading loading-spinner loading-sm" />}
            Confirm
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onCancel} aria-hidden="true" />
    </div>
  );
};

export default ConfirmModal;
