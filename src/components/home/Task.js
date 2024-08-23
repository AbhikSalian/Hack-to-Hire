import "../../index.css";
import { db } from "../../firebase/firebase";
import React, { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";

const Task = () => {
  const [tasks,setTasks]=useState([]);
  const { currentUser } = useAuth();
  const collectionRef = collection(db, `users/${currentUser.uid}/tasks`);
  // const collectionRef = collection(db, "users/${");
  useEffect(() => {
    const getTasks = async () => {
      await getDocs(collectionRef).then((task) => {
        let tasksData = task.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setTasks(tasksData)
      });
    };
    getTasks();
  }, []);
  console.log("tasks: ",tasks)
  return (
    <>
      <div className="container">
        <div className="row col-md-12">
          <div className="card card-white">
            <div className="card-body">


{tasks.map(({taskName,id})=>
              <div className="todo-list">
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
)}


            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Task;
