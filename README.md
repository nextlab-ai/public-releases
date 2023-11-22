# `nextlab-eslint` Shareable Config

> Publicly available sharable [ES Lint](https://eslint.org/) configuration for the JS, TS projects at [NextLab](https://www.nextlab.ai/)

## ES Lint Configuration

- [eslint.config.js](eslint.config.js) is based on the new [Flat Config](https://eslint.org/blog/2022/08/new-config-system-part-2/)
- Flat Config is loaded from legacy-compatable [eslint.config.json](eslint.config.json) and other config files

## Usage

### CLI

```sh
yarn global add https://github.com/nextlab-ai/public-releases/tree/eslint
nextlab-eslint src --fix
```

### VS Code

- Refer to [this Notion site](https://www.notion.so/nextlabai/ES-Lint-dd6726189c7e40c5b2b760ae183ec292?pvs=4) for the use in with [VS Code](https://code.visualstudio.com/)'
- `yarn glboal install` in your local machine is possible via [`eslint` branch at public-releases repository](https://github.com/nextlab-ai/public-releases/tree/eslint)

### CI

- [Dockerfile](Dockerfile) provides a container image to lint a codebase with this configuration without npm installing ES Lint and this repository in every run in a serverless CI environment
- Prebuilt image is available at [this package in GitHub Container Registry](https://github.com/nextlab-ai/public-releases/pkgs/container/eslint)

## Development

- Please commit your preferred rules and configuration changes to this folder: <https://github.com/nextlab-ai/ias-products-management-tools/tree/main/eslint>
