import type { TemplateInputDefinition } from "./types";

const noteStopPatterns = [
  ". Enter ",
  "? Enter ",
  ". Select ",
  "? Select ",
  ". Rating choices:",
  ". Choices:",
  "; Choices:",
  "; Rating choices:",
];

const directQuestionText: Record<string, string> = {
  "Gender.": "What is your gender?",
  "Race/Nationality.": "What is your race or nationality?",
  "Marital Status.": "What is your marital status?",
  "Number of children you have.": "How many children do you have?",
  "Highest grade you completed.": "What is the highest grade you completed?",
  "Current Employment-School status.": "What is your current employment or school status?",
  "Annual Household Income.": "What is your annual household income?",
  "Nurturing Parenting is.": "Which answer best describes nurturing parenting?",
  "Discipline means.": "What does discipline mean?",
  "Empathy means.": "What does empathy mean?",
  "Anger is.": "What is anger?",
  "Our self-worth is.": "What is self-worth?",
  "Free-text Other value for Question 6 Gender option e Other.": "What is your other gender response?",
  "Free-text Nationality line associated with Question 7 Race/Nationality; this is not the Question 7 letter answer field.": "What is your nationality?",
};

const questionStarters = [
  "are",
  "can",
  "did",
  "do",
  "does",
  "ever",
  "has",
  "have",
  "how",
  "is",
  "which",
  "why",
  "would",
];

function stripInternalQuestionPrefix(value: string) {
  return value.replace(/^Question\s+\d+:\s*/i, "").trim();
}

function punctuateAsQuestion(value: string) {
  const trimmed = value.trim().replace(/\.$/, "");
  return trimmed.endsWith("?") ? trimmed : `${trimmed}?`;
}

function labelToQuestion(label: string) {
  const normalized = label.trim();
  const lower = normalized.toLowerCase();

  if (lower === "email") return "What is your email address?";
  if (lower === "date") return "What is the date?";
  if (lower.includes("signature")) return `Please provide ${lower}.`;
  if (lower.includes("initial")) return `Please provide ${lower}.`;
  if (lower.includes("phone")) return `What is the ${lower}?`;
  if (lower.includes("name")) return `What is the ${lower}?`;
  if (lower.includes("date of birth") || lower.includes("dob")) return `What is the ${lower}?`;
  if (lower.includes("age")) return `What is the ${lower}?`;
  if (lower.includes("address")) return `What is the ${lower}?`;

  return `What is the ${lower}?`;
}

function lowercaseFirst(value: string) {
  return value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value;
}

function toSecondPerson(value: string) {
  return value
    .replace(/\bmyself\b/gi, "yourself")
    .replace(/\bmy\b/gi, "your")
    .replace(/\bI\b/g, "you");
}

function utilizationStatementToQuestion(value: string) {
  const lower = value.toLowerCase();
  const startsLikeUtilizationStatement =
    /^(make|recognize|respond|give|have|spend|praise|model|honor|help|refer|use|express)\b/.test(lower);
  if (!startsLikeUtilizationStatement) return null;

  return punctuateAsQuestion(`How often do you ${lowercaseFirst(toSecondPerson(value))}`);
}

function sentenceToQuestion(value: string) {
  const withoutPrefix = stripInternalQuestionPrefix(value);
  const direct = directQuestionText[withoutPrefix];
  if (direct) return direct;

  const lower = withoutPrefix.toLowerCase();
  if (lower.startsWith("ever ")) {
    return punctuateAsQuestion(`Did you ${lowercaseFirst(withoutPrefix)}`);
  }
  if (withoutPrefix.includes("?")) return punctuateAsQuestion(withoutPrefix);
  if (lower.startsWith("pick the right way to ")) {
    return punctuateAsQuestion(`What is the right way to ${withoutPrefix.slice("Pick the right way to ".length).toLowerCase()}`);
  }
  if (lower.startsWith("please rate ")) {
    return punctuateAsQuestion(withoutPrefix.replace(/^Please rate\s+/i, "How would you rate "));
  }
  if (lower.startsWith("rate ")) {
    return punctuateAsQuestion(withoutPrefix.replace(/^Rate\s+/i, "How would you rate "));
  }
  const utilizationQuestion = utilizationStatementToQuestion(withoutPrefix);
  if (utilizationQuestion) return utilizationQuestion;

  const firstWord = lower.split(/\s+/)[0];
  if (questionStarters.includes(firstWord)) return punctuateAsQuestion(withoutPrefix);

  if (withoutPrefix.includes(":")) return punctuateAsQuestion(withoutPrefix);

  return labelToQuestion(withoutPrefix.replace(/\.$/, ""));
}

function questionTextLooksGenerated(value: string) {
  return /^Question\s+\d+:/i.test(value.trim()) || /^What is the question \d+ answer\?$/i.test(value.trim());
}

export function inferQuestionText(input: Pick<TemplateInputDefinition, "label" | "notes" | "questionText">) {
  const explicitQuestionText = input.questionText?.trim();
  if (explicitQuestionText && !questionTextLooksGenerated(explicitQuestionText)) return explicitQuestionText;

  const notes = input.notes?.trim();
  if (notes) {
    let questionText = notes;
    for (const pattern of noteStopPatterns) {
      const index = questionText.indexOf(pattern);
      if (index !== -1) {
        questionText = questionText.slice(0, index + 1);
        break;
      }
    }

    return sentenceToQuestion(questionText);
  }

  return labelToQuestion(input.label);
}
