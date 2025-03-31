import { useState, useEffect } from "react"
import * as math from "mathjs"
import MemoryLog from "./MemoryLog.jsx"
import HistoryLog from "./HistoryLog.jsx"
import InstructionsLog from "./InstructionsLog.jsx"

const Calculator = () => {
  const [expression, setExpression] = useState("")
  const [result, setResult] = useState("")
  const [isInverseTrig, setIsInverseTrig] = useState(false)
  const [isHyperbolic, setIsHyperbolic] = useState(false)
  const [calculated, setCalculated] = useState(false)
  const [history, setHistory] = useState([])
  const [memoryList, setMemoryList] = useState([])
  const [isMemoryOpen, setIsMemoryOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false)
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState(null)
  const [isDegreeMode, setIsDegreeMode] = useState(false)
  const [internalExpression, setInternalExpression] = useState("")

  const toRadians = (deg) => deg * (Math.PI / 180)
  const toDegrees = (rad) => rad * (180 / Math.PI)

  const permutation = (n, r) => {
    if (n < r) return 0
    return math.factorial(n) / math.factorial(n - r)
  }

  const combination = (n, r) => {
    if (n < r) return 0
    return math.factorial(n) / (math.factorial(r) * math.factorial(n - r))
  }

  const handleButtonClick = (value) => {
    if (value === "=" || value === "Enter") {
      try {
        if (expression.trim() === "") return

        if (expression.includes(" nPr ") || expression.includes(" nCr ")) {
          const parts = expression.split(" ")
          if (parts.length === 3) {
            const n = Number(parts[0])
            const func = parts[1]
            const r = Number(parts[2])

            let calculatedValue = 0

            if (func === "nPr") {
              calculatedValue = permutation(n, r)
            } else if (func === "nCr") {
              calculatedValue = combination(n, r)
            }

            setResult(calculatedValue.toString())
            setCalculated(true)
            setHistory((prev) => [...prev, { expression, result: calculatedValue }])
            return
          }
        }

        const formattedExpression = expression
          .replace(/log\(/g, "log10(")
          .replace(/ln\(/g, "log(")
          .replace(/√(\d+(\.\d+)?)/g, "sqrt($1)")
          .replace(/π/g, `${Math.PI}`)
          .replace(/(\d+)\s*mod\s*(\d+)/g, "($1 % $2)")
          .replace(/(\d+)!/g, "factorial($1)")

        let evaluatedResult = math.evaluate(formattedExpression)
        if (isDegreeMode && expression.match(/(sin⁻¹|cos⁻¹|tan⁻¹)/)) {
          evaluatedResult = toDegrees(evaluatedResult)
        }
        setResult(evaluatedResult.toString())
        setCalculated(true)
        setHistory((prev) => [...prev, { expression, result: evaluatedResult }])
      } catch (error) {
        console.error("Calculation error:", error)
        setResult("Error")
        setCalculated(true)
      }
    } else if (value === "C") {
      setExpression("")
      setResult("")
      setCalculated(false)
      setInternalExpression("")
    } else if (value === "DEL" || value === "Backspace") {
      setExpression((prev) => (prev.length > 1 ? prev.slice(0, -1) : ""))
      setInternalExpression((prev) => (prev.length > 1 ? prev.slice(0, -1) : ""))
    } else if (
      [
        "sin",
        "cos",
        "tan",
        "sin⁻¹",
        "cos⁻¹",
        "tan⁻¹",
        "sinh",
        "cosh",
        "tanh",
        "sinh⁻¹",
        "cosh⁻¹",
        "tanh⁻¹",
        "log",
        "ln",
        "abs",
        "%",
      ].includes(value)
    ) {
      const originalInput = Number.parseFloat(calculated ? result : expression)
      let number = originalInput

      if (
        isDegreeMode &&
        !["sin⁻¹", "cos⁻¹", "tan⁻¹", "sinh⁻¹", "cosh⁻¹", "tanh⁻¹", "log", "ln", "abs", "%"].includes(value)
      ) {
        number = toRadians(number)
      }

      let resultValue = "Error"

      if (!isNaN(number)) {
        if (value === "sin") resultValue = Math.sin(number)
        if (value === "cos") resultValue = Math.cos(number)
        if (value === "tan") resultValue = Math.tan(number)
        if (value === "sinh") resultValue = Math.sinh(number)
        if (value === "cosh") resultValue = Math.cosh(number)
        if (value === "tanh") resultValue = Math.tanh(number)
        if (value === "log") resultValue = Math.log10(number)
        if (value === "ln") resultValue = Math.log(number)
        if (value === "abs") resultValue = Math.abs(number)
        if (value === "%") resultValue = number / 100
        if (value === "sin⁻¹" && number >= -1 && number <= 1) resultValue = Math.asin(number)
        if (value === "cos⁻¹" && number >= -1 && number <= 1) resultValue = Math.acos(number)
        if (value === "tan⁻¹") resultValue = Math.atan(number)
        if (value === "sinh⁻¹") resultValue = Math.asinh(number)
        if (value === "cosh⁻¹" && number >= 1) resultValue = Math.acosh(number)
        if (value === "tanh⁻¹" && number > -1 && number < 1) resultValue = Math.atanh(number)

        if (isDegreeMode && ["sin⁻¹", "cos⁻¹", "tan⁻¹"].includes(value)) {
          resultValue = toDegrees(resultValue)
        }
      }

      const displayExpression = `${value}(${originalInput})`

      setResult(resultValue.toString())
      setExpression(displayExpression)
      setInternalExpression(displayExpression)
      setCalculated(true)

      setHistory((prev) => [
        ...prev,
        {
          expression: displayExpression,
          result: resultValue,
        },
      ])
    } else if (value === "nPr" || value === "nCr") {
      const currentValue = calculated ? result : expression

      setExpression(`${currentValue} ${value} `)

      setInternalExpression(`${value}(${currentValue},`)

      setResult("")
      setCalculated(false)
    } else if (value === "MS") {
      const memoryValue = Number.parseFloat(result || expression || "0")
      if (!isNaN(memoryValue)) {
        setMemoryList((prev) => [...prev, memoryValue])
      }
    } else if (value === "MR") {
      if (memoryList.length > 0) {
        setExpression(memoryList[memoryList.length - 1].toString())
        setInternalExpression(memoryList[memoryList.length - 1].toString())
      }
    } else if (value === "M+") {
      if (selectedMemoryIndex !== null && memoryList[selectedMemoryIndex] !== undefined) {
        setMemoryList((prev) => {
          const updatedMemory = [...prev]
          updatedMemory[selectedMemoryIndex] += Number.parseFloat(result || expression || "0")
          return updatedMemory
        })
      }
    } else if (value === "M-") {
      if (selectedMemoryIndex !== null && memoryList[selectedMemoryIndex] !== undefined) {
        setMemoryList((prev) => {
          const updatedMemory = [...prev]
          updatedMemory[selectedMemoryIndex] -= Number.parseFloat(result || expression || "0")
          return updatedMemory
        })
      }
    } else if (value === "MC") {
      setMemoryList([])
    } else if (value === "SHIFT") {
      setIsInverseTrig(!isInverseTrig)
    } else if (value === "HYP") {
      setIsHyperbolic(!isHyperbolic)
    } else {
      if (calculated) {
        if (["+", "-", "*", "/", "^", "mod"].includes(value)) {
          setExpression(result + value)
          setInternalExpression(result + value)
        } else {
          setExpression(value)
          setInternalExpression(value)
        }
        setResult("")
        setCalculated(false)
      } else {
        setExpression((prev) => prev + value)
        setInternalExpression((prev) => prev + value)
      }
    }
  }

  const handleHistoryClose = (clearHistory = false) => {
    if (clearHistory) {
      setHistory([])
    }
    setIsHistoryOpen(false)
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key
      if (key.startsWith("F") && !isNaN(key.slice(1))) return
      if (/[\d+\-*/().!=,]/.test(key)) {
        handleButtonClick(key)
      } else if (key === "Enter") {
        handleButtonClick("=")
      } else if (key === "Backspace") {
        handleButtonClick("DEL")
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [])

  useEffect(() => {
    const memoryLog = document.querySelector(".memory-log")
    const historyLog = document.querySelector(".history-log")
    const instructionsLog = document.querySelector(".instructions-log")

    if (memoryLog && historyLog && instructionsLog) {
      if (isMemoryOpen && isHistoryOpen) {
        memoryLog.classList.add("with-history")
        historyLog.classList.add("with-memory")
      } else {
        memoryLog?.classList.remove("with-history")
        historyLog?.classList.remove("with-memory")
      }

      if (isMemoryOpen && isInstructionsOpen) {
        memoryLog.classList.add("with-instructions")
        instructionsLog.classList.add("with-memory")
      } else {
        memoryLog?.classList.remove("with-instructions")
        instructionsLog?.classList.remove("with-memory")
      }

      if (isHistoryOpen && isInstructionsOpen) {
        historyLog.classList.add("with-instructions")
        instructionsLog.classList.add("with-history")
      } else {
        historyLog?.classList.remove("with-instructions")
        instructionsLog?.classList.remove("with-history")
      }

      if (isHistoryOpen && !isMemoryOpen && !isInstructionsOpen) {
        historyLog.classList.add("solo")
      } else {
        historyLog?.classList.remove("solo")
      }

      if (isInstructionsOpen && !isMemoryOpen && !isHistoryOpen) {
        instructionsLog.classList.add("solo")
      } else {
        instructionsLog?.classList.remove("solo")
      }
    }

    if (isMemoryOpen || isHistoryOpen || isInstructionsOpen) {
      document.body.classList.add("panels-open")
    } else {
      document.body.classList.remove("panels-open")
    }
  }, [isMemoryOpen, isHistoryOpen, isInstructionsOpen])

  const getButtonClass = (btn) => {
    if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."].includes(btn)) {
      return "btn number"
    } else if (["+", "-", "*", "/", "^", "mod", ",", "(", ")"].includes(btn)) {
      return "btn operation"
    } else if (
      [
        "sin",
        "cos",
        "tan",
        "sin⁻¹",
        "cos⁻¹",
        "tan⁻¹",
        "sinh",
        "cosh",
        "tanh",
        "sinh⁻¹",
        "cosh⁻¹",
        "tanh⁻¹",
        "log",
        "ln",
        "√",
        "!",
        "π",
        "SHIFT",
        "HYP",
        "abs",
        "%",
        "nPr",
        "nCr",
      ].includes(btn)
    ) {
      return "btn function"
    } else if (["MS", "MR", "M+", "M-", "MC"].includes(btn)) {
      return "btn memory"
    } else if (btn === "=") {
      return "btn equals"
    } else if (["C", "DEL"].includes(btn)) {
      return "btn clear"
    } else {
      return "btn"
    }
  }

  const getTrigButtons = () => {
    if (isHyperbolic) {
      return isInverseTrig ? ["sinh⁻¹", "cosh⁻¹", "tanh⁻¹"] : ["sinh", "cosh", "tanh"]
    } else {
      return isInverseTrig ? ["sin⁻¹", "cos⁻¹", "tan⁻¹"] : ["sin", "cos", "tan"]
    }
  }

  const trigButtons = getTrigButtons()

  const buttons = [
    "Deg/Rad",
    "SHIFT",
    trigButtons[0],
    trigButtons[1],
    trigButtons[2],
    isInverseTrig ? "ln" : "log",
    "HYP",
    "(",
    ")",
    "abs",
    "%",
    "7",
    "8",
    "9",
    "/",
    "C",
    "4",
    "5",
    "6",
    "*",
    "nPr",
    "1",
    "2",
    "3",
    "-",
    "nCr",
    "0",
    ".",
    ",",
    "+",
    "=",
    "DEL",
    "MR",
    "MS",
  ]

  return (
    <div className="calculator">
      <div className="display">
        <input type="text" value={expression} readOnly placeholder="0" />
        <input type="text" value={result} readOnly />
      </div>
      <div className="mode-indicator">
        Mode: {isDegreeMode ? "Degrees" : "Radians"} |{isHyperbolic ? " Hyperbolic" : " Regular"} |
        {isInverseTrig ? " Inverse" : " Normal"}
      </div>

      {isMemoryOpen && (
        <MemoryLog
          memoryList={memoryList}
          setMemoryList={setMemoryList}
          onClose={() => setIsMemoryOpen(false)}
          setExpression={setExpression}
          result={result}
          expression={expression}
        />
      )}

      {isHistoryOpen && (
        <HistoryLog
          history={history}
          onClose={handleHistoryClose}
          setExpression={setExpression}
          setResult={setResult}
        />
      )}

      {isInstructionsOpen && <InstructionsLog onClose={() => setIsInstructionsOpen(false)} />}

      <div className="buttons">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={() => {
              if (btn === "Memory") {
                setIsMemoryOpen(true)
              } else if (btn === "Deg/Rad") {
                setIsDegreeMode((prevMode) => !prevMode)
              } else {
                handleButtonClick(btn)
              }
            }}
            className={getButtonClass(btn)}
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="panel-toggles">
        <button
          className={`panel-toggle-btn ${isMemoryOpen ? "active" : ""}`}
          onClick={() => setIsMemoryOpen(!isMemoryOpen)}
        >
          Memory
        </button>
        <button
          className={`panel-toggle-btn ${isHistoryOpen ? "active" : ""}`}
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
        >
          History
        </button>
        <button
          className={`panel-toggle-btn ${isInstructionsOpen ? "active" : ""}`}
          onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
        >
          Instructions
        </button>
      </div>
    </div>
  )
}

export default Calculator

