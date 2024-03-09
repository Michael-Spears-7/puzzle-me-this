const { Configuration, OpenAIApi } = require('openai');

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
  console.log('Generate Puzzle button clicked');
  
  errorMessageElement.textContent = ''; // Clear the error message

  const topic = topicInput.value.trim();
  if (topic) {
    // Generate words and clues
    const words = await generateWords(topic);
    const clues = await generateClues(words);

    // Create the crossword puzzle grid
    const grid = createCrosswordGrid(words);

    // Clear the existing grid and clues
    crosswordGrid.innerHTML = '';
    acrossCluesContainer.innerHTML = '';
    downCluesContainer.innerHTML = '';

    // Render the crossword puzzle grid
    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      for (let j = 0; j < row.length; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = row[j] || '';
        crosswordGrid.appendChild(cell);
      }
    }

    // Render the across and down clues
    for (let i = 0; i < words.length; i++) {
      const acrossClue = document.createElement('p');
      acrossClue.textContent = `${i + 1}. ${clues[i]}`;
      acrossCluesContainer.appendChild(acrossClue);

      const downClue = document.createElement('p');
      downClue.textContent = `${i + 1}. ${clues[words.length + i]}`;
      downCluesContainer.appendChild(downClue);
    }
  } else {
    errorMessageElement.textContent = 'Please enter a topic.';
  }
});