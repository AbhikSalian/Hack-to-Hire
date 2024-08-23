import "../../index.css";
import { db } from "../../firebase/firebase";
import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, query, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";

const Task = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const { currentUser } = useAuth();
  const collectionRef = collection(db, `users/${currentUser.uid}/tasks`);

  // Fetch limited tasks initially
  useEffect(() => {
    const getTasks = async () => {
      const taskQuery = query(collectionRef, orderBy("createdAt", "desc"), limit(10));
      const taskSnapshot = await getDocs(taskQuery);
      const tasksData = taskSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasks(tasksData);
    };
    getTasks();
  }, [collectionRef]);

  async function addTask(taskContent) {
    if (!taskContent.trim() || tasks.some(task => task.taskName === taskContent.trim())) {
      return; // Prevent adding empty or duplicate tasks
    }

    try {
      const newTask = {
        taskName: taskContent,
        createdAt: new Date(),
        status: "pending",
      };
      
      await addDoc(collectionRef, newTask);

      // Update the local state directly
      setTasks([newTask, ...tasks]);
      setTask(""); // Clear the input field
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
              <button type="submit" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Add Task
              </button>

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

      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Task</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form
                className="d-flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  addTask(task);
                }}
              >
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter the task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;
