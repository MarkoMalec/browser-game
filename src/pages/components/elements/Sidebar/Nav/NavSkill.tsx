import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const NavSkill = () => {
  const [skillList, setSkillList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user.id;
  // console.log(userId);

  useEffect(() => {
    async function fetchSkillListData() {
      // console.log(`https://sevario.xyz:6969/api/skills/` + userId);
      try {
        const response = await fetch(
          `https://sevario.xyz:6969/api/skills/` + userId
        );
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);
        setSkillList(data.result);
        setLoading(false);
        // console.log('Skill List: ' + data.result);
      } catch (err) {
        console.error("Failed to fetch skill data:", err);
      }
    }

    fetchSkillListData();
  }, [userId]);

  const capitalizeWords = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return <div>loading...</div>;
  }
  interface SkillItem {
    user_skill_id: number;
    user_id: string;
    skill_id: number;
    level: number;
    current_xp: number;
    updated_at: string;
    skills: {
      skill_id: number;
      skill_name: string;
      description: string;
    };
  }

  return (
    // loop through data and return a button for each skill
    <>
      <h3 className="w-full border-b pb-3 border-gray-700">Skills</h3>
      <ul>
        {skillList.map((skill: SkillItem) => (
          <li key={skill.skills.skill_name}>
            <Link
              href={`/skills/${skill.skills.skill_name}`}
              className="text-white no-underline transition hover:bg-white/20"
            >
              {capitalizeWords(skill.skills.skill_name)} (1)
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default NavSkill;
