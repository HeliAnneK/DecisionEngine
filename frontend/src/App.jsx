import { useState } from 'react'
import './App.css'

export default function App() {
  const [personalCode, setPersonalCode] = useState('')
  const [loanAmount, setLoanAmount] = useState(5000)
  const [loanPeriod, setLoanPeriod] = useState(30)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('http://localhost:8080/api/loan/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalCode,
          loanAmount: Number(loanAmount),
          loanPeriod: Number(loanPeriod),
        }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Request failed.')
      else setResult(data)
    } catch {
      setError('Could not reach the server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <div className="card">
        <h1>Loan Decision Engine</h1>

        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="personalCode">Personal code</label>
            <input
              id="personalCode"
              type="text"
              placeholder="e.g. 49002010976"
              value={personalCode}
              onChange={(e) => setPersonalCode(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <div className="label-row">
              <label htmlFor="loanAmount">Loan amount</label>
              <input
                className="number-input"
                type="number"
                min={2000}
                max={10000}
                step={1}
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                onBlur={() => setLoanAmount(Math.min(10000, Math.max(2000, Number(loanAmount) || 2000)))}
              />
            </div>
            <input
              id="loanAmount"
              type="range"
              min={2000}
              max={10000}
              step={100}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
            <div className="range-labels">
              <span>2 000 €</span>
              <span>10 000 €</span>
            </div>
          </div>

          <div className="field">
            <div className="label-row">
              <label htmlFor="loanPeriod">Loan period</label>
              <input
                className="number-input"
                type="number"
                min={12}
                max={60}
                step={1}
                value={loanPeriod}
                onChange={(e) => setLoanPeriod(e.target.value)}
                onBlur={() => setLoanPeriod(Math.min(60, Math.max(12, Number(loanPeriod) || 12)))}
              />
            </div>
            <input
              id="loanPeriod"
              type="range"
              min={12}
              max={60}
              step={1}
              value={loanPeriod}
              onChange={(e) => setLoanPeriod(Number(e.target.value))}
            />
            <div className="range-labels">
              <span>12 months</span>
              <span>60 months</span>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Calculating...' : 'Get Decision'}
          </button>
        </form>

        {error && <div className="result error">{error}</div>}

        {result && (
          <div className={`result ${result.approved ? 'approved' : 'rejected'}`}>
            <p className="verdict">{result.approved ? 'Approved' : 'Rejected'}</p>
            {result.approved ? (
              <div className="details">
                <div className="detail-item">
                  <span>Amount</span>
                  <strong>{result.approvedAmount.toLocaleString()} €</strong>
                </div>
                <div className="detail-item">
                  <span>Period</span>
                  <strong>{result.approvedPeriod} months</strong>
                </div>
              </div>
            ) : (
              <p className="detail-text">No suitable offer could be found for this profile.</p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
