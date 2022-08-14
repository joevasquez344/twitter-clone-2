export const handleActiveTab = (tabId, tabs, userDetails, setTabs) => {
    const updatedTabs = tabs.map((tab) => {
      tab.isActive = false;
      if (tab.id === tabId) {
        tab.isActive = true;
        tab.fetchData(userDetails.id);
      }
      return tab;
    });

    setTabs(updatedTabs);
  };

  export const handleProfileCreatedAt = (profile) => {
    const arr = profile?.createdAt.split(" ");
    const month = arr[2];
    const year = arr[3];

    return `Joined ${month} ${year}`;
  };
