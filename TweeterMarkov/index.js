function generateTweet() {
  let tweetWordArray = [];
  let generatedTweet = '';

  let randomTweetStaringWord = getNextWord(tweetFirstWordsProbability);
  tweetWordArray.push(randomTweetStaringWord);

  for (let i = 1; i < 200; i++)
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


  $("#quote").html(generatedTweet);
  $("#author").html('Markov Bot 2016');

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



$(document).ready(function(){
  generateTweet();
});