function Jukebox() {
	//Initialize with the client id when the object instance is made
	SC.initialize({
		client_id: 'f665fc458615b821cdf1a26b6d1657f6'
	});
	this.playlist = null;
	this.songIndex = 0;
	this.currentTrackStream = null;
	this.currentSong = null;
	_this = this;

	SC.get("/tracks",{
		q: '30 seconds to mars'
	}).then(function(playlist) {
		console.log(playlist);
		_this.playlist = playlist;
		_this.currentSong = _this.playlist[_this.songIndex];
		_this.currentTrackStream = SC.stream( '/tracks/' + _this.currentSong.id );
	});

	this.play = function(){
		this.currentTrackStream.then(function(player){
			player.play();
		});
	}
	this.pause = function(){
		this.currentTrackStream.then(function(player){
			player.pause();
		});
	}
	this.next = function(){
		//Check to make sure we don't go beyond the end of the array
		if ((this.songIndex + 1) < this.playlist.length - 1) {
			this.songIndex++;
			this.currentSong = this.playlist[this.songIndex];
			this.currentTrackStream = SC.stream('/tracks/' + this.currentSong.id);
			this.play();
			this.displayInfo();
			$(document).focus();
			return true;
		}
		return false;	
	}
	this.previous = function(){
		if ((this.songIndex - 1) > 0) {
			this.songIndex--;
			this.currentSong = this.playlist[this.songIndex];
			this.currentTrackStream = SC.stream('/tracks/' + this.currentSong.id);
			this.play();
			this.displayInfo();
			$(document).focus();
			return true;
		}
		return false;
	}
	//Display song info on the HTML page
	this.displayInfo = function(){
		$('.title').text(this.currentSong.title);
		$('.artist-name').text(this.currentSong.user.username);
		$('#description').text(this.currentSong.description);

		var releaseDate = this.currentSong.release_month + '/' + this.currentSong.release_day + '/' + this.currentSong.release_year;
		var info = this.currentSong.user.username + "'s '" + this.currentSong.title + "' is of the " + this.currentSong.genre + " genre and was released on " + releaseDate;
		$('.info').text(info);
		$('#artwork').attr('src', this.currentSong.artwork_url);
	}
}

$(document).ready(function(){
	var juke = new Jukebox();

	$(document).keyup(function(e){
		if (e.key === ' ') {
			juke.play();
			juke.displayInfo();
		}
		if (e.key === 'p') {
			juke.pause();
		}
		if (e.which === 37) {
			if(!juke.previous()){
				$('.prev-error').show().delay(4000).fadeOut();
			}
		}
		if (e.which === 39) {
			if(!juke.next()){
				$('.next-error').show().delay(4000).fadeOut();
			}
		}
	});


});