import "../../index.css";
import { db } from "../../firebase/firebase";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore"; // Ensure addDoc and onSnapshot are imported
import { useAuth } from "../../contexts/authContext";
const Task = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const { currentUser } = useAuth();
  const [updatedTask, setUpdatedTask] = useState(task);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const collectionRef = collection(db, `users/${currentUser.uid}/tasks`);
  const tasksQuery = query(collectionRef, orderBy("createdAt", "desc"));
  // Use real-time listener to listen for changes in the tasks collection
  useEffect(() => {
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasks(tasksData);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [tasksQuery]);

  async function addTask(taskContent) {
    if (!taskContent.trim()) {
      return; // Prevent adding empty tasks
    }

    try {
      await addDoc(collectionRef, {
        taskName: taskContent,
        createdAt: new Date(),
        status: "pending",
        isChecked: false,
      });

      // No need to re-fetch tasks, as the real-time listener will automatically update the tasks state
      setTask(""); // Clear the input field after adding the task
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  }

  const deleteTask = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmation) {
      try {
        const taskDocRef = doc(db, `users/${currentUser.uid}/tasks/${id}`);
        await deleteDoc(taskDocRef);
      } catch (error) {
        console.error("Error deleting task: ", error);
      }
    }
  };

  const updateTask = async () => {
    try {
      const taskDocument = doc(db, `users/${currentUser.uid}/tasks`, currentTaskId);
      await updateDoc(taskDocument, {
        taskName: updatedTask,
      });
      setCurrentTaskId(null); // Clear the current task ID after update
      setUpdatedTask("");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <div className="container">
        <div className="row col-md-12">
          <div className="card card-white">
            <div className="card-body">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal1"
              >
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
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal2"
                        onClick={() => {
                          setCurrentTaskId(id); // Set the current task ID for editing
                          setUpdatedTask(taskName); // Pre-fill the modal with the current task name
                        }}
                      >
                        Edit
                      </button>
                    </span>
                    <button
                      onClick={() => deleteTask(id)}
                      type="button"
                      className="btn btn-danger float-end"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add task modal */}
      <div
        className="modal fade"
        id="exampleModal1"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add New Task
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                className="d-flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  addTask(task);
                  setTask("");
                }}
              >
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter the task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Add task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit task modal */}
      <div
        className="modal fade"
        id="exampleModal2"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Task
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="d-flex">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter the task"
                  value={updatedTask}
                  onChange={(e) => {
                    setUpdatedTask(e.target.value);
                  }}
                />
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => updateTask}
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Save changes
                  </button>
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
