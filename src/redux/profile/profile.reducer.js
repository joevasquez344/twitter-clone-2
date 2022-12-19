import { updatePostInFeeds } from "../../utils/helpers";
import {
  GET_POSTS,
  TOGGLE_LIKE_POST,
  GET_USER_LIKES,
  REFRESH_POST,
  REFRESH_FEED,
  PROFILE_REQUEST_SENT,
  FEED_REQUEST_SENT,
  GET_FEED_SUCCESS,
  ADD_PINNED_POST,
  REMOVE_PINNED_POST,
  DELETE_POST,
  GET_PROFILE_SUCCESS,
  FOLLOW_USER,
  UNFOLLOW_USER,
  EDIT_USER,
  GET_FOLLOWERS_SUCCESS,
  GET_FOLLOWING_SUCCESS,
  TOGGLE_LIKE_PIN_POST,
  GET_PINNED_POST,
  FOLLOW_POST_USER,
  UNFOLLOW_POST_USER,
  GET_USERS_POST_COUNT,
  ADD_USERS_POST_COUNT,
  SUBTRACT_USERS_POST_COUNT,
  CREATE_COMMENT,
  GET_TWEETS_SUCCESS,
  GET_TWEETS_AND_REPLIES_SUCCESS,
  GET_MEDIA_SUCCESS,
  GET_LIKES_SUCCESS,
  SET_FEED_MESSAGE,
  CLEAR_FEED_MESSAGE,
  SET_UNPINNED_POSTS_LIKES,
  SET_PINNED_POSTS_LIKES,
} from "./profile.types";

const initialState = {
  profile: {},
  profilePostCount: null,
  feed: [],
  tweets: [],
  tweetsAndReplies: [],
  media: [],
  likes: [],
  pinnedPost: {},
  loading: true,
  feedLoading: true,
  feedMessage: null,
};

const profileReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case PROFILE_REQUEST_SENT:
      return {
        ...state,
        loading: true,
        feed: [],
        pinnedPost: {},
      };

    case FEED_REQUEST_SENT:
      return {
        ...state,
        feedLoading: true,
      };

    case SET_FEED_MESSAGE:
      return {
        ...state,
        feedMessage: payload,
      };
    case CLEAR_FEED_MESSAGE:
      return {
        ...state,
        feedMessage: null,
      };

    case GET_TWEETS_SUCCESS:
      return {
        ...state,
        feedLoading: false,
        tweets: payload.posts,
      };
    case GET_TWEETS_AND_REPLIES_SUCCESS:
      return {
        ...state,
        feedLoading: false,
        tweetsAndReplies: payload.posts,
      };
    case GET_MEDIA_SUCCESS:
      return {
        ...state,
        feedLoading: false,
        media: payload.posts,
      };
    case GET_LIKES_SUCCESS:
      return {
        ...state,
        feedLoading: false,
        likes: payload.posts,
      };

    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: payload,
        tweetsAndReplies: [],
        media: [],
        likes: [],
      };

    case GET_USERS_POST_COUNT:
      return {
        ...state,
        profilePostCount: payload,
      };

    case ADD_USERS_POST_COUNT:
      return {
        ...state,
        profilePostCount: state.profilePostCount + 1,
      };
    case SUBTRACT_USERS_POST_COUNT:
      return {
        ...state,
        profilePostCount: state.profilePostCount - 1,
      };

    case GET_FEED_SUCCESS:
      return {
        ...state,
        feedLoading: false,
        feed: payload.posts,
        // pinnedPost: payload.pinnedPost,
      };

    case TOGGLE_LIKE_POST:
      const updatedTweets = state.tweets.map((post) => {
        if (post.id === payload.postId) {
          post.likes = payload.likes;
        }

        return post;
      });
      const updatedTweetsAndReplies = state.tweetsAndReplies.map((post) => {
        if (post.id === payload.postId) {
          post.likes = payload.likes;
        }

        return post;
      });
      const updatedMedia = state.media.map((post) => {
        if (post.id === payload.postId) {
          post.likes = payload.likes;
        }

        return post;
      });
      const updatedLikes = state.likes.map((post) => {
        if (post.id === payload.postId) {
          post.likes = payload.likes;
        }

        return post;
      });

      return {
        ...state,
        tweets: updatedTweets,
        tweetsAndReplies: updatedTweetsAndReplies,
        media: updatedMedia,
        likes: updatedLikes,
      };

    case REFRESH_POST:
      const posts = state.feed.map((post) => {
        if (post.id === payload.id) {
          post = payload;
        }
        return post;
      });
      return {
        ...state,
        feed: posts,
      };

    case GET_PINNED_POST:
      return {
        ...state,
        pinnedPost: payload,
      };

    case ADD_PINNED_POST:
      return {
        ...state,
        profile: {
          ...state.profile,
          pinnedPost: payload,
        },
        feed: state.feed.map((post) => {
          if (post.id === payload.id) {
            // post = state.pinnedPost;
            post.pinnedPost = false;
          }

          return post;
        }),
        pinnedPost: payload,
      };
    case REMOVE_PINNED_POST:
      return {
        ...state,
        profile: {
          ...state.profile,
          pinnedPost: {},
        },
        feed: state.feed.map((post) => {
          if (post.id === payload) {
            post.pinnedPost = false;
          }

          return post;
        }),
        pinnedPost: {},
      };
    case TOGGLE_LIKE_PIN_POST:
      return {
        ...state,
        pinnedPost: {
          ...state.pinnedPost,
          likes: payload,
        },
      };
    case SET_UNPINNED_POSTS_LIKES:
      const tweets = state.tweets.map((post) => {
        if (post.id === payload?.id) {
          post.likes = payload.likes;
        }

        return post;
      });
      const updatedPostsAndReplies = state.tweetsAndReplies.map((post) => {
        if (post.id === payload?.id) {
          post.likes = payload.likes;
        }

        return post;
      });
      const updatedMediaPosts = state.media.map((post) => {
        if (post.id === payload?.id) {
          post.likes = payload.likes;
        }

        return post;
      });
      const updatedLikedPosts = state.likes.map((post) => {
        if (post.id === payload?.id) {
          post.likes = payload.likes;
        }

        return post;
      });
      return {
        ...state,
        tweets: tweets,
        tweetsAndReplies: updatedPostsAndReplies,
        media: updatedMediaPosts,
        likes: updatedLikedPosts,
      };
    case SET_PINNED_POSTS_LIKES:
      return {
        ...state,
        tweets: state.tweets.map((post) => {
          if (post.id === payload?.id) {
            post.likes = payload.likes;
          }

          return post;
        }),
        tweetsAndReplies: state.tweetsAndReplies.map((post) => {
          if (post.id === payload?.id) {
            post.likes = payload.likes;
          }

          return post;
        }),
        media: state.media.map((post) => {
          if (post.id === payload?.id) {
            post.likes = payload.likes;
          }

          return post;
        }),
        likes: state.likes.map((post) => {
          if (post.id === payload?.id) {
            post.likes = payload.likes;
          }

          return post;
        }),
      };
    case DELETE_POST:
      return {
        ...state,
        tweets: state.tweets.filter((tweet) => tweet.id !== payload),
        tweetsAndReplies: state.tweetsAndReplies.filter(
          (tweet) => tweet.id !== payload
        ),
        media: state.media.filter((tweet) => tweet.id !== payload),
        likes: state.likes.filter((tweet) => tweet.id !== payload),
        pinnedPost: state.pinnedPost.id === payload ? {} : state.pinnedPost,
      };
    case CREATE_COMMENT:
      return {
        ...state,
        tweets: state.tweets.map((post) => {
          if (post.id === payload.replyToPost.id) {
            post.comments = [...post.comments, payload.createdPost];
          }
          return post;
        }),
        tweetsAndReplies: state.tweetsAndReplies.map((post) => {
          if (post.id === payload.replyToPost.id) {
            post.comments = [...post.comments, payload.createdPost];
          }
          return post;
        }),
        media: state.media.map((post) => {
          if (post.id === payload.replyToPost.id) {
            post.comments = [...post.comments, payload.createdPost];
          }
          return post;
        }),
        likes: state.likes.map((post) => {
          if (post.id === payload.replyToPost.id) {
            post.comments = [...post.comments, payload.createdPost];
          }
          return post;
        }),
      };
    case FOLLOW_USER:
      return {
        ...state,
        profile: {
          ...state.profile,
          followers: payload.followers,
        },
        tweets: state.tweets.map((post) => {
          let match = post.followers.find(
            (follower) => follower.id === payload.auth.id
          );

          if (!match) {
            post = {
              ...post,
              followers: [...post.followers, payload.auth],
            };
          }

          return post;
        }),
        tweetsAndReplies: state.tweetsAndReplies.map((post) => {
          let match = post.followers.find(
            (follower) => follower.id === payload.auth.id
          );

          if (!match) {
            post = {
              ...post,
              followers: [...post.followers, payload.auth],
            };
          }

          return post;
        }),
        media: state.media.map((post) => {
          let match = post.followers.find(
            (follower) => follower.id === payload.auth.id
          );

          if (!match) {
            post = {
              ...post,
              followers: [...post.followers, payload.auth],
            };
          }

          return post;
        }),
        likes: state.likes.map((post) => {
          let match = post.followers.find(
            (follower) => follower.id === payload.auth.id
          );

          if (!match) {
            post = {
              ...post,
              followers: [...post.followers, payload.auth],
            };
          }

          return post;
        }),
      };
    case UNFOLLOW_USER:
      return {
        ...state,
        profile: {
          ...state.profile,
          followers: payload.followers,
          // following: payload.authUserFollowing
        },
        tweets: state.tweets.map((post) => {
          let match = post.followers.find(
            (follower) => follower.id === payload.auth.id
          );

          if (match) {
            post = {
              ...post,
              followers: post.followers.filter((u) => u.id !== payload.auth.id),
            };
          }

          return post;
        }),
        tweetsAndReplies: state.tweetsAndReplies.map((post) => {
          let match = post.followers.find(
            (follower) => follower.id === payload.auth.id
          );

          if (match) {
            post = {
              ...post,
              followers: post.followers.filter((u) => u.id !== payload.auth.id),
            };
          }

          return post;
        }),
        media: state.media.map((post) => {
          let match = post.followers.find(
            (follower) => follower.id === payload.auth.id
          );

          if (match) {
            post = {
              ...post,
              followers: post.followers.filter((u) => u.id !== payload.auth.id),
            };
          }

          return post;
        }),
        likes: state.likes.map((post) => {
          let match = post.followers.find(
            (follower) => follower.id === payload.auth.id
          );

          if (match) {
            post = {
              ...post,
              followers: post.followers.filter((u) => u.id !== payload.auth.id),
            };
          }

          return post;
        }),
      };

    case FOLLOW_POST_USER:
      if (state.profile?.id === payload.auth.id) {
        return {
          ...state,
          profile: {
            ...state.profile,
            following: payload.following,
          },
          tweets: state.tweets.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (!match) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
          tweetsAndReplies: state.tweetsAndReplies.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (!match) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
          media: state.media.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (!match) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
          likes: state.likes.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (!match) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
          feed: state.feed.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
        };
      } else if (
        payload.post.uid === state.profile.id &&
        payload.post.uid !== payload.auth.id
      ) {
        return {
          ...state,
          profile: {
            ...state.profile,
            followers: payload.followers,
          },
          tweets: state.tweets.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (!match) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
          tweetsAndReplies: state.tweetsAndReplies.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (!match) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
          media: state.media.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (!match) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
          likes: state.likes.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (!match) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
          feed: state.feed.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
        };
      } else {
        return {
          ...state,
          tweets: state.tweets.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (!match) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
          tweetsAndReplies: state.tweetsAndReplies.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (!match) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
          media: state.media.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (!match) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
          likes: state.likes.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (!match) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
          feed: state.feed.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            return post;
          }),
        };
      }

    case UNFOLLOW_POST_USER:
      if (state.profile?.id === payload.auth.id) {
        return {
          ...state,
          profile: {
            ...state.profile,
            following: payload.following,
          },
          tweets: state.tweets.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (match) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
          tweetsAndReplies: state.tweetsAndReplies.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (match) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
          media: state.media.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (match) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
          likes: state.likes.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (match) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
          feed: state.feed.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
        };
      } else if (payload.post.uid === state.profile.id) {
        return {
          ...state,
          profile: {
            ...state.profile,
            followers: payload.followers,
          },
          tweets: state.tweets.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (match) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
          tweetsAndReplies: state.tweetsAndReplies.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (match) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
          media: state.media.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (match) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
          likes: state.likes.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (match) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
          feed: state.feed.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
        };
      } else {
        return {
          ...state,
          tweets: state.tweets.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (match) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
          tweetsAndReplies: state.tweetsAndReplies.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (match) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
          media: state.media.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (match) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
          likes: state.likes.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: [...post.followers, payload.auth],
              };
            }

            let match = post.followers.find(
              (follower) => follower.id === payload.auth.id
            );

            if (match) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
          feed: state.feed.map((post) => {
            if (post.id === payload.post.id) {
              post = {
                ...post,
                followers: post.followers.filter(
                  (u) => u.id !== payload.auth.id
                ),
              };
            }

            return post;
          }),
        };
      }
    case EDIT_USER:
      return {
        ...state,
        loading: false,
        profile: {
          ...state.profile,
          ...payload,
        },
      };

    case GET_FOLLOWERS_SUCCESS:
      return {
        ...state,
        feedloading: false,
        feed: payload,
      };
    case GET_FOLLOWING_SUCCESS:
      return {
        ...state,
        feedloading: false,
        feed: payload,
      };

    default:
      return state;
  }
};

export default profileReducer;
