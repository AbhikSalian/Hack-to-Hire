import "../../index.css";
import { db } from "../../firebase/firebase";
import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore"; // Ensure addDoc is imported
import { useAuth } from "../../contexts/authContext";

const Task = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const { currentUser } = useAuth();

  const collectionRef = collection(db, `users/${currentUser.uid}/tasks`);

  useEffect(() => {
    const getTasks = async () => {
      const taskSnapshot = await getDocs(collectionRef);
      const tasksData = taskSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasks(tasksData);
    };
    getTasks();
  }, [collectionRef]);

  async function addTask(taskContent) {
    if (!taskContent.trim()) {
      return; // Prevent adding empty tasks
    }

    try {
      const tasksRef = collection(db, `users/${currentUser.uid}/tasks`);
      await addDoc(tasksRef, {
        taskName: taskContent,
        createdAt: new Date(),
        status: "pending",
      });

      // After adding the task, refresh the task list
      const taskSnapshot = await getDocs(collectionRef);
      const updatedTasks = taskSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasks(updatedTasks);
      setTask(""); // Clear the input field after adding the task
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  }

  return (
    <>
      <div className="container">
        <div className="row col-md-12">
          <div className="card card-white">
            <div className="card-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addTask(task);
                }}
              >
                <input
                  type="text"
                  value={task}
                  onChange={(e) => {setTask(e.target.value);

                  }}
                />
                <button type="submit" className="btn btn-primary mt-2">
                  Add Task
                </button>
              </form>
              {tasks.map(({ taskName, id }) => (
                <div key={id} className="todo-list">
                  <div className="todo-item">
                    <hr />
                    <span>
                      <div className="checker">
                        <span>
                          <input type="checkbox" />
                        </span>
                      </div>
                      &nbsp;{taskName}
                    </span>
                    <span className="float-end mx-3">
                      <button type="button" className="btn btn-primary">
                        Edit
                      </button>
                    </span>
                    <button type="button" className="btn btn-danger float-end">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;
