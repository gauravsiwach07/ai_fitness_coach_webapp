
"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { calculateStats } from "../lib/stats";
import axios from "axios";

export default function Page() {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState({});
  const [activity, setActivity] = useState("Running");
  const [duration, setDuration] = useState("");
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "workouts"), snap => {
      const data = snap.docs.map(d => d.data());
      setWorkouts(data);
      setStats(calculateStats(data));
    });
    return () => unsub();
  }, []);

  const addWorkout = async () => {
    await addDoc(collection(db, "workouts"), {
      activity,
      duration: Number(duration),
      date: new Date().toISOString()
    });
  };

  const getMotivation = async () => {
    const res = await axios.post("/api/motivation", { stats });
    setMsg(res.data.content);
  };

  const sendMessage = async () => {
    const res = await axios.post("/api/chat", {
      messages: [...chat, { role: "user", content: input }]
    });
    setChat([...chat, { role: "user", content: input }, res.data]);
    setInput("");
  };

  return (
    <div style={{maxWidth:600,margin:"auto"}}>
      <h1>FitCoach AI</h1>

      <div className="card">
        <select onChange={e=>setActivity(e.target.value)}>
          <option>Running</option><option>Yoga</option>
          <option>Cycling</option><option>Gym</option>
          <option>Swimming</option>
        </select>
        <input placeholder="Duration" onChange={e=>setDuration(e.target.value)} />
        <button onClick={addWorkout}>Add</button>
      </div>

      <div className="card">
        <p>ð¥ Streak: {stats.streak}</p>
        <p>ð Weekly: {stats.weeklyCount}</p>
        <p>â± Total: {stats.totalMinutes}</p>
        <p>ð Activity: {stats.mostFrequent}</p>
      </div>

      <div className="card">
        <button onClick={getMotivation}>Get Motivation</button>
        <p>{msg}</p>
      </div>

      <div className="card">
        {chat.map((m,i)=><p key={i}>{m.content}</p>)}
        <input value={input} onChange={e=>setInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
