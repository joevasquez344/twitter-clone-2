import React from "react";
import ExploreItem from "./ExploreItem";

const ExploreList = ({ items }) => {
  return items.map((item) => (
    <div className="m-6 flex flex-col space-y-6">
      <ExploreItem item={item} />
    </div>
  ));
};

export default ExploreList;
