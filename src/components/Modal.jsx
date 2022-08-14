import React, { useEffect, useState } from "react";
import { XIcon } from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
const Modal = ({ modal, closeModal, postType, tweet, children, header }) => {
  const authUser = useSelector((state) => state.users.user);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
   
  }, []);
  return (
    <div>
      {" "}
      <div
        className={`${
          modal
            ? "absolute top-1/4 left-1/5 bg-white w-1/3 h-2/3 rounded-lg z-50 shadow-lg border-t"
            : "hidden"
        }`}
      >
        <div className="flex items-center p-3 ">
          <div onClick={closeModal} className="mr-9 cursor-pointer">
            <XIcon className="h-5 w-5" />
          </div>
          <div className="font-bold text-lg">{header}</div>
        </div>
        <div className="overflow-scroll overflow-y-hidden overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
