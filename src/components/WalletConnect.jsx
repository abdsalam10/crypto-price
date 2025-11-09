import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect } from 'react';
import './WalletConnect.css';

function WalletConnect({ onWalletConnected }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  // Debug: Log connector status
  useEffect(() => {
    console.log('Connectors available:', connectors);
    console.log('Is connected:', isConnected);
    console.log('Address:', address);
    if (error) {
      console.error('Connection error:', error);
    }
  }, [connectors, isConnected, address, error]);

  // Notify parent when wallet connects
  useEffect(() => {
    if (isConnected && address && onWalletConnected) {
      onWalletConnected(address);
    }
  }, [isConnected, address, onWalletConnected]);

  const handleConnect = () => {
    console.log('Attempting to connect with connector:', connectors[0]);
    if (connectors[0]) {
      try {
        connect({ connector: connectors[0] });
      } catch (err) {
        console.error('Connect error:', err);
      }
    } else {
      console.error('No connectors available');
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
        disabled={isPending || connectors.length === 0}
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
      {error && <p className="wallet-error">{error.message}</p>}
      {connectors.length === 0 && <p className="wallet-error">No wallet connector available</p>}
    </div>
  );
}

export default WalletConnect;
