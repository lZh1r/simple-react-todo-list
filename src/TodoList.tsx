import {ChangeEvent, useEffect, useRef, useState} from "react";
import StylishButton from "./StylishButton.tsx";
import TaskElement from "./TaskElement.tsx";

interface Task {
    taskName: string,
    id: number,
    color: string
}

export default function TodoList() {

    const [globalId, setGlobalId] = useState(0);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskName, setTaskName] = useState("");
    const db = useRef<IDBDatabase | null>(null);

    //TODO: proper error handling
    useEffect(() => {
        const IDBOpenRequest = indexedDB.open("todolist", 7);
        IDBOpenRequest.onupgradeneeded = () => {
            db.current = IDBOpenRequest.result;
            db.current.deleteObjectStore("tasks");
            const objectStore = db.current.createObjectStore("tasks", {keyPath: "id", autoIncrement: true});
            objectStore.transaction.oncomplete = () => {
                tasks.forEach((task) => {
                    objectStore.add(task);
                })
            }
        }
        IDBOpenRequest.onerror = () => {
            console.log("Error loading database " + IDBOpenRequest.error);
        }
        IDBOpenRequest.onsuccess = async () => {
            db.current = IDBOpenRequest.result;
            const store = db.current.transaction("tasks", "readonly").objectStore("tasks");
            const getAllRequest = store.getAll();
            getAllRequest.onsuccess = () => {
                const dbEntries = getAllRequest.result;
                const lastIndex = dbEntries.length !== 0 ? dbEntries.length : 0;
                if (lastIndex !== 0) {
                    setGlobalId(dbEntries[lastIndex - 1].id + 1);
                }
            }
            getDataFromDB(db.current);
            console.log("Database loaded");
        }
    }, []);

    function getDataFromDB(database:IDBDatabase) {
        const objStore = database.transaction("tasks").objectStore("tasks");
        const request = objStore.getAll();
        let dbTasks:Task[] = [];
        request.onerror = () => {
            console.log("error ocurred " + request.error);
        }
        request.onsuccess = () => {
            console.log(request.result);
            dbTasks = request.result;
            setTasks(dbTasks);
            return request.result;
        }
        return dbTasks;
    }

    function getObjectStore(storeName:string, mode:IDBTransactionMode|undefined) {
        const transaction = db.current!.transaction(storeName, mode);
        console.log(transaction);
        return transaction.objectStore(storeName);
    }

    function handleTaskNameChange(e:ChangeEvent<HTMLInputElement>) {
        setTaskName(e.target.value);
    }

    function handleTaskAdd() {
        const newTask = {
            taskName: taskName,
            id: globalId,
            color: "#B8F3FF"
        };

        setGlobalId(id => id + 1)
        setTasks(t => [...t, newTask]);
        setTaskName("");

        const objStore = getObjectStore("tasks", "readwrite");
        const request = objStore.add(newTask);
        request.onsuccess = () => {
            console.log("success!");
        }
        request.onerror = () => {
            console.log("failed " + request.error);
        }
    }

    function handleTaskRemove(i: number) {
        const id = tasks[i].id;
        setTasks(tasks.filter((_, index) => index !== i));
        const objStore = getObjectStore("tasks", "readwrite");
        const request = objStore.delete(id);
        request.onsuccess = () => {
            console.log("successfully deleted!");
        }
        request.onerror = () => {
            console.log("error occured " + request.error);
        }
    }

    return (
        <div className="text-primary-text font-primary text-xl text-center mt-10">
            <ul>
                {tasks.map((task, index) => (
                    <TaskElement key={index} taskName={task.taskName} index={index} color={task.color} removeTask={handleTaskRemove}/>
                ))}
            </ul>
            <div className="mt-10">
                <input name="task-name-input" className="text-center m-3 p-5 outline-light-bg border-solid outline-2 rounded-4xl
            focus:outline-primary-text focus:scale-105 transition-all" type="text" onChange={handleTaskNameChange} value={taskName} placeholder="Enter Task Name" />
                <StylishButton text="Add Task" callback={handleTaskAdd} />
            </div>

        </div>
    )
}