import {MouseEventHandler} from "react";

export default function StylishButton({text, callback}:{text: string, callback: MouseEventHandler}) {
    return (
        <button className="outline-button-accent bg-light-bg rounded-4xl border-solid outline-2 p-3 m-3
            cursor-pointer hover:scale-105 hover:outline-primary-text transition-all" onClick={callback}>
            {text}
        </button>
    )
}