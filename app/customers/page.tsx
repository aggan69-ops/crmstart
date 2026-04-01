"use client";
import { useState } from "react";
export default function Customers() {
  const [list, setList] = useState(["Customer 1","Customer 2"]);
  const [input, setInput] = useState("");
  return (
    <div>
      <h1>Kunder</h1>
      <input value={input} onChange={e=>setInput(e.target.value)} />
      <button onClick={()=>{ if(input) setList([input,...list]); setInput("");}}>Add</button>
      <ul>{list.map((l,i)=><li key={i}>{l}</li>)}</ul>
      <a href="/">Back</a>
    </div>
  );
}