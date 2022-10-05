import React, { useEffect, useState } from "react";
import { XIcon } from "@heroicons/react/outline";
import { Grid } from "@giphy/react-components";

const GiphyModal = ({ fetchGifs, setGiphyModal }) => {
  const [gifs, setGifs] = useState([]);

  useEffect(() => {
    
  }, []);
  return (
    <div className="absolute top-20 z-50 h-1/2  overflow-y-scroll shadow-lg w-full bg-white border-t rounded-xl">
      <div className="flex items-center p-3">
        <XIcon
          onClick={() => setGiphyModal(false)}
          className="w-5 h-5 mr-3 cursor-pointer"
        />
        <form className="w-100">
          <input
            className="border w-96 rounded-full py-2 px-4 focus:outline-blue-400"
            type="text"
            placeholder="Search for GIFs"
          />
        </form>
      </div>
      <Grid onClick={() => setGiphyModal(false)} width={600} columns={3} fetchGifs={fetchGifs} />
    </div>
  );
};

export default GiphyModal;
