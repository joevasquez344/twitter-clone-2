import React, { useEffect, useState } from "react";
import { XIcon } from "@heroicons/react/outline";
import { useSelector } from "react-redux";
const Modal = ({
  modal,
  modalType,
  closeModal,
  children,
  headerTitle,
  headerButton,
  target,
  onHeaderButtonClick,
}) => {
  let styles = {};

  if (target === "Edit Profile") {
    styles.headerButton =
      "flex items-center justify-center bg-black text-white font-semibold rounded-full py-1 px-5 cursor-pointer";
  }

  return (
    <div>
      {" "}
      {modal && (
        <div
          onClick={closeModal}
          className="bg-black fixed top-0 bottom-0 left-0 right-0 opacity-40 z-50 w-screen h-screen"
        ></div>
      )}
      <div
        className={`${
          modal
            ? "fixed top-1/5  bg-white w-1/3  rounded-lg z-50 shadow-lg border-t"
            : "hidden"
        }`}
      >
        <div className="flex items-center p-3 ">
          <div onClick={closeModal} className="mr-9 cursor-pointer">
            <XIcon className="h-5 w-5" />
          </div>
          <div className="flex w-full justify-between items-center">
            <div className="font-bold text-lg">{headerTitle}</div>
            <div onClick={onHeaderButtonClick} className={styles.headerButton}>
              {headerButton}
            </div>
          </div>
        </div>
        <div className="overflow-scroll bg-white overflow-y-hidden overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
