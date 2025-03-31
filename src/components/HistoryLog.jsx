import "./calculator.css"

const HistoryLog = ({ history, onClose, setExpression, setResult }) => {
  const handleCalculation = (expression, result) => {
    setExpression(expression)
    setResult(result.toString())
  }

  return (
    <div className="history-log">
      <button className="close-btn" onClick={() => onClose(false)}>
        X
      </button>
      <h3>Calculation History</h3>

      <ul>
        {history.length === 0 ? (
          <li className="history-empty">No calculation history</li>
        ) : (
          history.map((item, index) => (
            <li key={index} onClick={() => handleCalculation(item.expression, item.result)} className="history-item">
              <div className="history-expression">{item.expression}</div>
              <div className="history-result">{item.result}</div>
            </li>
          ))
        )}
      </ul>

      {history.length > 0 && (
        <div className="history-footer">
          <button className="clear-history-btn" onClick={() => onClose(true)}>
            Clear History
          </button>
        </div>
      )}
    </div>
  )
}

export default HistoryLog