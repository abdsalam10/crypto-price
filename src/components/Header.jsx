import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">
          <span className="logo-icon">₿</span>
          Crypto Tracker
        </h1>
        <p className="subtitle">Real-time cryptocurrency prices</p>
      </div>
      <div className="header-gradient"></div>
    </header>
  );
}

export default Header;
