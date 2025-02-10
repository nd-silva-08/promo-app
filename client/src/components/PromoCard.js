import React from 'react';

function PromoCard({ promo }) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
      }}
    >
      <h3>{promo.promoCode}</h3>
      <p>
        <strong>Discount Details:</strong> {promo.discountDetails}
      </p>
      <p>
        <strong>Expires On:</strong>{' '}
        {new Date(promo.expirationDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Description/Terms:</strong> {promo.descriptionTerms}
      </p>
      <p>
        <strong>Source:</strong> {promo.sourceEmail?.sender} -{' '}
        {promo.sourceEmail?.subject}
      </p>
    </div>
  );
}

export default PromoCard; 