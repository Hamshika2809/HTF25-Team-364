export const symptomMap: Record<string, string> = {
  "leg pain": "Muscle Strain",
  "cough": "Bronchitis",
  "fever": "Flu",
  "headache": "Migraine",
  "sore throat": "Pharyngitis",
  "stomach ache": "Gastritis",
  "back pain": "Lumbar Strain",
  "chest pain": "Angina",
};

export function getMappedCondition(symptoms: string) {
  const lowerSymptoms = symptoms.toLowerCase();
  for (const key in symptomMap) {
    if (lowerSymptoms.includes(key)) {
      return symptomMap[key];
    }
  }
  return "General Malaise"; // fallback
}
