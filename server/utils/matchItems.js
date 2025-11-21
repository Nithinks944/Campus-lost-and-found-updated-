import Item from '../models/Item.js';

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

function jaccardSimilarity(text1, text2) {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) return 0;

  return intersection.size / union.size;
}

export async function findMatches(item) {
  try {
    const oppositeType = item.type === 'lost' ? 'found' : 'lost';

    const locationRegex = new RegExp(item.location, 'i');

    const candidates = await Item.find({
      type: oppositeType,
      category: item.category,
      status: 'open',
      location: locationRegex,
    }).populate('postedBy', 'name email');

    const itemText = `${item.title} ${item.description}`;
    const matches = [];

    for (const candidate of candidates) {
      const candidateText = `${candidate.title} ${candidate.description}`;
      const score = jaccardSimilarity(itemText, candidateText);

      if (score >= 0.3) {
        matches.push({
          item: candidate,
          score: Math.round(score * 100),
        });
      }
    }

    matches.sort((a, b) => b.score - a.score);

    return matches;
  } catch (error) {
    console.error('Error finding matches:', error);
    return [];
  }
}
