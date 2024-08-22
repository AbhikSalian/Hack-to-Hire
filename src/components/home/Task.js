import "../../index.css";
import { db } from "../../firebase/firebase";
import React, { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";

const Task = () => {
    const fetchUserTasks = async (user) => {
        if (!user) return; // Make sure user is logged in
      
        try {
          const tasksCollection = collection(db, "tasks");
          const tasksSnapshot = await getDocs(tasksCollection);
          const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          return tasksList;
        } catch (error) {
          console.error("Error fetching tasks: ", error);
          return [];
        }
      };
  return (
    <>
      <div className="container">
        <div className="row col-md-12">
          <div className="card card-white">
            <div className="card-body">
              <div className="todo-list">
                <div className="todo-item">
                  <hr />
                  <span>
                    <div className="checker">
                      <span>
                        <input type="checkbox" />
                      </span>
                    </div>
                    &nbsp;Learn Web dev
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Task;
