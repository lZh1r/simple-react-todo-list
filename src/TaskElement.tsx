import StylishButton from "./StylishButton.tsx";
import {ChangeEvent, useState} from "react";

type Callback = (index: number) => void;

export default function TaskElement({ taskName, index, color, removeTask}:
{ taskName: string, index: number, color: string, removeTask: Callback }) {

    const [col, setCol] = useState(color);

    function handleColorChange(e: ChangeEvent<HTMLInputElement>) {
        setCol(e.target.value);
    }

    return (
        <li className="flex justify-between p-4 mt-3 mb-3 lg:mr-50 lg:ml-50 sm:mr-15 sm:ml-15 xs:ml-15 outline-light-bg border-solid outline-2
                    hover:bg-light-bg rounded-4xl" key={index}>
            <input type="color" value={col} onChange={handleColorChange}
                   className="w-12 h-12 self-center outline-none cursor-pointer [&::-webkit-color-swatch]:rounded-full"/>
            <p style={{color: col}} className="self-center text-wrap">{taskName}</p>
            <StylishButton text="Remove" callback={() => removeTask(index)}/>
        </li>
    )
}