import React, { useState } from "react";

const useModals = (modalsArr, posts) => {
  const [modals, setModals] = useState(modalsArr);

  const openModal = (modalId) => {
    const updatedModals = modals.map((modal) => {
      modal.active = false;
      if (modal.id === modalId) {
        modal.active = true; 
      }

      return modal;
    });

    setModals(updatedModals);
  };
  const closeModal = (modalId) => {
    const updatedModals = modals.map((modal) => {
      modal.active = false;
      if (modal.id === modalId) {
        modal.active = false;
      }

      return modal;
    });

    setModals(updatedModals);
  };

  return { modals, openModal, closeModal };
};

export default useModals;
