import { useEffect, useMemo, useState } from 'react'

function useWallet() {
  const [wallet, setWallet] = useState(null)
  const [balance, setBalance] = useState('0')
  const [addressInput, setAddressInput] = useState('')
  const [sendTo, setSendTo] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  const createWallet = () => {
    const random = crypto.getRandomValues(new Uint8Array(16))
    const seed = Array.from(random).map(b => b.toString(16).padStart(2, '0')).join('')
    const address = `EDUTY-${seed.slice(0, 12).toUpperCase()}`
    const privateKey = `PRV-${seed.slice(12).toUpperCase()}`
    setWallet({ address, privateKey })
    setAddressInput(address)
    setBalance('0')
    setMessage('New wallet created locally in your browser.')
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setMessage('Copied to clipboard.')
    } catch {
      setMessage('Copy failed.')
    }
  }

  const refreshBalance = async () => {
    if (!wallet) return
    setMessage('Balance refreshed.')
    setBalance('0.0000')
  }

  const send = () => {
    if (!wallet || !sendTo || !amount) {
      setMessage('Fill destination and amount.')
      return
    }
    setMessage(`Demo transaction prepared: ${amount} to ${sendTo}.`)
  }

  return {
    wallet,
    balance,
    addressInput,
    setAddressInput,
    sendTo,
    setSendTo,
    amount,
    setAmount,
    message,
    createWallet,
    copyToClipboard,
    refreshBalance,
    send
  }
}

export default function App() {
  const {
    wallet,
    balance,
    sendTo,
    setSendTo,
    amount,
    setAmount,
    message,
    createWallet,
    copyToClipboard,
    refreshBalance,
    send
  } = useWallet()

  useEffect(() => {
    document.title = 'Crypto E-Duty'
  }, [])

  const shortAddress = useMemo(() => {
    if (!wallet?.address) return ''
    return `${wallet.address.slice(0, 10)}...${wallet.address.slice(-4)}`
  }, [wallet])

  return (
    <div className="app-shell">
      <main className="app-card">
        <div className="hero">
          <p className="eyebrow">Open Source • Lightweight • Educational</p>
          <h1>Crypto E-Duty</h1>
          <p className="subtitle">
            A simple crypto wallet demo designed to be easy to understand for beginners.
          </p>
        </div>

        <section className="panel">
          <div className="panel-head">
            <h2>Your Wallet</h2>
            <button className="ghost-btn" onClick={createWallet}>Create wallet</button>
          </div>

          {!wallet ? (
            <div className="empty-state">
              <p>No wallet yet. Create one to begin.</p>
            </div>
          ) : (
            <>
              <div className="field">
                <label>Address</label>
                <div className="row">
                  <input readOnly value={shortAddress} />
                  <button className="ghost-btn" onClick={() => copyToClipboard(wallet.address)}>Copy</button>
                </div>
              </div>

              <div className="field">
                <label>Private key backup</label>
                <div className="row">
                  <input readOnly value="Hidden for demo safety" />
                  <button className="ghost-btn" onClick={() => copyToClipboard(wallet.privateKey)}>Copy</button>
                </div>
              </div>

              <div className="balance-box">
                <span>Balance</span>
                <strong>{balance} BTC</strong>
                <button className="primary-btn" onClick={refreshBalance}>Refresh</button>
              </div>
            </>
          )}
        </section>

        <section className="panel">
          <h2>Send Demo Transfer</h2>
          <div className="field">
            <label>Destination address</label>
            <input
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
              placeholder="Enter destination"
            />
          </div>
          <div className="field">
            <label>Amount</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0000"
              inputMode="decimal"
            />
          </div>
          <button className="primary-btn full" onClick={send}>Prepare transfer</button>
        </section>

        <section className="info-box">
          <h3>For beginners</h3>
          <p><strong>Wallet</strong> manages your keys.</p>
          <p><strong>Address</strong> is what you share to receive funds.</p>
          <p><strong>Private key</strong> must never be shared.</p>
        </section>

        {message && <p className="status">{message}</p>}
      </main>
    </div>
  )
}