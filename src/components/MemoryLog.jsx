import "./calculator.css"

const MemoryLog = ({ memoryList, setMemoryList, onClose, setExpression, result, expression }) => {
  return (
    <div className="memory-log">
      <button className="close-btn" onClick={onClose}>
        X
      </button>
      <h3>Memory Log</h3>

      <ul>
        {memoryList.length === 0 ? (
          <li className="memory-empty">No stored memory</li>
        ) : (
          memoryList.map((mem, index) => (
            <li key={index}>
              <strong>{mem}</strong>
              <div className="memory-controls">
                <button onClick={() => setExpression(mem.toString())}>MR</button>
                <button
                  onClick={() =>
                    setMemoryList((prev) =>
                      prev.map((val, i) => (i === index ? val + Number.parseFloat(result || expression || "0") : val)),
                    )
                  }
                >
                  M+
                </button>
                <button
                  onClick={() =>
                    setMemoryList((prev) =>
                      prev.map((val, i) => (i === index ? val - Number.parseFloat(result || expression || "0") : val)),
                    )
                  }
                >
                  M-
                </button>
                <button onClick={() => setMemoryList((prev) => prev.filter((_, i) => i !== index))}>MC</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default MemoryLog

