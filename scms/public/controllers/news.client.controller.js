angular.module('webapp')
  .controller('NewsController', ['$scope', 'NewsService', NewsController]);

function NewsController($scope, NewsService){
  $scope.list = [];
  $scope.current = {};
  $scope.new = {};

  $scope.save = function(){
    if(!$scope.new.title) {
      $scope.editorMessage = 'Title is required';
      return;
    }

    if(!$scope.new.content) {
      $scope.editorMessage = 'Content is required';
      return;
    }

    $scope.editorMessage = '';

    NewsService.save($scope.new).then(
      function(data){
        $("#modal-editor").modal('hide')
        $scope.loadNews();
      },
      function(err){
        $scope.editorMessage = err;
      }
    );
  };

  $scope.createNews = function(){
    $("#modal-editor").modal('show');
  };

  $scope.openNewsDetail = function(id){
<<<<<<< HEAD
    // alert(id);
=======
>>>>>>> origin/master
    $scope.loadDetail(id);
    $("#modal-detail").modal('show');
  };

  $scope.loadDetail = function(id){
<<<<<<< HEAD
    // alert("loadDetail_id:",id);
=======
>>>>>>> origin/master
    NewsService.detail(id).then(
      function(data){
        $scope.current = data;
      },
      function(err){}
    );
  };

  $scope.formatTime = function(time){
    return moment(time).format('l');
  };

  $scope.loadNews = function(){
    NewsService.list().then(
      function(data){
<<<<<<< HEAD
        console.log('data:');
        console.log(data);
        
=======
>>>>>>> origin/master
        $scope.list = data;
      },
      function(err){}
    );
  };

  $scope.loadNews();
}