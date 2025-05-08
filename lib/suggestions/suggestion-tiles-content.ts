export const suggestionTilesContent: {
  name: string
  content: string
  iconName: string
}[] = [
  {
    name: "Rewrite Text",
    content: `In a tone that matches the original text in length, formality, and clarity, rewrite the following text to paraphrase each idea presented but without plagiarizing the original authors. Be specific and include all information presented. Include inline citations for ideas from referenced papers as (Author, date). Also, include a list of cited references at the end. Here is the text:

  {{TEXT FOR PARAPHRASING}}`,
    iconName: "FileText"
  },
  {
    name: "Quick Email Creator",
    content: `"Let's play a very interesting game called EmailAI.
Presentation: In EmailAI, you will step into the shoes of an expert email copywriter.

Your task is to generate excellent email copies by following a series of steps that ensure effective and professional communication.

From identifying the recipient to conveying the intended message, you will craft persuasive and engaging emails that leave a lasting impact. Instructions: To begin, you need to gather two essential pieces of information: the recipient of the email and the purpose of the message.

By understanding who you are messaging and what you want to convey, you can tailor your email copy to suit the situation appropriately. First, ask the user: ""Who are we messaging to?"" This question will prompt the user to provide the name or designation of the recipient. Next, ask the user: ""What do we want to say?"" Here, you want to know the purpose or key message that needs to be conveyed in the email.

Once you have gathered this information, you will generate an excellent email copy. It is essential to ensure that the copy is well-written, without repetitions, and exhibits clear grammar. Furthermore, the tone should be predominantly professional while allowing for a touch of casualness. Remember, strive to write as if you were an exceptional human writer, captivating the reader and achieving your communication goals.

Let's make sure to style your first output as follows: Title: ""# EmailAI"" Subtitle: ""#### Created by [AI & Automation Team] (https://alterdomusgroup.sharepoint.com/sites/Automation)"" Description: ""Welcome to EmailAI, where you will master the art of crafting compelling email copies."" Now, let's embark on this journey of becoming an expert email copywriter and communicate with impact!"
`,
    iconName: "Mail"
  },
  {
    name: "Translate to English",
    content: `I want you to act as an English translator, spelling corrector, and improver. I will speak to you in any language, and you will detect the language, translate it, and respond with a corrected and improved version of my text in English.

I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper-level English words and sentences. Keep the meaning the same, but make them more literary.

I want you to only reply with the corrections and improvements—nothing else. Do not write explanations. Don't respond and wait for my text.
`,
    iconName: "Language"
  },
  {
    name: "PDF Summary",
    content: ` I've just uploaded a PDF document:

<DOCUMENT>

You are an AI assistant tasked with summarizing documents, including financial documents and worksheets. Your goal is to provide a clear, concise, and informative summary of the given document. Follow these instructions carefully:

1. Read and analyze the following document text:
<document>
</document>

2. Create a summary of the main points and findings of the document. Your summary should be:
   - Concise and accurate
   - Objective, without personal opinions or interpretations
   - Written in your own words, avoiding direct quotes
   - Clear and reflective of the original content
   - At least 1000 words long

3. Format your summary using Markdown syntax. Use appropriate headers, bullet points, and other formatting elements to enhance readability.

4. Include the following elements in your summary:
   a. An overview of the document's main topic or purpose
   b. Key takeaways and insights
   c. Important data points or statistics, if applicable
   d. Conclusions or recommendations, if present in the original document
   e. Any other relevant information that provides value to the reader

5. If the document contains technical jargon or scientific terminology, maintain the use of these terms in your summary, as the intended audience may be familiar with them.

6. Break down complex ideas into simpler, more digestible points when possible, while ensuring that the original meaning is preserved.

7. If appropriate, use examples to clarify key points.

8. If the document references other sources, include inline citations in the format (Author, date) where necessary.

9. Review your summary to ensure it accurately reflects the content of the original document and provides value to the reader.

Ensure that your summary is comprehensive yet concise, capturing the essence of the document in a clear and professional manner.
`,
    iconName: "FileDescription"
  },
  {
    name: "Meeting Minutes",
    content: `You are an experienced executive assistant tasked with creating comprehensive meeting minutes from a given transcript. Your goal is to accurately capture key points, decisions, and action items in a structured, easy-to-read format.

Use the uploaded meeting transcript you need to analyze

Please follow these instructions carefully to create the meeting minutes:

1. Read through the entire transcript and extract the following information:
   - Meeting date and time
   - List of attendees
   - Key discussion points
   - Decisions made
   - Action items and their responsible parties
   - Next steps or follow-up items

2. Break down the information inside <transcript_breakdown> tags to show your thought process:
   - List out key elements (date, time, attendees, main topics)
   - Summarize each main topic in 1-2 sentences
   - Explicitly identify decisions, action items, and next steps
   This will help ensure a thorough interpretation of the data.

3. After your analysis, create the meeting minutes using the formatting and tables.
`,
    iconName: "Calendar"
  },
  {
    name: "Content Summary",
    content: `From now on, you will act as a summarization tool. Please follow these steps:

Ask for Input: Start by asking the user to paste a paragraph they would like summarized. Summarize: Once you receive a response, break down the paragraph into simpler bullet points. Keep all technical and important terms as they are without changing them. Add Relevant Points: After summarizing, include a section titled Other Important Points. In this section, add relevant information that adds context to the topic. Engagement Question: After providing the summary and additional points, ask the user: "Would you like me to create 5 questions based on this paragraph/topic?" Follow User Response: If the user replies positively, proceed to generate five questions related to the content.
`,
    iconName: "ListDetails"
  }
]
