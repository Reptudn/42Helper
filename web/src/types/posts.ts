// Shared types for posts and projects

export type PostType = "offer" | "request";

export type PostSubtype =
  | "i can help with"
  | "i need help with"
  | "i need a test evaluation for"
  | "i can do a test eval for";

export type ProjectType =
  | "libft"
  | "ft_printf"
  | "get_next_line"
  | "born2beroot"
  | "so_long"
  | "pipex"
  | "push_swap"
  | "minishell"
  | "philosophers"
  | "cub3d"
  | "cpp"
  | "webserv"
  | "inception"
  | "other"
  | "fun";

export type PostItem = {
  id: string;
  title: string;
  description: string;
  type: PostType;
  subtype: PostSubtype;
  project: ProjectType;
  createdAt: string;
  userId: string; // ID of the user who owns this post
  userIntraName?: string; // Optional: 42 intra username for display
};
