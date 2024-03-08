const { Configuration, OpenAIApi } = window.openai;

const configuration = new Configuration({
  apiKey: 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,
});
const openai = new OpenAIApi(configuration);

// HELPER FUNTIONS

// Function to generate random words based on the topic
async function generateWords(topic) {
  const prompt = `Generate 5 random words related to the topic "${topic}".`;
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 50,
    temperature: 0.7,
  });
  const generatedText = response.data.choices[0].text.trim();
  return generatedText.split('\n');
}

// Function to generate clues for the words
async function generateClues(words) {
  const prompt = `For each of the following words, provide a concise clue:\n\n${words.join('\n')}`;
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 200,
    temperature: 0.7,
  });
  const generatedText = response.data.choices[0].text.trim();
  return generatedText.split('\n');
}

// Function to create the crossword puzzle grid
function createCrosswordGrid(words) {
  const gridSize = 5;
  const grid = [];

  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      row.push('');
    }
    grid.push(row);
  }

  // Place the words in the grid
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    const direction = Math.random() < 0.5 ? 'across' : 'down';

    let canPlace = true;
    if (direction === 'across') {
      if (col + word.length > gridSize) {
        canPlace = false;
      } else {
        for (let j = 0; j < word.length; j++) {
          if (grid[row][col + j] !== '' && grid[row][col + j] !== word[j]) {
            canPlace = false;
            break;
          }
        }
      }
    } else {
      if (row + word.length > gridSize) {
        canPlace = false;
      } else {
        for (let j = 0; j < word.length; j++) {
          if (grid[row + j][col] !== '' && grid[row + j][col] !== word[j]) {
            canPlace = false;
            break;
          }
        }
      }
    }

    if (canPlace) {
      if (direction === 'across') {
        for (let j = 0; j < word.length; j++) {
          grid[row][col + j] = word[j];
        }
      } else {
        for (let j = 0; j < word.length; j++) {
          grid[row + j][col] = word[j];
        }
      }
    } else {
      i--;
    }
  }

  return grid;
}

// PUZZLE LOGIC

// Get references to the HTML elements
const topicInput = document.getElementById('topic');
const generatePuzzleButton = document.getElementById('generate-puzzle');
const crosswordGrid = document.getElementById('crossword-grid');
const acrossCluesContainer = document.getElementById('across-clues');
const downCluesContainer = document.getElementById('down-clues');

// Event listener for the "Generate Puzzle" button
generatePuzzleButton.addEventListener('click', async () => {
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
    alert('Please enter a topic.');
  }
});