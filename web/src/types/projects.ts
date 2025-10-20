// Runtime export for Project values so they exist in emitted JS.
export const Project = {
  LIBFT: "libft",
  GET_NEXT_LINE: "get_next_line",
  FT_PRINTF: "ft_printf",
  PUSH_SWAP: "push_swap",
  MINISHELL: "minishell",
  CUB3D: "cub3d",
  PHILOSOPHERS: "philosophers",
  SO_LONG: "so_long",
  MINITALK: "minitalk",
  WEBSERV: "webserv",
  CPP_00: "cpp_00",
  CPP_01: "cpp_01",
  CPP_02: "cpp_02",
  CPP_03: "cpp_03",
  CPP_04: "cpp_04",
  CPP_05: "cpp_05",
  CPP_06: "cpp_06",
  CPP_07: "cpp_07",
  CPP_08: "cpp_08",
  CPP_09: "cpp_09",
  TRANSCENDENCE: "transcendence",
} as const;

export type ProjectValue = (typeof Project)[keyof typeof Project];
