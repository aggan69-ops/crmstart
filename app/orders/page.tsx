"use client";
import { useState } from "react";
export default function Orders() {
  const [orders, setOrders] = useState(["Order 1","Order 2"]);
  const [input, setInput] = useState("");
  return (
    <div>
      <h1>Order</h1>
      <input value={input} onChange={e=>setInput(e.target.value)} />
      <button onClick={()=>{ if(input) setOrders([input,...orders]); setInput("");}}>Add</button>
      <ul>{orders.map((o,i)=><li key={i}>{o}</li>)}</ul>
      <a href="/">Back</a>
    </div>
  );
}