// YOUR CODE HERE:

//POST request
var message = {
  username: 'Mel Brooks',
  text: 'It\'s good to be the king',
  roomname: 'lobby'
}

$(document).ready(function() {
  app.init();
});

var error;
var app = (function() {
  var messageList;
  var friends = [];
  var curRoom = 'lobby';
  var server = 'http://127.0.0.1:3000/';
  var user = window.location.search.split('=')[1];


  function roomSelect() {
    clearMessages();
    messageList.filter(function(message) {
      curRoom = $('select option:selected').val();
      if (message.roomname === curRoom) {
        return true;
      }
      else {
        return false;
      }
    }).reverse().forEach(function(message) {
      addMessage(message);
    });
    console.log('change rooms!');
  }


  function includes(array, item) {
    var isIn = false;
    array.forEach(function(element) {
      if (item === element) {
        isIn = true;
      }
    });
    return isIn;
  }

  function init() {
    app.fetch();
    $('#roomSelect').change(roomSelect);
    $('body').on('click', '#submit', function() {
      var $messageText = $('#chatInput').val();
      send({
        username: user,
        text: $messageText,
        roomname: $('#newRoom').val() || $('select option:selected').val()
      });
      $('#newRoom').val('');
    });
  }

  function clearMessages() {
    $('#chats').empty();
  }

  function fetch() {
    $.ajax({
      type: 'GET',
      url: server,
      data: {
        createdAt: '-createdAt'
      },
      // dataType: 'json',
      success: function(data) {
        data = JSON.parse(data);
        console.log('data after parsing: ', data);
        messageList = data.results.reverse();
        clearMessages();
        messageList.forEach(function(message) {
          addMessage(message);
        });
        $('#main').on('click', '.username', addFriend);

      },
      error: function(data) {
        console.error('Chatterbox message receipt failure: ', data.error);
      }
    });
  }

  function send(data) {
    // console.log('data passed: ', data);
    $.ajax({
      type: 'POST',
      url: server,
      data: JSON.stringify(data),
      contentType: 'application/JSON',
      success: function(data) {
        fetch();
      },
      error: function(data) {
        console.error('Chatterbox message send failure: ', data);
      }
    })
  }

  function addMessage(message) {
    var roomNames = [];
    var $roomLabel = $('#roomSelect').children();
    for (i = 0; i < $roomLabel.length; i++) {
      roomNames.push($roomLabel[i].innerText);
    }
    if (!(includes(roomNames, message.roomname)) && message.roomname) {
      $('#roomSelect').append('<option id="room" selected="selected"></option>');
      $('#roomSelect').children().last().text(message.roomname);
    }

    var $message = $('<div class="message"></div>');
    $message.html('<div class="username">' + _.escape(message.username.slice(0, 20)) +'</div>'
      + '<div class="messageText">' + _.escape(message.text) +'</div>'
      + '<div class="messageRoom">' + _.escape(message.roomname) + '</div>');
    $('#chats').append($message);
  }

  function addRoom(roomName) {
    $('#roomSelect').append('<option class="rooms"></option>');
  }

  function addFriend(friend) {
    var friendName = friend.toElement.innerText.slice(0, 20);
    var currentFriendNames = [];
    var $currentFriends = $('#friends').children();
    for (var i = 0; i < $currentFriends.length; i++) {
      currentFriendNames.push($currentFriends[i].innerText);
    }
    if (!(includes(currentFriendNames, friendName))) {
      $('#friends').append('<option class="friend">' + friendName + '</option>');
      //$('#friends').children().last().append(friendName);
    }
  }


  return {
   send: send,
   init: init,
   fetch: fetch,
   server: server,
   addMessage: addMessage,
   clearMessages: clearMessages,
   messageList: messageList,
   addRoom: addRoom,
   addFriend: addFriend
  };
})();

