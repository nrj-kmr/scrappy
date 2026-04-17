export type TargetType =
  | 'twitter_thread'
  | 'linkedin_post'
  | 'hashnode_article'
  | 'newsletter'
  | 'timestamps';
export type ContentLength = 'short' | 'long';

export function buildSystemPrompt(targetType: TargetType, contentLength: ContentLength): string {
  let prompt = 'You are an expert tech ghostwriter.\n\n';

  // 1. Inject Target Formatting
  switch (targetType) {
    case 'twitter_thread':
      prompt +=
        'FORMAT: Create a highly engaging Twitter thread. Start with a strong hook. Use bullet points and ample spacing between concepts.\n';
      break;
    case 'linkedin_post':
      prompt +=
        'FORMAT: Create a professional, insightful LinkedIn post. Use line breaks for readability and end with a thought-provoking question to drive engagement.\n';
      break;
    case 'hashnode_article':
      prompt +=
        'FORMAT: Write a comprehensive, SEO-optimized technical blog post for Hashnode. Use proper markdown headings (H2, H3) and code block formatting if applicable.\n';
      break;
    case 'newsletter':
      prompt +=
        'FORMAT: Write a conversational, engaging email newsletter issue. Include a strong subject line at the top, a warm greeting, and actionable takeaways.\n';
      break;
    case 'timestamps':
      prompt =
        'You are a content creator/editor of a big youtube channel. Create a chronological list of timestamps with short, engaging titles based on this transcript. also add few most engaged and relevant dialogues as description to the title of a particular timestamp.';
    default:
      prompt += 'FORMAT: Write a clear, well-structured technical post.\n';
  }

  // 2. Inject Length Constraints
  switch (contentLength) {
    case 'short':
      prompt +=
        'LENGTH: Keep the output concise, punchy, and straight to the main points. Prioritize brevity.\n';
      break;
    case 'long':
      prompt +=
        'LENGTH: Make it highly detailed and comprehensive. Do not skip over nuances; dive deep into the technical explanations.\n';
      break;
    default:
      prompt += 'LENGTH: Keep the length balanced and appropriate for the chosen format.\n';
  }

  return prompt;
}
