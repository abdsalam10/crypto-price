import { useState } from 'react';
import './CryptoList.css';
import CryptoCard from './CryptoCard';

function CryptoList({ cryptoData }) {
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  if (cryptoData.length === 0) {
    return (
      <div className="empty-state">
        <p>No cryptocurrencies found</p>
      </div>
    );
  }

  return (
    <>
      <div className="crypto-list">
        <div className="list-header">
          <div className="rank-col">#</div>
          <div className="name-col">Name</div>
          <div className="price-col">Price</div>
          <div className="change-col">24h</div>
        </div>
        {cryptoData.map((crypto) => (
          <CryptoCard
            key={crypto.id}
            crypto={crypto}
            onClick={() => setSelectedCrypto(crypto)}
          />
        ))}
      </div>

      {selectedCrypto && (
        <div className="modal-overlay" onClick={() => setSelectedCrypto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCrypto(null)}>✕</button>
            <div className="modal-header">
              <img src={selectedCrypto.image} alt={selectedCrypto.name} />
              <div>
                <h2>{selectedCrypto.name}</h2>
                <span className="symbol">{selectedCrypto.symbol.toUpperCase()}</span>
              </div>
            </div>
            <div className="modal-body">
              <div className="stat-row">
                <span className="label">Current Price</span>
                <span className="value">${selectedCrypto.current_price.toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span className="label">Market Cap</span>
                <span className="value">${(selectedCrypto.market_cap / 1e9).toFixed(2)}B</span>
              </div>
              <div className="stat-row">
                <span className="label">24h Volume</span>
                <span className="value">${(selectedCrypto.total_volume / 1e9).toFixed(2)}B</span>
              </div>
              <div className="stat-row">
                <span className="label">24h Change</span>
                <span className={`value ${selectedCrypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                  {selectedCrypto.price_change_percentage_24h >= 0 ? '+' : ''}
                  {selectedCrypto.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
              <div className="stat-row">
                <span className="label">Market Cap Rank</span>
                <span className="value">#{selectedCrypto.market_cap_rank}</span>
              </div>
              {selectedCrypto.high_24h && (
                <div className="stat-row">
                  <span className="label">24h High</span>
                  <span className="value">${selectedCrypto.high_24h.toLocaleString()}</span>
                </div>
              )}
              {selectedCrypto.low_24h && (
                <div className="stat-row">
                  <span className="label">24h Low</span>
                  <span className="value">${selectedCrypto.low_24h.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CryptoList;
