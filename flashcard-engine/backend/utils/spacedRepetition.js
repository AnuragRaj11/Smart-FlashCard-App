export function calculateNextReview(card, quality) {
  const qualityLabels = {
  0: "Again (Forgot)",
  3: "Hard",
  5: "Easy"
};
  // quality: 0-5 (0=forgot, 5=perfect recall)
  let { repetitions, easeFactor, interval } = card;
  
  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    repetitions = 0;
    interval = 1;
  }
  
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;
  
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return { repetitions, easeFactor, interval, nextReviewDate };
}
