
export const calculateTotals = (scores: (number | null)[]) => {
  const out = scores.slice(0, 9).reduce((acc, score) => acc + (score || 0), 0);
  
  if (scores.length === 9) {
    return { out, in: 0, total: out };
  }
  
  const in_ = scores.slice(9, 18).reduce((acc, score) => acc + (score || 0), 0);
  const total = out + in_;
  return { out, in: in_, total };
};
