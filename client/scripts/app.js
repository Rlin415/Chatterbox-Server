// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  invalid: ['script', 'img', 'body', 'iframe', 'input', 'link', 'table', 'div', 'object']
};

var client = {
  friends: [],
  currRoom: "lobby",
  messages: []
};

app.init = function() {
  $('#chats').on('click', ".username", function() {
    //this === element that was clicked
    app.addFriend($(this).text());
  });

  $('#searchbutton').on('click', function() {
    client.currRoom = $('#searchBar').val();
    app.fetch();
  });

  client.username = prompt('Enter your name:');

  app.fetch();
  setInterval(app.updateMsg, 1000);
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent. Data: ', data);
    },
    error: function(data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message. Error: ', data);
    }
  });
};

app.fetch = function() {
  //option 1: only add messages of client.currRoom
  //every time we change rooms
  //change currRooms, call fetch() again
  //option 2: load ALL messages
  //iterates through ALL messages, if room != currRoom, display='hidden'

  //option 1: fetch everything, iterate through everything, reload ALL HTML elements
  //option 2: somehow comparing our current elements with new ones, only appending new ones

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    data: 'where={"roomname":"' + client.currRoom + '"}',
    success: function(data) {
      console.log('Retrieved', data, 'for room:' , client.currRoom);
      client.messages = [];
      data.results.forEach(function(obj) {
        //obj.username = <script>alert(1)</script>
        // <> >
        // escape messages here
        //if(obj is valid)
        if (app.isValid(obj)) {
          client.messages.push(obj);
        }

      });

    },
    error: function(data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('Fetch failed', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
  var element = "<div class='chat";
  if (client.friends.indexOf(message.username) !== -1) {
    element += ' friend';
  }
  $('#chats')
    .append(element + "'><span class='username'>" +
      message.username + "</span>: <span class='message'>" +
      message.text + "</span></div>");
};

app.addRoom = function(room) {
  $('#roomSelect').append('<div>' + room + '</div>');
};

app.addFriend = function(friend) {
  if (client.friends.indexOf(friend) === -1) {
    client.friends.push(friend);
    $('#friends').append('<p>' + friend + '</p>');
  }

};

app.handleSubmit = function() {
  var message = {
    username: client.username,
    text: $('#message').val(),
    roomname: client.currRoom
  };
  app.send(message);
};

app.updateMsg = function() {
  app.clearMessages();
  client.messages.forEach(function(msg) {
    app.addMessage(msg);
  });
};

app.isValid = function(obj) {
  if (obj.username === undefined || obj.text === undefined) {
    return false;
  }

  for (var i = 0; i < app.invalid.length; i++) {
    var regexp = new RegExp('<.*?'+app.invalid[i]+'.*?>'); //<script> //+ means 1 or more occurences, * means 0 or more
    if (regexp.test(obj.username) || regexp.test(obj.text)) {
      return false;
    }
  }
  return true;
};
