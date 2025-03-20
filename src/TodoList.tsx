import {ChangeEvent, useState} from "react";
import StylishButton from "./StylishButton.tsx";
import TaskElement from "./TaskElement.tsx";

export default function TodoList() {

    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState("");
    const color = "#B8F3FF";

    function handleTaskNameChange(e:ChangeEvent<HTMLInputElement>) {
        setTaskName(e.target.value);
    }

    function handleTaskAdd() {
        const newTask = taskName;
        // @ts-expect-error TODO: fix this
        setTasks(t => [...t, newTask]);
        setTaskName("");
    }

    function handleTaskRemove(i: number) {
        setTasks(tasks.filter((_, index) => index !== i));
    }

    return (
        <div className="text-primary-text font-primary text-xl text-center mt-10">
            <ul>
                {tasks.map((name, index) => (
                    <TaskElement taskName={name} index={index} color={color} removeTask={handleTaskRemove}/>
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