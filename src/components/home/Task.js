import "../../index.css";
import { db } from "../../firebase/firebase";
import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, onSnapshot } from "firebase/firestore"; // Ensure addDoc and onSnapshot are imported
import { useAuth } from "../../contexts/authContext";

const Task = () => {
  
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const { currentUser } = useAuth();

  const collectionRef = collection(db, `users/${currentUser.uid}/tasks`);

  // Use real-time listener to listen for changes in the tasks collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasks(tasksData);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [collectionRef]);

  async function addTask(taskContent) {
    if (!taskContent.trim()) {
      return; // Prevent adding empty tasks
    }

    try {
      await addDoc(collectionRef, {
        taskName: taskContent,
        createdAt: new Date(),
        status: "pending",
      });

      // No need to re-fetch tasks, as the real-time listener will automatically update the tasks state
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
              <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal1">
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
                      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal2">
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

      {/* modal */}
      <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Task</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="d-flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  addTask(task);
                  setTask("");
                }}
              >
                <input className="form-control"
                  type="text" placeholder="Enter the task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
                <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
            </div>
              </form>
            </div>
            
          </div>
        </div>
      </div>


      {/* modal */}
      <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Task</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="d-flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  addTask(task);
                  setTask("");
                }}
              >
                <input className="form-control"
                  type="text" placeholder="Enter the task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
                <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
            </div>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;
