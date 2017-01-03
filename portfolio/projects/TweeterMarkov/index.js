function generateAndRenderTweet() {
  let newTweet = generateTweet();
  renderTweetText(newTweet)
}

function generateTweet() {
  const tweetSentenceWordLimit = 200;
  let tweetWordArray = [];
  let generatedTweet = '';

  tweetWordArray.push(getFirstRandomWord());

  for (let i = 1; i < tweetSentenceWordLimit - 1; i++)
  {
    let lastWord = tweetWordArray[i - 1];
    let nextWord = getNextWord(markovTransition[lastWord]);

    if ((nextWord) !== '\n') {
      tweetWordArray.push(nextWord);      
    } else {
      break;
    }
  }

   generatedTweet = tweetWordArray.join(' ');

  return generatedTweet;
}

function getFirstRandomWord() {
  return getNextWord(tweetFirstWordsProbability);
}

function getNextWord(wordTransitionArray) {
  let randomNumber = Math.random();
  let accumulatedProbaility = 0;
  for (let i = 0; i < wordTransitionArray.length; i++) {
    let word = wordTransitionArray[i][0];
    let wordProbability = wordTransitionArray[i][1];

    if (randomNumber < (accumulatedProbaility + wordProbability)) {
      return word;
    } else {
      accumulatedProbaility += wordProbability;
    }
  }
}

function renderTweetText(text, author) {
  if (author === undefined) {
    author ='Markov Bot 2016';
  }
  $("#quote").html(text);
  $("#author").html(author);
}

$(document).ready(function(){
  generateAndRenderTweet();
});