import { useAccount, useConnect, useDisconnect } from 'wagmi';
import './WalletConnect.css';

function WalletConnect({ onWalletConnected }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // Notify parent when wallet connects
  if (isConnected && address && onWalletConnected) {
    onWalletConnected(address);
  }

  const handleConnect = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] });
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="wallet-connected">
        <div className="wallet-icon">🔗</div>
        <div className="wallet-info">
          <span className="wallet-label">Connected</span>
          <span className="wallet-address">{formatAddress(address)}</span>
        </div>
        <button onClick={() => disconnect()} className="disconnect-btn" title="Disconnect">
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-connect-container">
      <button 
        className="connect-wallet-btn" 
        onClick={handleConnect}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <span className="spinner"></span>
            Connecting...
          </>
        ) : (
          <>
            <span className="wallet-icon-btn">👛</span>
            Connect Wallet
          </>
        )}
      </button>
    </div>
  );
}

export default WalletConnect;
