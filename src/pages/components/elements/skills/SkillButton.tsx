import React, { useState, useEffect } from "react";
import { useTask } from "@context/Tasks/TaskContext";
import useWebSocket from "@hooks/useSkills";
import { useSession } from "next-auth/react";

interface SkillButtonProps {
  Name: string;
  profession: string;
  XP: number;
  Time: number;
  Icon: string;
}

const SkillButton: React.FC<SkillButtonProps> = ({
  Name,
  profession,
  XP,
  Time,
  Icon,
}) => {
  const { activeTask, startTask, stopTask } = useTask();
  const [userId, setUserId] = useState('');
  const [ws, connected] = useWebSocket();

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setUserId(session.user.id);
    }
  }, [])

  // const startTaskServer = async (task) => {
  //   try {
      
  //     console.table("Task object:", task);
  //     const response = await fetch("https://sevario.xyz:6969/api/task/start", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ userId: `${userId}`, task }),
  //     });
  //     const data = await response.json();
  //     console.log(data, "data");
  //   } catch (err) {
  //     console.error("Error starting task:", err);
  //   }
  // };
  const handleButtonClick = () => {
    if (activeTask && activeTask.name === Name) {
      stopTask();
    } else {
      startTask({ name: Name, profession: profession, xp: XP, time: Time });
      const taskData = {
        name: Name,
        profession: profession,
        xp: XP,
        time: Time,
      };
      // startTaskServer(taskData);
  
      // Send a message to the server to start the task using WebSocket
      if (ws instanceof WebSocket && connected) {
        ws.send(
          JSON.stringify({
            type: 'taskStart',
            userId: userId,
            task: taskData,
          })
        );
      }
    }
  };

  return (
    <button
      onClick={handleButtonClick}
      className="rounded bg-gray-800 p-5 text-gray-300 shadow-sm transition hover:bg-gray-900"
    >
      {Icon}
      <h3 className="text-lg">{Name}</h3>
      <p className="mb-1 rounded bg-gray-900 p-2">
        Experience gain: <br />
        <strong>{XP}</strong>xp
      </p>
      <p className="mb-1 rounded bg-gray-900 p-2">
        Time consuming: <br />
        <strong>{Time}</strong>s
      </p>
    </button>
  );
};

export default SkillButton;
