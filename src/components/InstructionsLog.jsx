import "./calculator.css"

const InstructionsLog = ({ onClose }) => {
  return (
    <div className="instructions-log">
      <button className="close-btn" onClick={onClose}>
        X
      </button>
      <h3>Calculator Instructions</h3>

      <div className="instructions-content">
        <h4>Basic Operations</h4>
        <ul>
          <li>
            <strong>+, -, *, /</strong>: Basic arithmetic operations
          </li>
          <li>
            <strong>=</strong>: Calculate result
          </li>
          <li>
            <strong>C</strong>: Clear all
          </li>
          <li>
            <strong>DEL</strong>: Delete last character
          </li>
        </ul>

        <h4>Scientific Functions</h4>
        <ul>
          <li>
            <strong>sin, cos, tan</strong>: Trigonometric functions
          </li>
          <li>
            <strong>SHIFT</strong>: Toggle inverse trigonometric functions (sin⁻¹, cos⁻¹, tan⁻¹)
          </li>
          <li>
            <strong>HYP</strong>: Toggle hyperbolic functions (sinh, cosh, tanh)
          </li>
          <li>
            <strong>log</strong>: Logarithm base 10
          </li>
          <li>
            <strong>ln</strong>: Natural logarithm
          </li>
          <li>
            <strong>abs</strong>: Absolute value
          </li>
          <li>
            <strong>%</strong>: Percentage
          </li>
          <li>
            <strong>Deg/Rad</strong>: Toggle between degrees and radians
          </li>
        </ul>

        <h4>Permutation and Combination</h4>
        <ul>
          <li>
            <strong>nPr</strong>: Permutation - enter first number, press nPr, enter second number, press =
          </li>
          <li>
            <strong>nCr</strong>: Combination - enter first number, press nCr, enter second number, press =
          </li>
        </ul>

        <h4>Memory Functions</h4>
        <ul>
          <li>
            <strong>MS</strong>: Memory Store - store current value in memory
          </li>
          <li>
            <strong>MR</strong>: Memory Recall - recall last stored value
          </li>
          <li>
            <strong>M+</strong>: Memory Add - add current value to memory
          </li>
          <li>
            <strong>M-</strong>: Memory Subtract - subtract current value from memory
          </li>
          <li>
            <strong>MC</strong>: Memory Clear - clear all memory
          </li>
        </ul>

        <h4>History</h4>
        <p>Click the History button to view your calculation history. Click on any previous calculation to reuse it.</p>
      </div>
    </div>
  )
}

export default InstructionsLog

