{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
        "ci",
        "build"
      ]
    ],
    "scope-enum": [
      2,
      "always",
      [
        "auth",
        "user",
        "room",
        "chat",
        "websocket",
        "database",
        "cache",
        "api",
        "docs",
        "test",
        "ci",
        "docker",
        "security"
      ]
    ],
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
    "body-leading-blank": [1, "always"],
    "footer-leading-blank": [1, "always"]
  }
}
