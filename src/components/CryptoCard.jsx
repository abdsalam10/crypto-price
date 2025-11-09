import './CryptoCard.css';

function CryptoCard({ crypto, onClick }) {
  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(6)}`;
  };

  const formatChange = (change) => {
    if (!change) return '0.00%';
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const isPositive = crypto.price_change_percentage_24h >= 0;

  return (
    <div className="crypto-card" onClick={onClick}>
      <div className="rank">{crypto.market_cap_rank}</div>
      <div className="crypto-info">
        <img src={crypto.image} alt={crypto.name} className="crypto-icon" />
        <div className="crypto-details">
          <span className="crypto-name">{crypto.name}</span>
          <span className="crypto-symbol">{crypto.symbol.toUpperCase()}</span>
        </div>
      </div>
      <div className="crypto-price">
        {formatPrice(crypto.current_price)}
      </div>
      <div className={`crypto-change ${isPositive ? 'positive' : 'negative'}`}>
        <span className="change-icon">{isPositive ? '▲' : '▼'}</span>
        {formatChange(crypto.price_change_percentage_24h)}
      </div>
    </div>
  );
}

export default CryptoCard;
