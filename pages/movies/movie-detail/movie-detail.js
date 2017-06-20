import { Movie } from 'class/Movie.js';
var app = getApp();
Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    var movieId = options.id;
    var url = app.globalData.doubanBase +
      "/v2/movie/subject/" + movieId;
    var movie = new Movie(url);
    movie.getMovieData((movie) => {
      this.setData({
        movie: movie
      })
    })
  },


  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
})