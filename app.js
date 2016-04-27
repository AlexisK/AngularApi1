angular.module('app', ['directives'])

.controller('Audiolist', ['$scope', 'vkGetMusic', function($scope, vkGetMusic) {
    var self = this;
    
    self.current = null;
    
    vkGetMusic.then(function(vkSession) {
        console.log('Audiolist:Got session and music!');
    });
    
}])

.factory('vkAuth', function() {
    var vkSession = null;
    
    var promise = new Promise(function(done, reject) {
        
        VK.Auth.getLoginStatus(function(response) {
            if (response.session) {
                vkSession = response.session
                console.log('user: '+vkSession.mid);
                done(vkSession);
            } else {
                console.log('not auth');
                reject();
            }
        });
    });
    
    return promise;
})

.factory('vkGetMusic', ['vkAuth', 'parseAudioDb', function(vkAuth, parseAudioDb) {
    var promise = new Promise(function(done, reject) {
        
        vkAuth.then(function(vkSession) {
            console.log('vkGetMusic: Got session!');
            
            VK.Api.call('audio.get',{},function(list){
                console.log('vkGetMusic: Got music!');
                done(vkSession, parseAudioDb(list));
            });
            
            
        });
        
    });
    return promise;
}])

.factory('parseAudioDb', function() {
    return function(list) {
        var db = {
            artist: {},
            song: {}
        };
        
        
        
        return list
    }
});
