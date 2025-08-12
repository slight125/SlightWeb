import React from 'react';

// Subtle animated tech background: grid drift, gradient blobs, and a soft sweep line.
// Pointer-events are disabled so it never blocks interactions.
const BackgroundFX: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="fx-grid" />
      <div className="fx-blob fx-blob--brand" />
      <div className="fx-blob fx-blob--cyan" />
      <div className="fx-sweep" />
    </div>
  );
};

export default BackgroundFX;
