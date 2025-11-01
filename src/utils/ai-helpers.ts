// Parse AI response text and extract JSON object
export function parseAIResponse<T>(response: string): T {
	// Remove markdown code blocks if present
	const cleanText = response
		.replace(/```json\s*/g, "")
		.replace(/```\s*/g, "")
		.trim();

	// Find the first { and last } to extract JSON
	const firstBrace = cleanText.indexOf("{");
	const lastBrace = cleanText.lastIndexOf("}");

	if (firstBrace === -1 || lastBrace === -1) {
		throw new Error("JSON não encontrado na resposta");
	}

	let jsonString = cleanText.substring(firstBrace, lastBrace + 1);

	// Sanitize JSON
	// Remove trailing commas before ] or }
	jsonString = jsonString.replace(/,(\s*[}\]])/g, "$1");

	// Remove line breaks that might break JSON parsing
	jsonString = jsonString.replace(/\n/g, " ");

	return JSON.parse(jsonString);
}
