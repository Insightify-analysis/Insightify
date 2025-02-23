import yfinance as yf
import matplotlib.pyplot as plt

# Define the ticker symbol
ticker_symbol = "AAPL"

# Download historical market data
data = yf.download(ticker_symbol, start="2020-01-01", end="2022-12-31")

# Plot the closing price
plt.figure(figsize=(12, 6))
plt.plot(data.index, data['Close'], label='Closing Price', color='blue')
plt.xlabel('Date')
plt.ylabel('Stock Price (USD)')
plt.title(f'{ticker_symbol} Stock Price Chart')
plt.legend()
plt.grid()
plt.show()
