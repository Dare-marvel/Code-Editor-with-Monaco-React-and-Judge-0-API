import React from "react";
import { getOutput } from "./utils/GetOutput";

const CodeOutput = ({ output, status }) => {
    return (
        <>
            <label className="flex text-lg border-b-2 border-gray-200 pb-4  text-gray-600">
                Output:{" "}
                {status && (
                    <span
                        className={`ml-2 block w-28 font-bold text-base text-center rounded-full text-white p-1 ${status === "Running" ? "bg-[#0088cc]" : "bg-[#5cb85c]"
                            } `}>
                        {status}
                    </span>
                )}
            </label>
            <div className="w-full h-full flex flex-col p-2 overflow-y-auto">
                {output ? <>{getOutput(output)}</> : null}
            </div>
        </>
    );
};

export default CodeOutput;