"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
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
    const unsub = onSnapshot(collection(db, "workouts"), (snap) => {
      const data = snap.docs.map((d) => d.data());
      setWorkouts(data);
      setStats(calculateStats(data));
    });
    return () => unsub();
  }, []);

  const addWorkout = async () => {
    if (!duration) return alert("Enter duration");

    await addDoc(collection(db, "workouts"), {
      activity,
      duration: Number(duration),
      date: new Date().toISOString()
    });

    setDuration("");
  };

  const getMotivation = async () => {
    const res = await axios.post("/api/motivation", { stats });
    setMsg(res.data.content);
  };

  const sendMessage = async () => {
    if (!input) return;

    const res = await axios.post("/api/chat", {
      messages: [...chat, { role: "user", content: input }]
    });

    setChat([...chat, { role: "user", content: input }, res.data]);
    setInput("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>💪 FitCoach AI</h1>

      {/* Workout Form */}
      <div style={{ background: "#fff", padding: 15, marginBottom: 10 }}>
        <select onChange={(e) => setActivity(e.target.value)}>
          <option>Running</option>
          <option>Yoga</option>
          <option>Cycling</option>
          <option>Gym</option>
          <option>Swimming</option>
        </select>

        <input
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <button onClick={addWorkout}>Add Workout</button>
      </div>

      {/* Stats */}
      <div style={{ background: "#fff", padding: 15, marginBottom: 10 }}>
        <p>🔥 Streak: {stats.streak}</p>
        <p>📊 This Week: {stats.weeklyCount}</p>
        <p>⏱ Total Minutes: {stats.totalMinutes}</p>
        <p>🏆 Favorite: {stats.mostFrequent}</p>
        <p>⚠ Gap Days: {stats.gapDays}</p>
      </div>

      {/* Motivation */}
      <div style={{ background: "#fff", padding: 15, marginBottom: 10 }}>
        <button onClick={getMotivation}>Get AI Motivation</button>
        <p>{msg}</p>
      </div>

      {/* Chatbot */}
      <div style={{ background: "#fff", padding: 15 }}>
        <h3>AI Coach</h3>

        {chat.map((m, i) => (
          <p key={i}>{m.content}</p>
        ))}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
