import React from "react";
import "./calculator.css";

const MemoryLog = ({ memoryList, setMemoryList, onClose, setExpression, result, expression }) => {
  return (
    <div className="memory-log">
      <h3>Memory Log</h3>
      <button className="close-btn" onClick={onClose}>X</button>

      <ul>
        {memoryList.length === 0 ? (
          <li>No stored memory</li>
        ) : (
          memoryList.map((mem, index) => (
            <li key={index}>
              <strong>{mem}</strong>
              {/* Use stored value in calculation (MR) */}
              <button onClick={() => setExpression(mem.toString())}>MR</button>
              {/* Add the current result or expression to the memory */}
              <button
                onClick={() =>
                  setMemoryList((prev) =>
                    prev.map((val, i) =>
                      i === index ? val + parseFloat(result || expression || "0") : val
                    )
                  )
                }
              >
                M+
              </button>
              {/* Subtract the current result or expression from the memory */}
              <button
                onClick={() =>
                  setMemoryList((prev) =>
                    prev.map((val, i) =>
                      i === index ? val - parseFloat(result || expression || "0") : val
                    )
                  )
                }
              >
                M-
              </button>
              {/* Remove a specific memory entry */}
              <button onClick={() => setMemoryList((prev) => prev.filter((_, i) => i !== index))}>
                MC
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MemoryLog;
