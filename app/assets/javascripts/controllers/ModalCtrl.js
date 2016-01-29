djello.controller('ModalCtrl',
  ['$scope', '$window', 'card', 'close', 'cardService', 'userService', 'boardService',
  function($scope, $window, card, close, cardService, userService, boardService) {

    $scope.card = card;
    $scope.card_members = card.card_members || [];
    $scope.users = userService.excluding($scope.card_members);

    $scope.close = function(result) {
      if (result === 'Completed' &&
        $window.confirm('Mark this card as completed and remove from list?')) {
        cardService.markCompleted($scope.card);
      };

      close(result, 500);
    };

    $scope.addMember = function() {
      $scope.newMember['card_id'] = $scope.card.id;
      userService.create($scope.newMember)
        .then( function(response) {
          boardService.addMember(response);
          $scope.card_members = card.card_members;
          $scope.users = userService.excluding($scope.card_members);
        });
        $scope.newMember = {};
    };

    $scope.removeMember = function(card_member) {
      userService.remove(card_member)
        .then( function(response) {
          boardService.removeMember(response);

          $scope.dropScopeMember(response.id);
        });
    };

    $scope.dropScopeMember = function(id) {
      $scope.card_members = $scope.card_members.filter( function(member) {
        return (member.id !== Number(id))
      });
      $scope.users = userService.excluding($scope.card_members);
    };

}]);