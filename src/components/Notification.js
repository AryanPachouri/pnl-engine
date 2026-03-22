import React from 'react';

export default function Notification({ msg, type }) {
  return (
    <div className={`notification gs ${type}`}>{msg}</div>
  );
}
