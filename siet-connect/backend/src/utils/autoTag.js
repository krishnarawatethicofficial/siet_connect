// Smart auto-tagging — keyword extraction from text content
const KEYWORD_MAP = {
  exam: ["exam", "examination", "test", "midterm", "mid-sem", "end-sem", "datesheet"],
  placement: ["placement", "internship", "job", "hiring", "recruit", "company", "package", "offer"],
  event: ["event", "workshop", "seminar", "hackathon", "fest", "competition", "webinar"],
  academic: ["syllabus", "attendance", "class", "lecture", "lab", "practical", "assignment"],
  urgent: ["urgent", "important", "immediate", "deadline", "last date", "mandatory"],
  scholarship: ["scholarship", "merit", "financial", "aid", "stipend", "fellowship"],
  sports: ["sports", "cricket", "football", "tournament", "athletics", "match"],
  hostel: ["hostel", "mess", "room", "warden", "accommodation"],
};

// Extract tags from title + content text
export const extractTags = (text) => {
  if (!text) return [];

  const lower = text.toLowerCase();
  const tags = new Set();

  for (const [tag, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      tags.add(tag);
    }
  }

  return Array.from(tags);
};
