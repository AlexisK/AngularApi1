angular.module('app', ['directives'])

.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.toggleClass(attrs.toggleClass);
            });
        }
    };
})


.controller('Audiolist', ['$scope', 'vkGetMusic', function($scope, vkGetMusic) {
    var self = this;
    
    self.current = null;
    self.songs = [];
    self.artists = [];
    
    vkGetMusic(function(vkSession, music) {
        console.log('Audiolist:Got session and music!\n', music);
        self.songs = music.song;
        self.artists = music.artist;
        $scope.$apply();
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
    
    return function(todo) {
        vkAuth.then(function(vkSession) {
            console.log('vkGetMusic: Got session!');
            
            VK.Api.call('audio.get',{},function(resp){
                console.log('vkGetMusic: Got music!');
                todo(vkSession, parseAudioDb(resp.response));
            });
            
        });
    };
}])

.factory('parseAudioDb', function() {
    
    var trimName = function(name) {
        var newName = name.toLowerCase().trim().replace(/\s+/g,' ').split(/(feat|\(|\[)/g)[0].split(' ');
        
        if ( newName.length > 3 ) {
            if ( newName[0] == 'the' ) { newName.splice(0,1); }
        }
        angular.forEach(newName, function(v, i) {
            var nval = v;
            if ( v.length > 3 && v[v.length-1] == 's') {
                nval = v.slice(0,-1);
            }
            newName[i] = nval.replace(/\W/g,'');
        });
        
        return newName.join('');
    }
    
    var artistToIndex = {};
    var artistIndex = 0;
    
    
    
    return function(list) {
        var db = {
            artist: [],
            song: []
        };
        
        angular.forEach(list, function(val) {
            var artistName = trimName(val.artist);
            var ind = artistToIndex[artistName];
            if ( !ind ) {
                
                var newArtist = {
                    title: val.artist,
                    name: artistName,
                    songs: []
                };
                
                ind = db.artist.push(newArtist)-1;
                artistToIndex[artistName] = ind;
            }
            var artist = db.artist[ind];
            
            var newSong = {
                title: val.title,
                dur: val.duration,
                artist: ind,
                url: val.url
            }
            
            db.song.push(newSong);
            
            artist.songs.push(newSong);
        });
        
        console.log(list[0]);
        
        return db;
    }
});
