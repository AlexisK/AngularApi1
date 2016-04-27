angular.module('directives', [])

.directive('audiocontainer', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: function($scope, $element) {
            var audio_files = $scope.audio_files = [];
            
            $scope.select = function(audio_file) {
                angular.forEach(audio_files, function(audio_file) {
                    audio_file.selected = false;
                });
                audio_file.selected = true;
            }
            
            this.addAudioFile = function(audio_file) {
                if (audio_files.length == 0) $scope.select(audio_file);
                audio_files.push(audio_file);
            }
        },
        template: '<nav class="audio_container"><div class="audio_file" ng-repeat="audio_file in audio_files" ng-class="{active:pane.selected}"></div></nav>',
        replace: 'true'
    };
})

.directive('audiofile', function() {
    return {
        require: '^audio_container',
        restrict: 'E',
        transclude: true,
        scope: {},
        link: function(scope, element, attrs, audioController) {
            audioController.addAudioFile(scope);
        },
        template: '<div class="audio_file"></div>',
        replace: true
    };
})

;
