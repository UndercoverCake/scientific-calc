import React, { useState, useEffect } from "react";
import * as math from "mathjs";
import MemoryLog from "./MemoryLog.jsx"; 

const Calculator = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [isInverseTrig, setIsInverseTrig] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [history, setHistory] = useState([]); 
  const [memoryList, setMemoryList] = useState([]); 
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState(null);
  const [isDegreeMode, setIsDegreeMode] = useState(false); 
  const toRadians = (deg) => deg * (Math.PI / 180);
  const toDegrees = (rad) => rad * (180 / Math.PI);  

  const handleButtonClick = (value) => {
    if (value === "=" || value === "Enter") {
      try {
        if (expression.trim() === "") return;
        const formattedExpression = expression
          .replace(/log\(/g, "log10(") // log → base 10 log
          .replace(/ln\(/g, "log(") // Natural log
          .replace(/√(\d+(\.\d+)?)/g, "sqrt($1)")
          .replace(/π/g, `${Math.PI}`)
          .replace(/(\d+)\s*mod\s*(\d+)/g, "($1 % $2)")
          .replace(/(\d+)!/g, "factorial($1)")
          let evaluatedResult = math.evaluate(formattedExpression);
          if (isDegreeMode && expression.match(/(sin⁻¹|cos⁻¹|tan⁻¹)/)) {
            evaluatedResult = toDegrees(evaluatedResult); 
          }          
        setResult(evaluatedResult.toString());
        setCalculated(true);
        setHistory((prev) => [...prev, { expression, result: evaluatedResult }]);
      } catch {
        setResult("Error");
        setCalculated(true);
      }
    } else if (value === "C") {
      setExpression("");
      setResult("");
      setCalculated(false);
    } else if (value === "DEL" || value === "Backspace") {
      setExpression((prev) => (prev.length > 1 ? prev.slice(0, -1) : ""));
    } 
    else if (["sin", "cos", "tan", "sin⁻¹", "cos⁻¹", "tan⁻¹"].includes(value)) {
      let originalInput = parseFloat(calculated ? result : expression);
      let number = originalInput;

      // Ensure correct handling when switching between degree/radian modes
      if (isDegreeMode && !["sin⁻¹", "cos⁻¹", "tan⁻¹"].includes(value)) {
        number = toRadians(number);
      }
      
      let resultValue = "Error";
      
      if (!isNaN(number)) {
          
          if (value === "sin") resultValue = Math.sin(number);
          if (value === "cos") resultValue = Math.cos(number);
          if (value === "tan") resultValue = Math.tan(number);
      
          // Inverse trig functions (asin, acos, atan) should return degrees if in degree mode
          if (value === "sin⁻¹" && number >= -1 && number <= 1) 
              resultValue = Math.asin(number);
          if (value === "cos⁻¹" && number >= -1 && number <= 1) 
              resultValue = Math.acos(number);
          if (value === "tan⁻¹") 
              resultValue = Math.atan(number);
      
          // Convert back to degrees only for inverse functions
          if (isDegreeMode && ["sin⁻¹", "cos⁻¹", "tan⁻¹"].includes(value)) {
              resultValue = toDegrees(resultValue);
          }
      }
      console.log(`Input before conversion: ${number}, Mode: ${isDegreeMode ? "Degrees" : "Radians"}`);
      console.log(`Computed ${value}(${number}) = ${resultValue}`); // Debugging
  
      setResult(resultValue.toString());
      setExpression(`${value}(${originalInput})`);  
      setCalculated(true);
    }  
    else if (value === "MS") {
      const memoryValue = parseFloat(result || expression || "0");
      if (!isNaN(memoryValue)) {
        setMemoryList((prev) => [...prev, memoryValue]);
      }
    } else if (value === "MR") {
      if (memoryList.length > 0) {
        setExpression(memoryList[memoryList.length - 1].toString());
      }
    } else if (value === "M+") {
      if (selectedMemoryIndex !== null && memoryList[selectedMemoryIndex] !== undefined) {
        setMemoryList((prev) => {
          const updatedMemory = [...prev];
          updatedMemory[selectedMemoryIndex] += parseFloat(result || expression || "0");
          return updatedMemory;
        });
      }
    } 
    else if (value === "M-") {
      if (selectedMemoryIndex !== null && memoryList[selectedMemoryIndex] !== undefined) {
        setMemoryList((prev) => {
          const updatedMemory = [...prev];
          updatedMemory[selectedMemoryIndex] -= parseFloat(result || expression || "0");
          return updatedMemory;
        });
      }
    }    
    else if (value === "MC") {
      setMemoryList([]);
    } 

    else if (value === "INV") {
      setIsInverseTrig(!isInverseTrig);
    } else {
      if (calculated) {
        if (["+", "-", "*", "/", "^", "mod"].includes(value)) {
          setExpression(result + value);
        } else {
          setExpression(value);
        }
        setResult("");
        setCalculated(false);
      } else {
        setExpression((prev) => prev + value);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      if (key.startsWith("F") && !isNaN(key.slice(1))) return;
      if (/[\d+\-*/().!=]/.test(key)) {
        handleButtonClick(key);
      } else if (key === "Enter") {
        handleButtonClick("=");
      } else if (key === "Backspace") {
        handleButtonClick("DEL");
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const buttons = [
    "Deg/Rad",
    "INV", isInverseTrig ? "sin⁻¹" : "sin", isInverseTrig ? "cos⁻¹" : "cos", isInverseTrig ? "tan⁻¹" : "tan", isInverseTrig ? "ln" : "log",
    "(", ")", "√", "^", "mod",
    "7", "8", "9", "/", "C",
    "4", "5", "6", "*", "π",
    "1", "2", "3", "-",
    "0", ".", "!", "+", "=",
    "DEL", "MR", "MS",
    "Memory"
  ];

  return (
    <div className="calculator">
      <div className="display">
        <input type="text" value={expression} readOnly placeholder="0" />
        <input type="text" value={result} readOnly />
      </div>
      <div className="mode-indicator">
      Mode: {isDegreeMode ? "Degrees" : "Radians"}
    </div>

      {/* ✅ Memory Log Component (Replaces inline memory display) */}
      {isMemoryOpen && (
      <MemoryLog 
        memoryList={memoryList} 
        setMemoryList={setMemoryList} 
        onClose={() => setIsMemoryOpen(false)}
        setExpression={setExpression} // Enables MR to work properly
        result={result} // ✅ Pass the current result
        expression={expression} // ✅ Pass the current expression
      />
     )}


      <div className="buttons">
        {buttons.map((btn, index) => (
          <button 
            key={index} 
            onClick={() => {
              if (btn === "Memory") {
                setIsMemoryOpen(true);
              } else if (btn === "Deg/Rad") {
                setIsDegreeMode((prevMode) => !prevMode); // Toggle degree/radian mode
              } else {
                handleButtonClick(btn);
              }
            }}            
            className="btn"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>

  );
};

export default Calculator;
