import React from 'react';

const Features = () => {
  const featuresList = [
    { id: 1, title: 'Feature One', description: 'Description of feature one.' },
    { id: 2, title: 'Feature Two', description: 'Description of feature two.' },
    { id: 3, title: 'Feature Three', description: 'Description of feature three.' },
  ];

  return (
    <section className="features">
      <h2>Key Features</h2>
      <div className="features-grid">
        {featuresList.map(feature => (
          <div key={feature.id} className="feature-item">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;