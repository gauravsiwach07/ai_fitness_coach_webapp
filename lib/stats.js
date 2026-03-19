
export function calculateStats(workouts) {
  const sorted = workouts.sort((a, b) => new Date(b.date) - new Date(a.date));

  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < sorted.length; i++) {
    const d = new Date(sorted[i].date);
    if (currentDate.toDateString() === d.toDateString()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else break;
  }

  const thisWeek = workouts.filter(w => {
    const d = new Date(w.date);
    const now = new Date();
    return d >= new Date(now.setDate(now.getDate() - 7));
  });

  const totalMinutes = workouts.reduce((a, b) => a + b.duration, 0);

  const freq = {};
  workouts.forEach(w => {
    freq[w.activity] = (freq[w.activity] || 0) + 1;
  });

  const mostFrequent = Object.keys(freq).reduce((a, b) =>
    freq[a] > freq[b] ? a : b, "None"
  );

  const lastWorkout = workouts[0]?.date;
  const gapDays = lastWorkout
    ? Math.floor((new Date() - new Date(lastWorkout)) / (1000*60*60*24))
    : 0;

  return {
    streak,
    weeklyCount: thisWeek.length,
    totalMinutes,
    mostFrequent,
    gapDays
  };
}
