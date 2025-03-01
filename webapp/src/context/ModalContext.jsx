import React, { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState(new Map());

  const openModal = (id, component) => {
    setModals(prev => new Map(prev).set(id, component));
  };

  const closeModal = (id) => {
    setModals(prev => {
      const newModals = new Map(prev);
      newModals.delete(id);
      return newModals;
    });
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {Array.from(modals.entries()).map(([id, component]) => {
        return createPortal(
          <div 
            className="modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal(id);
            }}
          >
            <div className="modal-content">
              {React.cloneElement(component, { onClose: () => closeModal(id) })}
            </div>
          </div>,
          document.getElementById('modal-root')
        );
      })}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};