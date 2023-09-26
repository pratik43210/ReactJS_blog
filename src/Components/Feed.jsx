import Post from "./Post"

/* eslint-disable react/prop-types */
const Feed = ({posts}) => {
  return (
    <div className="Feed">
        {posts.map(post=><Post key={post.id} post={post}/>)}
    </div>
  )
}

export default Feed