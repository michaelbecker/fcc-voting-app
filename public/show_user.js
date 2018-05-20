// User logic to handle confirming poll deletion

$(".poll-delete-form").submit(function() {
  
  var confirmed = window.confirm("Are you sure you want to delete this poll?");
  
  if (confirmed){
    return true;
  }
  else {
    return false;
  }
});

