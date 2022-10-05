import React, { useEffect, useState } from "react";
import { XIcon } from "@heroicons/react/outline";
import { useSelector } from "react-redux";
const Modal = ({  modal, modalType, closeModal, children, header }) => {

  return (
    <div>
      {" "}
      <div
        className={`${
          modal
            ? "absolute top-1/4   bg-white w-full  rounded-lg z-50 shadow-lg border-t"
            : "hidden"
        }`}
      >
        <div className="flex items-center p-3 ">
          <div onClick={closeModal} className="mr-9 cursor-pointer">
            <XIcon className="h-5 w-5" />
          </div>
          <div className="font-bold text-lg">{header}</div>
        </div>
        <div className="overflow-scroll bg-white overflow-y-hidden overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
