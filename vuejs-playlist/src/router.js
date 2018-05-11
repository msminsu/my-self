import showBlogs from './blogs/showBlogs';
import addBlog from './blogs/addBlog';
import singleBlog from './blogs/singleBlog';

export default [
  {path:'/', component:showBlogs},
  {path:'/add',component:addBlog},
  {path:'/blog/:id',component:singleBlog}
]
