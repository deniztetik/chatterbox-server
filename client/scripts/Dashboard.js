var Dashboard = (function Dashboard() {
  //display posts
    //append posts to div id=main

  function addMessage(message) {
    console.log('addMessage working! ', message.responseText.results );
    app.fetch(message);
    $('#chats').append('<div>' + message.responseText.results + '</div>');

  }




  //


  return {
    addMessage: addMessage
  };
})();

console.log(Dashboard);

