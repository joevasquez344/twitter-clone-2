import React from "react";
import { SearchIcon } from "@heroicons/react/outline";
import { TwitterTimelineEmbed } from "react-twitter-embed";

const Widgets = () => {
  return (
    <div className="">
    
      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="NASA"
        options={{ height: 1000 }}
      />
    </div>
  );
};

export default Widgets;
