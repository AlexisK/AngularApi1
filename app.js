angular.module('app', ['directives'])

.service('vkAuth', function() {
    var promise = new Promise(function(done, reject) {
        VK.Auth.getLoginStatus(function(response) {
            if (response.session) {
                window.vkSession = response.session
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

.controller('Audiolist', function($scope) {
    var self = this;
    self.bands = {
        1: 'Cheville'
    }
    self.songs = [{band:1,title:'The Red', file: 'file'}];
    self.current = null;
    
    vkAuth.then(function(vkSession) {
        console.log('Got session!');
    });
    
});
