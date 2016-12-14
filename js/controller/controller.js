// Controller

app.controller('VideosController', function ($scope, $http, $log, VideosService, $filter, movieService) {

    init();

    function init() {
      $scope.youtube = VideosService.getYoutube();
      $scope.results = VideosService.getResults();
      $scope.upcoming = VideosService.getUpcoming();
      $scope.history = VideosService.getHistory();
      $scope.playlist = true;
    }

    $scope.getListResult = function(){
        movieService.getMovie()
            .then(function(movieData) {
                $scope.results = movieData.data;
            });
    };
    $scope.getListResult();

    $scope.song = {};
    $scope.listSong = {};
    $scope.listSong["data"] = $scope.song;

    $scope.submitForm = function () {
        var id = $scope.song.url.substr($scope.song.url.indexOf("=") + 1);
        var key = "AIzaSyBZjNjipSg8pKGU6ODjDNse9tmeotr1umY";
        $http.get('https://www.googleapis.com/youtube/v3/videos?id='+id+'&key='+key+'&part=snippet,contentDetails')
        .success( function (data) {
            if (data) {
                $scope.label = 'No results were found!';
                var title = data.items[0].snippet.title;
                var duration = data.items[0].contentDetails.duration;
                console.log(duration);
                console.log(title);
                var Ids = $scope.convert_time(duration);

                var data = {
                    "title": title,
                    "id": id,
                    "duration": parseInt(Ids)
                };
                $http({
                    method: 'POST',
                    url: 'http://playlist-royletzchange.rhcloud.com/add',
                    dataType: 'jsonp',
                    data: {
                        "data": data
                    },
                    headers: {"Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers":"Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
                        "Access-Control-Allow-Methods": "GET, PUT, POST"}
                    }).success(function(data) {
                        if (data.errors) {
                            // Showing errors.
                           console.log(errors);
                        } else {
                            console.log(data);
                            $scope.getListResult();
                            $scope.message = data.message;
                        }
                    });
            }
        })
        .error( function () {
            $log.info('Search error');
        })
    };

    $scope.deleteSong = function (id) {
        $http({
            method: 'POST',
            url: 'http://playlist-royletzchange.rhcloud.com/remove/'+ id,
            dataType: 'jsonp',
            headers: {"Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":"Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
                "Access-Control-Allow-Methods": "GET, PUT, POST"}
            }).success(function(data) {
                if (data.errors) {
                   console.log(errors);
                } else {
                    console.log(data);
                    $scope.getListResult();
                    $scope.message = data.message;

                }
        });
    };

    $scope.launch = function (id, title) {
      VideosService.launchPlayer(id, title);
      VideosService.archiveVideo(id, title);
      VideosService.deleteVideo($scope.upcoming, id);
      $log.info('Launched id:' + id + ' and title:' + title);
    };

    $scope.queue = function (id, title) {
      VideosService.queueVideo(id, title);
    };

    $scope.delete = function (list, id) {
      VideosService.deleteVideo(list, id);
    };

    $scope.tabulate = function (state) {
      $scope.playlist = state;
    }

    $scope.convert_time = function(duration) {
        var a = duration.match(/\d+/g);
        if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
            a = [0, a[0], 0];
        }

        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
            a = [a[0], 0, a[1]];
        }
        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
            a = [a[0], 0, 0];
        }

        duration = 0;

        if (a.length == 3) {
            duration = duration + parseInt(a[0]) * 3600;
            duration = duration + parseInt(a[1]) * 60;
            duration = duration + parseInt(a[2]);
        }

        if (a.length == 2) {
            duration = duration + parseInt(a[0]) * 60;
            duration = duration + parseInt(a[1]);
        }

        if (a.length == 1) {
            duration = duration + parseInt(a[0]);
        }
        var h = Math.floor(duration / 3600);
        var m = Math.floor(duration % 3600 / 60);
        var s = Math.floor(duration % 3600 % 60);
        return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m);
    }
});
