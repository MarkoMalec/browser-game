import React, { useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux';
import { increment } from '@store/reducers';
import { RootState } from '@store/store';

const NavSkill = () => {

  const dispatch = useDispatch();
  const value = useSelector((state: RootState) => state.test.value);

  const handleIncrementClick = () => {
    dispatch(increment());
  };
  const queryClient = useQueryClient();

  const fetchSkills = async () => {
    const res = await fetch("/skills.json");
    return res.json();
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }
  const handleAddLevel = (skillName: string) => {
    const updatedData = {
      ...data,
      skills: data.skills.map((skill: { name: string; level: number }) =>
        skill.name === skillName ? { ...skill, level: skill.level + 1 } : skill
      ),
    };
    queryClient.setQueryData(["skills"], updatedData);
  };

  return (
    // loop through data and return a button for each skill
    <div className="flex flex-col items-center justify-center gap-4">
      {data.skills.map((skill: { name: string; level: number }) => (
        <div className="" key={skill.name}>
          <Link
            href={`/components/skills/${skill.name}`}
            className="text-white no-underline transition hover:bg-white/20"
          >
            {skill.name} ({value})
          </Link>
          <button
            className="text-white no-underline transition hover:bg-white/20"
            onClick={handleIncrementClick}
          >
            Add Level
          </button>
        </div>
      ))}
    </div>
  );
};

export default NavSkill;
