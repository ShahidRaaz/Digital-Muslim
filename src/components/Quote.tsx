import './Quote.css';

interface QuoteProps {
  quote: {
    arabic?: string;
    text: string;
    source?: string;
  };
}

export function Quote({ quote }: QuoteProps) {
  return (
    <div className="quote-section">
      <div className="quote-content">
        <small> Ayah of the day </small>
        {quote.arabic && <p className="quote-arabic">{quote.arabic}</p>}
        <p className="quote-eng">"{quote.text}"</p>
        {quote.source && <p className="quote-source">{quote.source}</p>}
      </div>
    </div>
  );
}
