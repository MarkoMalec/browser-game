import React from 'react';
import dynamic from 'next/dynamic';

const Skill = ({ skill }) => {
  const SkillComponent = dynamic(() => import(`@components/skills/${skill}`), {
    loading: () => <div>Loading...</div>,
    onError: () => <div>404 - Skill not found</div>,
  });

  return <SkillComponent />;
};

export async function getServerSideProps({ params }) {
  const { skill } = params;

  if (!skill) {
    return { notFound: true };
  }

  const capitalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
  return { props: { skill: capitalizedSkill } };
}

export default Skill;
