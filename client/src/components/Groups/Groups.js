import React, { useContext, useEffect, useRef, useState } from "react";
import "./Groups.css";
import { GetGroupsByUsername } from "../../modules/groups/groupRepository";
import { getCurrentUser } from "../../modules/users/userRepository";
import { useUser } from "../../lib/context/userContext";
import GroupCard from "../GroupCard/GroupCard";

export default function Groups({ children }) {
  const { currentUser } = useUser();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getGroups = async () => {
      if (currentUser) {
        const groups = await GetGroupsByUsername(currentUser.username);
        setGroups(groups);
      }
    };

    getGroups();
  }, [currentUser]);

  return (
    <div>
      {groups.map((group) => {
        return (
          <GroupCard
            key={group.Id}
            groupId={group.Id}
            groupPicture={""}
            usernames={group.Users}
            lastMessage={""}
          />
        );
      })}
    </div>
  );
}
