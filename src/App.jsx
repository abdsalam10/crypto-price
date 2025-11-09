import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import './App.css';
import CryptoList from './components/CryptoList';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WalletConnect from './components/WalletConnect';
import MyPortfolio from './components/MyPortfolio';

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [showPortfolio, setShowPortfolio] = useState(false);

  useEffect(() => {
    // Initialize Farcaster Mini App SDK - hide splash screen
    sdk.actions.ready();
  }, []);

  useEffect(() => {
    fetchCryptoData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(cryptoData);
    } else {
      const filtered = cryptoData.filter(crypto =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, cryptoData]);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      // Using CoinGecko API (no API key required for basic usage)
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,24h,7d'
      );
      const data = await response.json();
      setCryptoData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnected = (address) => {
    setWalletAddress(address);
    setShowPortfolio(true);
  };

  return (
    <div className="app">
      <Header />
      <WalletConnect onWalletConnected={handleWalletConnected} />
      
      {walletAddress && (
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${!showPortfolio ? 'active' : ''}`}
            onClick={() => setShowPortfolio(false)}
          >
            📊 Market
          </button>
          <button 
            className={`toggle-btn ${showPortfolio ? 'active' : ''}`}
            onClick={() => setShowPortfolio(true)}
          >
            💼 My Portfolio
          </button>
        </div>
      )}

      {showPortfolio && walletAddress ? (
        <MyPortfolio walletAddress={walletAddress} />
      ) : (
        <>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading crypto data...</p>
            </div>
          ) : (
            <CryptoList cryptoData={filteredData} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
