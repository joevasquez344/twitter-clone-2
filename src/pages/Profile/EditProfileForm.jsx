import React from "react";

const EditProfileForm = ({
  handleEditProfile,
  handleNameChange,
  nameInput,
  name,
  bio,
  handleBioChange,
  bioInput,
  handleLocationChange,
  locationInput,
  location,
  handleBirthdayChange,
  birthdayInput,
}) => {
  return (
    <form onSubmit={handleEditProfile} className="flex flex-col p-4">
      <input
        onChange={handleNameChange}
        value={nameInput}
        type="text"
        placeholder={name || "Name"}
        className="border mb-6 p-3 rounded-md"
      />
      <textarea
        className="border mb-6 p-3 rounded-md"
        name=""
        id=""
        cols="30"
        rows="3"
        onChange={handleBioChange}
        value={bioInput}
        type="text"
        placeholder={bio || "Bio"}
      ></textarea>

      <input
        onChange={handleLocationChange}
        value={locationInput}
        type="text"
        placeholder={location ? location : "Location"}
        className="border mb-6 p-3 rounded-md"
      />
      <input
        onChange={handleBirthdayChange}
        value={birthdayInput}
        type="date"
        className="border mb-6 p-3 rounded-md"
      />
    </form>
  );
};

export default EditProfileForm;
