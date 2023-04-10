import { createContext, useContext, useState, useEffect } from "react";

interface Task {
  name: string;
  profession: string;
  xp: number;
  time: number;
}

interface TaskContextType {
  activeTask: Task | null;
  progress: number;
  setProgress: (value: number) => void;
  startTask: (task: Task) => void;
  stopTask: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("there is no useTask context inside TaskProvider");
  }
  return context;
};

export const TaskProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const startTask = (task: Task) => {
    if (activeTask) {
      stopTask();
    }
    setActiveTask(task);
    localStorage.setItem("activeTask", JSON.stringify(task));
  };

  const stopTask = () => {
    setActiveTask(null);
    setProgress(0);
    localStorage.removeItem("activeTask");
  };

  useEffect(() => {
    const savedActiveTask = localStorage.getItem("activeTask");
    if (savedActiveTask) {
      setActiveTask(JSON.parse(savedActiveTask));
    }
  }, []);

  return (
    <TaskContext.Provider
      value={{
        activeTask,
        progress,
        setProgress,
        startTask,
        stopTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
