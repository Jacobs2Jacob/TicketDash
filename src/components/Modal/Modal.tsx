import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
};

const Modal = ({ open, onClose, title, children }: ModalProps) => {
    // create a DOM node for the portal
    const modalRoot = document.getElementById('modal-root')!;
     
    if (!open) {
        return null;
    }

    const modalContent = (
        <div className={styles.backdrop} onClick={onClose} aria-modal="true" role="dialog">
            <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title ?? 'Modal'}</h2>
                    <button onClick={onClose} aria-label="Close" className={styles.close}>
                        x
                    </button>
                </div>
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, modalRoot);
};

export default Modal;
