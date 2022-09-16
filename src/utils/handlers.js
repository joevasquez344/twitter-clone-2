export const handleActiveTab = (tabId, tabs, profile, setTabs) => {
    const updatedTabs = tabs.map((tab) => {
      tab.isActive = false;
      if (tab.id === tabId) {
        tab.isActive = true;
        tab.fetchData(profile);
      }
      return tab;
    });

    setTabs(updatedTabs);
  };

  export const handleAuthLayout = (profile, setIsFollowing, user) => {
    const match = profile?.followers?.find((u) => u.id === user.id);

    if (match) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  };

  export const handleProfileCreatedAt = (profile) => {
    const arr = profile?.createdAt.split(" ");
    const month = arr[2];
    const year = arr[3];

    return `Joined ${month} ${year}`;
  };
