### README for `fpj-manager`

## Introduction

`fpj-manager` is a Node.js command-line tool for managing JavaScript project dependencies. It allows you to install specific packages, install all dependencies listed in `package.json`, list installed packages, and run JavaScript scripts.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd fpj-manager
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Link the command globally:
   ```sh
   npm link
   ```

## Usage

The `fpj` command supports several subcommands:

### Install a Specific Package

To install a specific package, use the `install` command followed by the package name:

```sh
fpj install <package-name>
```

Example:
```sh
fpj install lodash
```

### Install All Dependencies

To install all dependencies listed in `package.json`, use the `install-all` command:

```sh
fpj install-all
```

### List Installed Packages

To list all installed packages, use the `list` command:

```sh
fpj list
```

### Run a JavaScript Script

To run a JavaScript file, use the `run` command followed by the path to the script:

```sh
fpj run <script-path>
```

Example:
```sh
fpj run scripts/test.js
```

## Commands Summary

- `fpj install <package-name>`: Install a specific package.
- `fpj install-all`: Install all dependencies listed in `package.json`.
- `fpj list`: List all installed packages.
- `fpj run <script-path>`: Run a JavaScript file.

## Example

Here is an example of how to use `fpj-manager`:

1. Install the `axios` package:
   ```sh
   fpj install axios
   ```

2. Install all dependencies from `package.json`:
   ```sh
   fpj install-all
   ```

3. List all installed packages:
   ```sh
   fpj list
   ```

4. Run a script located at `scripts/test.js`:
   ```sh
   fpj run scripts/test.js
   ```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### File Structure

- `index.js`: Main script for the CLI tool.
- `package.json`: Contains metadata about the project and its dependencies.
- `bin/fpj`: Symlink to `index.js` for command-line execution.

---

### Notes

- Ensure you have the correct permissions to run scripts and install packages globally.
- This tool recursively installs dependencies of the specified package, ensuring all required packages are installed.

---

**a.** Add unit tests to validate the functionality of each command.
**b.** Implement logging to a file for better error tracking and debugging.