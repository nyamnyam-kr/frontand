import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    closeButton?: boolean; // X 버튼 표시 여부 (post에서 없는 버전 사용)
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, closeButton = true }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
            <div className="bg-white rounded-lg shadow-lg p-6 z-10 relative" onClick={(e) => e.stopPropagation()}> {/* relative 클래스 추가 */}
                {closeButton && (
                    <button className="absolute top-4 right-4" onClick={onClose}> {/* top과 right 값 조정 */}
                        ✖️
                    </button>
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal;
