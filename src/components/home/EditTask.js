import React, { useState } from "react";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";
import { doc, updateDoc } from "firebase/firestore";

const EditTask = ({ task, taskId }) => {
  // console.log(task,taskId);
  const [updatedTask, SetUpdatedTask] = useState(task);
  const { currentUser } = useAuth();
  const updateTask = async (e) => {
    e.preventDefault();
    try {
      const taskDocument = doc(db, `users/${currentUser.uid}/tasks`, taskId);
      await updateDoc(taskDocument,{
        taskName: updatedTask
      });
      window.location.reload();
    } catch (e) {
console.log(e);
    }
  };
  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal2"
      >
        Edit
      </button>

      {/* modal */}
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
                  defaultValue={updatedTask}
                  onChange={(e) => {
                    SetUpdatedTask(e.target.value);
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
                    onClick={() => updateTask()}
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
export default EditTask;
