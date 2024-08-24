import "../../index.css";
import { db } from "../../firebase/firebase";
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";

const Task = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [updatedTask, setUpdatedTask] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [cDate, setDate] = useState("");
  const { currentUser } = useAuth();
  const collectionRef = collection(db, `users/${currentUser.uid}/tasks`);

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collectionRef);
        const tasksData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, [collectionRef]);

  async function addTask(taskContent, cDate) {
    if (!taskContent.trim()) {
      return; // Prevent adding empty tasks
    }
    try {
      const docRef = await addDoc(collectionRef, {
        taskName: taskContent,
        createdAt: new Date(),
        status: "pending",
        isChecked: false,
        completeBy: cDate,
      });

      setTasks((prevTasks) => [
        {
          taskName: taskContent,
          id: docRef.id,
          isChecked: false,
          completeBy: cDate,
        },
        ...prevTasks,
      ]);

      setTask(""); // Clear the input field after adding the task
      setDate("");
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
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } catch (error) {
        console.error("Error deleting task: ", error);
      }
    }
  };

  const updateTask = async () => {
    try {
      const taskDocument = doc(
        db,
        `users/${currentUser.uid}/tasks`,
        currentTaskId
      );
      await updateDoc(taskDocument, {
        taskName: updatedTask,
        completeBy: updatedDate,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === currentTaskId ? { ...task, taskName: updatedTask } : task
        )
      );
      setCurrentTaskId(null);
      setUpdatedTask("");
      setUpdatedDate("");
    } catch (e) {
      console.log(e);
    }
  };

  const checkBoxHandler = async (event) => {
    event.preventDefault();
    const taskId = event.target.name;
    const isTaskChecked = event.target.checked;

    try {
      const taskDocRef = doc(db, `users/${currentUser.uid}/tasks/${taskId}`);
      await updateDoc(taskDocRef, {
        isChecked: isTaskChecked,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, isChecked: isTaskChecked } : task
        )
      );
    } catch (error) {
      console.error("Error updating task checkbox: ", error);
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

              {tasks.map(({ taskName, id, isChecked, completeBy }) => (
                <div key={id} className="todo-list">
                  <div className="todo-item">
                    <hr />
                    <span className={`${isChecked ? "done" : ""}`}>
                      <div className="checker">
                        <span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(event) => checkBoxHandler(event)}
                            name={id}
                          />
                        </span>
                      </div>
                      &nbsp;{taskName}
                      <br />
                      Due date (YYYY/MM/DD): {completeBy}
                    </span>
                    <span className="float-end mx-3">
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal2"
                        onClick={() => {
                          setCurrentTaskId(id);
                          setUpdatedTask(taskName);
                          setUpdatedDate(completeBy);
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

      {/* Add Task Modal */}
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
                  addTask(task, cDate);
                }}
              >
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter the task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
                <input
                  type="date"
                  placeholder="Enter due date"
                  value={cDate}
                  onChange={(e) => setDate(e.target.value)}
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

      {/* Edit Task Modal */}
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
                  onChange={(e) => setUpdatedTask(e.target.value)}
                />
                <input
                  type="date"
                  placeholder="Enter due date"
                  value={updatedDate}
                  onChange={(e) => setUpdatedDate(e.target.value)}
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
                    onClick={(e) => {
                      e.preventDefault();
                      updateTask();
                    }}
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
