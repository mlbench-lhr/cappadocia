import { BlogForm } from "@/lib/types/blog";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BlogsState {
  generatedBlogs: BlogForm[];
  refreshBlogData: number;
}

const initialState: BlogsState = {
  generatedBlogs: [],
  refreshBlogData: 0,
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setGeneratedBlogs: (state, action: PayloadAction<BlogForm[]>) => {
      state.generatedBlogs = action.payload;
    },
    setRefreshBlogData: (state) => {
      state.refreshBlogData = state.refreshBlogData + 1;
    },
    removeGeneratedBlog: (state, action: PayloadAction<number>) => {
      state.generatedBlogs = state.generatedBlogs.filter(
        (_, index) => index !== action.payload
      );
    },
  },
});

export const { setGeneratedBlogs, removeGeneratedBlog, setRefreshBlogData } =
  blogsSlice.actions;

export default blogsSlice.reducer;
