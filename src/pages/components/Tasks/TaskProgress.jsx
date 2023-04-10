import React, { useEffect, useState } from "react";
import { useTask } from "@context/Tasks/TaskContext";
import useWebSocket from "@hooks/useSkills";
import { useSession } from "next-auth/react";

const TaskProgress = () => {
  const { activeTask, progress, setProgress, stopTask } = useTask();
  const [intervalId, setIntervalId] = useState(null);
  const { data: session } = useSession();
  const [userId, setUserId] = useState('');
  const [progressIntervalId, setProgressIntervalId] = useState(null);
  const [ws, connected] = useWebSocket();

  useEffect(() => {
    if (session) {
      setUserId(session.user.id);
    }
    if (activeTask) {
      if (intervalId) {
        clearInterval(intervalId);
      }
      const id = setInterval(() => {
        console.log(`Gained ${activeTask.xp} XP in ${activeTask.profession}`);
        setProgress(0);
      }, activeTask.time * 1000);
      setIntervalId(id);

      if (progressIntervalId) {
        clearInterval(progressIntervalId);
      }
      const progressId = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            return 0;
          }
          return prevProgress + 100 / (activeTask.time * 64);
        });
      }, 1);
      setProgressIntervalId(progressId);
    } else {
      clearInterval(intervalId);
      clearInterval(progressIntervalId);
      setIntervalId(null);
      setProgressIntervalId(null);
    }

    return () => {
      clearInterval(intervalId);
      clearInterval(progressIntervalId);
    };
  }, [activeTask]);

//   const handleStopTaskButton = () => {
//     stopTask();
//   };

  
const handleStopTaskButton = () => {
  if (ws instanceof WebSocket && connected) {
    ws.send(
      JSON.stringify({
        type: 'taskStop',
        userId: `${userId}`,
      })
    );
  }
  stopTask();
};

  if (!activeTask) {
    return null;
  }

  return (
    <div className="fixed top-0 left-1/2 z-50 w-1/4 -translate-x-1/2 transform rounded-md bg-gray-800 p-2 flex flex-col">
      <p className="text-center mb-4">{activeTask.name}</p>
      {/* {console.log(activeTask)} */}
      <progress value={progress} max="100" className="w-full"/>
      <button
        className="mt-2 rounded bg-red-500 px-4 py-1 text-white m-"
        onClick={handleStopTaskButton}
      >
        Stop Task
      </button>
    </div>
  );
};

export default TaskProgress;
