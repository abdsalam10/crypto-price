import { useState, useEffect } from 'react';
import { useBalance, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import './MyPortfolio.css';

// ERC20 ABI for balanceOf
const erc20Abi = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// Base chain tokens
const baseTokens = [
  { 
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 
    symbol: 'USDC', 
    name: 'USD Coin',
    decimals: 6,
    coingeckoId: 'usd-coin',
    icon: '💵'
  },
  { 
    address: '0x4200000000000000000000000000000000000006', 
    symbol: 'WETH', 
    name: 'Wrapped Ether',
    decimals: 18,
    coingeckoId: 'weth',
    icon: '⟠'
  },
  { 
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', 
    symbol: 'DAI', 
    name: 'Dai Stablecoin',
    decimals: 18,
    coingeckoId: 'dai',
    icon: '◈'
  }
];

function MyPortfolio({ walletAddress }) {
  const [portfolio, setPortfolio] = useState([]);
  const [prices, setPrices] = useState({});
  const [totalValue, setTotalValue] = useState(0);

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: walletAddress,
  });

  // Get ERC20 token balances
  const { data: tokenBalances } = useReadContracts({
    contracts: baseTokens.map(token => ({
      address: token.address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [walletAddress],
    })),
  });

  // Fetch prices from CoinGecko
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = ['ethereum', ...baseTokens.map(t => t.coingeckoId)].join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        const data = await response.json();
        setPrices(data);
      } catch (err) {
        console.error('Error fetching prices:', err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Build portfolio from balances and prices
  useEffect(() => {
    if (!ethBalance || !tokenBalances || !prices.ethereum) return;

    const portfolioData = [];

    // Add ETH
    const ethAmount = parseFloat(formatUnits(ethBalance.value, 18));
    const ethPrice = prices.ethereum?.usd || 0;
    if (ethAmount > 0) {
      portfolioData.push({
        symbol: 'ETH',
        name: 'Ethereum',
        balance: ethAmount,
        price: ethPrice,
        value: ethAmount * ethPrice,
        icon: '⟠'
      });
    }

    // Add ERC20 tokens
    tokenBalances.forEach((result, index) => {
      if (result.status === 'success' && result.result) {
        const token = baseTokens[index];
        const balance = parseFloat(formatUnits(result.result, token.decimals));
        const price = prices[token.coingeckoId]?.usd || 0;
        
        if (balance > 0) {
          portfolioData.push({
            symbol: token.symbol,
            name: token.name,
            balance: balance,
            price: price,
            value: balance * price,
            icon: token.icon
          });
        }
      }
    });

    const total = portfolioData.reduce((sum, item) => sum + item.value, 0);
    setPortfolio(portfolioData);
    setTotalValue(total);
  }, [ethBalance, tokenBalances, prices]);

  if (!walletAddress) {
    return null;
  }

  const isLoading = !ethBalance || !tokenBalances || !prices.ethereum;

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h3 className="portfolio-title">My Portfolio</h3>
      </div>
      
      {isLoading ? (
        <div className="portfolio-loading">
          <div className="loader"></div>
          <p>Loading your holdings...</p>
        </div>
      ) : (
        <>
          <div className="total-value">
            <span className="total-label">Total Value</span>
            <span className="total-amount">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <div className="portfolio-list">
            {portfolio.map((asset, index) => (
              <div key={index} className="portfolio-item">
                <div className="asset-info">
                  <span className="asset-icon">{asset.icon}</span>
                  <div className="asset-details">
                    <span className="asset-symbol">{asset.symbol}</span>
                    <span className="asset-name">{asset.name}</span>
                  </div>
                </div>
                <div className="asset-values">
                  <span className="asset-balance">{asset.balance.toFixed(6)}</span>
                  <span className="asset-value">${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            ))}
          </div>

          {portfolio.length === 0 && (
            <div className="empty-portfolio">
              <p>No assets found in this wallet</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyPortfolio;
