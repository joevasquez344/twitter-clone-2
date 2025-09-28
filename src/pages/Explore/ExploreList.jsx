import React from "react";
import ExploreItem from "./ExploreItem";
import { useExplore } from "./ExploreContext";

const ExploreList = () => {
  const {forYouItems} = useExplore()
  return forYouItems.map((item) => (
    <div className="m-6 flex flex-col space-y-6">
      <ExploreItem item={item} />
    </div>
  ));
};

export default ExploreList;
