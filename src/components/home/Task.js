import "../../index.css";
import { db } from "../../firebase/firebase";
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";

const Task = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [updatedTask, setUpdatedTask] = useState("");
  const [currentTaskId, setCurrentTaskId] = useState(null); // For tracking the task to be edited
  const [checked, setChecked] = useState([]);
  const { currentUser } = useAuth();
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
      setChecked(tasksData);
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
      const taskDocument = doc(
        db,
        `users/${currentUser.uid}/tasks`,
        currentTaskId
      );
      await updateDoc(taskDocument, {
        taskName: updatedTask,
      });
      setCurrentTaskId(null); // Clear the current task ID after update
      setUpdatedTask(""); // Clear the updated task after update
    } catch (e) {
      console.log(e);
    }
  };
  // const checkBoxHandler = async (event) => {
    // setChecked((state) => {
    //   const index = state.findIndex(
    //     (checkbox) => checkbox.id.toString() === event.target.name
    //   );
    //   let newState = state.slice();
    //   newState.splice(index, 1, {
    //     ...state[index],
    //     isChecked: !state[index]?.isChecked,
    //   });
    //   setTasks(newState);
    //   return newState;
    // });

  // };
  const checkBoxHandler = async (event) => {
    event.preventDefault();
    const taskId = event.target.name;
    const isTaskChecked = event.target.checked;
  
    // Update the checked status in Firestore
    try {
      const taskDocRef = doc(db, `users/${currentUser.uid}/tasks/${taskId}`);
      await updateDoc(taskDocRef, {
        isChecked: isTaskChecked,
      });
  
      // Update the local state after successful update in Firestore
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, isChecked: isTaskChecked } : task
        )
      );
    } catch (error) {
      console.error("Error updating task checkbox: ", error);
    }
  };
  
  // console.log("taskss",tasks);
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

              {tasks.map(({ taskName, id, isChecked }) => (
                <div key={id} className="todo-list">
                  <div className="todo-item">
                    <hr />
                    <span className={`${isChecked===true ? 'done' : ''}`}>
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
                  value={updatedTask} // Use the updated task value
                  onChange={(e) => setUpdatedTask(e.target.value)}
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
