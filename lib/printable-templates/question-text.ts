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

const generatedQuestionPattern = /^(What is|What are|Which|How many|Please provide|How often|How much|Are you|Do you|Did you|Have you|Can you|Would you)\b/i;

function stripInternalQuestionPrefix(value: string) {
  return value.replace(/^Question\s+\d+:\s*/i, "").trim();
}

function punctuateAsQuestion(value: string) {
  const trimmed = value.trim().replace(/\.$/, "");
  return trimmed.endsWith("?") ? trimmed : `${trimmed}?`;
}

function stripTrailingNotes(value: string) {
  return value.replace(/\s+notes$/i, "").trim();
}

function normalizeLabelForPrompt(label: string) {
  return label
    .trim()
    .replace(/\bDOB\b/gi, "date of birth")
    .replace(/\bid\b/gi, "ID")
    .replace(/\bmon\b/gi, "Monday")
    .replace(/\btues\b/gi, "Tuesday")
    .replace(/\bwed\b/gi, "Wednesday")
    .replace(/\bthurs\b/gi, "Thursday")
    .replace(/\bfri\b/gi, "Friday")
    .replace(/\bsat\b/gi, "Saturday")
    .replace(/\bsun\b/gi, "Sunday")
    .replace(/\s+/g, " ");
}

function capitalizeFirst(value: string) {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
}

function startsWithAny(value: string, prefixes: string[]) {
  return prefixes.some((prefix) => value.startsWith(prefix));
}

function hasPluralHead(value: string) {
  return /\b(classes|items|benefits|services|children|names|descriptions|funds|groups|visits|needs|criteria|hardships|topics)\b/i.test(value);
}

function labelToQuestion(label: string, typeId?: TemplateInputDefinition["typeId"]) {
  const normalized = label.trim();
  const promptLabel = normalizeLabelForPrompt(normalized);
  const lower = promptLabel.toLowerCase();
  const withoutNotes = stripTrailingNotes(promptLabel);
  const lowerWithoutNotes = withoutNotes.toLowerCase();

  if (lower === "email") return "What is your email address?";
  if (lower === "dob" || lower === "date of birth") return "What is your date of birth?";
  if (lower === "date") return "What is the date?";
  if (lower === "phone") return "What is your phone number?";
  if (lower === "name") return "What is your name?";
  if (lower === "address") return "What is your address?";
  if (lower === "age") return "What is your age?";
  if (lower.includes("number of children")) return "How many children are there?";
  if (lower === "children date of birth/age") return "What are the children's dates of birth and ages?";
  if (lower === "primary language spoken at home") return "What is the primary language spoken at home?";
  if (lower === "program authorized for referral") return "Which program is authorized for referral?";
  if (lower === "highest level of education") return "What is the highest level of education?";
  if (lower === "preferred method of communication") return "What is your preferred method of communication?";
  if (lower === "eligibility criteria") return "Which eligibility criteria are met?";
  if (lower === "past year hardships") return "Which hardships occurred in the past year?";
  if (lower === "people i trust to ask for advice about") return "Which topics would you ask trusted people about?";
  if (lower === "unable to pay for needs in the past month") return "Which needs were you unable to pay for in the past month?";
  if (/^goal \d+ progress$/.test(lower)) return `What is the progress for ${lower.replace(/\s+progress$/, "")}?`;
  if (/^goal \d+ attained$/.test(lower)) return `Was ${lower.replace(/\s+attained$/, "")} attained?`;
  if (lower.includes("signature")) return `Please provide ${lower}.`;
  if (lower.includes("initial")) return `Please provide ${lower}.`;
  if (lower.includes("received")) return `Which ${lower.replace(/\s+received\b/, "")} have been received?`;
  if (lower === "children names") return "What are the children's names?";
  if (lower.includes("date of birth")) return `What is the ${lower}?`;
  if (/\bphone\b/.test(lower)) return `What is the ${lower}?`;
  if (/\bname\b/.test(lower)) return hasPluralHead(lower) ? `What are the ${lower}?` : `What is the ${lower}?`;
  if (/\baddress\b/.test(lower)) return `What is the ${lower}?`;
  if (/\bage\b/.test(lower)) return `What is the ${lower}?`;

  if (typeId === "checkbox") {
    if (lower.includes("completed checklist items")) return "Which checklist items are completed?";
    if (hasPluralHead(lower)) return `Which ${lower} apply?`;
    return `Which ${lower} apply?`;
  }

  if (lowerWithoutNotes.startsWith("in need of ")) {
    const subject = lowerWithoutNotes.slice("in need of ".length);
    return lower.endsWith(" notes") ? `Please provide notes about the need for ${subject}.` : `Are you in need of ${subject}?`;
  }

  if (lowerWithoutNotes.startsWith("interested in ")) {
    const subject = lowerWithoutNotes.slice("interested in ".length);
    return lower.endsWith(" notes") ? `Please provide notes about interest in ${subject}.` : `Are you interested in ${subject}?`;
  }

  if (lower.startsWith("if no,")) return punctuateAsQuestion(promptLabel);
  if (startsWithAny(lower, ["i ", "my ", "there ", "when ", "in my family, ", "how i "])) {
    return punctuateAsQuestion(`How much do you agree with this statement: ${capitalizeFirst(toSecondPerson(promptLabel))}`);
  }
  if (lower.startsWith("take positive steps") || lower.startsWith("now take positive steps")) {
    return punctuateAsQuestion(`How often do you ${lower.replace(/^now\s+/, "")}`);
  }

  if (questionStarters.includes(lower.split(/\s+/)[0])) return punctuateAsQuestion(promptLabel);
  if (hasPluralHead(lower)) return `What are the ${lower}?`;

  return `What is the ${lower}?`;
}

function lowercaseFirst(value: string) {
  return value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value;
}

function toSecondPerson(value: string) {
  return value
    .replace(/\bI'm\b/gi, "you're")
    .replace(/\bI am\b/gi, "you are")
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

function questionTextLooksGenerated(value: string, label?: string) {
  const trimmed = value.trim();
  if (/^Question\s+\d+:/i.test(trimmed) || /^What is the question \d+ answer\?$/i.test(trimmed)) return true;
  if (!generatedQuestionPattern.test(trimmed)) return false;
  if (!label) return false;

  const lowerQuestion = trimmed.toLowerCase();
  const rawLabel = label.trim().toLowerCase();
  const lowerLabel = normalizeLabelForPrompt(label).toLowerCase();
  if (
    lowerQuestion.startsWith("how much do you agree with this statement:") &&
    startsWithAny(lowerLabel, ["i ", "my ", "there ", "when ", "in my family, ", "how i "])
  ) {
    return true;
  }
  return lowerQuestion.includes(rawLabel.replace(/\.$/, "")) || lowerQuestion.includes(lowerLabel.replace(/\.$/, ""));
}

export function inferQuestionText(input: Pick<TemplateInputDefinition, "label" | "notes" | "questionText"> & { typeId?: TemplateInputDefinition["typeId"] }) {
  const explicitQuestionText = input.questionText?.trim();
  if (explicitQuestionText && !questionTextLooksGenerated(explicitQuestionText, input.label)) return explicitQuestionText;

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

  return labelToQuestion(input.label, "typeId" in input ? input.typeId : undefined);
}
