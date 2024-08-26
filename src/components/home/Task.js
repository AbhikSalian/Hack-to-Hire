// Importing necessary CSS and Firebase configurations
import "../../index.css";
import { db } from "../../firebase/firebase";

// Importing React and necessary hooks
import React, { useEffect, useState } from "react";

// Importing Firebase Firestore functions
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

// Importing custom authentication context
import { useAuth } from "../../contexts/authContext";

// Defining the Task component
const Task = () => {
  // State for handling input task, list of tasks, and task updates
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [updatedTask, setUpdatedTask] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [cDate, setDate] = useState("");

  // Get the current user from authentication context
  const { currentUser } = useAuth();

  // Reference to the Firestore collection for the current user's tasks
  const collectionRef = collection(db, `users/${currentUser.uid}/tasks`);

  // useEffect hook to fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collectionRef);
        // Mapping fetched documents to task data including the task ID
        const tasksData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // Setting fetched tasks to the state
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, [collectionRef]);

  // Function to add a new task to the Firestore collection
  async function addTask(taskContent, cDate) {
    if (!taskContent.trim()) {
      return; // Prevent adding empty tasks
    }
    try {
      // Adding the task document to Firestore
      const docRef = await addDoc(collectionRef, {
        taskName: taskContent,
        createdAt: new Date(),
        status: "pending",
        isChecked: false,
        completeBy: cDate,
      });

      // Updating the local state with the new task
      setTasks((prevTasks) => [
        {
          taskName: taskContent,
          id: docRef.id,
          isChecked: false,
          completeBy: cDate,
        },
        ...prevTasks,
      ]);

      // Clear input fields after adding the task
      setTask("");
      setDate("");
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  }

  // Function to delete a task from Firestore
  const deleteTask = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmation) {
      try {
        // Reference to the specific task document
        const taskDocRef = doc(db, `users/${currentUser.uid}/tasks/${id}`);
        await deleteDoc(taskDocRef);

        // Update local state by removing the deleted task
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } catch (error) {
        console.error("Error deleting task: ", error);
      }
    }
  };

  // Function to update a task's details in Firestore
  const updateTask = async () => {
    try {
      // Reference to the specific task document to be updated
      const taskDocument = doc(
        db,
        `users/${currentUser.uid}/tasks`,
        currentTaskId
      );
      await updateDoc(taskDocument, {
        taskName: updatedTask,
        completeBy: updatedDate,
      });

      // Updating the task in local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === currentTaskId ? { ...task, taskName: updatedTask } : task
        )
      );

      // Resetting state after updating
      setCurrentTaskId(null);
      setUpdatedTask("");
      setUpdatedDate("");
    } catch (e) {
      console.log(e);
    }
  };

  // Function to handle checkbox state changes and update Firestore
  const checkBoxHandler = async (event) => {
    event.preventDefault();
    const taskId = event.target.name;
    const isTaskChecked = event.target.checked;

    try {
      // Reference to the specific task document to be updated
      const taskDocRef = doc(db, `users/${currentUser.uid}/tasks/${taskId}`);
      await updateDoc(taskDocRef, {
        isChecked: isTaskChecked,
      });

      // Update the task's checked state in local state
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
      {/* Main container for the task management interface */}
      <div className="container">
        <div className="row col-md-12">
          <div className="card card-white">
            <div className="card-body">
              {/* Button to trigger modal for adding a new task */}
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal1"
              >
                Add Task
              </button>

              {/* Rendering each task in the list */}
              {tasks.map(({ taskName, id, isChecked, completeBy }) => {
                const isPastDue = new Date(completeBy) < new Date();

                return (
                  <div key={id} className="todo-list">
                    <div
                      className={`todo-item ${
                        isPastDue
                          ? isPastDue === new Date()
                            ? "today-due"
                            : "past-due"
                          : ""
                      }`}
                    >
                      <hr />
                      <span className={`${isChecked ? "done" : ""}`}>
                        <div className="checker">
                          <span>
                            {/* Checkbox for marking task as complete */}
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
                        <br />
                        <small className="text-muted">
                          {/* Displaying the due date for the task */}
                          Due date: {new Date(completeBy).toLocaleDateString()}
                        </small>
                      </span>
                      {/* Button to trigger modal for editing the task */}
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
                      {/* Button to delete the task */}
                      <button
                        onClick={() => deleteTask(id)}
                        type="button"
                        className="btn btn-danger float-end"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding a new task */}
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
                onSubmit={(e) => {
                  e.preventDefault();
                  addTask(task, cDate);
                }}
              >
                <div className="mb-3">
                  <label htmlFor="taskInput" className="form-label">
                    Task Name
                  </label>
                  <input
                    id="taskInput"
                    className="form-control"
                    type="text"
                    placeholder="Enter the task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="dateInput" className="form-label">
                    Due Date
                  </label>
                  <input
                    id="dateInput"
                    className="form-control"
                    type="date"
                    placeholder="Enter due date"
                    value={cDate}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
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
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for editing an existing task */}
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
                Update Task
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
                onSubmit={(e) => {
                  e.preventDefault();
                  updateTask();
                }}
              >
                <div className="mb-3">
                  <label htmlFor="updateTaskInput" className="form-label">
                    Task Name
                  </label>
                  <input
                    id="updateTaskInput"
                    className="form-control"
                    type="text"
                    placeholder="Enter the task"
                    value={updatedTask}
                    onChange={(e) => setUpdatedTask(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="updateDateInput" className="form-label">
                    Due Date
                  </label>
                  <input
                    id="updateDateInput"
                    className="form-control"
                    type="date"
                    placeholder="Enter due date"
                    value={updatedDate}
                    onChange={(e) => setUpdatedDate(e.target.value)}
                  />
                </div>
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
                    Update
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
