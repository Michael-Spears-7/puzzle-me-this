import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const errorMessageElement = document.getElementById('error-message');

// Function to generate random words based on the topic
async function generateWords(topic) {
  const prompt = `Generate 5 random words related to the topic "${topic}".`;

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 50,
      temperature: 0.7,
    });
    console.log('API response:', response.data);
    const generatedText = response.data.choices[0].text.trim();
    return generatedText.split('\n');
  } catch (error) {
    console.error('Error:', error);
    errorMessageElement.textContent = 'An error occurred while generating words. Please try again.';
    return [];
  }
}

// Function to generate clues for the words
async function generateClues(words) {
  const prompt = `For each of the following words, provide a concise clue:\n\n${words.join('\n')}`;

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 200,
      temperature: 0.7,
    });
    console.log('API response:', response.data);
    const generatedText = response.data.choices[0].text.trim();
    return generatedText.split('\n');
  } catch (error) {
    console.error('Error:', error);
    errorMessageElement.textContent = 'An error occurred while generating clues. Please try again.';
    return [];
  }
}

// ... (rest of the code remains the same)

// Event listener for the "Generate Puzzle" button
generatePuzzleButton.addEventListener('click', async () => {
  errorMessageElement.textContent = ''; // Clear the error message

  const topic = topicInput.value.trim();
  if (topic) {
    // ... (rest of the code remains the same)
  } else {
    errorMessageElement.textContent = 'Please enter a topic.';
  }
});