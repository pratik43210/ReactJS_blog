/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import Header from './Components/Header'
import Nav from './Components/Nav'
import Footer from './Components/Footer'
import Home from './Components/Home'
import About from './Components/About'
import NewPost from './Components/NewPost'
import PostPage from './Components/PostPage'
import Missing from './Components/Missing'
import {format} from 'date-fns'
import {Routes, Route, useNavigate} from 'react-router-dom'
import api from './api/posts'
import EditPost from './Components/EditPost'
import useWindowSize from './hooks/useWindow'
import useAxiosFetch from './hooks/useAxiosFetch'

function App() {
  const [posts,setPosts]=useState([])
  const [search,setSearch]=useState('')
  const [searchResults,setSearchResults]=useState([])
  const [postTitle,setPostTitle]=useState('')
  const [editTitle,setEditTitle]=useState('')
  const [postBody,setPostBody]=useState('')
  const [editBody,setEditBody]=useState('')
  const history=useNavigate()
  const {width}=useWindowSize();

  
  const {data, fetchError, isLoading}=useAxiosFetch('http://localhost:3500/posts');

  useEffect(()=>{
    setPosts(data)
  },[data]);

  useEffect(()=>{
    const filteredResults=posts.filter(
      post=>
      ((post.body).toLowerCase()).includes(search.toLowerCase())
      ||((post.title).toLowerCase()).includes(search.toLowerCase())
    )

    setSearchResults(filteredResults.reverse())
  },[posts,search])

  const handleDelete=async(id)=>{
    try{
      await api.delete(`/posts/${id}`)
      const postList=posts.filter(post=>post.id!==id)
      setPosts(postList)
      history('/')
    }catch(err){
      console.log(`Error: ${err.message}`)
    }
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const id=posts.length?posts[posts.length-1].id+1:1;
    const datetime=format(new Date(), 'MMMM dd, yyyy pp');
    const newPost={id,title:postTitle,datetime,body:postBody};
    try{
      const response=await api.post('/posts',newPost)
      const allPosts=[...posts,newPost];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      history('/');
    }catch(err){
      console.log(`Error: ${err.message}`);
    }
  }

  const handleEdit=async(id)=>{
    const datetime=format(new Date(),'MMMM dd, yyyy pp');
    const updatedPost={id,title:editTitle,datetime,body:editBody};
    try{
      const response=await api.put(`/posts/${id}`,updatedPost);
      setPosts(posts.map(post=>post.id==id?{...response.data}:post));
      setEditTitle('');
      setEditBody('');
      history('/');
    }catch(err){
      console.log(`Error: ${err.message}`)
    }
  }

  return (
    <div className='App'>
      <Header title="React JS Blog" width={width}/>
      <Nav
        search={search}
        setSearch={setSearch}
      />
      <Routes>
        <Route
          path='/'
          element={<Home
            posts={searchResults}
            fetchError={fetchError}
            isLoading={isLoading}
          />}
        />
        <Route path='/about' element={<About/>}/>
        <Route path='/post'>
          <Route index  element={<NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
          />}/>
          <Route
            path=':id'
            element={<PostPage
              posts={posts}
              handleDelete={handleDelete}
            />}
          />
        </Route>
        <Route path='/edit/:id'
          element={<EditPost
            posts={posts}
            handleEdit={handleEdit}
            editBody={editBody}
            setEditBody={setEditBody}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
          />}
        />
        <Route path='*' element={<Missing/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
