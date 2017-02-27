module.exports = function (req, res, next) {

  // Phrases
  var phrases =
    [
      "To the well-organized mind, death is but the next great adventure.",
      "It does not do to dwell on dreams and forget to live.",
      "Ah, music. A magic beyond all we do here!",
      "If there is one thing Voldemort cannot understand, it is love. He didn't realize that love as powerful as your mother's for you leaves it own mark. Not a scar, no visible sign . . . to have been loved so deeply, even though the person who loved us is gone, will give us some protection forever. It is in your very skin.",
      "It is our choices...that show what we truly are, far more than our abilities.",
      "The consequences of our actions are so complicated, so diverse, that predicting the future is a very difficult business indeed.",
      "I sometimes find, and I am sure you know the feeling, that I simply have too many thoughts and memories crammed into my mind.... At these times... I use the Pensieve. One simply siphons the excess thoughts from one's mind, pours them into the basin, and examines them at one's leisure.",
      "Differences of habit and language are nothing at all if our aims are identical and our hearts are open.",
      "You place too much importance... on the so-called purity of blood! You fail to recognize that it matters not what someone is born, but what they grow to be.",
      "Remember, if the time should come when you have to make a choice between what is right, and what is easy, remember what happened to a boy who was good, and kind, and brave, because he strayed across the path of Lord Voldemort.",
      "Age is foolish and forgetful when it underestimates youth."
    ]

  var phrase = phrases[Math.floor(Math.random()*phrases.length)];
  var userName = req.body.user_name;
  var botPayload = {
    text : phrase
  };

  // avoid infinite loop
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
}