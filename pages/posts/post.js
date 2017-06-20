var postsData = require('../../data/posts-data.js')

Page({
  data: {

  },
  onLoad: function () {
    // 生命周期函数--监听页面加载
    this.setData({
      postKey: postsData.postList
    });

  },

  onPostTap: function (event) {

    var postId = event.currentTarget.dataset.postid;

    wx.navigateTo({
      url: "post-detial/post-detial?id=" + postId
    })
  },

/*
 target和currentTarget
 target指的是当前点击的组建，currentTarget指的是时间捕获的组建
 target指的是image，currentTarget是的是swiper组件
*/
  onSwiperTap: function (event) {

    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: "post-detial/post-detial?id=" + postId

    })
  }

  // onSwiperItemTap: function (event) {
  //   var postId = event.currentTarget.dataset.postid;

  //   wx.navigateTo({
  //     url: "post-detial/post-detial?id=" + postId
  //   })

  // },
})
