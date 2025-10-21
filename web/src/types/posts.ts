// Shared types for posts and projects

export type PostType = "offer" | "request";

export type PostSubtype =
  | "help with project"
  | "need help with project" 
  | "test evaluation"
  | "can do test evaluation";

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
};
