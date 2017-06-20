var postsData = require('../../../data/posts-data.js')
var app = getApp();

Page({
    data: {
        isPlayingMusic: false
    },

    onLoad: function (option) {
        var globalData = app.globalData;
        var postId = option.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        this.setData({
            postKey: postData
        });

        var postsCollected = wx.getStorageSync('post_collection');//获取缓存数据

        if (postsCollected) {
            var isCollected = postsCollected[postId];//获取某篇文章的收藏状态
            this.setData({
                collected: isCollected
            })
        }
        else {

            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('post_collection', postsCollected);
        }

        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true
            })
        }
        this.setMusicMonitor();
    },

    setMusicMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            })
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
    },

    onCollectionTap: function (event) {
        this.getPostsCollectedSyc();//同步调用缓存
        // this.getPostsCollectedAsy();异步调用缓存

    },

    getPostsCollectedSyc: function () {

        var postsCollected = wx.getStorageSync('post_collection');
        var isCollected = postsCollected[this.data.currentPostId];
        //收藏变成未收藏，未收藏变成收藏
        isCollected = !isCollected;
        postsCollected[this.data.currentPostId] = isCollected;
        this.showToast(postsCollected, isCollected);

    },

    getPostsCollectedAsy: function (res) {
        var that = this;
        wx.getStorage({
            key: "post_collection",
            success: function (res) {
                var postsCollected = res.data;
                var isCollected = postsCollected[that.data.currentPostId];
                //收藏变成未收藏，未收藏变成收藏
                isCollected = !isCollected;
                postsCollected[that.data.currentPostId] = isCollected;
                that.showToast(postsCollected, isCollected);
            }
        })

    },

    showModal: function (postsCollected, isCollected) {
        var that = this;//this是函数调用的上下文环境
        wx.showModal({
            title: "收藏",
            content: isCollected ? "收藏该文章吗？" : "取消收藏改文章吗？",
            showCancel: "true",
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确认",
            confirmColor: "#405f80",
            success: function (res) {
                if (res.confirm) {
                    //更新了文章是否收藏的缓存
                    wx.setStorageSync('post_collection', postsCollected);
                    //更新数据绑定变量，从而实现切换图片状态
                    that.setData({
                        collected: isCollected
                    })

                }

            }

        })

    },

    showToast: function (postsCollected, isCollected) {

        //更新了文章是否收藏的缓存
        wx.setStorageSync('post_collection', postsCollected);
        //更新数据绑定变量，从而实现切换图片状态
        this.setData({
            collected: isCollected
        })
        //交互反馈的API
        wx.showToast({
            title: isCollected ? "收藏成功" : "取消收藏",
            duration: 1000,
            icon: "success"

        })

    },

    onShareTap: function (event) {

        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({

            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel 用户是不是点击了取消
                // res.tapIndex 数组元素的序号， 从零开始
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "用户是否取消?" + res.cancel + "目前无法实现分享功能",


                })
            }

        })
    },
    onMusicTap: function (event) {

        var isPlayingMusic = this.data.isPlayingMusic;
        var currentPostId = this.data.currentPostId;
        var postdata = postsData.postList[currentPostId];

        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })

        }
        else {
            wx.playBackgroundAudio({
                dataUrl: postdata.music.url,
                title: postdata.music.title,
                coverImgurl: postdata.music.coverImgurl
            })
            this.setData({
                isPlayingMusic: true
            })
        }
    }

})